import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  documentTextOutline, downloadOutline, eyeOutline, addOutline,
  calendarOutline, checkmarkCircleOutline, timeOutline,
  searchOutline, closeOutline, printOutline,
  createOutline, trashOutline, closeCircleOutline,
  alertCircleOutline, saveOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useReports, Report } from './ReportsContext';
import { printReport } from './Print';
import './ReportsModal.css';

/* ── Edit modal state ──────────────────────────────────────────────────── */
interface EditState {
  id: number;
  title: string;
  date: string;
  type: string;
  status: 'Submitted' | 'Pending';
  description: string;
  fullDetails: string;
}

const REPORT_TYPES = ['Daily', 'Weekly', 'Monthly', 'Midterm', 'Final', 'Incident'];

const Reports: React.FC = () => {
  const history = useHistory();
  const { reports, updateReport, deleteReport } = useReports();
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());

  // Edit modal
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);

  const stats = {
    total: reports.length,
    submitted: reports.filter((r: Report) => r.status === 'Submitted').length,
    pending: reports.filter((r: Report) => r.status === 'Pending').length,
  };

  const statusConfig: Record<string, { color: string; bg: string; icon: string }> = {
    'Submitted': { color: '#34d399', bg: 'rgba(52,211,153,0.12)', icon: checkmarkCircleOutline },
    'Pending':   { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: timeOutline },
  };

  const filtered = reports
    .filter((r: Report) => {
      const q = searchText.toLowerCase();
      const matches = r.title.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
      const filterMatch = selectedFilter === 'all' || r.status.toLowerCase() === selectedFilter;
      return matches && filterMatch;
    })
    .sort((a: Report, b: Report) => b.submittedAt - a.submittedAt);

  const filters = ['all', 'submitted', 'pending'];

  /* ── Download ─────────────────────────────────────────────────────────── */
  const handleDownload = (report: Report) => {
    setDownloadingId(report.id);
    const content = [
      `REPORT TITLE: ${report.title}`,
      `TYPE: ${report.type}`,
      `DATE: ${report.date}`,
      `STATUS: ${report.status}`,
      ``,
      `DESCRIPTION`,
      `------------`,
      report.description,
      ``,
      `FULL DETAILS`,
      `------------`,
      report.fullDetails || 'No additional details.',
      ``,
      `ATTACHMENTS`,
      `------------`,
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
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedIds(prev => new Set(prev).add(report.id));
    }, 800);
  };

  /* ── Edit handlers ────────────────────────────────────────────────────── */
  const openEdit = (report: Report) => {
    setEditState({
      id: report.id,
      title: report.title,
      date: report.date,
      type: report.type,
      status: report.status,
      description: report.description,
      fullDetails: report.fullDetails ?? '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editState) return;
    setIsSaving(true);
    await new Promise(res => setTimeout(res, 600));
    updateReport(editState.id, {
      title: editState.title.trim(),
      type: editState.type,
      status: editState.status,
      description: editState.description.trim(),
      fullDetails: editState.fullDetails.trim(),
    });
    setIsSaving(false);
    setEditState(null);
  };

  /* ── Delete handlers ──────────────────────────────────────────────────── */
  const confirmDelete = (report: Report) => setDeleteTarget(report);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteReport(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="rp-content">

        {/* Hero */}
        <div className="rp-hero">
          <div className="rp-hero-bg" />
          <div className="rp-hero-inner">
            <h1 className="rp-hero-title">Your Reports</h1>
            <p className="rp-hero-sub">Manage and track all submissions</p>
          </div>
        </div>

        <div className="rp-container">

          {/* Stats Row */} <br />
          <div className="rp-stats-row">
            <div className="rp-stat-card rp-stat-total">
              <IonIcon icon={documentTextOutline} className="rp-stat-icon" />
              <span className="rp-stat-num">{stats.total}</span>
              <span className="rp-stat-lbl">Total</span>
            </div>
            <div className="rp-stat-card rp-stat-submitted">
              <IonIcon icon={checkmarkCircleOutline} className="rp-stat-icon" />
              <span className="rp-stat-num">{stats.submitted}</span>
              <span className="rp-stat-lbl">Submitted</span>
            </div>
            <div className="rp-stat-card rp-stat-pending">
              <IonIcon icon={timeOutline} className="rp-stat-icon" />
              <span className="rp-stat-num">{stats.pending}</span>
              <span className="rp-stat-lbl">Pending</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="rp-filter-row">
            {filters.map(f => (
              <button
                key={f}
                className={`rp-filter-btn ${selectedFilter === f ? 'rp-filter-active' : ''}`}
                onClick={() => setSelectedFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="rp-search-wrap">
            <IonIcon icon={searchOutline} className="rp-search-icon" />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search reports..."
              className="rp-search-input"
            />
            {searchText && (
              <button className="rp-search-clear" onClick={() => setSearchText('')}>
                <IonIcon icon={closeOutline} />
              </button>
            )}
          </div>

          {/* List Header */}
          <div className="rp-list-header">
            <span className="rp-list-title">All Reports</span>
            <span className="rp-list-count">{filtered.length} items</span>
          </div>

          {/* Report Cards */}
          <div className="rp-list">
            {filtered.length === 0 ? (
              <div className="rp-empty">
                <IonIcon icon={documentTextOutline} />
                <p>No reports found.</p>
              </div>
            ) : (
              filtered.map((report: Report) => {
                const cfg = statusConfig[report.status];
                const isDownloading = downloadingId === report.id;
                const isDownloaded = downloadedIds.has(report.id);
                return (
                  <div key={report.id} className="rp-card">
                    <div className="rp-card-top">
                      <span className="rp-type-chip">
                        <IonIcon icon={documentTextOutline} />
                        {report.type}
                      </span>
                      <div className="rp-card-top-right">
                        <span className="rp-status-chip" style={{ color: cfg.color, background: cfg.bg }}>
                          <IonIcon icon={cfg.icon} />
                          {report.status}
                        </span>
                        <div className="rp-card-corner-actions">
                          <button
                            className="rp-side-btn rp-side-edit"
                            onClick={() => openEdit(report)}
                            title="Edit report"
                          >
                            <IonIcon icon={createOutline} />
                          </button>
                          <button
                            className="rp-side-btn rp-side-delete"
                            onClick={() => confirmDelete(report)}
                            title="Delete report"
                          >
                            <IonIcon icon={trashOutline} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="rp-card-body">
                      <p className="rp-card-title">{report.title}</p>
                      <p className="rp-card-desc">{report.description}</p>
                    </div>

                    <div className="rp-card-footer">
                      <div className="rp-card-date">
                        <IonIcon icon={calendarOutline} />
                        {report.date}
                      </div>
                      <div className="rp-card-actions">
                        <button
                          className="rp-btn rp-btn-view"
                          onClick={() => history.push('/report-detail', { report })}
                        >
                          <IonIcon icon={eyeOutline} /> View
                        </button>
                        <button
                          className="rp-btn rp-btn-print"
                          onClick={() => printReport(report)}
                        >
                          <IonIcon icon={printOutline} /> Print
                        </button>
                        <button
                          className={`rp-btn rp-btn-dl ${isDownloading ? 'rp-btn-dl--loading' : ''} ${isDownloaded ? 'rp-btn-dl--done' : ''}`}
                          onClick={() => handleDownload(report)}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <><span className="rp-btn-spinner" /> Saving…</>
                          ) : isDownloaded ? (
                            <><IonIcon icon={checkmarkCircleOutline} /> Saved</>
                          ) : (
                            <><IonIcon icon={downloadOutline} /> Download</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* FAB */}
        <div className="rp-fab-wrap">
          <button className="rp-fab" onClick={() => history.push('/upload-report')}>
            <IonIcon icon={addOutline} />
            <span>Upload Report</span>
          </button>
        </div>

      </IonContent>

      {/* ── EDIT MODAL ──────────────────────────────────────────────────── */}
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

              {/* Title */}
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

              {/* Type + Status row */}
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

              {/* Description */}
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

              {/* Full Details */}
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
                {isSaving ? (
                  <><span className="rp-btn-spinner" /> Saving…</>
                ) : (
                  <><IonIcon icon={saveOutline} /> Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ────────────────────────────────────── */}
      {deleteTarget && (
        <div className="rp-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="rp-modal rp-modal--delete" onClick={e => e.stopPropagation()}>
            <div className="rp-modal-header">
              <div className="rp-modal-title-row">
                <IonIcon icon={alertCircleOutline} className="rp-modal-icon rp-modal-icon--danger" />
                <h2 className="rp-modal-title">Delete Report?</h2>
              </div>
              <button className="rp-modal-close" onClick={() => setDeleteTarget(null)}>
                <IonIcon icon={closeCircleOutline} />
              </button>
            </div>

            <div className="rp-modal-body rp-delete-body">
              <p className="rp-delete-msg">
                You're about to permanently delete:
              </p>
              <div className="rp-delete-card">
                <p className="rp-delete-name">{deleteTarget.title}</p>
                <p className="rp-delete-meta">{deleteTarget.type} · {deleteTarget.date}</p>
              </div>
              <p className="rp-delete-warn">This action cannot be undone.</p>
            </div>

            <div className="rp-modal-footer">
              <button className="rp-modal-btn rp-modal-cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="rp-modal-btn rp-modal-delete" onClick={handleDelete}>
                <IonIcon icon={trashOutline} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab="reports" />
    </IonPage>
  );
};

export default Reports;