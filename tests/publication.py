"""Test the daily upload path in an isolated copy of the project."""
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SLUG = 'example-reading-quicknote'
URL = f'/notes/{SLUG}/'
MARKER = 'PRIVATE-DRAFT-BODY-MUST-STAY-PRIVATE'
ROOT_ITEMS = ('Gemfile', 'Gemfile.lock', 'settings.json', 'scripts', 'notes', 'site')

with tempfile.TemporaryDirectory(prefix='research-notes-') as directory:
    target = Path(directory)
    for name in ROOT_ITEMS:
        original = ROOT / name
        if original.is_dir():
            shutil.copytree(original, target / name)
        else:
            shutil.copy(original, target / name)
    source = (ROOT / 'templates' / f'{SLUG}.html').read_text()
    note = target / 'notes' / f'{SLUG}.html'

    def build():
        subprocess.run(['bash', 'scripts/build.sh'], cwd=target, check=True)
        return json.loads((target / '_site/search.json').read_text())

    note.write_text(source.replace('</article>', f'<p>{MARKER}</p></article>'))
    draft_attachment = target / 'notes' / 'private-attachment.txt'
    draft_attachment.write_text(MARKER)
    index = build()
    assert all(entry['url'] != URL for entry in index)
    assert not (target / '_site/notes' / SLUG).exists()
    assert not any(MARKER.encode() in path.read_bytes() for path in (target / '_site').rglob('*') if path.is_file())

    published = source.replace('name="note:status" content="draft"', 'name="note:status" content="published"')
    note.write_text(published)
    first = next(entry for entry in build() if entry['url'] == URL)
    rendered = target / '_site/notes' / SLUG / 'index.html'
    assert rendered.exists()
    assert URL in (target / '_site/directions/agentic-rl/index.html').read_text()

    revised = published.replace('name="note:updated" content="2026-11-15"', 'name="note:updated" content="2026-11-16"')
    note.write_text(revised)
    final = next(entry for entry in build() if entry['url'] == URL)
    assert final['created'] == first['created']
    assert final['updated'] == '2026-11-16'
    assert 'name="note:updated" content="2026-11-16"' in rendered.read_text()

    duplicate = target / 'notes' / 'duplicate' / note.name
    duplicate.parent.mkdir()
    duplicate.write_text(revised)
    rejected = subprocess.run(['bash', 'scripts/build.sh'], cwd=target, capture_output=True, text=True)
    assert rejected.returncode != 0 and '重复文章地址' in rejected.stderr
    assert 'name="note:updated" content="2026-11-16"' in rendered.read_text()

print('Draft privacy, publication, stable updates and failed-build preservation passed.')
