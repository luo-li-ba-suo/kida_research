#!/usr/bin/env python3
"""Check publication boundaries and links against the actual build."""
import json
from pathlib import Path
import sys
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree
from html.parser import HTMLParser

from import_notes import collect

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.links = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs:
                self.links.append(attrs[key])

def require(condition, message):
    if not condition:
        raise ValueError(message)

def check(output):
    index = json.loads((output / 'search.json').read_text())
    records = [record for record, _ in collect()]
    expected = {record['url'] for record in records if record['status'] == 'published'}
    require({record['url'] for record in index} == expected and len(index) == len(expected), '公开索引与发布状态不符')
    actual = {'/' + p.parent.relative_to(output).as_posix() + '/' for p in (output / 'notes').glob('*/index.html')}
    require(actual == expected, '公开文章与发布状态不符')
    for name in ('rss.xml', 'sitemap.xml'):
        tree = ElementTree.parse(output / name)
        links = {urlsplit(node.text).path for node in tree.iter() if node.tag.split('}')[-1] in ('loc', 'link') and node.text}
        require({link for link in links if link.startswith('/notes/')} == expected, f'{name} 的文章集合错误')
    require(not any((output / name).exists() for name in ('docs','templates','.git','provenance','scripts')), '部署目录含有私有源文件')
    pages = {p: Page(p.read_text(encoding='utf-8')) for p in output.rglob('*.html')}
    for path, page in pages.items():
        for raw_link in page.links:
            if not raw_link.startswith(('/', '#')) or raw_link.startswith('//'):
                continue
            link = urlsplit(raw_link)
            target = output / unquote(link.path).lstrip('/') if link.path else path
            if target.is_dir():
                target /= 'index.html'
            require(target.is_file(), f'{path.relative_to(output)}: 找不到 {raw_link}')
            if link.fragment and target in pages:
                require(unquote(link.fragment) in pages[target].ids, f'{path.relative_to(output)}: 找不到锚点 {raw_link}')
    print(f'Verified {len(expected)} public notes, {len(pages)} pages, internal links, RSS and sitemap.')

if __name__ == '__main__':
    try:
        check(Path(sys.argv[1]))
    except (ValueError, OSError, ElementTree.ParseError) as error:
        sys.exit(str(error))
