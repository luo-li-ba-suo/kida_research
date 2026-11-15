document.addEventListener('DOMContentLoaded',()=>{
  const meta=name=>document.querySelector(`meta[name="note:${name}"]`)?.content||'';
  document.querySelectorAll('[data-note-field]').forEach(el=>{const value=meta(el.dataset.noteField);
    el.textContent=value;
    if(el.tagName==='TIME')el.dateTime=value;});
  if(meta('status')!=='published'){const banner=document.createElement('div');banner.className='draft-banner';banner.textContent='私人草稿 · 此状态不会进入公开网站';document.body.prepend(banner);}
  document.title=meta('title')+' · Research Notes';
  const description=document.querySelector('meta[name=description]');
  if(description)description.content=meta('summary');
  document.querySelectorAll('.math-block,.math-inline').forEach(el=>{
    if(el.querySelector('math'))return;
    const tex=el.textContent;el.dataset.latex=tex;
    try{katex.render(tex,el,{displayMode:el.classList.contains('math-block'),throwOnError:true,trust:false,strict:'warn'});}
    catch(error){el.textContent=tex;el.classList.add('math-error');el.title=error.message;}
  });
});
