window.addEventListener('load',function(){
  var st=document.createElement('style');
  st.textContent='.bg-vacances_parent{background:#fde68a!important;border-color:#f59e0b!important}.bg-conge{background:#fed7aa!important;border-color:#fb923c!important}.v{background:#fde68a}.vacSlot{border:1px solid #dbe5f1;border-radius:14px;padding:10px;margin:8px 0;background:#f8fafc}.vacRow{display:grid;grid-template-columns:1fr 1fr;gap:8px}.vacBtns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}';
  document.head.appendChild(st);
  var zone=document.getElementById('vacations');
  if(!zone||document.getElementById('vacSlotZone'))return;
  var html='<div class="card" id="vacSlotZone"><h2>Vacances par période</h2><p class="hint">Départ = premier jour sans garde. Reprise = jour où la garde reprend.</p><h3>Mes vacances famille</h3>';
  for(var i=1;i<=15;i++)html+=slotHtml('p',i);
  html+='<h3>Vacances assistante maternelle</h3>';
  for(var j=1;j<=15;j++)html+=slotHtml('n',j);
  html+='</div>';
  zone.insertAdjacentHTML('afterbegin',html);
  fillVacSlots();
});
function slotHtml(t,i){return '<div class="vacSlot"><b>Vac '+i+'</b><div class="vacRow"><label>Départ<input class="vacStart" data-t="'+t+'" data-i="'+i+'" type="date"></label><label>Reprise<input class="vacBack" data-t="'+t+'" data-i="'+i+'" type="date"></label></div><div class="vacBtns"><button type="button" class="vacAdd" data-t="'+t+'" data-i="'+i+'">Ajouter</button><button type="button" class="danger vacClear" data-t="'+t+'" data-i="'+i+'">Corriger</button></div></div>'}
document.addEventListener('click',function(e){
  if(e.target.classList.contains('vacAdd'))saveVacSlot(e.target.dataset.t,e.target.dataset.i);
  if(e.target.classList.contains('vacClear'))clearVacSlot(e.target.dataset.t,e.target.dataset.i);
});
function vacStore(){try{return JSON.parse(localStorage.getItem('vacSlots')||'{}')}catch(e){return{}}}
function saveVacStore(x){localStorage.setItem('vacSlots',JSON.stringify(x))}
function oneDayBefore(x){var d=new Date(x+'T00:00:00');d.setDate(d.getDate()-1);return d}
function saveVacSlot(t,i){
  var a=document.querySelector('.vacStart[data-t="'+t+'"][data-i="'+i+'"]');
  var b=document.querySelector('.vacBack[data-t="'+t+'"][data-i="'+i+'"]');
  if(!a.value||!b.value){toast('Remplis départ et reprise');return}
  var start=new Date(a.value+'T00:00:00'),end=oneDayBefore(b.value),status=t==='p'?'vacances_parent':'conge',nb=0;
  if(end<start){toast('Reprise doit être après départ');return}
  for(var d=new Date(start);d<=end;d.setDate(d.getDate()+1)){state.days[key(d)]={status:status,start:'',end:'',pause:0,meal:false,care:false,note:'Vac '+i};nb++}
  var s=vacStore();s[t+i]={a:a.value,b:b.value,st:status};saveVacStore(s);state.year=start.getFullYear();state.month=start.getMonth();save();render();fillVacSlots();toast(nb+' jours ajoutés au calendrier')
}
function clearVacSlot(t,i){
  var s=vacStore(),it=s[t+i];
  if(!it)return;
  var start=new Date(it.a+'T00:00:00'),end=oneDayBefore(it.b);
  for(var d=new Date(start);d<=end;d.setDate(d.getDate()+1)){var k=key(d);if(state.days[k]&&state.days[k].status===it.st)delete state.days[k]}
  delete s[t+i];saveVacStore(s);save();render();fillVacSlots();toast('Période corrigée')
}
function fillVacSlots(){var s=vacStore();Object.keys(s).forEach(function(k){var t=k.charAt(0),i=k.slice(1),it=s[k],a=document.querySelector('.vacStart[data-t="'+t+'"][data-i="'+i+'"]'),b=document.querySelector('.vacBack[data-t="'+t+'"][data-i="'+i+'"]');if(a)a.value=it.a;if(b)b.value=it.b})}
