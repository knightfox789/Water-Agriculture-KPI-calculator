(() => {
  const C=window.KpiCalculators, P=window.KpiPage, S=window.KpiState;
  const method=document.getElementById('methodSelect');
  const panels=[...document.querySelectorAll('[data-method-panel]')];
  function show(){ panels.forEach(p=>p.hidden=p.dataset.methodPanel!==method.value); P.clearError(); }
  method.addEventListener('change',show); show();
  let last=null;
  function val(id){return document.getElementById(id)?.value;}
  document.getElementById('calculateBtn').addEventListener('click',()=>{
    try{
      P.clearError();
      if(method.value==='pump') last=C.pumpWater({hp:val('pumpHp'),swl:val('pumpSwl'),fl:val('pumpFl'),dh:val('pumpDh'),efficiencyPercent:val('pumpEff'),hours:val('pumpHours'),events:val('pumpEvents'),areaHa:val('pumpArea')});
      if(method.value==='depth') last=C.fieldDepthWater({depths:[1,2,3,4,5].map(i=>val('depth'+i)),events:val('depthEvents'),areaHa:val('depthArea')});
      if(method.value==='vnotch') last=C.vNotchWater({headM:val('vHead'),hours:val('vHours'),events:val('vEvents'),areaHa:val('vArea')});
      if(method.value==='drip') last=C.dripWater({areaHa:val('dripArea'),emitterSpacingM:val('dripES'),lateralSpacingM:val('dripLS'),emitterLph:val('dripQ'),hours:val('dripHours'),events:val('dripEvents')});
      if(method.value==='sprinkler') last=C.sprinklerWater({heads:val('sprHeads'),collectedMl:val('sprMl'),hours:val('sprHours'),events:val('sprEvents'),areaHa:val('sprArea')});
      P.set('perIrrigation',P.fmt(last.perIrrigationM3)+' m³'); P.set('seasonalWater',P.fmt(last.seasonalM3)+' m³'); P.set('waterPerHa',P.fmt(last.m3PerHa)+' m³/ha');
      const secondary = last.dischargeLpm ? `Discharge: ${P.fmt(last.dischargeLpm)} L/min` : last.dischargeM3s ? `Discharge: ${P.fmt(last.dischargeM3s)} m³/s` : last.emitterCount ? `Emitters: ${P.fmt(last.emitterCount)}` : last.dischargePerHeadLph ? `Discharge/head: ${P.fmt(last.dischargePerHeadLph)} LPH` : last.averageDepthMm ? `Average depth: ${P.fmt(last.averageDepthMm)} mm` : '';
      P.set('measurementDetail',secondary);
    }catch(e){last=null;P.error(e.message);}
  });
  document.getElementById('saveProgramme').addEventListener('click',()=>{ if(!last)return P.error('Calculate water use first.'); S.set({programmeWaterM3Ha:last.m3PerHa}); alert('Saved as Programme Water Use for the Water Saving calculator.'); });
  document.getElementById('saveControl').addEventListener('click',()=>{ if(!last)return P.error('Calculate water use first.'); S.set({controlWaterM3Ha:last.m3PerHa}); alert('Saved as Control Water Use for the Water Saving calculator.'); });
})();
