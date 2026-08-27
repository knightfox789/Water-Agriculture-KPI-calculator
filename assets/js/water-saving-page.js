(() => {
  const C=KpiCalculators,P=KpiPage,S=KpiState; const scenario=document.getElementById('scenarioSelect'); const panels=[...document.querySelectorAll('[data-scenario-panel]')];
  function show(){panels.forEach(p=>p.hidden=p.dataset.scenarioPanel!==scenario.value);P.clearError();} scenario.addEventListener('change',show); show();
  const saved=S.get(); if(saved.controlWaterM3Ha!=null) document.getElementById('simpleControl').value=saved.controlWaterM3Ha; if(saved.programmeWaterM3Ha!=null) document.getElementById('simpleProgramme').value=saved.programmeWaterM3Ha;
  document.getElementById('loadMeasured').addEventListener('click',()=>{const x=S.get(); if(x.controlWaterM3Ha!=null)document.getElementById('simpleControl').value=x.controlWaterM3Ha;if(x.programmeWaterM3Ha!=null)document.getElementById('simpleProgramme').value=x.programmeWaterM3Ha;});
  const cropRows=document.getElementById('waterCropRows');
  function addRow(data={}){ const d=document.createElement('div'); d.className='dynamic-row water'; d.innerHTML=`<div class="field"><label>Crop</label><input class="wc-crop" value="${data.crop||''}"></div><div class="field"><label>Area share %</label><input class="wc-share" type="number" step="0.01" value="${data.share||''}"></div><div class="field"><label>Programme yield kg / 1-ha intercrop plot</label><input class="wc-py" type="number" step="0.01"></div><div class="field"><label>Control water KL/ha</label><input class="wc-cw" type="number" step="0.01"></div><div class="field"><label>Control yield kg/ha</label><input class="wc-cy" type="number" step="0.01"></div><button class="icon-btn" type="button">✕</button>`; d.querySelector('.icon-btn').onclick=()=>d.remove(); cropRows.appendChild(d); }
  document.getElementById('addWaterCrop').onclick=()=>addRow(); addRow({crop:'Crop 1',share:50});addRow({crop:'Crop 2',share:50});
  let last=null;
  const v=id=>document.getElementById(id)?.value;
  document.getElementById('calculateBtn').onclick=()=>{try{P.clearError(); if(scenario.value==='same'){last=C.waterSavingSimple({controlM3Ha:v('simpleControl'),programmeM3Ha:v('simpleProgramme'),areaHa:v('simpleArea')});} else if(scenario.value==='change'){last=C.waterSavingSimple({controlM3Ha:v('changeControl'),programmeM3Ha:v('changeProgramme'),areaHa:v('changeArea')});}
    else if(scenario.value==='rainfed'){last=C.waterSavingRainfed({rainfallMm:v('rainRainfall'),controlYieldKgHa:v('rainCY'),programmeYieldKgHa:v('rainPY'),areaHa:v('rainArea')});}
    else {const crops=[...cropRows.children].map(r=>({crop:r.querySelector('.wc-crop').value,areaSharePct:r.querySelector('.wc-share').value,programmeYieldKgPlot:r.querySelector('.wc-py').value,controlWaterKLHa:r.querySelector('.wc-cw').value,controlYieldKgHa:r.querySelector('.wc-cy').value})); last=C.waterSavingIntercrop({totalProgrammeWaterKLHa:v('interTotalWater'),areaHa:v('interArea'),crops});}
    const total=last.totalSavingM3; P.set('savingPerHa',last.savingM3Ha!=null?P.fmt(last.savingM3Ha)+' m³/ha':'Scenario-specific');P.set('totalSaving',P.fmt(total)+' m³');P.set('savingPercent',last.reductionPercent!=null?P.fmt(last.reductionPercent)+' %':'—');
    S.set({waterSavingTotalM3:total});
  }catch(e){last=null;P.error(e.message);}};
})();
