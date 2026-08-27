window.KpiCalculators = (() => {
  const n = v => v === "" || v === null || v === undefined ? null : Number(v);
  const req = (value, name) => { const x = n(value); if (!Number.isFinite(x)) throw new Error(`${name} is required.`); return x; };
  const positive = (value, name, allowZero=false) => { const x=req(value,name); if (allowZero ? x < 0 : x <= 0) throw new Error(`${name} must be ${allowZero ? "zero or greater" : "greater than zero"}.`); return x; };

  function pumpWater(i) {
    const hp=positive(i.hp,'Pump HP'), swl=positive(i.swl,'Static water level',true), fl=positive(i.fl ?? 0,'Friction loss',true), dh=positive(i.dh,'Delivery head',true);
    const eff=positive(i.efficiencyPercent,'Pump efficiency')/100, hours=positive(i.hours,'Hours per irrigation'), events=positive(i.events,'Irrigation events'), area=positive(i.areaHa,'Area');
    const th=swl+fl+dh; if (th<=0) throw new Error('Total head must be greater than zero.');
    const qLpm=(60*hp*75*eff)/th;
    const perM3=qLpm*(hours*60)/1000;
    const seasonal=perM3*events;
    return { totalHeadM:th, dischargeLpm:qLpm, perIrrigationM3:perM3, seasonalM3:seasonal, m3PerHa:seasonal/area };
  }
  function fieldDepthWater(i) {
    const depths=i.depths.map((v,idx)=>positive(v,`Depth ${idx+1}`,true));
    const area=positive(i.areaHa,'Area'), events=positive(i.events,'Irrigation events');
    const avg=depths.reduce((a,b)=>a+b,0)/depths.length;
    const perM3=avg*(area*10000)/1000;
    const seasonal=perM3*events;
    return { averageDepthMm:avg, perIrrigationM3:perM3, seasonalM3:seasonal, m3PerHa:seasonal/area };
  }
  function vNotchWater(i) {
    const h=positive(i.headM,'V-notch head'), hours=positive(i.hours,'Hours per irrigation'), events=positive(i.events,'Irrigation events'), area=positive(i.areaHa,'Area');
    const q=1.38*Math.pow(h,2.5);
    const perM3=q*(hours*3600); const seasonal=perM3*events;
    return { dischargeM3s:q, perIrrigationM3:perM3, seasonalM3:seasonal, m3PerHa:seasonal/area };
  }
  function dripWater(i) {
    const area=positive(i.areaHa,'Area'), es=positive(i.emitterSpacingM,'Emitter spacing'), ls=positive(i.lateralSpacingM,'Lateral spacing'), q=positive(i.emitterLph,'Emitter discharge'), hours=positive(i.hours,'Hours per irrigation'), events=positive(i.events,'Irrigation events');
    const emitters=(area*10000)/(es*ls); const perM3=emitters*q*hours/1000; const seasonal=perM3*events;
    return { emitterCount:emitters, perIrrigationM3:perM3, seasonalM3:seasonal, m3PerHa:seasonal/area };
  }
  function sprinklerWater(i) {
    const heads=positive(i.heads,'Sprinkler heads'), ml=positive(i.collectedMl,'Collected volume'), hours=positive(i.hours,'Hours per irrigation'), events=positive(i.events,'Irrigation events'), area=positive(i.areaHa,'Area');
    const qLph=ml*0.12; const perM3=heads*qLph*hours/1000; const seasonal=perM3*events;
    return { dischargePerHeadLph:qLph, perIrrigationM3:perM3, seasonalM3:seasonal, m3PerHa:seasonal/area };
  }
  function waterSavingSimple(i) {
    const c=positive(i.controlM3Ha,'Control water',true), p=positive(i.programmeM3Ha,'Programme water',true), area=positive(i.areaHa,'Adopted area');
    const perHa=c-p; const total=perHa*area; const pct=c>0 ? perHa/c*100 : null;
    return { savingM3Ha:perHa, totalSavingM3:total, reductionPercent:pct };
  }
  function waterSavingRainfed(i) {
    const r=positive(i.rainfallMm,'Effective rainfall'), yc=positive(i.controlYieldKgHa,'Control yield'), yp=positive(i.programmeYieldKgHa,'Programme yield'), area=positive(i.areaHa,'Adopted area');
    const wpc=yc/r, wpp=yp/r; const savingMm=r*(wpp-wpc)/wpp; const totalM3=savingMm*area*10;
    return { controlWp:wpc, programmeWp:wpp, savingMm, savingM3Ha:savingMm*10, totalSavingM3:totalM3 };
  }
  function waterSavingIntercrop(i) {
    const totalProgrammeKL=positive(i.totalProgrammeWaterKLHa,'Programme plot total water'), area=positive(i.areaHa,'Adopted area');
    let totalSavingKL=0; const details=[];
    for (const row of i.crops) {
      const share=positive(row.areaSharePct,'Area share')/100, py=positive(row.programmeYieldKgPlot,'Programme crop yield'), cw=positive(row.controlWaterKLHa,'Control crop water'), cy=positive(row.controlYieldKgHa,'Control crop yield');
      const pw=totalProgrammeKL*share; const pwp=pw/py; const cwp=cw/cy; const savePerKg=cwp-pwp; const totalYield=py*area; const saved=savePerKg*totalYield;
      totalSavingKL += saved; details.push({ crop:row.crop || 'Crop', programmeWaterKL:pw, programmeWP:pwp, controlWP:cwp, savingKLKg:savePerKg, savingKL:saved });
    }
    return { totalSavingKL, totalSavingM3:totalSavingKL, details };
  }
  function productionSame(i) {
    const yc=positive(i.controlYieldKgHa,'Control yield'), yp=positive(i.programmeYieldKgHa,'Programme yield'), area=positive(i.areaHa,'Adopted area');
    const inc=yp-yc, kg=inc*area; return { incrementalYieldKgHa:inc, additionalKg:kg, additionalQtl:kg/100, additionalTonnes:kg/1000 };
  }
  function productionCropChange(i) {
    const yc=positive(i.controlYieldKgHa,'Control yield'), yp=positive(i.programmeYieldKgHa,'Programme yield'), pc=positive(i.controlPriceKg,'Control crop price'), pp=positive(i.programmePriceKg,'Programme crop price'), area=positive(i.areaHa,'Adopted area');
    const cey=yp*pp/pc, inc=cey-yc, kg=inc*area; return { programmeCEYKgHa:cey, incrementalYieldKgHa:inc, additionalKg:kg, additionalQtl:kg/100, additionalTonnes:kg/1000 };
  }
  function productionIntercrop(i) {
    const yc=positive(i.controlYieldKgHa,'Control yield'), pc=positive(i.controlPriceKg,'Control crop price'), area=positive(i.areaHa,'Adopted area');
    let totalCEY=0; const details=[];
    for (const row of i.crops) {
      const y=positive(row.yieldKgHa,'Crop yield'), share=positive(row.areaSharePct,'Area share')/100, price=positive(row.priceKg,'Crop price');
      const prod=y*share; const cey=prod*price/pc; totalCEY+=cey; details.push({crop:row.crop || 'Crop', productionKgPerHaPlot:prod, ceyKg:cey});
    }
    const inc=totalCEY-yc, kg=inc*area; return { totalProgrammeCEYKgHa:totalCEY, incrementalYieldKgHa:inc, additionalKg:kg, additionalQtl:kg/100, additionalTonnes:kg/1000, details };
  }
  function additionalIncome(i) {
    const area=positive(i.areaHa,'Comparable/adopted area'), yc=positive(i.controlYieldKgHa,'Control yield',true), yp=positive(i.programmeYieldKgHa,'Programme yield',true), pc=positive(i.controlPriceKg,'Control price',true), pp=positive(i.programmePriceKg,'Programme price',true), cc=positive(i.controlCostHa,'Control cost/ha',true), cp=positive(i.programmeCostHa,'Programme cost/ha',true);
    const controlGross=yc*pc*area, programmeGross=yp*pp*area, controlCost=cc*area, programmeCost=cp*area;
    const controlNet=controlGross-controlCost, programmeNet=programmeGross-programmeCost, additional=programmeNet-controlNet;
    const additionalRevenue=programmeGross-controlGross, costSaving=controlCost-programmeCost, pct=controlNet!==0 ? additional/Math.abs(controlNet)*100 : null;
    return { controlGross, programmeGross, controlCost, programmeCost, controlNet, programmeNet, additionalRevenue, costSaving, additionalIncome:additional, additionalIncomePerHa:additional/area, incomeChangePercent:pct };
  }
  return { pumpWater, fieldDepthWater, vNotchWater, dripWater, sprinklerWater, waterSavingSimple, waterSavingRainfed, waterSavingIntercrop, productionSame, productionCropChange, productionIntercrop, additionalIncome };
})();
