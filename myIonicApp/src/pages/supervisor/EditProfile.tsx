import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon, IonInput, IonItem, IonLabel } from '@ionic/react';
import { personCircleOutline, mailOutline, businessOutline, arrowBackOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

const EditProfile: React.FC = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    fullName:   'Dr. Kath Montenegro',
    email:      'kth.mntngr@university.edu',
    employeeId: 'UIP-2024-001',
    department: 'Information Technology Department',
    role:       'Senior IT Supervisor',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => history.goBack(), 800);
    }, 900);
  };

  const fields = [
    { key: 'fullName',   icon: personCircleOutline, label: 'Full Name',   type: 'text',  section: 'personal' },
    { key: 'email',      icon: mailOutline,         label: 'Email Address', type: 'email', section: 'personal' },
    { key: 'employeeId', icon: businessOutline,     label: 'Employee ID', type: 'text',  section: 'personal' },
    { key: 'department', icon: businessOutline,     label: 'Department',  type: 'text',  section: 'professional' },
    { key: 'role',       icon: personCircleOutline, label: 'Role',        type: 'text',  section: 'professional' },
  ];

  const personalFields = fields.filter(f => f.section === 'personal');
  const professionalFields = fields.filter(f => f.section === 'professional');

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content">

        {/* Hero */}
        <div className="sv-hero">
          <div className="sv-hero-bg" />
          <div className="sv-hero-inner">
            <button className="sv-back-btn" onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} />
              Back
            </button>
            <p className="sv-hero-sub">Update your account</p>
            <h1 className="sv-hero-name">Edit Profile</h1>
          </div>
        </div>

        <div className="sv-body">

          {/* Avatar Card */}
          <div className="sv-card sv-edit-avatar-card">
            <div className="sv-edit-av-wrap">
              <div className="sv-edit-av">
                <IonIcon icon={personCircleOutline} />
              </div>
              <button className="sv-edit-av-btn"><IonIcon icon={personCircleOutline} /></button>
            </div>
            <div className="sv-edit-av-info">
              <p className="sv-edit-av-name">{formData.fullName}</p>
              <p className="sv-edit-av-role">{formData.role}</p>
              <p className="sv-edit-av-dept">{formData.department}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Update</p>
                <h2 className="sv-card-title">Personal Information</h2>
              </div>
            </div>
            <div className="sv-form-list">
              {personalFields.map(field => (
                <div key={field.key} className="sv-form-item">
                  <div className="sv-form-item-icon"><IonIcon icon={field.icon} /></div>
                  <div className="sv-form-item-inner">
                    <IonItem lines="none" className="sv-ion-item">
                      <IonLabel position="stacked" className="sv-form-label">{field.label}</IonLabel>
                      <IonInput
                        type={field.type as any}
                        value={formData[field.key as keyof typeof formData]}
                        onIonChange={e => handleChange(field.key, e.detail.value!)}
                        className="sv-form-input"
                      />
                    </IonItem>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Information */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Update</p>
                <h2 className="sv-card-title">Professional Information</h2>
              </div>
            </div>
            <div className="sv-form-list">
              {professionalFields.map(field => (
                <div key={field.key} className="sv-form-item">
                  <div className="sv-form-item-icon"><IonIcon icon={field.icon} /></div>
                  <div className="sv-form-item-inner">
                    <IonItem lines="none" className="sv-ion-item">
                      <IonLabel position="stacked" className="sv-form-label">{field.label}</IonLabel>
                      <IonInput
                        type="text"
                        value={formData[field.key as keyof typeof formData]}
                        onIonChange={e => handleChange(field.key, e.detail.value!)}
                        className="sv-form-input"
                      />
                    </IonItem>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            className={`sv-save-btn ${saved ? 'sv-save-done' : ''} ${isSaving ? 'sv-save-loading' : ''}`}
            onClick={handleSave}
            disabled={isSaving || saved}
          >
            <IonIcon icon={checkmarkCircleOutline} />
            <span>{saved ? 'Saved!' : isSaving ? 'Saving…' : 'Save Changes'}</span>
          </button>

        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="profile" />
    </IonPage>
  );
};

export default EditProfile;