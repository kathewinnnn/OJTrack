import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  checkmarkCircleOutline, closeCircleOutline, timeOutline, documentOutline,
  calendarOutline, attachOutline, documentTextOutline, printOutline,
  downloadOutline, closeOutline, imageOutline,
} from 'ionicons/icons';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

interface Report {
  id: number;
  studentName: string;
  dateSubmitted: string;
  timeIn: string;
  timeOut: string;
  reportDescription: string;
  documentationAttachment: string;   // original filename
  attachmentDataUrl: string | null;  // base64 image data URL
  status: 'Pending' | 'Approved' | 'Rejected';
}

// ── SVG placeholder shown when no image has been uploaded yet ─────────────────
const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect width='400' height='220' fill='%23efe9f4'/%3E%3Ccircle cx='200' cy='95' r='34' fill='%23d8cfe6'/%3E%3Crect x='172' y='72' width='56' height='46' rx='6' fill='%235f0076' opacity='0.28'/%3E%3Ccircle cx='200' cy='97' r='12' fill='%235f0076' opacity='0.42'/%3E%3Ccircle cx='218' cy='78' r='4' fill='%235f0076' opacity='0.3'/%3E%3Ctext x='200' y='155' text-anchor='middle' font-family='DM Sans%2CArial%2Csans-serif' font-size='13' fill='%239e92ab' font-weight='600'%3ENo image attached%3C%2Ftext%3E%3C%2Fsvg%3E";

// ── Report Detail Modal ───────────────────────────────────────────────────────
interface ReportDetailModalProps {
  report: Report;
  onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
  const [imgExpanded, setImgExpanded] = useState(false);

  const statusCfg: Record<string, { color: string; bg: string; border: string }> = {
    Approved: { color: '#059669', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)'  },
    Rejected: { color: '#dc2626', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
    Pending:  { color: '#d97706', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)'  },
  };
  const cfg = statusCfg[report.status];

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const formattedDate = new Date(report.dateSubmitted).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const hasRealImage = !!report.attachmentDataUrl;
  const imgSrc = report.attachmentDataUrl ?? PLACEHOLDER_IMG;

  // ── Print ──────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const imgHtml = hasRealImage
      ? `<img src="${imgSrc}" alt="Attachment" style="width:100%;height:auto;display:block;border-radius:10px;margin-top:0;page-break-inside:avoid;" />`
      : '';

    const printContent = `<!DOCTYPE html><html><head>
      <title>Activity Report – ${report.studentName}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a2e;padding:40px;font-size:14px;line-height:1.6}
        .hdr{border-bottom:3px solid #5f0076;padding-bottom:20px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:flex-start}
        .hdr h1{font-size:24px;font-weight:800;color:#5f0076;margin-bottom:4px}
        .hdr p{font-size:13px;color:#6b5f77}
        .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700}
        .badge-Approved{background:#d1fae5;color:#059669}
        .badge-Rejected{background:#fee2e2;color:#dc2626}
        .badge-Pending{background:#fef3c7;color:#d97706}
        .sec{margin-bottom:22px}
        .sec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9e92ab;margin-bottom:10px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .cell{background:#f7f5f9;border-radius:8px;padding:12px}
        .lbl{font-size:11px;color:#9e92ab;font-weight:600;margin-bottom:3px}
        .val{font-size:14px;font-weight:600;color:#1a1a2e}
        .desc{background:#f7f5f9;border-radius:10px;padding:16px;border-left:4px solid #5f0076}
        .desc p{font-size:14px;color:#4a4a4a;line-height:1.7}
        .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e4dcea;font-size:11px;color:#9e92ab;text-align:center}
        @media print{body{padding:20px}}
      </style></head><body>
      <div class="hdr"><div><h1>Activity Report</h1><p>OJT Monitoring System · Supervisor Review</p></div><span class="badge badge-${report.status}">${report.status}</span></div>
      <div class="sec"><div class="sec-title">Student Information</div><div class="grid"><div class="cell"><div class="lbl">Student Name</div><div class="val">${report.studentName}</div></div><div class="cell"><div class="lbl">Report ID</div><div class="val">#RPT-${String(report.id).padStart(4,'0')}</div></div></div></div>
      <div class="sec"><div class="sec-title">Date &amp; Time</div><div class="grid"><div class="cell"><div class="lbl">Date Submitted</div><div class="val">${formattedDate}</div></div><div class="cell"><div class="lbl">Time Rendered</div><div class="val">${report.timeIn} – ${report.timeOut}</div></div></div></div>
      <div class="sec"><div class="sec-title">Report Description</div><div class="desc"><p>${report.reportDescription}</p></div></div>
      ${imgHtml ? `<div class="sec">${imgHtml}</div>` : ''}
      <div class="footer">Printed on ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} · OJT Monitoring System</div>
    </body></html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(printContent);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  // ── Download: image if present, otherwise download a .txt report summary ──
  const handleDownload = () => {
    if (hasRealImage) {
      const mime  = imgSrc.split(';')[0].split(':')[1] ?? 'image/jpeg';
      const ext   = mime.split('/')[1] ?? 'jpg';
      const base  = report.documentationAttachment.replace(/\.[^.]+$/, '');
      const fname = `${base}_${report.studentName.replace(/\s+/g, '_').toLowerCase()}.${ext}`;
      const a     = document.createElement('a');
      a.href      = imgSrc;
      a.download  = fname;
      a.click();
    } else {
      // No image — download the report details as a text file
      const lines = [
        '═══════════════════════════════════════════════════',
        '           OJT MONITORING SYSTEM',
        '              ACTIVITY REPORT',
        '═══════════════════════════════════════════════════',
        '',
        `Report ID      : #RPT-${String(report.id).padStart(4, '0')}`,
        `Status         : ${report.status.toUpperCase()}`,
        '',
        '───────────────────────────────────────────────────',
        'STUDENT INFORMATION',
        '───────────────────────────────────────────────────',
        `Student Name   : ${report.studentName}`,
        '',
        '───────────────────────────────────────────────────',
        'DATE & TIME',
        '───────────────────────────────────────────────────',
        `Date Submitted : ${formattedDate}`,
        `Time In        : ${report.timeIn}`,
        `Time Out       : ${report.timeOut}`,
        '',
        '───────────────────────────────────────────────────',
        'REPORT DESCRIPTION',
        '───────────────────────────────────────────────────',
        report.reportDescription,
        '',
        '───────────────────────────────────────────────────',
        'ATTACHED DOCUMENTATION',
        '───────────────────────────────────────────────────',
        `${report.documentationAttachment} (no image uploaded)`,
        '',
        '═══════════════════════════════════════════════════',
        `Downloaded on  : ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        '═══════════════════════════════════════════════════',
      ].join('\n');
      const blob  = new Blob([lines], { type: 'text/plain' });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href      = url;
      a.download  = `report_${report.studentName.replace(/\s+/g, '_').toLowerCase()}_${report.dateSubmitted}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      {/* Full-screen lightbox */}
      {imgExpanded && hasRealImage && (
        <div
          onClick={() => setImgExpanded(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 19999,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, cursor: 'zoom-out',
          }}
        >
          <img
            src={imgSrc}
            alt="Full view"
            style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain', boxShadow: '0 8px 40px rgba(0,0,0,.6)' }}
          />
          <button onClick={() => setImgExpanded(false)} style={{
            position: 'absolute', top: 20, right: 20,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,.15)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', fontSize: 20,
          }}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>
      )}

      {/* Bottom sheet backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,0,20,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}>
        <div style={{
          background: '#fff', width: '100%', maxWidth: 600,
          borderRadius: '24px 24px 0 0', maxHeight: '92vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 -8px 40px rgba(95,0,118,.25)',
          animation: 'slideUp .28s cubic-bezier(.34,1.1,.64,1)',
        }}>
          <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:.6}to{transform:translateY(0);opacity:1}}`}</style>

          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
            <div style={{ width: 40, height: 4, borderRadius: 99, background: '#e4dcea' }} />
          </div>

          {/* Sheet header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px 12px', borderBottom: '1.5px solid #f0ebf5',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg,#5f0076,#9e00c2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IonIcon icon={documentTextOutline} style={{ color: '#fff', fontSize: 20 }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1a1a2e', fontFamily: "'Sora',sans-serif" }}>
                  Activity Report
                </p>
                <p style={{ margin: 0, fontSize: 11, color: '#9e92ab', fontWeight: 500 }}>
                  #RPT-{String(report.id).padStart(4, '0')}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 34, height: 34, borderRadius: 10,
              background: '#f7f5f9', border: '1.5px solid #e4dcea',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#6b5f77', fontSize: 18,
            }}>
              <IonIcon icon={closeOutline} />
            </button>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

            {/* Student + status */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#f7f5f9', borderRadius: 14, padding: '14px 16px',
              marginBottom: 14, border: '1.5px solid #e4dcea',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#5f0076,#9e00c2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>
                  {initials(report.studentName)}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{report.studentName}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#9e92ab', fontWeight: 500 }}>OJT Trainee</p>
                </div>
              </div>
              <span style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                color: cfg.color, background: cfg.bg, border: `1.5px solid ${cfg.border}`,
              }}>
                {report.status}
              </span>
            </div>

            {/* Date & Time */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', color: '#9e92ab', margin: '0 0 8px' }}>
                Date &amp; Time
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Date Submitted', value: formattedDate,                          icon: calendarOutline },
                  { label: 'Time Rendered',  value: `${report.timeIn} – ${report.timeOut}`, icon: timeOutline     },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f7f5f9', borderRadius: 12, padding: 12, border: '1.5px solid #e4dcea' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                      <IonIcon icon={item.icon} style={{ fontSize: 13, color: '#5f0076' }} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#9e92ab', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                        {item.label}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.4 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', color: '#9e92ab', margin: '0 0 8px' }}>
                Report Description
              </p>
              <div style={{ background: '#f7f5f9', borderRadius: 12, padding: '14px 16px', border: '1.5px solid #e4dcea', borderLeft: '4px solid #5f0076' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <IonIcon icon={documentOutline} style={{ fontSize: 15, color: '#5f0076' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#5f0076' }}>Activity Summary</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: '#4a4a4a', lineHeight: 1.75 }}>{report.reportDescription}</p>
              </div>
            </div>

            {/* Attached Image */}
            <div style={{ marginBottom: 6 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', color: '#9e92ab', margin: '0 0 8px' }}>
                Attached Documentation
              </p>

              {/* Filename bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: 'rgba(95,0,118,0.06)',
                border: '1.5px solid rgba(95,0,118,0.15)',
                borderRadius: '12px 12px 0 0',
                borderBottom: 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(95,0,118,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <IonIcon icon={imageOutline} style={{ fontSize: 16, color: '#5f0076' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#5f0076', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {report.documentationAttachment}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: '#9e92ab' }}>Image file</p>
                </div>
                {hasRealImage && (
                  <span style={{ fontSize: 11, color: '#9e92ab', fontWeight: 500, flexShrink: 0 }}>Tap to expand</span>
                )}
              </div>

              {/* Image preview */}
              <div
                onClick={() => hasRealImage && setImgExpanded(true)}
                style={{
                  border: '1.5px solid rgba(95,0,118,0.15)',
                  borderTop: 'none',
                  borderRadius: '0 0 12px 12px',
                  overflow: 'hidden',
                  cursor: hasRealImage ? 'zoom-in' : 'default',
                  background: '#f7f5f9',
                  position: 'relative',
                  minHeight: 140,
                }}
              >
                <img
                  src={imgSrc}
                  alt={report.documentationAttachment}
                  style={{
                    width: '100%', display: 'block',
                    objectFit: hasRealImage ? 'cover' : 'contain',
                    maxHeight: hasRealImage ? 220 : 160,
                  }}
                />
                {hasRealImage && (
                  <div style={{
                    position: 'absolute', bottom: 8, right: 8,
                    background: 'rgba(0,0,0,0.45)', borderRadius: 8,
                    padding: '4px 10px', fontSize: 11, color: '#fff', fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                  }}>
                    🔍 View full size
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div style={{ padding: '12px 20px 28px', borderTop: '1.5px solid #f0ebf5', display: 'flex', gap: 10 }}>
            <button onClick={handlePrint} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '13px 0', borderRadius: 13,
              background: 'rgba(95,0,118,0.07)', border: '1.5px solid rgba(95,0,118,0.2)',
              color: '#5f0076', fontSize: 14, fontWeight: 700,
              fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
            }}>
              <IonIcon icon={printOutline} style={{ fontSize: 18 }} /> Print
            </button>
            <button
              onClick={handleDownload}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '13px 0', borderRadius: 13, border: 'none',
                background: 'linear-gradient(135deg,#5f0076,#9e00c2)',
                color: '#fff',
                fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(95,0,118,0.3)',
              }}
            >
              <IonIcon icon={downloadOutline} style={{ fontSize: 18 }} />
              Download
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Main Reports Component ────────────────────────────────────────────────────
const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    { id: 1, studentName: 'Katherine Mae',     dateSubmitted: '2026-02-14', timeIn: '8:00 AM', timeOut: '4:00 PM', reportDescription: 'Completed web development tasks for the week, including responsive design implementation and API integration.', documentationAttachment: 'weekly_report_katherine.jpg',  attachmentDataUrl: null, status: 'Pending'  },
    { id: 2, studentName: 'Mark Romer',         dateSubmitted: '2026-02-13', timeIn: '9:30 AM', timeOut: '5:00 PM', reportDescription: 'Worked on IoT project, successfully connected sensors and implemented data logging functionality.',               documentationAttachment: 'iot_project_mark.png',         attachmentDataUrl: null, status: 'Approved' },
    { id: 3, studentName: 'Samantha Lumpaodan', dateSubmitted: '2026-02-14', timeIn: '8:30 AM', timeOut: '4:30 PM', reportDescription: 'Database design and optimization tasks completed. Created ER diagrams and implemented query optimizations.',       documentationAttachment: 'database_design_samantha.jpg', attachmentDataUrl: null, status: 'Pending'  },
    { id: 4, studentName: 'Raffy Romero',       dateSubmitted: '2026-02-12', timeIn: '9:00 AM', timeOut: '4:15 PM', reportDescription: 'Mobile app development progress: implemented user authentication and basic navigation structure.',                documentationAttachment: 'mobile_app_raffy.png',         attachmentDataUrl: null, status: 'Rejected' },
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleApprove = (id: number) =>
    setReports(r => r.map(rep => rep.id === id ? { ...rep, status: 'Approved' as const } : rep));
  const handleReject  = (id: number) =>
    setReports(r => r.map(rep => rep.id === id ? { ...rep, status: 'Rejected' as const } : rep));

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const statusCfg: Record<string, { color: string; bg: string }> = {
    Approved: { color: 'var(--c-green)', bg: 'rgba(52,211,153,0.12)'  },
    Rejected: { color: 'var(--c-red)',   bg: 'rgba(248,113,113,0.12)' },
    Pending:  { color: 'var(--c-amber)', bg: 'rgba(251,191,36,0.12)'  },
  };

  const approved = reports.filter(r => r.status === 'Approved').length;
  const pending  = reports.filter(r => r.status === 'Pending').length;
  const rejected = reports.filter(r => r.status === 'Rejected').length;

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content" scrollY={!selectedReport}>

        {/* Hero */}
        <div className="sv-hero">
          <div className="sv-hero-bg" />
          <div className="sv-hero-inner">
            <p className="sv-hero-sub">Review &amp; approve</p>
            <h1 className="sv-hero-name">Activity Reports</h1>
            <div className="sv-hero-meta">
              <span className="sv-hero-chip">
                <IonIcon icon={documentTextOutline} /> {reports.length} total
              </span>
              <span className="sv-hero-chip sv-chip-amber">{pending} pending</span>
            </div>
          </div>
        </div>

        <div className="sv-body">
          <br />

          {/* Summary stats */}
          <div className="sv-stats-grid sv-stats-3">
            <div className="sv-stat-card sv-stat-green">
              <div className="sv-stat-icon-wrap"><IonIcon icon={checkmarkCircleOutline} /></div>
              <p className="sv-stat-num">{approved}</p><p className="sv-stat-lbl">Approved</p>
            </div>
            <div className="sv-stat-card sv-stat-amber">
              <div className="sv-stat-icon-wrap"><IonIcon icon={timeOutline} /></div>
              <p className="sv-stat-num">{pending}</p><p className="sv-stat-lbl">Pending</p>
            </div>
            <div className="sv-stat-card sv-stat-red">
              <div className="sv-stat-icon-wrap"><IonIcon icon={closeCircleOutline} /></div>
              <p className="sv-stat-num">{rejected}</p><p className="sv-stat-lbl">Rejected</p>
            </div>
          </div>

          {/* List header */}
          <div className="sv-list-header">
            <span className="sv-list-title">All Reports</span>
            <span className="sv-list-count">{reports.length} items</span>
          </div>

          {/* Report cards */}
          <div className="sv-report-list">
            {reports.map(report => {
              const cfg      = statusCfg[report.status];
              const hasImg   = !!report.attachmentDataUrl;
              return (
                <div key={report.id} className="sv-report-card">

                  {/* Card header */}
                  <div className="sv-report-card-header">
                    <div className="sv-report-avatar">{initials(report.studentName)}</div>
                    <div className="sv-report-header-info">
                      <span className="sv-report-student">{report.studentName}</span>
                      <span className="sv-report-status-chip" style={{ color: cfg.color, background: cfg.bg }}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="sv-report-meta">
                    <span className="sv-report-meta-item">
                      <IonIcon icon={calendarOutline} />
                      {new Date(report.dateSubmitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="sv-report-meta-item">
                      <IonIcon icon={timeOutline} />
                      {report.timeIn} – {report.timeOut}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="sv-report-desc-block">
                    <div className="sv-report-desc-title">
                      <IonIcon icon={documentOutline} /> Report Description
                    </div>
                    <p className="sv-report-desc-text">{report.reportDescription}</p>
                  </div>

                  {/* Attachment button — image thumbnail if loaded, filename bar otherwise */}
                  <button
                    onClick={() => setSelectedReport(report)}
                    style={{
                      width: '100%', padding: 0, background: 'none', border: 'none',
                      cursor: 'pointer', borderRadius: 10, overflow: 'hidden',
                      display: 'block', marginBottom: 2, textAlign: 'left',
                    }}
                  >
                    {/* Filename bar */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 13px',
                      background: 'rgba(95,0,118,0.05)',
                      border: '1.5px solid rgba(95,0,118,0.18)',
                      borderRadius: hasImg ? '10px 10px 0 0' : 10,
                      borderBottom: hasImg ? 'none' : undefined,
                      fontFamily: "'DM Sans',sans-serif",
                    }}>
                      <IonIcon icon={imageOutline} style={{ fontSize: 15, color: '#5f0076', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#5f0076', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report.documentationAttachment}
                      </span>
                      <span style={{ fontSize: 11, color: '#9e92ab', fontWeight: 500, flexShrink: 0 }}>View →</span>
                    </div>

                    {/* Thumbnail strip */}
                    {hasImg && (
                      <div style={{
                        border: '1.5px solid rgba(95,0,118,0.18)',
                        borderTop: 'none', borderRadius: '0 0 10px 10px',
                        overflow: 'hidden', height: 90,
                      }}>
                        <img
                          src={report.attachmentDataUrl!}
                          alt="preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    )}
                  </button>

                  {/* Approve / Reject */}
                  {report.status === 'Pending' && (
                    <div className="sv-report-actions">
                      <button className="sv-report-btn sv-btn-approve-full" onClick={() => handleApprove(report.id)}>
                        <IonIcon icon={checkmarkCircleOutline} /> Approve
                      </button>
                      <button className="sv-report-btn sv-btn-reject-full" onClick={() => handleReject(report.id)}>
                        <IonIcon icon={closeCircleOutline} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>

      <SupervisorBottomNav activeTab="reports" />

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </IonPage>
  );
};

export default Reports;