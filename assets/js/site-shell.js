(() => {
  "use strict";
  const cfg = window.KPI_SITE_CONFIG || {};
  const body = document.body;
  const root = body.dataset.root || ".";
  const url = rel => root === "." ? rel : `${root}/${rel}`;
  window.KPI_ROOT_URL = url;

  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="nav-wrap">
        <a class="brand" href="${url("index.html")}" aria-label="${cfg.siteTitle || "KPI Calculator"} home">
          <span class="brand-mark">${cfg.brandShort || "KPI"}</span>
          <span class="brand-text"><strong>${cfg.siteTitle || "KPI Calculator"}</strong><small>${cfg.brandName || ""}</small></span>
        </a>
        <button class="menu-button" type="button" aria-label="Toggle navigation">☰</button>
        <nav class="nav-links" aria-label="Main navigation">
          <a href="${url("index.html")}">Home</a>
          <a href="${url("calculators/water-measurement.html")}">Water Measurement</a>
          <a href="${url("calculators/water-saving.html")}">Water Saving</a>
          <a href="${url("calculators/additional-production.html")}">Production</a>
          <a href="${url("calculators/additional-income.html")}">Income</a>
          <a href="${url("calculators/person-days.html")}">Person-Days</a>
          <a href="${url("map/state-explorer.html")}">State Map</a>
          <a href="${url("methodology/index.html")}">Methodology</a>
          <button class="support" type="button" data-open-support>${cfg.supportButtonLabel || "☕ Support"}</button>
        </nav>
      </div>`;
    const mb = header.querySelector('.menu-button');
    const nl = header.querySelector('.nav-links');
    mb?.addEventListener('click', () => nl.classList.toggle('open'));
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="footer-wrap">
        <div>
          <strong>${cfg.siteTitle || "KPI Calculator"}</strong>
          <p>${cfg.brandName || ""} · ${cfg.tagline || ""}</p>
          <p>${cfg.disclaimer || ""}</p>
        </div>
        <div class="footer-actions">
          <a class="btn" href="${url("about/index.html")}">About</a>
          <a class="btn" href="${url("data-sources/index.html")}">Data Sources</a>
          <button class="btn support" data-open-support>${cfg.supportButtonLabel || "☕ Buy Me a Coffee"}</button>
        </div>
      </div>`;
  }

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="supportTitle">
      <div class="modal-head"><div><p class="eyebrow">Support this project</p><h2 id="supportTitle">☕ Buy Me a Coffee</h2></div><button class="modal-close" type="button" aria-label="Close">✕</button></div>
      <p>If this calculator is useful, you can support its continued improvement by scanning the UPI QR code below.</p>
      <div class="qr-wrap"><img src="${url(cfg.upiQrImage || "assets/images/upi-qr.jpeg")}" alt="UPI QR code for supporting the Water & Agriculture KPI Calculator" /></div>
      <p style="color:var(--muted);font-size:13px">The website does not collect or process payment details. Payment is handled by your UPI app.</p>
    </div>`;
  document.body.appendChild(modal);
  const open = () => { modal.hidden = false; document.body.style.overflow='hidden'; };
  const close = () => { modal.hidden = true; document.body.style.overflow=''; };
  document.querySelectorAll('[data-open-support]').forEach(b => b.addEventListener('click', open));
  modal.querySelector('.modal-close')?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });

  // Portfolio link is intentionally exposed only on the About page.
  document.querySelectorAll('[data-portfolio-link]').forEach(a => {
    a.href = cfg.portfolioUrl || '#';
    a.textContent = cfg.portfolioButtonLabel || 'Visit My Website';
  });

  // Calculator pages receive one print/PDF action in the result panel.
  const calcCard = document.querySelector('.calculator-card');
  const resultCard = document.querySelector('.result-card');
  if (calcCard && resultCard) {
    const actions = document.createElement('div');
    actions.className = 'form-actions report-actions';
    actions.innerHTML = '<button class="btn" type="button" data-print-calculation>🖨 Print / Save PDF</button>';
    resultCard.appendChild(actions);
    actions.querySelector('[data-print-calculation]').addEventListener('click', () => {
      if (window.KpiPrintReport?.print) window.KpiPrintReport.print();
      else window.print();
    });
  }
})();
