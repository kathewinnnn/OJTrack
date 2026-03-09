import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  calendarOutline,
  documentTextOutline,
  downloadOutline,
  checkmarkCircleOutline,
  timeOutline,
  imageOutline,
  informationCircleOutline,
  readerOutline,
  attachOutline,
  closeCircleOutline,
  printOutline,
  createOutline,
  trashOutline,
  alertCircleOutline,
  saveOutline,
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import './ReportDetail.css';
import { printReport } from './Print';
import { useReports } from './ReportsContext';

interface Report {
  id: number;
  title: string;
  date: string;
  status: 'Submitted' | 'Pending';
  type: string;
  description: string;
  fullDetails?: string;
  attachments?: string[];
  attachmentPreviews?: string[];
  submittedAt: number;
}

const statusConfig: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  Submitted: { color: '#34d399', bg: 'rgba(52,211,153,0.12)', icon: checkmarkCircleOutline, label: 'Submitted' },
  Pending:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: timeOutline,             label: 'Pending'   },
};

const REPORT_TYPES = ['Daily', 'Weekly', 'Monthly', 'Midterm', 'Final', 'Incident'];

const ReportDetail: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ report: Report }>();
  const { updateReport, deleteReport } = useReports();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Edit modal
  const [editState, setEditState] = useState<{
    title: string; type: string; status: 'Submitted' | 'Pending';
    description: string; fullDetails: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [showDelete, setShowDelete] = useState(false);

  const report = location.state?.report;

  if (!report) {
    return (
      <IonPage>
        <IonContent fullscreen className="rd-content">
          <div className="rd-not-found">
            <IonIcon icon={documentTextOutline} />
            <p>Report not found.</p>
            <button className="rd-back-link" onClick={() => history.push('/reports')}>
              Go back to Reports
            </button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const cfg = statusConfig[report.status];

  const handleDownload = () => {
    setDownloading(true);
    const content = [
      `REPORT TITLE: ${report.title}`,
      `TYPE:         ${report.type}`,
      `DATE:         ${report.date}`,
      `STATUS:       ${report.status}`,
      '',
      'DESCRIPTION',
      '------------',
      report.description,
      '',
      'FULL DETAILS',
      '------------',
      report.fullDetails || 'No additional details.',
      '',
      'ATTACHMENTS',
      '------------',
      report.attachments && report.attachments.length > 0
        ? report.attachments.join(', ')
        : 'No attachments.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => { setDownloading(false); setDownloaded(true); }, 800);
  };

  const openEdit = () => {
    setEditState({
      title: report.title,
      type: report.type,
      status: report.status,
      description: report.description,
      fullDetails: report.fullDetails ?? '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editState || !report) return;
    setIsSaving(true);
    await new Promise(res => setTimeout(res, 600));
    updateReport(report.id, {
      title: editState.title.trim(),
      type: editState.type,
      status: editState.status,
      description: editState.description.trim(),
      fullDetails: editState.fullDetails.trim(),
    });
    setIsSaving(false);
    setEditState(null);
    history.push('/reports');
  };

  const handleDelete = () => {
    if (!report) return;
    deleteReport(report.id);
    setShowDelete(false);
    history.push('/reports');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="rd-content">

        {/* Hero */}
        <div className="rd-hero">
          <div className="rd-hero-bg" />
          <div className="rd-hero-inner">
            <button className="rd-back-btn" onClick={() => history.push('/reports')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
            <div className="rd-hero-text">
              <span className="rd-hero-eyebrow">{report.type} Report</span>
              <h1 className="rd-hero-title">{report.title}</h1>
            </div>
            <span className="rd-hero-status" style={{ color: cfg.color, background: cfg.bg }}>
              <IonIcon icon={cfg.icon} />
              {cfg.label}
            </span>
            <div className="rd-hero-actions-inline">
              <button className="rd-hero-action-btn rd-hero-edit" onClick={openEdit} title="Edit report">
                <IonIcon icon={createOutline} />
              </button>
              <button className="rd-hero-action-btn rd-hero-delete" onClick={() => setShowDelete(true)} title="Delete report">
                <IonIcon icon={trashOutline} />
              </button>
            </div>
          </div>
        </div>

        <div className="rd-container">

          {/* Meta strip */} <br />
          <div className="rd-meta-strip">
            <div className="rd-meta-item">
              <IonIcon icon={calendarOutline} />
              <span>{report.date}</span>
            </div>
            <div className="rd-meta-divider" />
            <div className="rd-meta-item">
              <IonIcon icon={documentTextOutline} />
              <span>{report.type}</span>
            </div>
            {report.attachments && report.attachments.length > 0 && (
              <>
                <div className="rd-meta-divider" />
                <div className="rd-meta-item">
                  <IonIcon icon={imageOutline} />
                  <span>{report.attachments.length} file{report.attachments.length !== 1 ? 's' : ''}</span>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div className="rd-section">
            <div className="rd-section-header">
              <IonIcon icon={informationCircleOutline} />
              <span>Description</span>
            </div>
            <p className="rd-section-text">{report.description}</p>
          </div>

          {/* Full Details */}
          <div className="rd-section">
            <div className="rd-section-header">
              <IonIcon icon={readerOutline} />
              <span>Full Details</span>
            </div>
            <p className="rd-section-text">{report.fullDetails || 'No additional details provided.'}</p>
          </div>

          {/* Attachments */}
          <div className="rd-section">
            <div className="rd-section-header">
              <IonIcon icon={attachOutline} />
              <span>Attachments</span>
              {report.attachments && report.attachments.length > 0 && (
                <span className="rd-section-count">{report.attachments.length}</span>
              )}
            </div>
            {report.attachments && report.attachments.length > 0 ? (
              <div className="rd-attachments">
                {report.attachments.map((name, i) => {
                  const previewUrl = report.attachmentPreviews?.[i] || null;
                  return (
                    <div
                      key={i}
                      className="rd-attachment-card"
                      onClick={() => setSelectedImage(previewUrl || name)}
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt={name} className="rd-attachment-thumb-img" />
                      ) : (
                        <div className="rd-attachment-thumb">
                          <IonIcon icon={imageOutline} />
                        </div>
                      )}
                      <div className="rd-attachment-info">
                        <span className="rd-attachment-name">{name}</span>
                        <span className="rd-attachment-type">Tap to view</span>
                      </div>
                      <IonIcon icon={imageOutline} className="rd-attachment-arrow" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rd-empty-attachments">No attachments for this report.</p>
            )}
          </div>

          <div className="rd-bottom-space" />
        </div>

        {/* Sticky Action Bar — Print + Download side by side */}
        <div className="rd-sticky-bar">
          <div className="rd-action-row">
            <button
              className="rd-print-btn"
              onClick={() => printReport(report)}
            >
              <IonIcon icon={printOutline} />
              Print
            </button>
            <button
              className={`rd-dl-btn ${downloading ? 'rd-dl-btn--loading' : ''} ${downloaded ? 'rd-dl-btn--done' : ''}`}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <><span className="rd-spinner" />Saving…</>
              ) : downloaded ? (
                <><IonIcon icon={checkmarkCircleOutline} />Downloaded</>
              ) : (
                <><IonIcon icon={downloadOutline} />Download</>
              )}
            </button>
          </div>
        </div>

        {/* Image Lightbox */}
        {selectedImage && (
          <div className="rd-lightbox-overlay" onClick={() => setSelectedImage(null)}>
            <button className="rd-lightbox-close" onClick={() => setSelectedImage(null)}>
              <IonIcon icon={closeCircleOutline} />
            </button>
            <div className="rd-lightbox-body" onClick={e => e.stopPropagation()}>
              <div className="rd-lightbox-img-wrap">
                {selectedImage.startsWith('blob:') || selectedImage.startsWith('data:') || selectedImage.startsWith('http') ? (
                  <img src={selectedImage} alt="attachment" />
                ) : (
                  <>
                    <IonIcon icon={imageOutline} className="rd-lightbox-placeholder-icon" />
                    <p className="rd-lightbox-filename">{selectedImage}</p>
                    <p className="rd-lightbox-hint">No preview available for this file</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </IonContent>

      {/* ── EDIT MODAL ────────────────────────────────────────────────── */}
      {editState && (
        <div className="rp-modal-overlay" onClick={() => setEditState(null)}>
          <div className="rp-modal" onClick={e => e.stopPropagation()}>
            <div className="rp-modal-header">
              <div className="rp-modal-title-row">
                <IonIcon icon={createOutline} className="rp-modal-icon" />
                <h2 className="rp-modal-title">Edit Report</h2>
              </div>
              <button className="rp-modal-close" onClick={() => setEditState(null)}>
                <IonIcon icon={closeCircleOutline} />
              </button>
            </div>
            <div className="rp-modal-body">
              <div className="rp-field">
                <label className="rp-field-label">Title</label>
                <input
                  className="rp-field-input"
                  value={editState.title}
                  onChange={e => setEditState(s => s && ({ ...s, title: e.target.value }))}
                  maxLength={80}
                  placeholder="Report title"
                />
              </div>
              <div className="rp-field-row">
                <div className="rp-field">
                  <label className="rp-field-label">Type</label>
                  <select
                    className="rp-field-select"
                    value={editState.type}
                    onChange={e => setEditState(s => s && ({ ...s, type: e.target.value }))}
                  >
                    {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="rp-field">
                  <label className="rp-field-label">Status</label>
                  <select
                    className="rp-field-select"
                    value={editState.status}
                    onChange={e => setEditState(s => s && ({ ...s, status: e.target.value as 'Submitted' | 'Pending' }))}
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="rp-field">
                <label className="rp-field-label">Description</label>
                <textarea
                  className="rp-field-textarea"
                  value={editState.description}
                  onChange={e => setEditState(s => s && ({ ...s, description: e.target.value }))}
                  rows={3}
                  maxLength={600}
                  placeholder="Short description"
                />
                <span className="rp-field-count">{editState.description.length}/600</span>
              </div>
              <div className="rp-field">
                <label className="rp-field-label">Full Details</label>
                <textarea
                  className="rp-field-textarea"
                  value={editState.fullDetails}
                  onChange={e => setEditState(s => s && ({ ...s, fullDetails: e.target.value }))}
                  rows={5}
                  maxLength={2000}
                  placeholder="In-depth report details"
                />
                <span className="rp-field-count">{editState.fullDetails.length}/2000</span>
              </div>
            </div>
            <div className="rp-modal-footer">
              <button className="rp-modal-btn rp-modal-cancel" onClick={() => setEditState(null)}>
                Cancel
              </button>
              <button
                className={`rp-modal-btn rp-modal-save ${isSaving ? 'rp-modal-save--loading' : ''}`}
                onClick={handleSaveEdit}
                disabled={isSaving || !editState.title.trim() || !editState.description.trim()}
              >
                {isSaving
                  ? <><span className="rp-btn-spinner" /> Saving…</>
                  : <><IonIcon icon={saveOutline} /> Save Changes</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ──────────────────────────────────────────────── */}
      {showDelete && report && (
        <div className="rp-modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="rp-modal rp-modal--delete" onClick={e => e.stopPropagation()}>
            <div className="rp-modal-header">
              <div className="rp-modal-title-row">
                <IonIcon icon={alertCircleOutline} className="rp-modal-icon rp-modal-icon--danger" />
                <h2 className="rp-modal-title">Delete Report?</h2>
              </div>
              <button className="rp-modal-close" onClick={() => setShowDelete(false)}>
                <IonIcon icon={closeCircleOutline} />
              </button>
            </div>
            <div className="rp-modal-body rp-delete-body">
              <p className="rp-delete-msg">You're about to permanently delete:</p>
              <div className="rp-delete-card">
                <p className="rp-delete-name">{report.title}</p>
                <p className="rp-delete-meta">{report.type} · {report.date}</p>
              </div>
              <p className="rp-delete-warn">This action cannot be undone.</p>
            </div>
            <div className="rp-modal-footer">
              <button className="rp-modal-btn rp-modal-cancel" onClick={() => setShowDelete(false)}>
                Cancel
              </button>
              <button className="rp-modal-btn rp-modal-delete" onClick={handleDelete}>
                <IonIcon icon={trashOutline} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </IonPage>
  );
};

export default ReportDetail;