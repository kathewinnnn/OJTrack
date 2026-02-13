import React, { useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonText, IonIcon, IonButton, IonList, IonItem, IonLabel, IonInput } from '@ionic/react';
import { arrowBackOutline, documentTextOutline, downloadOutline, eyeOutline, addOutline, filterOutline, calendarOutline, checkmarkCircleOutline, timeOutline, createOutline, searchOutline, closeOutline } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';

interface ReportsProps {}

interface Report {
  id: number;
  title: string;
  date: string;
  status: 'Submitted' | 'Pending' | 'Draft';
  type: string;
  description: string;
}

const Reports: React.FC<ReportsProps> = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const reports: Report[] = [
    { id: 1, title: 'Weekly Report - Week 1', date: 'Jan 6, 2025', status: 'Submitted', type: 'Weekly', description: 'First week of OJT activities and observations' },
    { id: 2, title: 'Weekly Report - Week 2', date: 'Jan 13, 2025', status: 'Submitted', type: 'Weekly', description: 'Second week progress and learnings' },
    { id: 3, title: 'Weekly Report - Week 3', date: 'Jan 20, 2025', status: 'Pending', type: 'Weekly', description: 'Third week documentation pending' },
    { id: 4, title: 'Monthly Report - January', date: 'Jan 31, 2025', status: 'Draft', type: 'Monthly', description: 'Monthly comprehensive report draft' },
    { id: 5, title: 'Weekly Report - Week 4', date: 'Feb 3, 2025', status: 'Submitted', type: 'Weekly', description: 'Fourth week summary and achievements' },
    { id: 6, title: 'Midterm Report', date: 'Feb 10, 2025', status: 'Pending', type: 'Midterm', description: 'Midterm evaluation and progress report' },
  ];

  const stats = {
    total: reports.length,
    submitted: reports.filter(r => r.status === 'Submitted').length,
    pending: reports.filter(r => r.status === 'Pending').length,
    draft: reports.filter(r => r.status === 'Draft').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'var(--ion-color-success)';
      case 'Pending': return 'var(--ion-color-warning)';
      case 'Draft': return 'var(--ion-color-medium)';
      default: return 'var(--ion-color-medium)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return checkmarkCircleOutline;
      case 'Pending': return timeOutline;
      case 'Draft': return createOutline;
      default: return documentTextOutline;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'rgba(16, 185, 129, 0.1)';
      case 'Pending': return 'rgba(245, 158, 11, 0.1)';
      case 'Draft': return 'rgba(107, 114, 128, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || report.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <IonPage>

      <IonContent fullscreen className="reports-content">
        <div className="reports-container">
          {/* Welcome Section */}
          <div className="reports-header-section">
            <IonText>
              <h1 className="reports-welcome-title">Your Reports</h1>
              <p className="reports-welcome-subtitle">Manage and track all your submitted reports</p>
            </IonText>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <IonIcon icon={documentTextOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{stats.total}</IonText>
                <IonText className="stat-label">Total Reports</IonText>
              </div>
            </div>
            <div className="stat-card submitted">
              <div className="stat-icon">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{stats.submitted}</IonText>
                <IonText className="stat-label">Submitted</IonText>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <IonIcon icon={timeOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{stats.pending}</IonText>
                <IonText className="stat-label">Pending</IonText>
              </div>
            </div>
            <div className="stat-card draft">
              <div className="stat-icon">
                <IonIcon icon={createOutline} />
              </div>
              <div className="stat-info">
                <IonText className="stat-value">{stats.draft}</IonText>
                <IonText className="stat-label">Drafts</IonText>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-tab ${selectedFilter === 'submitted' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('submitted')}
            >
              Submitted
            </button>
            <button 
              className={`filter-tab ${selectedFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-tab ${selectedFilter === 'draft' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('draft')}
            >
              Drafts
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="custom-searchbar">
              <IonIcon icon={searchOutline} className="search-icon" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search reports..."
                className="search-input"
              />
              {searchText && (
                <button className="clear-btn" onClick={() => setSearchText('')}>
                  <IonIcon icon={closeOutline} />
                </button>
              )}
            </div>
          </div>

          {/* Reports List */}
          <div className="reports-list">
            <div className="list-header">
              <IonText>
                <h2 className="list-title">All Reports</h2>
              </IonText>
              <IonText className="list-count">{filteredReports.length} items</IonText>
            </div>
            
            {filteredReports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-card-header">
                  <div className="report-type-badge">
                    <IonIcon icon={documentTextOutline} />
                    <span>{report.type}</span>
                  </div>
                  <div 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getStatusBgColor(report.status),
                      color: getStatusColor(report.status)
                    }}
                  >
                    <IonIcon icon={getStatusIcon(report.status)} />
                    <span>{report.status}</span>
                  </div>
                </div>
                
                <div className="report-card-body">
                  <IonText className="report-title">{report.title}</IonText>
                  <IonText className="report-description">{report.description}</IonText>
                </div>
                
                <div className="report-card-footer">
                  <div className="report-date">
                    <IonIcon icon={calendarOutline} />
                    <span>{report.date}</span>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn view">
                      <IonIcon icon={eyeOutline} />
                      <span>View</span>
                    </button>
                    <button className="action-btn download">
                      <IonIcon icon={downloadOutline} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Report FAB */}
          <div className="fab-container">
            <button className="upload-fab">
              <IonIcon icon={addOutline} />
              <span>Upload Report</span>
            </button>
          </div>
        </div>
      </IonContent>

      <BottomNav activeTab="reports" />
    </IonPage>
  );
};

export default Reports;
