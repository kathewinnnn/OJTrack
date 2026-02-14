import React, { useState } from 'react';
import { IonPage, IonContent, IonText, IonCard, IonCardContent, IonButton, IonIcon, IonRow, IonCol, IonGrid } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline, timeOutline } from 'ionicons/icons';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

interface AttendanceRecord {
  id: number;
  studentName: string;
  timeIn: string | null;
  timeOut: string | null;
  status: 'Present' | 'Logged In' | 'Absent' | 'Late';
  verificationStatus: 'Pending' | 'Approved' | 'Disapproved';
}

const Attendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { id: 1, studentName: 'Katherine Mae', timeIn: '8:00 AM', timeOut: null, status: 'Logged In', verificationStatus: 'Pending' },
    { id: 2, studentName: 'Mark Romer', timeIn: '9:30 AM', timeOut: '4:00 PM', status: 'Present', verificationStatus: 'Approved' },
    { id: 3, studentName: 'Samantha Lumpaodan', timeIn: '9:45 AM', timeOut: '4:15 PM', status: 'Late', verificationStatus: 'Pending' },
    { id: 4, studentName: 'Raffy Romero', timeIn: null, timeOut: null, status: 'Absent', verificationStatus: 'Disapproved' },
  ]);

  const handleApprove = (id: number) => {
    setAttendanceRecords(records =>
      records.map(record =>
        record.id === id ? { ...record, verificationStatus: 'Approved' as const } : record
      )
    );
  };

  const handleDisapprove = (id: number) => {
    setAttendanceRecords(records =>
      records.map(record =>
        record.id === id ? { ...record, verificationStatus: 'Disapproved' as const } : record
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#10b981';
      case 'Disapproved': return '#ef4444';
      case 'Pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return '#10b981';
      case 'Logged In': return '#3b82f6';
      case 'Late': return '#f59e0b';
      case 'Absent': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="dashboard-container">
          <div className="welcome-section">
            <IonText>
              <h1 className="welcome-title">Attendance Verification</h1>
              <p className="welcome-subtitle">Review and verify daily attendance records</p>
            </IonText>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Today's Summary</h2>
              </IonText>
            </div>
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <h3 style={{ color: '#10b981', margin: '0' }}>
                      {attendanceRecords.filter(r => r.verificationStatus === 'Approved').length}
                    </h3>
                    <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>Approved</p>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <h3 style={{ color: '#f59e0b', margin: '0' }}>
                      {attendanceRecords.filter(r => r.verificationStatus === 'Pending').length}
                    </h3>
                    <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>Pending</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Attendance Records</h2>
              </IonText>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {attendanceRecords.map(record => (
                <div key={record.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  background: 'white'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{record.studentName}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{
                        color: getAttendanceStatusColor(record.status),
                        fontWeight: '500',
                        fontSize: '0.875rem'
                      }}>
                        {record.status}
                      </span>
                      {record.timeIn && (
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          <IonIcon icon={timeOutline} style={{ marginRight: '0.25rem' }} />
                          In: {record.timeIn}
                        </span>
                      )}
                      {record.timeOut && (
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Out: {record.timeOut}
                        </span>
                      )}
                    </div>
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: getStatusColor(record.verificationStatus),
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      {record.verificationStatus}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {record.verificationStatus === 'Pending' && (
                      <>
                        <button
                          color="success"
                          className="approve-buttonn"
                          onClick={() => handleApprove(record.id)}
                        >
                          <IonIcon icon={checkmarkCircleOutline} />
                        </button>
                        <button
                          color="danger"
                          className="disapprove-buttonn"
                          onClick={() => handleDisapprove(record.id)}
                        >
                          <IonIcon icon={closeCircleOutline} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="attendance" />
    </IonPage>
  );
};

export default Attendance;