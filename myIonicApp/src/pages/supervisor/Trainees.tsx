import React from 'react';
import { IonPage, IonContent, IonText, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { searchOutline, chevronForwardOutline, schoolOutline, peopleOutline } from 'ionicons/icons';
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

const Trainees: React.FC = () => {
  const history = useHistory();

  const trainees: Trainee[] = [
    { id: 1, name: 'Katherine Guzman', course: 'BSIT', school: 'ISPSC', status: 'Active', progress: 80, email: 'kathewinnnn@gmail.com', phone: '123-456-7890', startDate: '2026-01-15', supervisorNotes: 'Excellent performance in web development tasks.', birthday: '2000-05-15', age: 24, address: '123 Main St, City', section: 'A', profilePicture: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Samantha Lumpaodan', course: 'BSIT', school: 'ISPSC', status: 'Active', progress: 65, email: 'samantha@gmail.com', phone: '123-456-7891', startDate: '2026-01-15', supervisorNotes: 'Needs improvement in database design.', birthday: '2001-03-20', age: 23, address: '456 Elm St, City', section: 'B', profilePicture: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Raffy Romero', course: 'BSIT', school: 'ISPSC', status: 'Active', progress: 50, email: 'raffy@gmail.com', phone: '123-456-7892', startDate: '2026-01-15', supervisorNotes: 'Excellent performance in IoT tasks.', birthday: '1999-12-10', age: 25, address: '789 Oak St, City', section: 'A', profilePicture: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Mark Romer', course: 'BSIT', school: 'ISPSC', status: 'Inactive', progress: 30, email: 'mark@gmail.com', phone: '123-456-7893', startDate: '2026-01-15', supervisorNotes: 'Needs to submit pending reports.', birthday: '2000-08-22', age: 24, address: '321 Pine St, City', section: 'B', profilePicture: 'https://via.placeholder.com/150' },
  ];

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const progressColor = (p: number) =>
    p >= 75 ? 'var(--c-green)' : p >= 50 ? 'var(--c-amber)' : 'var(--c-red)';

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content">

        {/* Hero */}
        <div className="sv-hero">
          <div className="sv-hero-bg" />
          <div className="sv-hero-inner">
            <p className="sv-hero-sub">Manage &amp; monitor</p>
            <h1 className="sv-hero-name">Your Trainees</h1>
            <div className="sv-hero-meta">
              <span className="sv-hero-chip">
                <IonIcon icon={peopleOutline} />
                {trainees.length} total
              </span>
              <span className="sv-hero-chip sv-chip-green">
                {trainees.filter(t => t.status === 'Active').length} active
              </span>
            </div>
          </div>
        </div>

        <div className="sv-body">

          {/* Search */}
          <div className="sv-search-bar">
            <IonIcon icon={searchOutline} className="sv-search-icon" />
            <input type="text" placeholder="Search trainees…" className="sv-search-input" />
          </div>

          {/* List Header */}
          <div className="sv-list-header">
            <span className="sv-list-title">All Trainees</span>
            <span className="sv-list-count">{trainees.length} students</span>
          </div>

          {/* Trainee Cards */}
          <div className="sv-trainee-list">
            {trainees.map(trainee => (
              <div
                key={trainee.id}
                className="sv-trainee-card"
                onClick={() => history.push(`/trainee-detail/${trainee.id}`)}
              >
                {/* Left: Avatar */}
                <div className="sv-trainee-avatar">
                  {initials(trainee.name)}
                </div>

                {/* Middle: Info */}
                <div className="sv-trainee-info">
                  <div className="sv-trainee-name-row">
                    <span className="sv-trainee-name">{trainee.name}</span>
                    <span className={`sv-trainee-status ${trainee.status === 'Active' ? 'sv-status-active' : 'sv-status-inactive'}`}>
                      {trainee.status}
                    </span>
                  </div>
                  <div className="sv-trainee-meta-row">
                    <span className="sv-trainee-meta">
                      <IonIcon icon={schoolOutline} />
                      {trainee.course} · {trainee.school}
                    </span>
                    <span className="sv-trainee-section">Sec {trainee.section}</span>
                  </div>

                  {/* Mini Progress */}
                  <div className="sv-trainee-progress-row">
                    <div className="sv-mini-track">
                      <div
                        className="sv-mini-fill"
                        style={{ width: `${trainee.progress}%`, background: progressColor(trainee.progress) }}
                      />
                    </div>
                    <span className="sv-trainee-pct" style={{ color: progressColor(trainee.progress) }}>
                      {trainee.progress}%
                    </span>
                  </div>
                </div>

                {/* Right: Arrow */}
                <IonIcon icon={chevronForwardOutline} className="sv-trainee-arrow" />
              </div>
            ))}
          </div>

        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="trainees" />
    </IonPage>
  );
};

export default Trainees;