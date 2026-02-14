import React from 'react';
import { IonPage, IonContent, IonText, IonBadge } from '@ionic/react';
import { useHistory } from 'react-router-dom';
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
    // Add more trainees as needed
  ];

  const handleTraineeClick = (trainee: Trainee) => {
    history.push(`/trainee-detail/${trainee.id}`);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="dashboard-container">
          <div className="welcome-section">
            <IonText>
              <h1 className="welcome-title">Trainees</h1>
              <p className="welcome-subtitle">Manage and monitor your trainees</p>
            </IonText>
          </div>

          {trainees.map(trainee => (
            <div key={trainee.id} className="progress-card trainee-card" onClick={() => handleTraineeClick(trainee)} style={{cursor: 'pointer'}}>
              <div className="progress-header">
                <IonText>
                  <h2 className="card-title">{trainee.name}</h2>
                </IonText>
                <IonBadge color={trainee.status === 'Active' ? 'success' : 'medium'}>{trainee.status}</IonBadge>
              </div>
              <p><strong>Course:</strong> {trainee.course}</p>
              <p><strong>School:</strong> {trainee.school}</p>
              <div className="progress-bar-container">
                <div className="progress-bar-background">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${trainee.progress}%` }}
                  ></div>
                </div>
                <IonText className="progress-percentage">{trainee.progress}%</IonText>
              </div>
            </div>
          ))}
        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="trainees" />
    </IonPage>
  );
};

export default Trainees;