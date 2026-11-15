#!/usr/bin/env python3
"""Validate complete HTML notes and stage ONLY public material for Jekyll."""
import argparse
import datetime as dt
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
DIRECTIONS = {'agentic-rl': 'Agentic RL', 'reward-modeling': 'Reward Modeling', 'social-intelligence': 'Social Intelligence'}
KINDS = {'paper': '论文精读', 'quicknote': '阅读速记', 'synthesis': '专题总结'}

class Head(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta = {}; self.in_head = False; self.doctype = False
    def handle_decl(self, decl):
        if decl.lower() == 'doctype html': self.doctype = True
    def handle_starttag(self, tag, attrs):
        if tag == 'head': self.in_head = True
        if tag == 'meta' and self.in_head:
            attrs = dict(attrs); key = attrs.get('name', '')
            if key.startswith('note:'):
                if key[5:] in self.meta: raise ValueError('重复元信息 ' + key)
                self.meta[key[5:]] = attrs.get('content', '')
    def handle_endtag(self, tag):
        if tag == 'head': self.in_head = False

def read_note(path):
    raw = path.read_text(encoding='utf-8'); parser = Head(); parser.feed(raw)
    m = parser.meta
    for key in ('title', 'slug', 'summary', 'directions', 'kind', 'created', 'updated'):
        if not m.get(key, '').strip(): raise ValueError('缺少 note:' + key)
    if not parser.doctype or not re.search(r'</html\s*>', raw, re.I): raise ValueError('需要完整 HTML 文档')
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', m['slug']): raise ValueError('slug 只能使用小写字母、数字与连字符')
    if path.stem != m['slug']: raise ValueError('文件名必须与 slug 一致，更新时覆盖原文件')
    for key in ('created', 'updated'):
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', m[key]): raise ValueError(key + ' 应为 YYYY-MM-DD')
        dt.date.fromisoformat(m[key])
    if m['updated'] < m['created']: raise ValueError('更新时间早于首次发布时间')
    status = m.get('status', 'draft')
    if status not in ('draft', 'published'): raise ValueError('status 只能是 draft 或 published')
    directions = list(dict.fromkeys(x.strip() for x in m['directions'].split(',') if x.strip()))
    if not directions or any(x not in DIRECTIONS for x in directions): raise ValueError('未知研究方向')
    if m['kind'] not in KINDS: raise ValueError('未知文章类型')
    return dict(m, status=status, directions=directions,
                tags=list(dict.fromkeys(x.strip() for x in m.get('tags', '').split(',') if x.strip())),
                url='/notes/' + m['slug'] + '/', direction_labels=[DIRECTIONS[x] for x in directions],
                kind_label=KINDS[m['kind']]), raw

def collect(root=ROOT):
    notes=[]; slugs=set()
    for path in sorted((root / 'notes').rglob('*.html')):
        if path.is_symlink(): raise ValueError(str(path) + ': 不支持符号链接')
        try: record, raw = read_note(path)
        except (ValueError, UnicodeError) as error: raise ValueError(f'{path.relative_to(root)}: {error}') from error
        if record['slug'] in slugs: raise ValueError('重复文章地址: ' + record['slug'])
        slugs.add(record['slug']); notes.append((record,raw))
    return notes

def stage(root=ROOT):
    notes = collect(root)  # Do not mutate the last stage on invalid input.
    public = sorted((x for x in notes if x[0]['status']=='published'), key=lambda x:(x[0]['updated'],x[0]['slug']), reverse=True)
    target = root / '.build' / 'source'
    if target.exists(): shutil.rmtree(target)
    shutil.copytree(root / 'site', target)
    (target / '_posts').mkdir(exist_ok=True); (target / '_data').mkdir(exist_ok=True)
    records=[]
    for record, raw in public:
        records.append(record)
        front = dict(record, layout=None, render_with_liquid=False, permalink=record['url'], date=record['created'])
        # A JSON object is valid YAML and cannot inject front matter.
        post=target / '_posts' / (record['created']+'-'+record['slug']+'.html')
        post.write_text('---\n'+json.dumps(front,ensure_ascii=False)+'\n---\n'+raw,encoding='utf-8')
    (target / '_data' / 'notes.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
    config=json.loads((root/'settings.json').read_text())
    site_url = os.environ.get('SITE_URL')
    if not site_url and os.environ.get('CF_PAGES') == '1':
        raise ValueError('请在 Cloudflare Pages 配置 SITE_URL 为生产站地址')
    config['url'] = (site_url or config['url']).rstrip('/')
    config.update({'timezone':'Asia/Shanghai','future':True,'strict_front_matter':True,'encoding':'utf-8','exclude':[]})
    (target/'_config.yml').write_text(json.dumps(config,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Validated {len(notes)} notes; staged {len(public)} public notes. Drafts never enter the build source.')
    return target

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');a=p.parse_args()
    try:
        if a.check: print(f'Validated {len(collect())} notes.')
        else: stage()
    except ValueError as e: print(str(e),file=sys.stderr);sys.exit(1)
