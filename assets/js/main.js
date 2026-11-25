document.getElementById('yr').textContent = new Date().getFullYear();
// Hide any link that still has a PASTE_ placeholder, so unfinished links never show
window.addEventListener('load',()=>document.querySelectorAll('.figs').forEach(f=>{if(!f.querySelector('figure'))f.remove()}));
document.querySelectorAll('a[href^="PASTE_"]').forEach(a => a.style.display = 'none');
const root = document.documentElement, btn = document.getElementById('theme'), menu = document.getElementById('tmenu');
const themes = [
  ['light','Light','#f6f8fb','#1e40af'],['yellow','Light yellow','#fffbea','#a16207'],['sky','Sky blue','#f0f7fd','#0b6bb5'],
  ['rose','Soft rose','#fdf3f5','#be3455'],['lavender','Lavender','#f6f4fc','#5b3fc4'],['sand','Sand','#f7f4ee','#8a4b14'],
  ['forest','Forest','#f2f6f3','#1f6b45'],['slate','Slate','#f1f3f5','#334e68'],['dark','Dark','#0a1020','#7aa7ff'],['midnight','Midnight','#12161c','#8fb4e8']];
let cur = 'light';
function setTheme(t){
  if(!themes.some(x=>x[0]===t)) t='light';
  cur=t; root.setAttribute('data-theme',t);
  menu.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
  try { localStorage.setItem('theme',t); } catch(e){}
}
themes.forEach(([id,label,bg,ac])=>{
  const b=document.createElement('button'); b.type='button'; b.dataset.t=id;
  b.innerHTML='<span class="sw" style="background:'+bg+'"><i style="background:'+ac+'"></i></span>'+label;
  b.onclick=()=>{ setTheme(id); closeMenu(); };
  menu.appendChild(b);
});
function closeMenu(){ menu.hidden=true; btn.setAttribute('aria-expanded','false'); }
btn.onclick=e=>{ e.stopPropagation(); menu.hidden=!menu.hidden; btn.setAttribute('aria-expanded',String(!menu.hidden)); };
document.addEventListener('click',e=>{ if(!menu.hidden && !menu.contains(e.target)) closeMenu(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeMenu(); });
try { cur = localStorage.getItem('theme') || 'light'; } catch(e){}
setTheme(cur);
const links = document.getElementById('links');
document.getElementById('menu').onclick = () => links.classList.toggle('open');
links.querySelectorAll('a').forEach(a => a.onclick = () => links.classList.remove('open'));

// ---- Search ----
(function(){
  const ov=document.getElementById('sov'), inp=document.getElementById('sinput'),
        res=document.getElementById('sres'), hint=document.getElementById('shint');
  const items=[];
  function secName(el){const sec=el.closest('section'); if(!sec) return 'Top'; const h=sec.querySelector('h2'); return h?h.textContent.trim():''}
  function add(el,title,box){items.push({el,title:title.trim().replace(/\s+/g,' '),text:(box||el).textContent.toLowerCase().replace(/\s+/g,' '),sec:secName(el)})}
  document.querySelectorAll('section[id] h2').forEach(h=>add(h,h.textContent,h.closest('section')));
  document.querySelectorAll('.ri-list li').forEach(li=>add(li,li.querySelector('h3').textContent));
  document.querySelectorAll('.pub,.pubrow').forEach(a=>{const h=a.querySelector('h3'); if(h) add(a,h.textContent)});
  document.querySelectorAll('.xp').forEach(x=>{const h=x.querySelector('h4'); if(h) add(x,h.textContent)});
  document.querySelectorAll('.stat').forEach(()=>{});
  function open(){ov.hidden=false;inp.value='';render('');setTimeout(()=>inp.focus(),0)}
  function close(){ov.hidden=true}
  function render(q){
    q=q.trim().toLowerCase(); res.innerHTML='';
    if(!q){hint.textContent='Type to search this portfolio.';hint.style.display='block';return}
    const words=q.split(/\s+/);
    const hits=items.filter(i=>words.every(w=>i.text.includes(w))).slice(0,8);
    hint.style.display=hits.length?'none':'block'; hint.textContent='No results found.';
    hits.forEach(i=>{
      const li=document.createElement('li'), b=document.createElement('button');
      b.innerHTML='<span class="rt"></span><span class="rs"></span>';
      b.querySelector('.rt').textContent=i.title; b.querySelector('.rs').textContent=i.sec;
      b.onclick=()=>{close();i.el.scrollIntoView({behavior:'smooth',block:'center'});i.el.classList.add('flash');setTimeout(()=>i.el.classList.remove('flash'),1800)};
      li.appendChild(b);res.appendChild(li);
    });
  }
  document.getElementById('searchBtn').onclick=open;
  inp.addEventListener('input',()=>render(inp.value));
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!ov.hidden){close();return}
    const typing=/INPUT|TEXTAREA/.test((document.activeElement||{}).tagName||'');
    if((e.key==='/'&&!typing)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();open()}
  });
})();

// ---- Project status filter ----
(function(){
  const sec=document.getElementById('projects'); if(!sec) return;
  const arts=[...sec.querySelectorAll('.proj')];
  const count=f=>f==='all'?arts.length:arts.filter(a=>a.dataset.status===f).length;
  ['all','ongoing','completed'].forEach(f=>{const e=document.getElementById('c-'+f); if(e) e.textContent=count(f)});
  function apply(f){
    arts.forEach(a=>a.style.display=(f==='all'||a.dataset.status===f)?'':'none');
    sec.querySelectorAll('h3.group').forEach(g=>{
      let n=g.nextElementSibling, any=false;
      while(n && !n.classList.contains('group')){
        const r=n.matches('.proj')?[n]:[...n.querySelectorAll('.proj')];
        const vis=r.some(x=>x.style.display!=='none');
        if(r.length) n.style.display=vis?'':'none';
        if(vis) any=true; n=n.nextElementSibling;
      }
      g.style.display=any?'':'none';
    });
  }
  document.querySelectorAll('#pfilter .pf').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#pfilter .pf').forEach(x=>x.classList.remove('on'));
    b.classList.add('on'); apply(b.dataset.f);
  });
})();

// ---- Research output: counts read from the page lists ----
(function(){
  const root=document.getElementById('statchart'); if(!root) return;
  const counts={}, published=['journal','preprint','conference']; let lead=0;
  document.querySelectorAll('h3.group[data-stat]').forEach(g=>{
    const s=g.dataset.stat; g.id=g.id||'grp-'+s; counts[s]=0;
    let n=g.nextElementSibling;
    while(n && !n.classList.contains('group')){
      (n.matches('article')?[n]:[...n.querySelectorAll('article')]).forEach(a=>{
        counts[s]++;
        if(published.includes(s) && a.querySelector('.role.fc,.role.first,.role.corr')) lead++;
      });
      n=n.nextElementSibling;
    }
  });
  root.querySelectorAll('.gs[data-stat]').forEach(a=>{
    const s=a.dataset.stat, t=counts[s]; if(t===undefined) return;
    a.querySelector('.gn').textContent=t;
    const l=a.querySelector('.glab'); if(l.dataset.one) l.textContent=t===1?l.dataset.one:l.dataset.many;
    if(document.getElementById('grp-'+s)) a.setAttribute('href','#grp-'+s);
  });
  document.querySelector('#gs-lead .gn').textContent=lead;
})();

// Back-to-top button: appears after scrolling down, smooth-scrolls to the top
(function(){
  const b = document.getElementById('totop');
  if(!b) return;
  const toggle = () => b.classList.toggle('show', window.scrollY > 400);
  window.addEventListener('scroll', toggle, {passive:true});
  toggle();
  b.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'});
  });
})();

// Figures: hide any figure whose image is missing, click an image to enlarge
(function(){
  document.addEventListener('error',e=>{
    const img=e.target; if(img.tagName!=='IMG') return;
    const fig=img.closest('.figs figure'); if(!fig) return;
    const box=fig.parentElement; fig.remove();
    if(box && !box.querySelector('figure')) box.remove();
  },true);
  // images that already failed before this script ran
  window.addEventListener('load',()=>document.querySelectorAll('.figs img').forEach(img=>{
    if(img.complete && img.naturalWidth===0) img.dispatchEvent(new Event('error'));
  }));
  const lb=document.createElement('div'); lb.className='lb'; lb.hidden=true;
  lb.innerHTML='<img alt=""><p></p>'; document.body.appendChild(lb);
  const close=()=>{ lb.hidden=true; };
  lb.onclick=close;
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  document.addEventListener('click',e=>{
    const img=e.target.closest('.figs img'); if(!img) return;
    lb.querySelector('img').src=img.currentSrc||img.src;
    lb.querySelector('img').alt=img.alt;
    const cap=img.closest('figure').querySelector('figcaption');
    lb.querySelector('p').textContent=cap?cap.textContent:'';
    lb.hidden=false;
  });
})();
