window.KpiState = (() => {
  const KEY = "waterAgricultureKpiSessionV1";
  const defaults = {
    reportingYear: "2026-27", season: "Kharif", state: "Gujarat", crop: "Paddy",
    programmeWaterM3Ha: null, controlWaterM3Ha: null,
    waterSavingTotalM3: null, additionalProductionQtl: null,
    additionalProductionTonnes: null, additionalIncomeInr: null, personDays: null
  };
  function get() {
    try { return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY) || "{}")) }; }
    catch { return { ...defaults }; }
  }
  function set(patch) { const next = { ...get(), ...patch }; localStorage.setItem(KEY, JSON.stringify(next)); return next; }
  function reset() { localStorage.removeItem(KEY); return get(); }
  return { get, set, reset, key: KEY };
})();
