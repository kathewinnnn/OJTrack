import React from 'react';
import { IonIcon } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { homeOutline, peopleOutline, calendarOutline, documentTextOutline, personOutline } from 'ionicons/icons';

interface SupervisorBottomNavProps {
  activeTab?: string;
}

const SupervisorBottomNav: React.FC<SupervisorBottomNavProps> = ({ activeTab }) => {
  const history = useHistory();
  const location = useLocation();

  // Determine active tab from current location if not provided
  const getActiveTab = () => {
    if (activeTab) return activeTab;

    const path = location.pathname;
    if (path === '/supervisor-dashboard') return 'home';
    if (path === '/trainees') return 'trainees';
    if (path === '/attendance') return 'attendance';
    if (path === '/supervisor-reports') return 'reports';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const currentActiveTab = getActiveTab();

  const handleNavigation = (route: string) => {
    history.push(route);
  };

  return (
    <div className="bottom-nav">
      <button
        className={`nav-item ${currentActiveTab === 'home' ? 'active' : ''}`}
        onClick={() => handleNavigation('/supervisor-dashboard')}
      >
        <IonIcon icon={homeOutline} />
        <span>Home</span>
      </button>
      <button
        className={`nav-item ${currentActiveTab === 'trainees' ? 'active' : ''}`}
        onClick={() => handleNavigation('/trainees')}
      >
        <IonIcon icon={peopleOutline} />
        <span>Trainees</span>
      </button>
      <button
        className={`nav-item ${currentActiveTab === 'attendance' ? 'active' : ''}`}
        onClick={() => handleNavigation('/attendance')}
      >
        <IonIcon icon={calendarOutline} />
        <span>Attendance</span>
      </button>
      <button
        className={`nav-item ${currentActiveTab === 'reports' ? 'active' : ''}`}
        onClick={() => handleNavigation('/supervisor-reports')}
      >
        <IonIcon icon={documentTextOutline} />
        <span>Reports</span>
      </button>
      <button
        className={`nav-item ${currentActiveTab === 'profile' ? 'active' : ''}`}
        onClick={() => handleNavigation('/profile')}
      >
        <IonIcon icon={personOutline} />
        <span>Profile</span>
      </button>
    </div>
  );
};

export default SupervisorBottomNav;