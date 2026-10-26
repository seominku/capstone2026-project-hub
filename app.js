(() => {
'use strict';
const D = window.GAME_SHOWCASE, C = window.EQUIPMENT_CATALOG;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const photo = (src, alt, caption, label=caption, icon=false) => {const id=Number(/item-(\d+)\.png$/.exec(src)?.[1]),meta=icon?window.EQUIPMENT_OPTIONS.catalog.find(x=>x.id===id):null,pixels=meta?Math.min(Math.max(meta.iconWidth,meta.iconHeight),128):256,nativeWidth=meta?meta.iconWidth:256;if(meta)src='assets/equipment-v03/item-'+id+'.png';return '<button type="button" class="photo" data-photo="'+esc(src)+'" data-preview="'+(icon?'icon':'photo')+'" data-native-pixels="'+nativeWidth+'" style="--source-pixels:'+pixels+'px" data-caption="'+esc(caption)+'" aria-label="'+esc(alt)+(icon?' 보기':' 크게 보기')+'"><img src="'+esc(src)+'" alt="'+esc(alt)+'" loading="lazy">'+(label?'<span>'+esc(label)+' ↗</span>':'')+'</button>';};
const features = list => list.map(([n,title,body,href,label]) => '<article><span class="feature-number">'+esc(n)+'</span><h3>'+esc(title)+'</h3><p>'+esc(body)+'</p>'+(href?'<a class="text-link" href="#'+esc(href)+'">'+esc(label)+' →</a>':'')+'</article>').join('');
['intro','world','combat','memory','equipment'].forEach(key => $(key+'-features').innerHTML = features(D[key+'Features']));
$('faq-content').innerHTML=D.faq.map(([q,a])=>'<details><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join('');
const chapters = list => list.map(c=>'<article class="story-chapter"><h2>'+esc(c.title)+'</h2>'+c.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'</article>').join('');
$('story-content').innerHTML=chapters(D.story)+'<details class="story-spoilers"><summary>숲의 진실 읽기 · 후반부와 결말 포함</summary>'+chapters(D.spoilers)+'</details>';
$('journey').innerHTML=D.journey.map(([stage,name,body,img])=>'<article'+(!img?' class="rest-stop"':'')+'>'+(img?'<img src="assets/game/'+esc(img)+'.webp" alt="'+esc(name)+' 실제 게임 화면" loading="lazy">':'')+'<div>'+(!img?'<span class="rest-mark" aria-hidden="true">◇</span>':'')+'<span class="stage">'+esc(stage)+'</span><h3>'+esc(name)+'</h3><p>'+esc(body)+'</p></div></article>').join('');
$('room-gallery').innerHTML=D.roomGallery.map(([img,name])=>photo('assets/game/'+img+'.webp',name,name+' · 일반 미로 내부 관찰 화면',name)).join('');
$('room-list').innerHTML=D.rooms.map(name=>'<span>'+esc(name)+'</span>').join('');
$('growth-trees').innerHTML=D.trees.map(([name,sub,body,tags],i)=>'<article><span class="tree-symbol" aria-hidden="true">'+['↝','◇','✧'][i]+'</span><h3>'+esc(name)+'</h3><p class="tree-subtitle">'+esc(sub)+'</p><p>'+esc(body)+'</p><small>'+esc(tags)+'</small></article>').join('');
$('run-rules').innerHTML=D.rules.map(([name,body])=>'<article><h3>'+esc(name)+'</h3><p>'+esc(body)+'</p></article>').join('');
$('controls').innerHTML=D.controls.map(([key,action])=>'<div><dt><kbd>'+esc(key)+'</kbd></dt><dd>'+esc(action)+'</dd></div>').join('');
$('monster-grid').innerHTML=D.monsters.map(([key,name,role,body])=>'<article class="monster-card">'+photo('assets/unity/monster-'+key+'.png',name+' 모델',name+' · Unity 모델 촬영','')+'<p class="monster-role">'+esc(role)+'</p><h3>'+esc(name)+'</h3><p>'+esc(body)+'</p></article>').join('');
$('screen-gallery').innerHTML=D.gallery.map(([src,name])=>photo(src,name,name+' · 실제 게임 화면',name)).join('');
document.addEventListener('click',e=>{const b=e.target.closest('[data-scroll-to]');if(b)$(b.dataset.scrollTo)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});

let weight='all', kind='weapons', page=1;
const pageSize=20;
const pressed=(parent,attribute,value)=>document.querySelectorAll('#'+parent+' button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attribute]===value)));
function renderMemories(){
 const query=$('memory-search').value.trim().toLocaleLowerCase('ko');
 const items=C.memories.filter(m=>(weight==='all'||m.weight===weight)&&m.name.toLocaleLowerCase('ko').includes(query));
 $('memory-count').textContent=items.length+'개의 기억';
 $('memory-grid').innerHTML=items.length?items.map(m=>'<article class="memory-card">'+photo(m.image,m.name+' 아이콘',m.name+' · '+m.weightName+' 기억','')+'<div><h3>'+esc(m.name)+'</h3><p class="memory-meta"><span class="weight-'+esc(m.weight)+'">'+esc(m.weightName)+'</span> · '+esc(m.tag)+'</p></div></article>').join(''):'<p class="empty-state">조건에 맞는 기억이 없습니다. 검색어나 무게를 바꿔 보세요.</p>';
}
$('memory-filters').addEventListener('click',e=>{const b=e.target.closest('button[data-weight]');if(!b)return;weight=b.dataset.weight;pressed('memory-filters','weight',weight);renderMemories();});
$('memory-search').addEventListener('input',renderMemories);
const slots=[...new Set(C.armor.map(a=>a.slotName))];
$('slot-filter').innerHTML+=[...slots].map(s=>'<option value="'+esc(s)+'">'+esc(s)+'</option>').join('');
function renderEquipment(){
 const query=$('equipment-search').value.trim().toLocaleLowerCase('ko');
 const grade=$('grade-filter').value, slot=$('slot-filter').value;
 const items=C[kind].filter(x=>x.name.toLocaleLowerCase('ko').includes(query)&&(grade==='all'||String(x.gradeKey)===grade)&&(kind!=='armor'||slot==='all'||x.slotName===slot));
 const total=Math.max(1,Math.ceil(items.length/pageSize));page=Math.max(1,Math.min(page,total));
 $('grade-filter-label').hidden=false;
 $('slot-filter-label').hidden=kind!=='armor';
 $('equipment-count').textContent=items.length+'개의 '+({weapons:'무기',armor:'방어구',accessories:'장신구'}[kind]);
 $('equipment-grid').innerHTML=items.length?items.slice((page-1)*pageSize,page*pageSize).map(x=>'<article class="equipment-card" data-grade="'+esc(x.gradeKey)+'">'+photo(x.image,x.name+' 외형',x.name+' · 게임 장비 아이콘 · 원본 크기 미리보기','',true)+'<h3>'+esc(x.name)+'</h3><p>'+(x.grade?'<span class="grade grade-'+esc(x.gradeKey)+'">'+esc(x.grade)+'</span>':'')+esc(x.className||x.slotName)+'</p></article>').join(''):'<p class="empty-state">조건에 맞는 장비가 없습니다. 검색어나 필터를 바꿔 보세요.</p>';
 $('pagination').hidden=total<=1;
 $('page-count').textContent=page+' / '+total;
 $('previous-page').disabled=page===1;$('next-page').disabled=page===total;
}
function changeKind(next){
 kind=next;page=1;$('equipment-search').value='';$('grade-filter').value='all';$('slot-filter').value='all';
 pressed('equipment-filters','kind',kind);renderEquipment();
}
$('equipment-filters').addEventListener('click',e=>{const b=e.target.closest('button[data-kind]');if(b)changeKind(b.dataset.kind);});
['equipment-search','grade-filter','slot-filter'].forEach(id=>$(id).addEventListener(id==='equipment-search'?'input':'change',()=>{page=1;renderEquipment();}));
function movePage(delta){page+=delta;renderEquipment();$('equipment-grid').scrollIntoView({block:'start',behavior:'auto'});}
$('previous-page').addEventListener('click',()=>movePage(-1));$('next-page').addEventListener('click',()=>movePage(1));
renderMemories();renderEquipment();

// The option catalog is a read-only export of the shipping solo rules, not a new roll simulator.
const O=window.EQUIPMENT_OPTIONS;let optionKind='appraisal';
function renderOptions(){
 const slot=$('option-slot').value,grade=Number($('option-grade').value),isNight=optionKind==='night';
 $('option-slot-label').hidden=isNight;$('option-grade-label').hidden=isNight;
 const list=isNight?O.night:O.options.filter(o=>o.slot===slot&&o.grade===grade);
 $('option-count').textContent=list.length+'가지 '+(isNight?'고정 각인':'감정 옵션 후보');
 $('option-grid').innerHTML=list.map(o=>'<li class="option-card'+(isNight?(o.bane?' bane':' boon'):'')+'"><span class="option-category">'+(isNight?(o.bane?'디버프':'버프'):o.conditional?'조건부 옵션':'감정 옵션')+'</span><p>'+esc(o.minLabel)+(o.minLabel===o.maxLabel?'':'<span class="option-to">~</span>'+esc(o.maxLabel))+'</p></li>').join('');
 $('appraisal-note').hidden=isNight;$('night-note').hidden=!isNight;
}
$('option-filters').addEventListener('click',e=>{const b=e.target.closest('[data-option-kind]');if(!b)return;optionKind=b.dataset.optionKind;pressed('option-filters','optionKind',optionKind);renderOptions();});
['option-slot','option-grade'].forEach(id=>$(id).addEventListener('change',renderOptions));
$('unique-options').innerHTML=O.unique.map(o=>'<li>'+esc(o.label)+'</li>').join('');renderOptions();

const titles={intro:'게임 소개',story:'이야기',world:'숲과 심층',combat:'전투와 성장',memories:'기억',equipment:'장비',bestiary:'몬스터',download:'다운로드'};
const aliases={'game-bible':'intro',overview:'intro',systems:'combat','ui-ux':'combat',weapons:'equipment',armor:'equipment',boss:'bestiary',development:'intro',quality:'intro',documents:'intro',feedback:'intro',roadmap:'intro',qa:'intro'};
const toggle=document.querySelector('.menu-toggle'),nav=$('navigation');
function closeMenu(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
function route(focus=false){
 const raw=location.hash.slice(1)||'intro';
 if(raw==='main'){$('main').focus();return;}
 const next=titles[raw]?raw:(aliases[raw]||'intro');
 if(raw!==next)history.replaceState(null,'','#'+next);
 if(raw==='armor')changeKind('armor');else if(raw==='weapons')changeKind('weapons');
 document.querySelectorAll('.page').forEach(p=>p.hidden=p.id!==next);
 nav.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+next)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 document.title=titles[next]+' · 잠들지 않는 숲 | ROOTBOUND';
 closeMenu();window.scrollTo({top:0,behavior:'instant'});if(focus)$('main').focus({preventScroll:true});
}
window.addEventListener('hashchange',()=>route(true));route();
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

const dialog=$('photo-dialog'),fullImage=$('photo-image');
let photoTrigger=null;
document.addEventListener('click',e=>{
 const button=e.target.closest('button[data-photo]');
 if(!button)return;
 photoTrigger=button;dialog.dataset.preview=button.dataset.preview||'photo';fullImage.src=button.dataset.photo;
 fullImage.onload=()=>{fullImage.style.setProperty('--native-width',Math.min(fullImage.naturalWidth,Number(button.dataset.nativePixels)||fullImage.naturalWidth)+'px');};
 fullImage.alt=button.querySelector('img')?.alt||button.dataset.caption;
 $('photo-caption').textContent=button.dataset.caption;dialog.showModal();
});
$('close-photo').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{photoTrigger?.focus({preventScroll:true});fullImage.removeAttribute('src');});
})();
