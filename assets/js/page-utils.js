window.KpiPage = (() => {
  const nf = new Intl.NumberFormat('en-IN',{maximumFractionDigits:2});
  const money = new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  const fmt = v => v===null || v===undefined || Number.isNaN(v) ? '—' : nf.format(v);
  const inr = v => v===null || v===undefined || Number.isNaN(v) ? '—' : money.format(v);
  function set(id,value){ const e=document.getElementById(id); if(e) e.textContent=value; }
  function error(message){ const e=document.getElementById('calcMessage'); if(e){e.textContent=message;e.className='notice danger';e.hidden=false;} }
  function clearError(){ const e=document.getElementById('calcMessage'); if(e){e.hidden=true;e.textContent='';} }
  function saveCsv(filename,obj){ const keys=Object.keys(obj); const q=v=>`"${String(v??'').replaceAll('"','""')}"`; const csv=keys.map(q).join(',')+'\n'+keys.map(k=>q(obj[k])).join(',')+'\n'; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})); a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500); }
  return {fmt,inr,set,error,clearError,saveCsv};
})();
