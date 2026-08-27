window.KpiPrintReport = (() => {
  "use strict";
  const cfg = window.KPI_SITE_CONFIG || {};

  function textOf(el) { return (el?.textContent || '').replace(/\s+/g,' ').trim(); }
  function isVisibleField(field) { return !field.closest('[hidden]') && !field.hidden; }
  function fieldValue(control) {
    if (!control) return '';
    if (control.tagName === 'SELECT') return control.selectedOptions?.[0]?.textContent?.trim() || control.value;
    if (control.type === 'checkbox' || control.type === 'radio') return control.checked ? 'Yes' : 'No';
    return String(control.value ?? '').trim();
  }
  function escapeHtml(v) {
    return String(v ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }
  function collectInputs() {
    const rows = [];
    document.querySelectorAll('.calculator-card .field').forEach(field => {
      if (!isVisibleField(field)) return;
      const label = textOf(field.querySelector('label'));
      const control = field.querySelector('input,select,textarea');
      if (!label || !control) return;
      const value = fieldValue(control);
      if (value !== '') rows.push([label, value]);
    });
    return rows;
  }
  function collectResults() {
    const rows = [];
    document.querySelectorAll('.result-card .metric').forEach(metric => {
      const label = textOf(metric.querySelector('span'));
      const value = textOf(metric.querySelector('strong'));
      if (label && value) rows.push([label, value]);
    });
    return rows;
  }
  function collectFormulas() {
    return [...document.querySelectorAll('.calculator-card .formula')]
      .filter(el => !el.closest('[hidden]'))
      .map(textOf).filter(Boolean);
  }
  function collectNotes() {
    const notes = [];
    const prov = document.querySelector('.result-card .provenance');
    if (prov && textOf(prov)) notes.push(textOf(prov));
    document.querySelectorAll('.result-card .notice').forEach(n => {
      const t=textOf(n); if(t) notes.push(t);
    });
    return notes;
  }
  function build() {
    document.querySelector('.print-report')?.remove();
    const title = textOf(document.querySelector('.page-head h1')) || document.title;
    const subtitle = textOf(document.querySelector('.page-head .lede'));
    const inputs = collectInputs();
    const results = collectResults();
    const formulas = collectFormulas();
    const notes = collectNotes();
    const stamp = new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short'}).format(new Date());
    const status = textOf(document.querySelector('.result-card .status'));

    const report = document.createElement('section');
    report.className = 'print-report';
    report.setAttribute('aria-hidden','true');
    report.innerHTML = `
      <header class="print-report-head">
        <div><div class="print-brand-mark">${escapeHtml(cfg.brandShort || 'KG')}</div></div>
        <div class="print-brand-copy"><h1>${escapeHtml(cfg.siteTitle || 'Water & Agriculture KPI Calculator')}</h1><p>${escapeHtml(cfg.brandName || '')}${cfg.tagline ? ' · '+escapeHtml(cfg.tagline) : ''}</p></div>
      </header>
      <div class="print-title-block">
        <p class="print-kicker">Calculation Report</p>
        <h2>${escapeHtml(title)}</h2>
        ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}
        <p class="print-meta">Generated: ${escapeHtml(stamp)}${status ? ` · Status: ${escapeHtml(status)}` : ''}</p>
      </div>
      ${inputs.length ? `<section><h3>Inputs</h3><table>${inputs.map(([a,b])=>`<tr><th>${escapeHtml(a)}</th><td>${escapeHtml(b)}</td></tr>`).join('')}</table></section>` : ''}
      ${formulas.length ? `<section><h3>Formula / Method</h3>${formulas.map(f=>`<div class="print-formula">${escapeHtml(f)}</div>`).join('')}</section>` : ''}
      ${results.length ? `<section><h3>Calculated Results</h3><div class="print-results">${results.map(([a,b])=>`<div class="print-result"><span>${escapeHtml(a)}</span><strong>${escapeHtml(b)}</strong></div>`).join('')}</div></section>` : ''}
      ${notes.length ? `<section><h3>Method / Data Notes</h3>${notes.map(n=>`<p class="print-note">${escapeHtml(n)}</p>`).join('')}</section>` : ''}
      <footer class="print-report-foot"><p>${escapeHtml(cfg.disclaimer || '')}</p><p>Calculation page: ${escapeHtml(location.pathname)}</p></footer>`;
    document.body.appendChild(report);
    return report;
  }
  function print() {
    build();
    requestAnimationFrame(() => window.print());
  }
  return { build, print };
})();
