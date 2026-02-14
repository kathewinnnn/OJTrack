import React, { useState } from 'react';
import { IonPage, IonContent, IonText, IonInput, IonItem, IonLabel, IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/react';
import { personCircleOutline, mailOutline, callOutline, locationOutline, businessOutline, calendarOutline, settingsOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

const EditProfile: React.FC = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    fullName: 'Dr. Kath Montenegro',
    email: 'kth.mntngr@university.edu',
    employeeId: 'UIP-2024-001',
    department: 'Information Technology Department',
    role: 'Senior IT Supervisor'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile:', formData);
    history.goBack();
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="dashboard-container">
          <div className="welcome-section">
            <button className="back-button" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              Back
            </button>
            <IonText><br /><br /><br />
              <h1 className="welcome-title">Edit Profile</h1>
              <p className="welcome-subtitle">Update your account information</p>
            </IonText>
          </div>

          {/* Profile Avatar Section */}
          <div className="progress-card profile-header-card">
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <IonIcon icon={personCircleOutline} />
                </div>
                <div className="profile-avatar-edit">
                  <button className="profile-edit-button">
                    <IonIcon icon={personCircleOutline} />
                  </button>
                </div>
              </div><br /><br />
              <div className="profile-info">
                <h2 className="profile-name">{formData.fullName}</h2>
                <p className="profile-role">{formData.role}</p>
                <p className="profile-department">{formData.department}</p>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Personal Information</h2>
              </IonText>
            </div>
            <div className="edit-form-grid">
              <div className="edit-form-item">
                <IonIcon icon={personCircleOutline} />
                <IonItem>
                  <IonLabel position="stacked">Full Name</IonLabel>
                  <br /><br /><IonInput
                    value={formData.fullName}
                    onIonChange={e => handleInputChange('fullName', e.detail.value!)}
                  />
                </IonItem>
              </div>
              <div className="edit-form-item">
                <IonIcon icon={mailOutline} />
                <IonItem>
                  <IonLabel position="stacked">Email Address</IonLabel>
                  <br /><br /><IonInput
                    type="email"
                    value={formData.email}
                    onIonChange={e => handleInputChange('email', e.detail.value!)}
                  />
                </IonItem>
              </div>
              <div className="edit-form-item">
                <IonIcon icon={businessOutline} />
                <IonItem>
                  <IonLabel position="stacked">Employee ID</IonLabel>
                  <br /><br /><IonInput
                    value={formData.employeeId}
                    onIonChange={e => handleInputChange('employeeId', e.detail.value!)}
                  />
                </IonItem>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="progress-card">
            <div className="progress-header">
              <IonText>
                <h2 className="card-title">Professional Information</h2>
              </IonText>
            </div>
            <div className="edit-form-grid">
              <div className="edit-form-item">
                <IonIcon icon={businessOutline} />
                <IonItem>
                  <IonLabel position="stacked">Department</IonLabel>
                  <br /><br /><IonInput
                    value={formData.department}
                    onIonChange={e => handleInputChange('department', e.detail.value!)}
                  />
                </IonItem>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="progress-card">
            <button className="action-button-primary save-button" onClick={handleSave}>
              <IonIcon icon={personCircleOutline} slot="start" style={{marginRight: '5%'}}/>
              Save Changes
            </button>
          </div>
        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="profile" />
    </IonPage>
  );
};

export default EditProfile;