import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  personCircleOutline,
  mailOutline,
  businessOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  idCardOutline,
  briefcaseOutline,
  cameraOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

interface FieldConfig {
  key: string;
  icon: string;
  label: string;
  type: string;
  section: 'personal' | 'professional';
}

const fieldConfig: FieldConfig[] = [
  { key: 'fullName',   icon: personCircleOutline, label: 'Full Name',     type: 'text',  section: 'personal' },
  { key: 'email',      icon: mailOutline,          label: 'Email Address', type: 'email', section: 'personal' },
  { key: 'employeeId', icon: idCardOutline,         label: 'Employee ID',  type: 'text',  section: 'personal' },
  { key: 'department', icon: businessOutline,       label: 'Department',   type: 'text',  section: 'professional' },
  { key: 'role',       icon: briefcaseOutline,      label: 'Role / Title', type: 'text',  section: 'professional' },
];

const STORAGE_KEY = 'supervisorProfile';

// Default profile data
const defaultProfile = {
  fullName: 'Dr. Kath Montenegro',
  email: 'kth.mntngr@university.edu',
  employeeId: 'UIP-2024-001',
  department: 'Information Technology Department',
  role: 'Senior IT Supervisor',
};

// Load profile from localStorage or return default
const loadProfile = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return defaultProfile;
};

// Save profile to localStorage
const saveProfile = (data: typeof defaultProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
};

const EditProfile: React.FC = () => {
  const history = useHistory();

  const [formData, setFormData] = useState(loadProfile);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved]       = useState(false);

  const handleChange = (field: string, value: string) =>
    setFormData((prev: typeof formData) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setIsSaving(true);
    // Save to localStorage
    saveProfile(formData);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      // Navigate back to profile
      setTimeout(() => history.push('/profile'), 900);
    }, 900);
  };

  const personalFields     = fieldConfig.filter(f => f.section === 'personal');
  const professionalFields = fieldConfig.filter(f => f.section === 'professional');

  const renderField = (field: FieldConfig) => {
    const isFocused = focusedField === field.key;
    return (
      <div
        key={field.key}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--c-surface-2)',
          borderRadius: '12px',
          border: `1.5px solid ${isFocused ? 'var(--c-purple)' : 'var(--c-border)'}`,
          boxShadow: isFocused ? '0 0 0 3px var(--c-purple-glow)' : 'none',
          overflow: 'hidden',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Icon column */}
        <div style={{
          width: '44px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--c-purple)',
          fontSize: '18px',
          flexShrink: 0,
          background: 'var(--c-surface-3)',
          borderRight: `1.5px solid var(--c-border)`,
        }}>
          <IonIcon icon={field.icon} />
        </div>

        {/* Input column */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '6px 12px',
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--c-text-muted)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase' as const,
            marginBottom: '2px',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {field.label}
          </span>
          <input
            type={field.type}
            value={formData[field.key as keyof typeof formData]}
            onChange={e => handleChange(field.key, e.target.value)}
            onFocus={() => setFocusedField(field.key)}
            onBlur={() => setFocusedField(null)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--c-text-primary)',
              padding: 0,
              lineHeight: '1.4',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content">

        {/* ── Hero — reuses sv-hero classes from supervisor.css ── */}
        <div className="sv-hero">
          <div className="sv-hero-bg" />
          <div className="sv-hero-inner">
            <button className="sv-back-btn" onClick={() => history.push('/profile')}>
              <IonIcon icon={arrowBackOutline} />
              Back
            </button>
            <p className="sv-hero-sub">Account Settings</p>
            <h1 className="sv-hero-name">Edit Profile</h1>
          </div>
        </div>

        <div className="sv-body sv-body-account">

          {/* ── Avatar Card — reuses sv-card + sv-profile-av ── */}
          <div className="sv-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8%'}}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div className="sv-profile-av" style={{ width: '72px', height: '72px' }}>
                <IonIcon icon={personCircleOutline} style={{ fontSize: '38px' }} />
              </div>
              <button className="sv-profile-av-edit">
                <IonIcon icon={cameraOutline} />
              </button>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: '16px',
                color: 'var(--c-text-primary)',
                margin: '0 0 2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' as const,
              }}>
                {formData.fullName}
              </p>
              <p style={{
                fontSize: '13px',
                color: 'var(--c-purple)',
                fontWeight: 600,
                margin: '0 0 5px',
              }}>
                {formData.role}
              </p>
              <span className="sv-profile-dept-badge">{formData.department}</span>
            </div>
          </div>

          {/* ── Personal Information ── */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Update</p>
                <h2 className="sv-card-title">Personal Information</h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {personalFields.map(renderField)}
            </div>
          </div>

          {/* ── Professional Information ── */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div>
                <p className="sv-card-label">Update</p>
                <h2 className="sv-card-title">Professional Information</h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {professionalFields.map(renderField)}
            </div>
          </div>

          {/* ── Save Button ── */}
          <button
            onClick={handleSave}
            disabled={isSaving || saved}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '14px',
              border: 'none',
              background: saved
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, var(--c-purple), var(--c-purple-light))',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isSaving || saved ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.75 : 1,
              boxShadow: saved
                ? '0 4px 18px rgba(16,185,129,0.35)'
                : '0 4px 18px var(--c-purple-glow)',
              transition: 'all 0.3s',
            }}
          >
            <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '20px' }} />
            <span>{saved ? 'Saved!' : isSaving ? 'Saving…' : 'Save Changes'}</span>
          </button>

        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="profile" />
    </IonPage>
  );
};

export default EditProfile;