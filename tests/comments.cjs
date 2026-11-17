// Run with: node tests/comments.cjs (no packages or network required).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const runtime = read(path.join(root, 'templates/article-runtime.js'));

function page({protocol = 'https:', status = 'published', title = 'Paper', observer = true} = {}) {
  const scripts = [];
  const message = {};
  const discussion = {};
  const mount = {append: script => scripts.push(script)};
  const comments = {querySelector: selector => ({
    '[data-comments-status]': message,
    '[data-comments-mount]': mount,
    '[data-comments-link]': discussion,
  })[selector]};
  const metadata = {slug: 'stable-note', status, title, summary: 'Summary'};
  let intersect;
  let disconnected = false;
  class Observer {
    constructor(callback) { intersect = callback; }
    observe(target) { assert.equal(target, comments); }
    disconnect() { disconnected = true; }
  }
  const document = {
    querySelector(selector) {
      const meta = selector.match(/^meta\[name="note:([^\"]+)"\]$/);
      if (meta) return {content: metadata[meta[1]] || ''};
      if (selector === '.article-comments') return comments;
      return null;
    },
    querySelectorAll: () => [],
    createElement: () => ({setAttribute(name, value) { this[name] = value; }}),
    body: {prepend() {}},
    addEventListener(event, callback) { assert.equal(event, 'DOMContentLoaded'); callback(); },
  };
  const context = {document, location: {protocol}, URL, window: observer ? {IntersectionObserver: Observer} : {}};
  if (observer) context.IntersectionObserver = Observer;
  vm.runInNewContext(runtime, context);
  return {scripts, message, discussion, intersect: visible => intersect([{isIntersecting: visible}]), disconnected: () => disconnected};
}

const live = page();
assert.equal(live.scripts.length, 0, 'Comments should wait until near the viewport');
live.intersect(false);
assert.equal(live.scripts.length, 0);
live.intersect(true);
live.intersect(true);
assert.equal(live.scripts.length, 1, 'Load the service only once');
assert.ok(live.disconnected());
const script = live.scripts[0];
assert.equal(script.src, 'https://utteranc.es/client.js');
assert.equal(script.repo, 'luo-li-ba-suo/kida_research');
assert.equal(script['issue-term'], 'notes/stable-note/');
assert.equal(page({title: 'Renamed paper', observer: false}).scripts[0]['issue-term'], script['issue-term']);
script.onload();
assert.match(live.message.textContent, /GitHub/);
script.onerror();
assert.match(live.message.textContent, /GitHub/);
assert.match(live.discussion.href, /^https:\/\/github.com\/luo-li-ba-suo\/kida_research\/issues\?q=/);
for (const options of [{protocol: 'file:'}, {status: 'draft'}, {status: ''}]) {
  const local = page(options);
  assert.equal(local.scripts.length, 0, 'Drafts and local files must not contact the comment service');
  assert.equal(local.discussion.hidden, true);
}

const fragment = read(path.join(root, 'templates/article-comments.inc')).trim();
const files = fs.readdirSync(path.join(root, 'notes')).filter(name => name.endsWith('.html')).map(name => path.join(root, 'notes', name));
files.push(path.join(root, 'templates/your-note.html'), path.join(root, 'templates/example-reading-quicknote.html'));
for (const file of files) {
  const html = read(file);
  assert.ok(html.includes(fragment), `${file}: missing comment markup`);
  assert.ok(html.includes(runtime.trim()), `${file}: stale runtime`);
  assert.equal((html.match(/id="comments"/g) || []).length, 1);
  assert.ok(html.indexOf('id="comments"') > html.indexOf('</article>'), 'Comments must stay out of the article TOC');
}
console.log(`Comments: lazy loading, stable threads, fallback, local/draft guards and ${files.length} HTML integrations passed.`);
