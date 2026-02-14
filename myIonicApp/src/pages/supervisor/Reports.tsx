import React, { useState } from 'react';
import { IonPage, IonContent, IonText, IonCard, IonCardContent, IonButton, IonIcon, IonRow, IonCol, IonGrid, IonChip } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline, timeOutline, documentOutline, calendarOutline, attachOutline } from 'ionicons/icons';
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
    {
      id: 1,
      studentName: 'Katherine Mae',
      dateSubmitted: '2026-02-14',
      timeIn: '8:00 AM',
      timeOut: '4:00 PM',
      reportDescription: 'Completed web development tasks for the week, including responsive design implementation and API integration.',
      documentationAttachment: 'weekly_report_katherine.pdf',
      status: 'Pending'
    },
    {
      id: 2,
      studentName: 'Mark Romer',
      dateSubmitted: '2026-02-13',
      timeIn: '9:30 AM',
      timeOut: '5:00 PM',
      reportDescription: 'Worked on IoT project, successfully connected sensors and implemented data logging functionality.',
      documentationAttachment: 'iot_project_mark.pdf',
      status: 'Approved'
    },
    {
      id: 3,
      studentName: 'Samantha Lumpaodan',
      dateSubmitted: '2026-02-14',
      timeIn: '8:30 AM',
      timeOut: '4:30 PM',
      reportDescription: 'Database design and optimization tasks completed. Created ER diagrams and implemented query optimizations.',
      documentationAttachment: 'database_design_samantha.pdf',
      status: 'Pending'
    },
    {
      id: 4,
      studentName: 'Raffy Romero',
      dateSubmitted: '2026-02-12',
      timeIn: '9:00 AM',
      timeOut: '4:15 PM',
      reportDescription: 'Mobile app development progress: implemented user authentication and basic navigation structure.',
      documentationAttachment: 'mobile_app_raffy.pdf',
      status: 'Rejected'
    },
  ]);

  const handleApprove = (id: number) => {
    setReports(reports =>
      reports.map(report =>
        report.id === id ? { ...report, status: 'Approved' as const } : report
      )
    );
  };

  const handleReject = (id: number) => {
    setReports(reports =>
      reports.map(report =>
        report.id === id ? { ...report, status: 'Rejected' as const } : report
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#10b981';
      case 'Rejected': return '#ef4444';
      case 'Pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="dashboard-container">
          <div className="welcome-section">
            <IonText>
              <h1 className="welcome-title">Reports Review</h1>
              <p className="welcome-subtitle">Review and approve trainee activity reports</p>
            </IonText>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Reports Summary</h2>
              </IonText>
            </div>
            <IonGrid>
              <IonRow>
                <IonCol size="4">
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <h3 style={{ color: '#10b981', margin: '0' }}>
                      {reports.filter(r => r.status === 'Approved').length}
                    </h3>
                    <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.806rem' }}>Approved</p>
                  </div>
                </IonCol>
                <IonCol size="4">
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <h3 style={{ color: '#f59e0b', margin: '0' }}>
                      {reports.filter(r => r.status === 'Pending').length}
                    </h3>
                    <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>Pending</p>
                  </div>
                </IonCol>
                <IonCol size="4">
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <h3 style={{ color: '#ef4444', margin: '0' }}>
                      {reports.filter(r => r.status === 'Rejected').length}
                    </h3>
                    <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>Rejected</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Activity Reports</h2>
              </IonText>
            </div>
            <div className="reports-list">
              {reports.map(report => (
                <div key={report.id} className="report-card">
                  <div className="report-content">
                    <div className="report-header">
                      <h3 className="report-student-name">{report.studentName}</h3>
                      <IonChip className={`status-chip status-${report.status.toLowerCase()}`}>
                        {report.status}
                      </IonChip>
                    </div>

                    <div className="report-meta">
                      <div className="meta-item">
                        <IonIcon icon={calendarOutline} />
                        <span>Submitted: {new Date(report.dateSubmitted).toLocaleDateString()}</span>
                      </div>
                      <div className="meta-item">
                        <IonIcon icon={timeOutline} />
                        <span>{report.timeIn} - {report.timeOut}</span>
                      </div>
                    </div>

                    <div className="report-description">
                      <h4 className="description-title">
                        <IonIcon icon={documentOutline} />
                        Report Description
                      </h4>
                      <p className="description-text">{report.reportDescription}</p>
                    </div>

                    <div className="report-attachment">
                      <IonIcon icon={attachOutline} />
                      <span>Attachment: {report.documentationAttachment}</span>
                    </div>
                  </div>

                  {report.status === 'Pending' && (
                    <div className="report-actions">
                      <button
                        color="success"
                        className="approve-button"
                        onClick={() => handleApprove(report.id)}
                      >
                        <IonIcon icon={checkmarkCircleOutline} slot="start" />
                        Approve
                      </button>
                      <button
                        color="danger"
                        className="disapprove-button"
                        onClick={() => handleReject(report.id)}
                      >
                        <IonIcon icon={closeCircleOutline} slot="start" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="reports" />
    </IonPage>
  );
};

export default Reports;