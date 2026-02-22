import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  arrowBackOutline,
  personOutline,
  mailOutline,
  schoolOutline,
  calendarOutline,
  shieldCheckmarkOutline,
  callOutline,
  locationOutline,
  checkmarkCircleOutline,
  createOutline,
  saveOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './EditAccount.css';

interface FormField {
  key: string;
  label: string;
  icon: string;
  type: string;
  placeholder: string;
  editable: boolean;
  hint?: string;
}

const EditAccount: React.FC = () => {
  const history = useHistory();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name:      'Katherine Guzman',
    email:     'kathewinnnn@gmail.com',
    program:   'Bachelor of Science in Information Technology',
    year:      '3rd Year',
    studentId: 'A23-00502',
    phone:     '',
    address:   '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const fields: FormField[] = [
    { key: 'name',      label: 'Full Name',        icon: personOutline,          type: 'text',  placeholder: 'Your full name',         editable: true },
    { key: 'email',     label: 'Email Address',    icon: mailOutline,            type: 'email', placeholder: 'your@email.com',         editable: true },
    { key: 'phone',     label: 'Phone Number',     icon: callOutline,            type: 'tel',   placeholder: '+63 9XX XXX XXXX',       editable: true },
    { key: 'address',   label: 'Home Address',     icon: locationOutline,        type: 'text',  placeholder: 'City, Province',         editable: true },
    { key: 'program',   label: 'Academic Program', icon: schoolOutline,          type: 'text',  placeholder: 'Your program',           editable: false, hint: 'Contact your coordinator to change' },
    { key: 'year',      label: 'Year Level',       icon: calendarOutline,        type: 'text',  placeholder: '3rd Year',               editable: false, hint: 'Updated automatically' },
    { key: 'studentId', label: 'Student ID',       icon: shieldCheckmarkOutline, type: 'text',  placeholder: 'A00-00000',              editable: false, hint: 'Cannot be changed' },
  ];

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const validate = (key: string, value: string) => {
    if (key === 'name' && value.trim().length < 2)  return 'Name must be at least 2 characters';
    if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
    if (key === 'phone' && value && !/^[+\d\s\-()]{7,}$/.test(value))  return 'Enter a valid phone number';
    return '';
  };

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (touched[key]) {
      const err = validate(key, value);
      setErrors(prev => ({ ...prev, [key]: err }));
    }
  };

  const handleBlur = (key: string) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    const err = validate(key, form[key as keyof typeof form]);
    setErrors(prev => ({ ...prev, [key]: err }));
  };

  const isFormValid = !errors.name && !errors.email && !errors.phone && form.name.trim() && form.email.trim();

  const handleSave = () => {
    if (!isFormValid) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => history.push('/account'), 1800);
    }, 1800);
  };

  if (saved) {
    return (
      <IonPage>
        <IonContent fullscreen className="ea-content">
          <div className="ea-success-screen">
            
            <div className="ea-success-icon">
              <IonIcon icon={checkmarkCircleOutline} />
            </div>
            <h2 className="ea-success-title">Changes Saved!</h2>
            <p className="ea-success-sub">Your profile has been updated successfully.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ea-content">

        {/* Hero */}
        <div className="ea-hero">
          <div className="ea-hero-bg" />
          <div className="ea-hero-inner">
            <button className="ea-back-btn" onClick={() => history.push('/account')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
            <div>
              <h1 className="ea-hero-title">Edit Profile</h1>
              <p className="ea-hero-sub">Update your account information</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="ea-avatar-wrap">
            <div className="ea-avatar">
              <IonIcon icon={personOutline} />
            </div>
            <button className="ea-avatar-edit">
              <IonIcon icon={createOutline} />
            </button>
          </div>
        </div>

        <div className="ea-container">

          {/* Editable fields */}
          <div className="ea-section">
            <div className="ea-section-label">Personal Information</div>
            {fields.filter(f => f.editable).map(field => (
              <div key={field.key} className={`ea-field ${touched[field.key] && errors[field.key] ? 'ea-field--error' : ''} ${touched[field.key] && !errors[field.key] && form[field.key as keyof typeof form] ? 'ea-field--valid' : ''}`}>
                <label className="ea-field-label">
                  <IonIcon icon={field.icon} />
                  {field.label}
                </label>
                <div className="ea-input-wrap">
                  <input
                    type={field.type}
                    className="ea-input"
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => handleChange(field.key, e.target.value)}
                    onBlur={() => handleBlur(field.key)}
                  />
                  {touched[field.key] && !errors[field.key] && form[field.key as keyof typeof form] && (
                    <IonIcon icon={checkmarkCircleOutline} className="ea-valid-icon" />
                  )}
                </div>
                {touched[field.key] && errors[field.key] && (
                  <p className="ea-error-msg">{errors[field.key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Read-only fields */}
          <div className="ea-section">
            <div className="ea-section-label">Academic Details</div>
            <p className="ea-section-hint">These fields are managed by your institution</p>
            {fields.filter(f => !f.editable).map(field => (
              <div key={field.key} className="ea-field ea-field--locked">
                <label className="ea-field-label">
                  <IonIcon icon={field.icon} />
                  {field.label}
                </label>
                <div className="ea-input-wrap">
                  <input
                    type={field.type}
                    className="ea-input ea-input--locked"
                    value={form[field.key as keyof typeof form]}
                    readOnly
                    disabled
                  />
                  <span className="ea-lock-badge">Locked</span>
                </div>
                {field.hint && <p className="ea-hint-msg">{field.hint}</p>}
              </div>
            ))}
          </div>

          {/* Save button */}
          <button
            className={`ea-save-btn ${isFormValid ? 'ea-save-ready' : ''} ${isSaving ? 'ea-save-loading' : ''}`}
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
          >
            {isSaving ? (
              <>
                <span className="ea-spinner" />
                Saving Changes…
              </>
            ) : (
              <>
                <IonIcon icon={saveOutline} />
                Save Changes
              </>
            )}
          </button>

          <div className="ea-bottom-space" />
        </div>

      </IonContent>
    </IonPage>
  );
};

export default EditAccount;