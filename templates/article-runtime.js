document.addEventListener('DOMContentLoaded',()=>{
  const meta=name=>document.querySelector(`meta[name="note:${name}"]`)?.content||'';
  document.querySelectorAll('[data-note-field]').forEach(el=>{const value=meta(el.dataset.noteField);
    el.textContent=value;
    if(el.tagName==='TIME')el.dateTime=value;});
  if(meta('status')!=='published'){const banner=document.createElement('div');banner.className='draft-banner';banner.textContent='私人草稿 · 此状态不会进入公开网站';document.body.prepend(banner);}
  document.title=meta('title')+' · Research Notes';
  const description=document.querySelector('meta[name=description]');
  if(description)description.content=meta('summary');
  const paperUrl=meta('paper-url');
  const heading=document.querySelector('.article-header h1');
  if(heading&&paperUrl){
    try{
      const url=new URL(paperUrl);
      if(url.protocol==='https:'&&url.hostname==='arxiv.org'){
        const link=document.createElement('a');link.className='paper-link';link.href=url.href;
        link.target='_blank';link.rel='noopener noreferrer';
        link.setAttribute('aria-label','Open original paper on arXiv (new tab)');link.title='arXiv';
        link.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 28" aria-hidden="true" focusable="false"><text x="1" y="21" fill="currentColor" font-family="Georgia,serif" font-size="24">arXiv</text></svg>';
        heading.append(link);
      }
    }catch(error){/* An empty or invalid paper URL leaves the title unchanged. */}
  }
  // Older notes and new templates get a directory from their section headings.
  const article=document.querySelector('main article');
  if(article&&!article.querySelector('.reading-toc')){
    const headings=[...article.querySelectorAll('h2')];
    if(headings.length){
      const toc=document.createElement('details');toc.className='reading-toc';toc.open=true;
      const summary=document.createElement('summary');summary.textContent='本文目录';toc.append(summary);
      const list=document.createElement('ol');
      headings.forEach((heading,index)=>{
        if(!heading.id){
          let id='section-'+(index+1);
          while(document.getElementById(id))id+='-heading';
          heading.id=id;
        }
        const item=document.createElement('li');const link=document.createElement('a');
        link.href='#'+encodeURIComponent(heading.id);link.textContent=heading.textContent;
        item.append(link);list.append(item);
      });
      toc.append(list);
      const header=article.querySelector('.article-header');
      if(header)header.after(toc);else article.prepend(toc);
    }
  }
  // Comment threads follow the note slug across title and domain changes.
  const comments=document.querySelector('.article-comments');
  if(comments){
    const status=comments.querySelector('[data-comments-status]');
    const mount=comments.querySelector('[data-comments-mount]');
    const discussion=comments.querySelector('[data-comments-link]');
    const slug=meta('slug');
    const repo='luo-li-ba-suo/kida_research';
    const term='notes/'+slug+'/';
    discussion.href='https://github.com/'+repo+'/issues?q='+encodeURIComponent('is:issue "'+term+'"');
    if(meta('status')!=='published'||!/^https?:$/.test(location.protocol)){
      status.textContent='评论在已发布的网站上开放。本地文件和草稿不加载评论服务。';
      discussion.hidden=true;
    }else{
      let loaded=false;
      const loadComments=()=>{
        if(loaded)return;
        loaded=true;
        status.textContent='正在加载评论…';
        const script=document.createElement('script');
        script.src='https://utteranc.es/client.js';script.async=true;
        script.setAttribute('repo',repo);script.setAttribute('issue-term',term);
        script.setAttribute('theme','github-light');script.setAttribute('crossorigin','anonymous');
        script.onload=()=>{status.textContent='使用 GitHub 登录后即可留言。首条评论会创建本篇讨论。';};
        script.onerror=()=>{status.textContent='评论暂时无法加载，可通过下方链接在 GitHub 查看讨论，或刷新页面重试。';};
        mount.append(script);
      };
      if('IntersectionObserver' in window){
        const observer=new IntersectionObserver(entries=>{
          if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();loadComments();}
        },{rootMargin:'300px'});
        observer.observe(comments);
      }else loadComments();
    }
  }
  document.querySelectorAll('.math-block,.math-inline').forEach(el=>{
    if(el.querySelector('math'))return;
    const tex=el.textContent;el.dataset.latex=tex;
    try{katex.render(tex,el,{displayMode:el.classList.contains('math-block'),throwOnError:true,trust:false,strict:'warn'});}
    catch(error){el.textContent=tex;el.classList.add('math-error');el.title=error.message;}
  });
});
