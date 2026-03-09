import { Report } from './ReportsContext';

export const printReport = (report: Report) => {
  const printedOn = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  // Only render actual preview URLs (real uploaded images)
  const imagePreviews = (report.attachmentPreviews ?? []).filter(Boolean);

  // Full-size image cards — no filenames, no labels
  const imagesHtml = imagePreviews.length > 0
    ? imagePreviews.map(src => `
        <div class="img-card">
          <img src="${src}" alt="Attachment" />
        </div>`).join('')
    : `<p class="no-att">No image attachments for this report.</p>`;

  const statusClass = report.status === 'Submitted' ? 'status-submitted' : 'status-pending';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${report.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      line-height: 1.7;
      color: #1a1a2e;
      background: #fff;
    }

    .page {
      width: 100%;
      max-width: 760px;
      margin: 0 auto;
    }

    /* ── COVER ── */
    .cover {
      background: linear-gradient(135deg, #5f0076 0%, #3a004a 45%, #1e1e2e 100%);
      color: #fff;
      padding: 48px 52px 44px;
      position: relative;
      overflow: hidden;
    }
    .cover::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 260px; height: 260px;
      border-radius: 50%;
      background: rgba(255,255,255,0.055);
    }
    .cover::after {
      content: '';
      position: absolute;
      bottom: -60px; left: 30px;
      width: 180px; height: 180px;
      border-radius: 50%;
      background: rgba(255,255,255,0.035);
    }
    .cover-circle {
      position: absolute;
      top: 50%; right: 180px;
      transform: translateY(-50%);
      width: 120px; height: 120px;
      border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.08);
    }
    .cover-inner { position: relative; z-index: 1; }

    .cover-eyebrow {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: rgba(255,255,255,0.42);
      margin-bottom: 12px;
    }
    .cover-title {
      font-family: 'Sora', sans-serif;
      font-size: 30px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.5px;
      margin-bottom: 28px;
      max-width: 520px;
    }
    .cover-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }
    .meta-chip {
      display: flex;
      align-items: center;
      gap: 7px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 50px;
      padding: 5px 14px 5px 10px;
    }
    .meta-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(255,255,255,0.45);
      flex-shrink: 0;
    }
    .meta-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255,255,255,0.4);
    }
    .meta-value {
      font-size: 12px;
      font-weight: 600;
      color: #fff;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .status-submitted { background: rgba(52,211,153,0.22); color: #34d399; }
    .status-pending   { background: rgba(251,191,36,0.22);  color: #fbbf24; }
    .status-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }

    /* ── BODY ── */
    .body { padding: 40px 52px 52px; }

    /* ── Section ── */
    .section { margin-bottom: 36px; }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .section-accent {
      width: 3px;
      height: 18px;
      border-radius: 4px;
      background: linear-gradient(180deg, #5f0076, #9e00c2);
      flex-shrink: 0;
    }
    .section-label {
      font-family: 'Sora', sans-serif;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #6b5f77;
    }
    .section-rule {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, #e4dcea 0%, transparent 100%);
    }

    /* ── Content Box ── */
    .content-box {
      background: #f7f5f9;
      border: 1px solid #e4dcea;
      border-left: 3px solid #5f0076;
      border-radius: 0 10px 10px 0;
      padding: 16px 20px;
    }
    .content-box p {
      font-size: 14px;
      color: #3a3a4a;
      line-height: 1.8;
    }
    .empty-text {
      color: #9e92ab;
      font-style: italic;
    }

    /* ── Image Stack (full-width, stacked vertically) ── */
    .img-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .img-card {
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      border: 1.5px solid #e4dcea;
      box-shadow: 0 2px 16px rgba(95,0,118,0.07);
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .img-card img {
      width: 100%;
      display: block;
      object-fit: contain;
      max-height: 520px;
      background: #f0ecf5;
    }
    .no-att {
      font-size: 13px;
      color: #9e92ab;
      font-style: italic;
      padding: 4px 0;
    }

    /* ── Divider ── */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, #e4dcea 0%, transparent 80%);
      margin: 36px 0 28px;
    }

    /* ── Footer ── */
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .footer-brand {
      font-family: 'Sora', sans-serif;
      font-size: 15px;
      font-weight: 800;
      color: #5f0076;
      letter-spacing: -0.3px;
      display: block;
    }
    .footer-tagline {
      font-size: 11px;
      color: #9e92ab;
      margin-top: 2px;
      display: block;
    }
    .footer-right { text-align: right; }
    .footer-date {
      font-size: 11px;
      color: #9e92ab;
      display: block;
    }
    .footer-id {
      font-size: 10px;
      color: #c4bad0;
      font-family: 'Courier New', monospace;
      margin-top: 2px;
      display: block;
    }

    /* ── Print ── */
    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { background: #fff !important; }
      .cover { background: linear-gradient(135deg, #5f0076 0%, #3a004a 45%, #1e1e2e 100%) !important; }
      .img-card { page-break-inside: avoid; break-inside: avoid; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- COVER -->
  <div class="cover">
    <div class="cover-circle"></div>
    <div class="cover-inner">
      <p class="cover-eyebrow">OJT Tracker &nbsp;·&nbsp; Official Report</p>
      <h1 class="cover-title">${report.title}</h1>
      <div class="cover-meta">
        <div class="meta-chip">
          <span class="meta-dot"></span>
          <span class="meta-label">Date</span>
          <span class="meta-value">${report.date}</span>
        </div>
        <div class="meta-chip">
          <span class="meta-dot"></span>
          <span class="meta-label">Type</span>
          <span class="meta-value">${report.type}</span>
        </div>
        <span class="status-pill ${statusClass}">
          <span class="status-dot"></span>
          ${report.status}
        </span>
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">

    <!-- Description -->
    <div class="section">
      <div class="section-header">
        <span class="section-accent"></span>
        <span class="section-label">Description</span>
        <span class="section-rule"></span>
      </div>
      <div class="content-box">
        <p>${report.description || '<span class="empty-text">No description provided.</span>'}</p>
      </div>
    </div>

    <!-- Full Details -->
    <div class="section">
      <div class="section-header">
        <span class="section-accent"></span>
        <span class="section-label">Full Details</span>
        <span class="section-rule"></span>
      </div>
      <div class="content-box">
        <p>${report.fullDetails || '<span class="empty-text">No additional details provided.</span>'}</p>
      </div>
    </div>

    <!-- Attachments — full-size images only, no filenames -->
    <div class="section">
      <div class="section-header">
        <span class="section-accent"></span>
        <span class="section-label">Attachments</span>
        <span class="section-rule"></span>
      </div>
      <div class="img-stack">
        ${imagesHtml}
      </div>
    </div>

    <div class="divider"></div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        <span class="footer-brand">OJT Tracker</span>
        <span class="footer-tagline">On-the-Job Training Management</span>
      </div>
      <div class="footer-right">
        <span class="footer-date">Printed on ${printedOn}</span>
        <span class="footer-id">Report ID #${report.id}</span>
      </div>
    </div>

  </div>
</div>
</body>
</html>`;

  const existing = document.getElementById('__print_frame__');
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  iframe.id = '__print_frame__';
  iframe.style.cssText =
    'position:fixed;top:0;left:0;width:1px;height:1px;border:none;opacity:0;pointer-events:none;z-index:-1;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    const imgs = Array.from(doc.images);
    if (imgs.length === 0) {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => iframe.remove(), 2000);
      }, 600);
    } else {
      let loaded = 0;
      const tryPrint = () => {
        loaded++;
        if (loaded >= imgs.length) {
          setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => iframe.remove(), 2000);
          }, 400);
        }
      };
      imgs.forEach(img => {
        if (img.complete) tryPrint();
        else { img.onload = tryPrint; img.onerror = tryPrint; }
      });
    }
  };
};