import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonText, IonIcon, IonInput, IonDatetime, IonTextarea, IonLabel, IonButton } from '@ionic/react';
import { arrowBackOutline, calendarOutline, timeOutline, checkmarkCircleOutline, documentTextOutline, briefcaseOutline, addOutline } from 'ionicons/icons';
import BottomNav from '../components/BottomNav';
import './DTR.css';

interface DTRProps {}

const DTR: React.FC<DTRProps> = () => {
  const [selectedDate, setSelectedDate] = useState<string | string[]>(new Date().toISOString());
  const [morningTimeIn, setMorningTimeIn] = useState<string>('');
  const [morningTimeOut, setMorningTimeOut] = useState<string>('');
  const [afternoonTimeIn, setAfternoonTimeIn] = useState<string>('');
  const [afternoonTimeOut, setAfternoonTimeOut] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleMorningTimeIn = () => setMorningTimeIn(getCurrentTime());
  const handleMorningTimeOut = () => setMorningTimeOut(getCurrentTime());
  const handleAfternoonTimeIn = () => setAfternoonTimeIn(getCurrentTime());
  const handleAfternoonTimeOut = () => setAfternoonTimeOut(getCurrentTime());

  const formatTime12Hour = (time: string) => {
    if (!time) return 'Not set';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const calculateTotalHours = () => {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    let totalMinutes = 0;

    if (morningTimeIn && morningTimeOut) {
      const morningDiff = toMinutes(morningTimeOut) - toMinutes(morningTimeIn);
      totalMinutes += morningDiff;
    }

    if (afternoonTimeIn && afternoonTimeOut) {
      const afternoonDiff = toMinutes(afternoonTimeOut) - toMinutes(afternoonTimeIn);
      totalMinutes += afternoonDiff;
    }

    if (totalMinutes === 0) return 'Not set';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('DTR Submitted:', {
        date: selectedDate,
        morningTimeIn,
        morningTimeOut,
        afternoonTimeIn,
        afternoonTimeOut,
        totalHours: calculateTotalHours()
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const formatDate = (dateStr: string | string[]) => {
    const date = new Date(dateStr as string);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isFormComplete = morningTimeIn && morningTimeOut;

  return (
    <IonPage>

       <IonContent fullscreen className="dtr-content">
                {/* Welcome Message */}
                <div className="welcome-section">
                  <IonText>
                    <h1 className="dtr-title">Log Your Work</h1>
                    <p className="dtr-subtitle">Track your activities and hours</p>
                  </IonText>
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

          {/* Morning Shift Card */}
          <div className="dtr-card">
            <div className="card-header">
              <div className="card-icon-wrapper time-icon">
                <IonIcon icon={timeOutline} className="card-icon" />
              </div>
              <div className="card-title-wrapper">
                <IonText className="card-title">Morning Shift</IonText>
                <IonText className="card-subtitle">7:00 AM - 12:00 PM</IonText>
              </div>
            </div>

            <div className="time-inputs">
              <div className={`time-input-group ${morningTimeIn ? 'completed' : ''}`}>
                <div className="input-label-wrapper">
                  <div className="input-icon-wrapper in">
                    <IonIcon icon={timeOutline} />
                  </div>
                  <IonLabel className="input-label">Time In</IonLabel>
                  {morningTimeIn && <span className="status-badge in">✓</span>}
                </div>
                <div className="time-input-wrapper">
                  <IonInput
                    type="time"
                    value={morningTimeIn}
                    onIonChange={(e) => setMorningTimeIn(e.detail.value!)}
                    className="time-input"
                    placeholder="Select time"
                    min="07:00"
                    max="12:00"
                    disabled={isSubmitted}
                  />
                  <button onClick={handleMorningTimeIn} className="set-current-btn" disabled={isSubmitted}>
                    <IonIcon icon={timeOutline} />
                    Set Current
                  </button>
                </div>
              </div>

              <div className="time-divider">
                <span className="divider-line"></span>
                <div className="divider-icon">
                  <IonIcon icon={addOutline} />
                </div>
                <span className="divider-line"></span>
              </div>

              <div className={`time-input-group ${morningTimeOut ? 'completed' : ''}`}>
                <div className="input-label-wrapper">
                  <div className="input-icon-wrapper out">
                    <IonIcon icon={timeOutline} />
                  </div>
                  <IonLabel className="input-label">Time Out</IonLabel>
                  {morningTimeOut && <span className="status-badge out">✓</span>}
                </div>
                <div className="time-input-wrapper">
                  <IonInput
                    type="time"
                    value={morningTimeOut}
                    onIonChange={(e) => setMorningTimeOut(e.detail.value!)}
                    className="time-input"
                    placeholder="Select time"
                    min="07:00"
                    max="12:00"
                    disabled={isSubmitted}
                  />
                  <button onClick={handleMorningTimeOut} className="set-current-btn" disabled={isSubmitted}>
                    <IonIcon icon={timeOutline} />
                    Set Current
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Afternoon Shift Card */}
          <div className="dtr-card">
            <div className="card-header">
              <div className="card-icon-wrapper time-icon">
                <IonIcon icon={timeOutline} className="card-icon" />
              </div>
              <div className="card-title-wrapper">
                <IonText className="card-title">Afternoon Shift</IonText>
                <IonText className="card-subtitle">1:00 PM - 5:00 PM</IonText>
              </div>
            </div>

            <div className="time-inputs">
              <div className={`time-input-group ${afternoonTimeIn ? 'completed' : ''}`}>
                <div className="input-label-wrapper">
                  <div className="input-icon-wrapper in">
                    <IonIcon icon={timeOutline} />
                  </div>
                  <IonLabel className="input-label">Time In</IonLabel>
                  {afternoonTimeIn && <span className="status-badge in">✓</span>}
                </div>
                <div className="time-input-wrapper">
                  <IonInput
                    type="time"
                    value={afternoonTimeIn}
                    onIonChange={(e) => setAfternoonTimeIn(e.detail.value!)}
                    className="time-input"
                    placeholder="Select time"
                    min="13:00"
                    max="17:00"
                    disabled={isSubmitted}
                  />
                  <button onClick={handleAfternoonTimeIn} className="set-current-btn" disabled={isSubmitted}>
                    <IonIcon icon={timeOutline} />
                    Set Current
                  </button>
                </div>
              </div>

              <div className="time-divider">
                <span className="divider-line"></span>
                <div className="divider-icon">
                  <IonIcon icon={addOutline} />
                </div>
                <span className="divider-line"></span>
              </div>

              <div className={`time-input-group ${afternoonTimeOut ? 'completed' : ''}`}>
                <div className="input-label-wrapper">
                  <div className="input-icon-wrapper out">
                    <IonIcon icon={timeOutline} />
                  </div>
                  <IonLabel className="input-label">Time Out</IonLabel>
                  {afternoonTimeOut && <span className="status-badge out">✓</span>}
                </div>
                <div className="time-input-wrapper">
                  <IonInput
                    type="time"
                    value={afternoonTimeOut}
                    onIonChange={(e) => setAfternoonTimeOut(e.detail.value!)}
                    className="time-input"
                    placeholder="Select time"
                    min="13:00"
                    max="17:00"
                    disabled={isSubmitted}
                  />
                  <button onClick={handleAfternoonTimeOut} className="set-current-btn" disabled={isSubmitted}>
                    <IonIcon icon={timeOutline} />
                    Set Current
                  </button>
                </div>
              </div>
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
              <div className={`summary-item ${morningTimeIn ? 'done' : ''}`}>
                <div className="item-indicator"></div>
                <div className="item-content">
                  <span className="item-label">Morning Time In</span>
                  <span className="item-value">{formatTime12Hour(morningTimeIn)}</span>
                </div>
              </div>
              <div className={`summary-item ${morningTimeOut ? 'done' : ''}`}>
                <div className="item-indicator"></div>
                <div className="item-content">
                  <span className="item-label">Morning Time Out</span>
                  <span className="item-value">{formatTime12Hour(morningTimeOut)}</span>
                </div>
              </div>
              <div className={`summary-item ${afternoonTimeIn ? 'done' : ''}`}>
                <div className="item-indicator"></div>
                <div className="item-content">
                  <span className="item-label">Afternoon Time In</span>
                  <span className="item-value">{formatTime12Hour(afternoonTimeIn)}</span>
                </div>
              </div>
              <div className={`summary-item ${afternoonTimeOut ? 'done' : ''}`}>
                <div className="item-indicator"></div>
                <div className="item-content">
                  <span className="item-label">Afternoon Time Out</span>
                  <span className="item-value">{formatTime12Hour(afternoonTimeOut)}</span>
                </div>
              </div>
              <div className={`summary-item ${isFormComplete ? 'done' : ''}`}>
                <div className="item-indicator"></div>
                <div className="item-content">
                  <span className="item-label">Total Working Hours</span>
                  <span className="item-value">{calculateTotalHours()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button
              className={`submit-btn ${isFormComplete && !isSubmitted ? 'ready' : ''} ${isSubmitting ? 'submitting' : ''}`}
              onClick={handleSubmit}
              disabled={!isFormComplete || isSubmitting || isSubmitted}
            >
              <div className="btn-content">
                <IonIcon icon={isSubmitting ? '' : checkmarkCircleOutline} className={isSubmitting ? 'spinner' : ''} />
                <span>{isSubmitted ? 'Submitted' : isSubmitting ? 'Submitting...' : 'Submit DTR'}</span>
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

export default DTR;