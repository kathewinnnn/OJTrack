import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonText, IonIcon, IonInput, IonDatetime, IonTextarea, IonLabel } from '@ionic/react';
import { arrowBackOutline, calendarOutline, timeOutline, checkmarkCircleOutline, documentTextOutline, briefcaseOutline, addOutline } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';

interface DTRProps {}

const DTR: React.FC<DTRProps> = () => {
  const [selectedDate, setSelectedDate] = useState<string | string[]>(new Date().toISOString());
  const [timeIn, setTimeIn] = useState<string>('');
  const [timeOut, setTimeOut] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('DTR Submitted:', {
        date: selectedDate,
        timeIn,
        timeOut,
        taskDescription
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const formatDate = (dateStr: string | string[]) => {
    const date = new Date(dateStr as string);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isFormComplete = timeIn && timeOut && taskDescription;

  return (
    <IonPage>

       <IonContent fullscreen className="dtr-content">
              <div className="dashboard-container dtr-hero">
                {/* Welcome Message */}
                <div className="welcome-section">
                  <IonText>
                    <h1 className="dtr-title">Log Your Work</h1>
                    <p className="dtr-subtitle">Track your activities and hours</p>
                  </IonText>
                </div>
              </div>

        <div className="dtr-container">
          {/* Date Selection Card */}
          <div className="dtr-card">
            <div className="card-header">
              <div className="card-icon-wrapper date-icon">
                <IonIcon icon={calendarOutline} className="card-icon" />
              </div>
              <div className="card-title-wrapper">
                <IonText className="card-title">Date</IonText>
                <IonText className="card-subtitle">{formatDate(selectedDate)}</IonText>
              </div>
            </div>
          </div>

          {/* Time Records Card */}
          <div className="dtr-card">
            <div className="card-header">
              <div className="card-icon-wrapper time-icon">
                <IonIcon icon={timeOutline} className="card-icon" />
              </div>
              <div className="card-title-wrapper">
                <IonText className="card-title">Work Hours</IonText>
                <IonText className="card-subtitle">Record your time in and out</IonText>
              </div>
            </div>

            <div className="time-inputs">
              <div className={`time-input-group ${timeIn ? 'completed' : ''}`}>
                <div className="input-label-wrapper">
                  <div className="input-icon-wrapper in">
                    <IonIcon icon={timeOutline} />
                  </div>
                  <IonLabel className="input-label">Time In</IonLabel>
                  {timeIn && <span className="status-badge in">✓</span>}
                </div>
                <div className="time-input-wrapper">
                  <IonInput
                    type="time"
                    value={timeIn}
                    onIonChange={(e) => setTimeIn(e.detail.value!)}
                    className="time-input"
                    placeholder="Select time"
                  />
                </div>
              </div>

              <div className="time-divider">
                <span className="divider-line"></span>
                <div className="divider-icon">
                  <IonIcon icon={addOutline} />
                </div>
                <span className="divider-line"></span>
              </div>

              <div className={`time-input-group ${timeOut ? 'completed' : ''}`}>
                <div className="input-label-wrapper">
                  <div className="input-icon-wrapper out">
                    <IonIcon icon={timeOutline} />
                  </div>
                  <IonLabel className="input-label">Time Out</IonLabel>
                  {timeOut && <span className="status-badge out">✓</span>}
                </div>
                <div className="time-input-wrapper">
                  <IonInput
                    type="time"
                    value={timeOut}
                    onIonChange={(e) => setTimeOut(e.detail.value!)}
                    className="time-input"
                    placeholder="Select time"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Task Description Card */}
          <div className="dtr-card">
            <div className="card-header">
              <div className="card-icon-wrapper task-icon">
                <IonIcon icon={documentTextOutline} className="card-icon" />
              </div>
              <div className="card-title-wrapper">
                <IonText className="card-title">Tasks & Activities</IonText>
                <IonText className="card-subtitle">What did you work on?</IonText>
              </div>
            </div>
            <div className={`textarea-wrapper ${taskDescription ? 'completed' : ''}`}>
              <IonTextarea
                value={taskDescription}
                onIonChange={(e) => setTaskDescription(e.detail.value!)}
                className="task-textarea"
                placeholder="Describe your tasks, meetings, and accomplishments for the day..."
                rows={5}
              />
              {taskDescription && (
                <div className="word-count">
                  <span className="word-count-number">
                    {taskDescription.split(/\s+/).filter(word => word.length > 0).length}
                  </span>
                  <span className="word-count-label"> words</span>
                </div>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="dtr-card summary-card">
            <div className="summary-header">
              <div className="summary-icon-wrapper">
                <IonIcon icon={checkmarkCircleOutline} className="summary-icon" />
              </div>
              <IonText className="summary-title">Summary</IonText>
            </div>
            <div className="summary-items">
              <div className={`summary-item ${timeIn ? 'done' : ''}`}>
                <div className="item-indicator"></div>
                <div className="item-content">
                  <span className="item-label">Time In</span>
                  <span className="item-value">{timeIn || 'Not set'}</span>
                </div>
              </div>
              <div className={`summary-item ${timeOut ? 'done' : ''}`}>
                <div className="item-indicator"></div>
                <div className="item-content">
                  <span className="item-label">Time Out</span>
                  <span className="item-value">{timeOut || 'Not set'}</span>
                </div>
              </div>
              <div className={`summary-item ${taskDescription ? 'done' : ''}`}>
                <div className="item-indicator"></div>
                <div className="item-content">
                  <span className="item-label">Description</span>
                  <span className="item-value">{taskDescription ? 'Provided' : 'Missing'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button
              className={`submit-btn ${isFormComplete ? 'ready' : ''} ${isSubmitting ? 'submitting' : ''}`}
              onClick={handleSubmit}
              disabled={!isFormComplete || isSubmitting}
            >
              <div className="btn-content">
                <IonIcon icon={isSubmitting ? '' : checkmarkCircleOutline} className={isSubmitting ? 'spinner' : ''} />
                <span>{isSubmitting ? 'Submitting...' : 'Submit DTR'}</span>
              </div>
              {isFormComplete && !isSubmitting && <div className="btn-glow"></div>}
            </button>
          </div>
        </div>
      </IonContent>

      <BottomNav activeTab="dtr" />
    </IonPage>
  );
};

// Add styles
const styles = `
  /* Hero Section */
  .dtr-hero {
    position: relative;
    padding-top: 3%;
    padding-bottom: 3px;
    overflow: hidden;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .hero-icon-wrapper {
    flex-shrink: 0;
  }

  .hero-icon {
    width: 48px;
    height: 48px;
    background: rgba(87, 86, 86, 0.2);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    animation: float 3s ease-in-out infinite;
  }

  .hero-icon ion-icon {
    font-size: 24px;
    color: black;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .hero-text h2 {
    color: #1f2937;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 3% 0 0.25rem 0;
  }

  .hero-text p {
    color: #6b7280;
  font-size: 1rem;
  margin: 0;
  }

  /* Container */
  .dtr-container {
    padding: 0.75rem 1.5rem 0;
    background: #f5f7fa;
    min-height: 100%;
  }

  /* Cards */
  .dtr-card {
    background: white;
    border-radius: 20px;
    padding: 1.25rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .dtr-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .card-icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
    
  .card-icon {
    font-size: 22px;
    color: white;
  }

  .card-title-wrapper {
    flex: 1;
  }

  .card-title {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 0.15rem;
  }

  .card-subtitle {
    display: block;
    font-size: 0.8rem;
    color: #8892b0;
  }

  /* Date Picker */
  .date-picker-container {
    position: relative;
  }

  .date-display {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 1rem;
    color: white;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .date-display:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  .date-display-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
  }

  .date-display-content ion-icon {
    font-size: 1.5rem;
    opacity: 0.9;
  }

  .date-picker {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 10;
    --background: transparent;
    --color: #1a1a2e;
    --title-color: #667eea;
    --day-color: #64748b;
    --day-today-color: #667eea;
    --day-selected-color: #ffffff;
    --day-selected-background: #667eea;
  }

  .date-picker::part(calendar) {
    width: 100%;
  }

  .date-picker::part(month-year) {
    font-weight: 600;
    color: #1a1a2e;
    font-size: 1rem;
  }

  .date-picker::part(day) {
    border-radius: 10px;
    font-weight: 500;
  }

  .date-picker::part(day-today) {
    border: 2px solid #667eea;
    font-weight: 700;
  }

  .date-picker::part(day-active) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-weight: 600;
  }

  /* Responsive calendar */
  @media (max-width: 380px) {
    .date-picker {
      min-height: 260px;
    }
    
    .date-picker::part(month-year) {
      font-size: 0.9rem;
    }
    
    .date-picker::part(day) {
      font-size: 0.85rem;
      width: 36px;
      height: 36px;
    }
  }

  /* Mobile Responsive Styles */
  @media (max-width: 480px) {
    .dtr-container {
      padding: 1rem;
    }

    .dtr-card {
      padding: 1rem;
      border-radius: 16px;
    }

    .card-header {
      gap: 0.75rem;
    }

    .card-icon-wrapper {
      width: 40px;
      height: 40px;
    }

    .card-icon {
      font-size: 20px;
    }

    .card-title {
      font-size: 0.95rem;
    }

    .card-subtitle {
      font-size: 0.75rem;
    }

    .time-input-group {
      padding: 0.875rem;
    }

    .submit-btn {
      padding: 0.875rem 1.25rem;
      border-radius: 14px;
    }
  }

  /* Time Inputs */
  .time-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .time-input-group {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1rem;
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }

  .time-input-group.completed {
    background: #f0fdf4;
    border-color: #22c55e;
  }

  .input-label-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .input-icon-wrapper {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .input-icon-wrapper.in {
    background: rgba(102, 126, 234, 0.15);
    color: #667eea;
  }

  .input-icon-wrapper.out {
    background: rgba(238, 242, 255, 0.15);
    color: #8b5cf6;
  }

  .input-icon-wrapper ion-icon {
    font-size: 16px;
  }

  .input-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #64748b;
  }

  .status-badge {
    margin-left: auto;
    padding: 0.25rem 0.5rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.in {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .status-badge.out {
    background: rgba(139, 92, 246, 0.15);
    color: #8b5cf6;
  }

  .time-input-wrapper {
    background: white;
    border-radius: 10px;
    overflow: hidden;
  }

  .time-input {
    --padding-start: 1rem;
    --padding-end: 1rem;
    --padding-top: 0.75rem;
    --padding-bottom: 0.75rem;
    --color: #1a1a2e;
    --placeholder-color: #94a3b8;
    font-size: 1rem;
    font-weight: 500;
  }

  .time-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
  }

  .divider-line {
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  }

  .divider-icon {
    width: 28px;
    height: 28px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .divider-icon ion-icon {
    font-size: 14px;
    color: #94a3b8;
  }

  /* Textarea */
  .textarea-wrapper {
    background: #f0f5f7;
    border-radius: 16px;
    padding: 1rem;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
  }

  .textarea-wrapper.completed {
    background: #fefce8;
    border-color: #facc15;
  }

  .task-textarea {
    --background: transparent;
    --color: #1a1a2e;
    --placeholder-color: #e8e8e8;
    --padding: 0;
    font-size: 0.95rem;
    line-height: 1.6;
    min-height: 120px;
    width: 100%;
  }

  .word-count {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
  }

  .word-count-number {
    font-size: 1.1rem;
    font-weight: 700;
    color: #facc15;
  }

  .word-count-label {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-left: 0.25rem;
  }

  /* Summary Card */
  .summary-card {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }

  .summary-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .summary-icon-wrapper {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .summary-icon {
    font-size: 18px;
    color: #22c55e;
  }

  .summary-title {
    font-size: 1rem;
    font-weight: 600;
    color: white;
  }

  .summary-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .summary-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  .summary-item.done {
    background: rgba(34, 197, 94, 0.1);
  }

  .item-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #64748b;
    transition: all 0.3s ease;
  }

  .summary-item.done .item-indicator {
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
  }

  .item-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .item-value {
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.5);
  }

  .summary-item.done .item-value {
    color: #22c55e;
  }

  /* Submit Button */
  .submit-section {
    padding: 0;
    margin-bottom: 5%;
  }

  .submit-btn {
    width: 100%;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 16px;
    background: #e2f0e3;
    color: black;
    font-size: 1rem;
    font-weight: 600;
    cursor: not-allowed;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .submit-btn.ready {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
  }

  .submit-btn.ready:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  .submit-btn.submitting {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
  }

  .btn-content ion-icon {
    font-size: 1.25rem;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .btn-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  /* Header Styles */
  .dtr-header {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .header-content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .back-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: #f1f5f9;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: #e2e8f0;
  }

  .back-btn ion-icon {
    font-size: 20px;
    color: #64748b;
  }

  .page-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a2e;
    margin-left: 0.75rem;
  }

  .header-spacer {
    flex: 1;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default DTR;
