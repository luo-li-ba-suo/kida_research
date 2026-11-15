/* No HTML injection: titles, summaries and labels always become text nodes. */
(async()=>{
const input=document.querySelector('#search'), direction=document.querySelector('#direction'), tag=document.querySelector('#tag'), output=document.querySelector('#search-results'), count=document.querySelector('#result-count');
try {
const response=await fetch('/search.json');if(!response.ok)throw new Error('index');const notes=await response.json();
const node=(name,text,cls)=>{const el=document.createElement(name);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
[...new Set(notes.flatMap(n=>n.tags))].sort().forEach(t=>{const o=node('option',t);o.value=t;tag.append(o);});
function render(){
 const q=input.value.trim().toLocaleLowerCase();
 const visible=notes.filter(n=>(!q||(n.title+' '+n.summary).toLocaleLowerCase().includes(q))&&(!direction.value||n.directions.includes(direction.value))&&(!tag.value||n.tags.includes(tag.value)));
 output.replaceChildren();count.textContent=`找到 ${visible.length} 篇文章`;
 if(!visible.length){output.append(node('p','没有匹配的文章，试试更短的关键词或其他方向。','empty-state'));return;}
 for(const n of visible){const article=node('article',undefined,'note-row'),date=node('div',undefined,'note-date'),time=node('time',n.updated);time.dateTime=n.updated;date.append(time,node('span',n.kind_label));const body=node('div'),h=node('h3'),a=node('a',n.title);a.href=n.url;h.append(a);body.append(h,node('p',n.summary));const tags=node('div',undefined,'tags');[...n.direction_labels,...n.tags.slice(0,3)].forEach(t=>tags.append(node('span',t)));body.append(tags);article.append(date,body);output.append(article);}
}
input.addEventListener('input',render);direction.addEventListener('change',render);tag.addEventListener('change',render);
const initial=new URLSearchParams(location.search);input.value=initial.get('q')||'';direction.value=initial.get('direction')||'';tag.value=initial.get('tag')||'';render();
}catch(error){count.textContent='搜索索引暂时不可用，下方仍可浏览全部文章。';}
})();
