import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { timeOutline, logInOutline, logOutOutline, documentTextOutline, cloudUploadOutline, calendarOutline, searchOutline, closeOutline } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';

interface Activity {
  id: number;
  type: 'time-in' | 'time-out' | 'dtr' | 'report';
  title: string;
  description: string;
  time: string;
  date: string;
  category: string;
}

const Activity: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const activities: Activity[] = [
    { id: 1, type: 'time-in',  title: 'Time In',              description: 'Started work for the day – Morning check-in',           time: '8:00 AM',  date: 'Today',        category: 'Time Record' },
    { id: 2, type: 'dtr',      title: 'DTR Submitted',         description: 'Daily Time Record for today – All entries verified',    time: '5:30 PM',  date: 'Today',        category: 'DTR' },
    { id: 3, type: 'time-out', title: 'Time Out',              description: 'Ended work for the day – Productive day completed',     time: '5:30 PM',  date: 'Today',        category: 'Time Record' },
    { id: 4, type: 'report',   title: 'Weekly Report Uploaded',description: 'Week 3 Progress Report – Submitted for review',        time: '10:00 AM', date: 'Yesterday',    category: 'Reports' },
    { id: 5, type: 'time-in',  title: 'Time In',              description: 'Started work for the day',                             time: '8:15 AM',  date: 'Yesterday',    category: 'Time Record' },
    { id: 6, type: 'time-out', title: 'Time Out',              description: 'Ended work for the day – Early departure',             time: '5:00 PM',  date: 'Yesterday',    category: 'Time Record' },
    { id: 7, type: 'report',   title: 'Monthly Report Created',description: 'January Monthly Summary – Draft saved',               time: '2:00 PM',  date: 'Jan 31, 2025', category: 'Reports' },
    { id: 8, type: 'dtr',      title: 'DTR Submitted',         description: 'Daily Time Record for Jan 31',                        time: '5:30 PM',  date: 'Jan 31, 2025', category: 'DTR' },
  ];

  const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
    'time-in':  { icon: logInOutline,        color: '#34d399', bg: 'rgba(52,211,153,0.15)',  label: 'Time In' },
    'time-out': { icon: logOutOutline,       color: '#f87171', bg: 'rgba(248,113,113,0.15)', label: 'Time Out' },
    'dtr':      { icon: documentTextOutline, color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', label: 'DTR' },
    'report':   { icon: cloudUploadOutline,  color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',  label: 'Report' },
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'time-in', label: 'Time In' },
    { key: 'time-out', label: 'Time Out' },
    { key: 'dtr', label: 'DTR' },
    { key: 'report', label: 'Reports' },
  ];

  const filtered = activities.filter(a => {
    const q = searchText.toLowerCase();
    const match = a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    const fmatch = selectedFilter === 'all' || a.type === selectedFilter;
    return match && fmatch;
  });

  return (
    <IonPage>
      <IonContent fullscreen className="act-content">

        {/* Hero */}
        <div className="act-hero">
          <div className="act-hero-bg" />
          <div className="act-hero-inner">
            <h1 className="act-hero-title">Your Activity</h1>
            <p className="act-hero-sub">Track your daily progress and achievements</p>
          </div>
        </div>

        <div className="act-container">

          {/* Stats Row */}
          <div className="act-stats-row">
            <div className="act-stat-card">
              <div className="act-stat-icon-wrap act-icon-hours">
                <IonIcon icon={timeOutline} />
              </div>
              <div>
                <p className="act-stat-num">320</p>
                <p className="act-stat-lbl">Total Hours</p>
              </div>
            </div>
            <div className="act-stat-card">
              <div className="act-stat-icon-wrap act-icon-days">
                <IonIcon icon={calendarOutline} />
              </div>
              <div>
                <p className="act-stat-num">45</p>
                <p className="act-stat-lbl">Days Worked</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="act-filter-row">
            {filters.map(f => (
              <button
                key={f.key}
                className={`act-filter-btn ${selectedFilter === f.key ? 'act-filter-active' : ''}`}
                onClick={() => setSelectedFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="act-search-wrap">
            <IonIcon icon={searchOutline} className="act-search-icon" />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search activities..."
              className="act-search-input"
            />
            {searchText && (
              <button className="act-search-clear" onClick={() => setSearchText('')}>
                <IonIcon icon={closeOutline} />
              </button>
            )}
          </div>

          {/* Timeline */}
          <div className="act-timeline-head">
            <span className="act-timeline-title">Activity Timeline</span>
            <span className="act-timeline-count">{filtered.length} activities</span>
          </div>

          <div className="act-timeline">
            {filtered.map((activity, idx) => {
              const cfg = typeConfig[activity.type];
              const isLast = idx === filtered.length - 1;
              return (
                <div key={activity.id} className="act-tl-item">
                  <div className="act-tl-left">
                    <p className="act-tl-time">{activity.time}</p>
                    <p className="act-tl-date">{activity.date}</p>
                  </div>
                  <div className="act-tl-spine">
                    <div className="act-tl-dot" style={{ background: cfg.color }} />
                    {!isLast && <div className="act-tl-line" />}
                  </div>
                  <div className="act-tl-card">
                    <div className="act-tl-card-top">
                      <div className="act-tl-icon-wrap" style={{ background: cfg.bg }}>
                        <IonIcon icon={cfg.icon} style={{ color: cfg.color }} />
                      </div>
                      <span className="act-tl-type-chip" style={{ color: cfg.color, background: cfg.bg }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="act-tl-card-title">{activity.title}</p>
                    <p className="act-tl-card-desc">{activity.description}</p>
                    <div className="act-tl-card-footer">
                      <span className="act-tl-category">{activity.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </IonContent>
      <BottomNav activeTab="activity" />
    </IonPage>
  );
};

export default Activity;