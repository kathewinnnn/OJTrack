import React, { useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonText, IonIcon, IonButton, IonList, IonItem, IonLabel, IonInput } from '@ionic/react';
import { arrowBackOutline, timeOutline, logInOutline, logOutOutline, documentTextOutline, cloudUploadOutline, calendarOutline, searchOutline, closeOutline, filterOutline, trendingUpOutline, peopleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';

interface ActivityProps {}

interface Activity {
  id: number;
  type: 'time-in' | 'time-out' | 'dtr' | 'report';
  title: string;
  description: string;
  time: string;
  date: string;
  category: string;
}

const Activity: React.FC<ActivityProps> = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const activities: Activity[] = [
    { id: 1, type: 'time-in', title: 'Time In', description: 'Started work for the day - Morning check-in', time: '8:00 AM', date: 'Today', category: 'Time Record' },
    { id: 2, type: 'dtr', title: 'DTR Submitted', description: 'Daily Time Record for today - All entries verified', time: '5:30 PM', date: 'Today', category: 'DTR' },
    { id: 3, type: 'time-out', title: 'Time Out', description: 'Ended work for the day - Productive day completed', time: '5:30 PM', date: 'Today', category: 'Time Record' },
    { id: 4, type: 'report', title: 'Weekly Report Uploaded', description: 'Week 3 Progress Report - Submitted for review', time: '10:00 AM', date: 'Yesterday', category: 'Reports' },
    { id: 5, type: 'time-in', title: 'Time In', description: 'Started work for the day -迟到 check-in', time: '8:15 AM', date: 'Yesterday', category: 'Time Record' },
    { id: 6, type: 'time-out', title: 'Time Out', description: 'Ended work for the day - Early departure', time: '5:00 PM', date: 'Yesterday', category: 'Time Record' },
    { id: 7, type: 'report', title: 'Monthly Report Created', description: 'January Monthly Summary - Draft saved', time: '2:00 PM', date: 'Jan 31, 2025', category: 'Reports' },
    { id: 8, type: 'dtr', title: 'DTR Submitted', description: 'Daily Time Record for Jan 31', time: '5:30 PM', date: 'Jan 31, 2025', category: 'DTR' },
  ];

  const stats = {
    totalHours: 320,
    daysWorked: 45,
    avgHoursPerDay: 7.1,
    streak: 12,
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'time-in': return logInOutline;
      case 'time-out': return logOutOutline;
      case 'dtr': return documentTextOutline;
      case 'report': return cloudUploadOutline;
      default: return timeOutline;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'time-in': return 'rgba(16, 185, 129, 0.1)';
      case 'time-out': return 'rgba(239, 68, 68, 0.1)';
      case 'dtr': return 'rgba(102, 126, 234, 0.1)';
      case 'report': return 'rgba(14, 165, 233, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'time-in': return '#10b981';
      case 'time-out': return '#ef4444';
      case 'dtr': return '#667eea';
      case 'report': return '#0ea5e9';
      default: return '#6b7280';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'time-in': return 'Time In';
      case 'time-out': return 'Time Out';
      case 'dtr': return 'DTR';
      case 'report': return 'Report';
      default: return 'Activity';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || activity.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <IonPage>
      <IonContent fullscreen className="activity-content">
        <div className="activity-container">
          {/* Welcome Section */}
          <div className="activity-header-section">
            <IonText>
              <h1 className="activity-welcome-title">Your Activity</h1>
              <p className="activity-welcome-subtitle">Track your daily progress and achievements</p>
            </IonText>
          </div>

          {/* Stats Grid */}
          <div className="activity-stats-grid">
            <div className="activity-stat-card">
              <div className="stat-icon-wrapper hours">
                <IonIcon icon={timeOutline} />
              </div>
              <div className="stat-content">
                <IonText className="stat-value">{stats.totalHours}</IonText>
                <IonText className="stat-label">Total Hours</IonText>
              </div>
            </div>
            <div className="activity-stat-card">
              <div className="stat-icon-wrapper days">
                <IonIcon icon={calendarOutline} />
              </div>
              <div className="stat-content">
                <IonText className="stat-value">{stats.daysWorked}</IonText>
                <IonText className="stat-label">Days Worked</IonText>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="activity-filter-tabs">
            <button 
              className={`filter-tab ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-tab ${selectedFilter === 'time-in' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('time-in')}
            >
              Time In
            </button>
            <button 
              className={`filter-tab ${selectedFilter === 'time-out' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('time-out')}
            >
              Time Out
            </button>
            <button 
              className={`filter-tab ${selectedFilter === 'dtr' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('dtr')}
            >
              DTR
            </button>
            <button 
              className={`filter-tab ${selectedFilter === 'report' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('report')}
            >
              Reports
            </button>
          </div>

          {/* Search Bar */}
          <div className="activity-search-container">
            <div className="custom-searchbar">
              <IonIcon icon={searchOutline} className="search-icon" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search activities..."
                className="search-input"
              />
              {searchText && (
                <button className="clear-btn" onClick={() => setSearchText('')}>
                  <IonIcon icon={closeOutline} />
                </button>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="activity-timeline-section">
            <div className="timeline-header">
              <IonText>
                <h2 className="timeline-title">Activity Timeline</h2>
              </IonText>
              <IonText className="timeline-count">{filteredActivities.length} activities</IonText>
            </div>

            <div className="activity-timeline">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="activity-timeline-item">
                  <div className="timeline-left">
                    <div className="activity-time-badge">
                      <IonText className="activity-time">{activity.time}</IonText>
                      <IonText className="activity-date">{activity.date}</IonText>
                    </div>
                  </div>
                  <div className="timeline-center">
                    <div className="timeline-dot" style={{ background: getActivityIconColor(activity.type) }}></div>
                    <div className="timeline-line"></div>
                  </div>
                  <div className="timeline-right">
                    <div className="activity-content-card">
                      <div className="card-header">
                        <div 
                          className="activity-icon-wrapper"
                          style={{ background: getActivityBgColor(activity.type) }}
                        >
                          <IonIcon icon={getActivityIcon(activity.type)} style={{ color: getActivityIconColor(activity.type) }} />
                        </div>
                        <div className="activity-type-badge">
                          <span>{getTypeLabel(activity.type)}</span>
                        </div>
                      </div>
                      <div className="card-body">
                        <IonText className="activity-title">{activity.title}</IonText>
                        <IonText className="activity-description">{activity.description}</IonText>
                      </div>
                      <div className="card-footer">
                        <span className="activity-category">{activity.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>

      <BottomNav activeTab="activity" />
    </IonPage>
  );
};

export default Activity;
