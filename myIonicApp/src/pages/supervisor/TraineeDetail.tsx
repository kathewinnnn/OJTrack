import React from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { arrowBackOutline, calendarOutline, documentTextOutline, mailOutline, callOutline, schoolOutline, locationOutline, personOutline } from 'ionicons/icons';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

interface Trainee {
  id: number;
  name: string;
  course: string;
  school: string;
  status: string;
  progress: number;
  email: string;
  phone: string;
  startDate: string;
  supervisorNotes: string;
  birthday: string;
  age: number;
  address: string;
  section: string;
  profilePicture: string;
}

const TraineeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const trainees: Trainee[] = [
    { id: 1, name: 'Katherine Guzman', course: 'BSIT', school: 'ISPSC', status: 'Active', progress: 80, email: 'kathewinnnn@gmail.com', phone: '123-456-7890', startDate: '2026-01-15', supervisorNotes: 'Excellent performance in web development tasks.', birthday: '2005-04-05', age: 20, address: 'Pilar, Abra', section: 'A', profilePicture: '' },
    { id: 2, name: 'Samantha Lumpaodan', course: 'BSIT', school: 'ISPSC', status: 'Active', progress: 65, email: 'samantha@gmail.com', phone: '123-456-7891', startDate: '2026-01-15', supervisorNotes: 'Needs improvement in database design.', birthday: '2005-10-06', age: 20, address: 'Sta Maria', section: 'A', profilePicture: '' },
    { id: 3, name: 'Raffy Romero', course: 'BSIT', school: 'ISPSC', status: 'Active', progress: 50, email: 'raffy@gmail.com', phone: '123-456-7892', startDate: '2026-01-15', supervisorNotes: 'Excellent performance in IoT tasks.', birthday: '2005-12-10', age: 20, address: 'Sta Maria', section: 'A', profilePicture: '' },
  ];

  const trainee = trainees.find(t => t.id === parseInt(id));
  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const progressColor = (p: number) => p >= 75 ? 'var(--c-green)' : p >= 50 ? 'var(--c-amber)' : 'var(--c-red)';

  if (!trainee) {
    return (
      <IonPage>
        <IonContent className="sv-content">
          <div className="sv-body" style={{ paddingTop: 40 }}>
            <div className="sv-card" style={{ textAlign: 'center', padding: 32 }}>
              <p style={{ color: 'var(--c-text-muted)' }}>Trainee not found.</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const details = [
    { icon: calendarOutline,  label: 'Birthday',        value: trainee.birthday },
    { icon: personOutline,    label: 'Age',             value: `${trainee.age} years old` },
    { icon: mailOutline,      label: 'Email',           value: trainee.email },
    { icon: callOutline,      label: 'Contact Number',  value: trainee.phone },
    { icon: schoolOutline,    label: 'School',          value: trainee.school },
    { icon: locationOutline,  label: 'Address',         value: trainee.address },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content">

        {/* Hero */}
        <div className="sv-hero sv-hero-detail">
          <div className="sv-hero-bg" />
          <div className="sv-hero-inner">
            <button className="sv-back-btn" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} />
              Back
            </button>
            <div className="sv-detail-profile">
              <div className="sv-detail-avatar">{initials(trainee.name)}</div>
              <div className="sv-detail-profile-info">
                <h1 className="sv-detail-name">{trainee.name}</h1>
                <p className="sv-detail-meta">{trainee.course} · Section {trainee.section}</p>
                <span className={`sv-detail-status ${trainee.status === 'Active' ? 'sv-status-active' : 'sv-status-inactive'}`}>
                  <span className="sv-status-dot" />
                  {trainee.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sv-body">

          {/* Progress Card */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Training Progress</p>
                <h2 className="sv-card-title">Overall Completion</h2>
              </div>
              <span className="sv-pct-badge" style={{ color: progressColor(trainee.progress), background: `${progressColor(trainee.progress)}18` }}>
                {trainee.progress}%
              </span>
            </div>
            <div className="sv-progress-track">
              <div
                className="sv-progress-fill"
                style={{ width: `${trainee.progress}%`, background: `linear-gradient(90deg, ${progressColor(trainee.progress)}, ${progressColor(trainee.progress)}cc)` }}
              >
                <div className="sv-progress-glow" style={{ background: progressColor(trainee.progress) }} />
              </div>
            </div>
            <p className="sv-progress-note">
              {trainee.progress >= 75 ? '🎉 Excellent progress!' : trainee.progress >= 50 ? '📈 On track, keep going!' : '⚠️ Needs attention'}
            </p>
          </div>

          {/* Student Details */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Personal Information</p>
                <h2 className="sv-card-title">Student Details</h2>
              </div>
            </div>
            <div className="sv-detail-list">
              {details.map((d, i) => (
                <div key={i} className="sv-detail-item">
                  <div className="sv-detail-item-icon">
                    <IonIcon icon={d.icon} />
                  </div>
                  <div className="sv-detail-item-text">
                    <p className="sv-detail-item-lbl">{d.label}</p>
                    <p className="sv-detail-item-val">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supervisor Notes */}
          <div className="sv-card sv-notes-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Supervisor Notes</p>
                <h2 className="sv-card-title">Observations</h2>
              </div>
            </div>
            <p className="sv-notes-text">{trainee.supervisorNotes}</p>
          </div>

          {/* Actions */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Navigate To</p>
                <h2 className="sv-card-title">Supervisor Actions</h2>
              </div>
            </div>
            <div className="sv-action-btns-grid">
              <button className="sv-nav-action-btn sv-nav-purple" onClick={() => history.push('/attendance')}>
                <div className="sv-nav-btn-icon"><IonIcon icon={calendarOutline} /></div>
                <span>View Attendance</span>
              </button>
              <button className="sv-nav-action-btn sv-nav-dark" onClick={() => history.push('/supervisor-reports')}>
                <div className="sv-nav-btn-icon"><IonIcon icon={documentTextOutline} /></div>
                <span>Check Reports</span>
              </button>
            </div>
          </div>

        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="trainees" />
    </IonPage>
  );
};

export default TraineeDetail;