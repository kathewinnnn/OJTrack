import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline, timeOutline, documentOutline, calendarOutline, attachOutline, documentTextOutline } from 'ionicons/icons';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

interface Report {
  id: number;
  studentName: string;
  dateSubmitted: string;
  timeIn: string;
  timeOut: string;
  reportDescription: string;
  documentationAttachment: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    { id: 1, studentName: 'Katherine Mae', dateSubmitted: '2026-02-14', timeIn: '8:00 AM', timeOut: '4:00 PM', reportDescription: 'Completed web development tasks for the week, including responsive design implementation and API integration.', documentationAttachment: 'weekly_report_katherine.pdf', status: 'Pending' },
    { id: 2, studentName: 'Mark Romer', dateSubmitted: '2026-02-13', timeIn: '9:30 AM', timeOut: '5:00 PM', reportDescription: 'Worked on IoT project, successfully connected sensors and implemented data logging functionality.', documentationAttachment: 'iot_project_mark.pdf', status: 'Approved' },
    { id: 3, studentName: 'Samantha Lumpaodan', dateSubmitted: '2026-02-14', timeIn: '8:30 AM', timeOut: '4:30 PM', reportDescription: 'Database design and optimization tasks completed. Created ER diagrams and implemented query optimizations.', documentationAttachment: 'database_design_samantha.pdf', status: 'Pending' },
    { id: 4, studentName: 'Raffy Romero', dateSubmitted: '2026-02-12', timeIn: '9:00 AM', timeOut: '4:15 PM', reportDescription: 'Mobile app development progress: implemented user authentication and basic navigation structure.', documentationAttachment: 'mobile_app_raffy.pdf', status: 'Rejected' },
  ]);

  const handleApprove = (id: number) =>
    setReports(r => r.map(rep => rep.id === id ? { ...rep, status: 'Approved' as const } : rep));
  const handleReject = (id: number) =>
    setReports(r => r.map(rep => rep.id === id ? { ...rep, status: 'Rejected' as const } : rep));

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const statusCfg: Record<string, { color: string; bg: string }> = {
    Approved: { color: 'var(--c-green)', bg: 'rgba(52,211,153,0.12)' },
    Rejected: { color: 'var(--c-red)',   bg: 'rgba(248,113,113,0.12)' },
    Pending:  { color: 'var(--c-amber)', bg: 'rgba(251,191,36,0.12)' },
  };

  const approved = reports.filter(r => r.status === 'Approved').length;
  const pending  = reports.filter(r => r.status === 'Pending').length;
  const rejected = reports.filter(r => r.status === 'Rejected').length;

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content">

        {/* Hero */}
        <div className="sv-hero">
          <div className="sv-hero-bg" />
          <div className="sv-hero-inner">
            <p className="sv-hero-sub">Review &amp; approve</p>
            <h1 className="sv-hero-name">Activity Reports</h1>
            <div className="sv-hero-meta">
              <span className="sv-hero-chip">
                <IonIcon icon={documentTextOutline} />
                {reports.length} total
              </span>
              <span className="sv-hero-chip sv-chip-amber">{pending} pending</span>
            </div>
          </div>
        </div>

        <div className="sv-body">

          {/* Summary Row */}<br/>
          <div className="sv-stats-grid sv-stats-3">
            <div className="sv-stat-card sv-stat-green">
              <div className="sv-stat-icon-wrap"><IonIcon icon={checkmarkCircleOutline} /></div>
              <p className="sv-stat-num">{approved}</p>
              <p className="sv-stat-lbl">Approved</p>
            </div>
            <div className="sv-stat-card sv-stat-amber">
              <div className="sv-stat-icon-wrap"><IonIcon icon={timeOutline} /></div>
              <p className="sv-stat-num">{pending}</p>
              <p className="sv-stat-lbl">Pending</p>
            </div>
            <div className="sv-stat-card sv-stat-red">
              <div className="sv-stat-icon-wrap"><IonIcon icon={closeCircleOutline} /></div>
              <p className="sv-stat-num">{rejected}</p>
              <p className="sv-stat-lbl">Rejected</p>
            </div>
          </div>

          {/* List Header */}
          <div className="sv-list-header">
            <span className="sv-list-title">All Reports</span>
            <span className="sv-list-count">{reports.length} items</span>
          </div>

          {/* Report Cards */}
          <div className="sv-report-list">
            {reports.map(report => {
              const cfg = statusCfg[report.status];
              return (
                <div key={report.id} className="sv-report-card">

                  {/* Card Header */}
                  <div className="sv-report-card-header">
                    <div className="sv-report-avatar">{initials(report.studentName)}</div>
                    <div className="sv-report-header-info">
                      <span className="sv-report-student">{report.studentName}</span>
                      <span className="sv-report-status-chip"
                        style={{ color: cfg.color, background: cfg.bg }}>
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
                      <IonIcon icon={documentOutline} />
                      Report Description
                    </div>
                    <p className="sv-report-desc-text">{report.reportDescription}</p>
                  </div>

                  {/* Attachment */}
                  <div className="sv-report-attachment">
                    <IonIcon icon={attachOutline} />
                    <span>{report.documentationAttachment}</span>
                  </div>

                  {/* Actions */}
                  {report.status === 'Pending' && (
                    <div className="sv-report-actions">
                      <button className="sv-report-btn sv-btn-approve-full" onClick={() => handleApprove(report.id)}>
                        <IonIcon icon={checkmarkCircleOutline} />
                        Approve
                      </button>
                      <button className="sv-report-btn sv-btn-reject-full" onClick={() => handleReject(report.id)}>
                        <IonIcon icon={closeCircleOutline} />
                        Reject
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
    </IonPage>
  );
};

export default Reports;