function niToast(text){
  const t=document.getElementById('toast');
  if(!t){alert(text);return;}
  t.textContent=text;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}
function niDownload(name, data){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));
  a.download=name;
  a.click();
}
function niResetVacations(){
  if(!confirm('Supprimer toutes les vacances famille et congés nounou de l’année affichée ?')) return;
  let total=0;
  for(const k of Object.keys(state.days||{})){
    const d=date(k);
    const item=state.days[k];
    if(d.getFullYear()===state.year && item && (item.status==='vacances_parent' || item.status==='conge')){
      delete state.days[k];
      total++;
    }
  }
  save();
  render();
  niToast(total+' jour(s) vacances/congés supprimé(s).');
}
function niResetYear(){
  if(!confirm('Supprimer tout le planning de l’année affichée ?')) return;
  let total=0;
  for(const k of Object.keys(state.days||{})){
    if(date(k).getFullYear()===state.year){delete state.days[k];total++;}
  }
  save();
  render();
  niToast(total+' jour(s) supprimé(s) sur l’année.');
}
function niResetAll(){
  if(!confirm('Attention : tout supprimer ? Planning, vacances, réglages et historique.')) return;
  localStorage.removeItem('nounouIA.v1');
  localStorage.removeItem('nounouIA.v2');
  localStorage.removeItem('nounouIA.v3');
  localStorage.removeItem('nounouIA.v4');
  location.reload();
}
function niExportFullBackup(){
  niDownload('sauvegarde-complete-nounou-ia.json',JSON.stringify(state,null,2));
}
function niBuildTools(){
  const settings=document.querySelector('#settings .card');
  if(settings && !document.getElementById('maintenanceCard')){
    const card=document.createElement('div');
    card.className='card';
    card.id='maintenanceCard';
    card.innerHTML='<h2>Correction et reset</h2><p class="hint">Avant une grosse correction, exporte une sauvegarde.</p><button id="fullBackup">Sauvegarde complète</button><button id="resetVacations">Reset vacances/congés de l’année</button><button id="resetYear" class="danger">Reset planning de l’année</button><button id="resetAll" class="danger">Reset complet application</button>';
    settings.after(card);
    document.getElementById('fullBackup').onclick=niExportFullBackup;
    document.getElementById('resetVacations').onclick=niResetVacations;
    document.getElementById('resetYear').onclick=niResetYear;
    document.getElementById('resetAll').onclick=niResetAll;
  }
  const vacations=document.querySelector('#vacations .card');
  if(vacations && !document.getElementById('quickCorrectionCard')){
    const card=document.createElement('div');
    card.className='card';
    card.id='quickCorrectionCard';
    card.innerHTML='<h2>Corrections rapides</h2><button id="resetVacations2" class="danger">Effacer uniquement vacances/congés de l’année</button><p class="hint">Pour corriger une seule journée : ouvre le calendrier, touche le jour, change le statut, puis Enregistrer.</p>';
    vacations.after(card);
    document.getElementById('resetVacations2').onclick=niResetVacations;
  }
}
window.addEventListener('load',niBuildTools);
