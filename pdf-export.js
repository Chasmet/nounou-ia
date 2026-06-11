function niContractCalc(){
  const s=state.settings;
  const start=date(s.periodStart||state.year+'-01-01');
  const end=date(s.periodEnd||state.year+'-12-31');
  const days=s.standardDays||[];
  let possible=0, planned=0, excluded=0;
  for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){
    if(!days.includes(d.getDay())) continue;
    possible++;
    const item=state.days[key(d)];
    if(item && (item.status==='vacances_parent' || item.status==='conge')) excluded++;
    else planned++;
  }
  const daysPerWeek=days.length||1;
  const hoursPerDay=hBetween(s.defaultStart,s.defaultEnd);
  const hoursPerWeek=hoursPerDay*daysPerWeek;
  const weeks=planned/daysPerWeek;
  const rate=Number(s.hourlyRate||0);
  const yearlyBase=hoursPerWeek*rate*weeks;
  const monthlyBase=yearlyBase/12;
  const leaveByTen=yearlyBase*0.10;
  const leaveDays=Math.min(30,weeks/4*2.5);
  const leaveBySalary=(leaveDays/6)*hoursPerWeek*rate;
  const leaveToPay=Math.max(leaveByTen,leaveBySalary);
  return {start,end,possible,planned,excluded,daysPerWeek,hoursPerWeek,weeks,monthlyBase,yearlyBase,leaveByTen,leaveBySalary,leaveDays,leaveToPay,total:yearlyBase+leaveToPay};
}
function niContractHtml(){
  const c=niContractCalc();
  return line('Semaines annuelles à déclarer',c.weeks.toFixed(2).replace('.',','))+
  line('Heures prévues par semaine',htxt(c.hoursPerWeek))+
  line('Jours possibles avant vacances',c.possible)+
  line('Jours retirés par vacances/congés',c.excluded)+
  line('Jours d’accueil programmés',c.planned)+
  line('Salaire mensuel année incomplète',euro(c.monthlyBase))+
  line('Salaire annuel hors congés',euro(c.yearlyBase))+
  line('Congés acquis estimés',c.leaveDays.toFixed(2).replace('.',',')+' jours ouvrables')+
  line('Congés méthode maintien',euro(c.leaveBySalary))+
  line('Congés méthode 10%',euro(c.leaveByTen))+
  line('Congés à payer une fois par an',euro(c.leaveToPay))+
  line('Total annuel estimé',euro(c.total));
}
function niMonthBlock(m){
  let html='<div class="pdf-month"><h3>'+MONTHS[m]+' '+state.year+'</h3><table><thead><tr><th>Lun</th><th>Mar</th><th>Mer</th><th>Jeu</th><th>Ven</th><th>Sam</th><th>Dim</th></tr></thead><tbody>';
  const ds=gridDates(state.year,m);
  for(let i=0;i<42;i+=7){
    html+='<tr>';
    for(let j=0;j<7;j++){
      const d=ds[i+j];
      const k=key(d);
      const item=state.days[k];
      const label=item?LABEL[item.status]||item.status:'';
      html+='<td class="'+(d.getMonth()!=m?'muted ':'')+(item?'pdf-'+item.status:'')+'"><b>'+d.getDate()+'</b><br>'+label+'</td>';
    }
    html+='</tr>';
  }
  return html+'</tbody></table></div>';
}
function exportCalendarPdf(){
  const title='Calendrier annuel assistante maternelle - '+state.year;
  const child=state.settings.childName||'';
  const nanny=state.settings.nannyName||'';
  let html='<style>@page{size:A4 landscape;margin:8mm}body{font-family:Arial,sans-serif;color:#111}.pdf-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.pdf-head h1{margin:0;font-size:22px}.pdf-info{font-size:12px}.pdf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.pdf-month{break-inside:avoid;border:1px solid #bbb;border-radius:8px;padding:5px}.pdf-month h3{margin:0 0 4px;font-size:13px}.pdf-month table{width:100%;border-collapse:collapse;font-size:8px}.pdf-month th,.pdf-month td{border:1px solid #ddd;vertical-align:top;height:28px;padding:2px}.muted{opacity:.35}.pdf-garde{background:#bbf7d0}.pdf-exceptionnel{background:#ddd6fe}.pdf-vacances_parent{background:#fde68a}.pdf-conge{background:#fed7aa}.pdf-absence_enfant{background:#fecaca}.pdf-absence_nounou{background:#bfdbfe}.pdf-summary{display:grid;grid-template-columns:repeat(2,1fr);gap:4px;margin:8px 0}.line{display:flex;justify-content:space-between;border:1px solid #ddd;padding:4px;border-radius:5px;font-size:11px}.hint{font-size:10px;color:#555}</style>';
  html+='<div class="pdf-head"><div><h1>'+title+'</h1><div class="pdf-info">Enfant : '+child+'<br>Assistante maternelle : '+nanny+'<br>Document de vérification planning, semaines contrat et congés payés.</div></div><div class="pdf-info">Généré le '+new Date().toLocaleDateString('fr-FR')+'</div></div>';
  html+='<h2>Calcul année incomplète</h2><div class="pdf-summary">'+niContractHtml()+'</div>';
  html+='<div class="pdf-grid">';
  for(let m=0;m<12;m++) html+=niMonthBlock(m);
  html+='</div>';
  document.getElementById('printArea').innerHTML=html;
  setTimeout(()=>window.print(),80);
}
window.addEventListener('load',()=>{
  window.annualCalc=niContractCalc;
  window.annualHtml=niContractHtml;
  const p=document.getElementById('print');
  if(p){p.textContent='Télécharger calendrier PDF';p.onclick=exportCalendarPdf;}
  try{render()}catch(e){}
});
