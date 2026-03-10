import React, { useState, useRef, useCallback, useEffect } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  personCircleOutline, mailOutline, businessOutline, arrowBackOutline,
  checkmarkCircleOutline, idCardOutline, briefcaseOutline, cameraOutline,
  closeOutline, checkmarkOutline, imageOutline, trashOutline, alertCircleOutline,
  personOutline, calendarOutline, transgenderOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

const PROFILE_KEY = 'supervisorProfile';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ProfileData {
  fullName: string; username: string; email: string; gender: string; birthday: string;
  employeeId: string; department: string; role: string; profilePhoto: string | null;
}

const DEFAULT_PROFILE: ProfileData = {
  fullName:     'Dr. Mingyu Kim',
  username:     '',
  email:        'mingyu@university.edu',
  gender:       '',
  birthday:     '',
  employeeId:   'UIP-2024-001',
  department:   'Information Technology Department',
  role:         'Senior IT Supervisor',
  profilePhoto: null,
};

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

// ── Load / Save helpers ───────────────────────────────────────────────────────
const loadProfile = (): ProfileData => {
  try {
    const loggedInUsername = localStorage.getItem('loggedInUsername') ?? '';
    const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.username === loggedInUsername);

    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      const parsed: ProfileData = JSON.parse(saved);
      if (found) {
        if (!parsed.username) parsed.username = found.username ?? loggedInUsername;
        if (!parsed.gender)   parsed.gender   = found.gender   ?? '';
        if (!parsed.birthday) parsed.birthday = found.birthday ?? '';
      }
      return parsed;
    }

    if (found) {
      const seeded: ProfileData = {
        fullName:     `${found.firstName ?? ''} ${found.lastName ?? ''}`.trim() || DEFAULT_PROFILE.fullName,
        username:     found.username     ?? loggedInUsername,
        email:        found.email        ?? DEFAULT_PROFILE.email,
        gender:       found.gender       ?? '',
        birthday:     found.birthday     ?? '',
        employeeId:   found.employeeId   ?? DEFAULT_PROFILE.employeeId,
        department:   found.department   ?? DEFAULT_PROFILE.department,
        role:         found.role         ?? DEFAULT_PROFILE.role,
        profilePhoto: found.profilePhoto ?? null,
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(seeded));
      return seeded;
    }
  } catch (e) { console.error('EditProfile load error:', e); }
  return { ...DEFAULT_PROFILE };
};

/**
 * saveProfile — writes ALL profile fields to:
 *  1. PROFILE_KEY  (read by Profile.tsx)
 *  2. users array  (indexed by OLD username; also updates username key itself)
 *  3. currentUser  (session cache)
 *  4. loggedInUsername  (updated if username changed)
 */
const saveProfile = (data: ProfileData, oldUsername: string) => {
  try {
    // 1. Write the profile store
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));

    // 2. Update users array — find by oldUsername, then rename the key
    const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.username === oldUsername);
    if (idx !== -1) {
      users[idx].username    = data.username;
      users[idx].fullName    = data.fullName;
      users[idx].email       = data.email;
      users[idx].gender      = data.gender;
      users[idx].birthday    = data.birthday;
      users[idx].employeeId  = data.employeeId;
      users[idx].department  = data.department;
      users[idx].role        = data.role;
      users[idx].profilePhoto = data.profilePhoto;
      localStorage.setItem('users', JSON.stringify(users));
    }

    // 3. Update currentUser session cache
    const cu = localStorage.getItem('currentUser');
    if (cu) {
      const parsed = JSON.parse(cu);
      parsed.username    = data.username;
      parsed.fullName    = data.fullName;
      parsed.email       = data.email;
      parsed.gender      = data.gender;
      parsed.birthday    = data.birthday;
      parsed.employeeId  = data.employeeId;
      parsed.department  = data.department;
      parsed.role        = data.role;
      parsed.profilePhoto = data.profilePhoto;
      localStorage.setItem('currentUser', JSON.stringify(parsed));
    }

    // 4. Keep loggedInUsername in sync if it changed
    if (data.username !== oldUsername) {
      localStorage.setItem('loggedInUsername', data.username);
    }
  } catch (e) { console.error('EditProfile save error:', e); }
};

// ── Field config (text / email inputs only — username, gender, birthday are handled separately) ──
interface FieldConfig {
  key: string; icon: string; label: string; type: string;
  section: 'personal' | 'professional'; errorMsg: string;
}
const fieldConfig: FieldConfig[] = [
  { key: 'fullName',   icon: personCircleOutline, label: 'Full Name',     type: 'text',  section: 'personal',     errorMsg: 'Full name is required.'      },
  { key: 'email',      icon: mailOutline,          label: 'Email Address', type: 'email', section: 'personal',     errorMsg: 'Email address is required.'   },
  { key: 'employeeId', icon: idCardOutline,         label: 'Employee ID',  type: 'text',  section: 'personal',     errorMsg: 'Employee ID is required.'     },
  { key: 'department', icon: businessOutline,       label: 'Department',   type: 'text',  section: 'professional', errorMsg: 'Department is required.'      },
  { key: 'role',       icon: briefcaseOutline,      label: 'Role / Title', type: 'text',  section: 'professional', errorMsg: 'Role / Title is required.'    },
];

interface CropState { x: number; y: number; scale: number; }
const CROP_SIZE = 260;

// ── Component ─────────────────────────────────────────────────────────────────
const EditProfile: React.FC = () => {
  const history    = useHistory();
  const initialProfile                          = loadProfile();
  const originalUsername                        = useRef<string>(initialProfile.username);

  const [formData, setFormData]                 = useState<ProfileData>(initialProfile);
  const [focusedField, setFocusedField]         = useState<string | null>(null);
  const [isSaving, setIsSaving]                 = useState(false);
  const [saved, setSaved]                       = useState(false);
  const [touched, setTouched]                   = useState<Record<string, boolean>>({});
  const [errors, setErrors]                     = useState<Record<string, string>>({});

  // Username-specific state
  const [usernameStatus, setUsernameStatus]     = useState<'idle' | 'checking' | 'available' | 'taken' | 'empty'>('idle');
  const usernameDebounceRef                     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Photo / crop
  const [rawImageSrc, setRawImageSrc]           = useState<string | null>(null);
  const [isCropping, setIsCropping]             = useState(false);
  const [cropState, setCropState]               = useState<CropState>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging]             = useState(false);
  const dragStart                               = useRef<{ mx: number; my: number; cx: number; cy: number } | null>(null);
  const fileInputRef                            = useRef<HTMLInputElement>(null);
  const cropImgRef                              = useRef<HTMLImageElement>(null);

  // ── Username duplicate check (debounced) ─────────────────────────────────
  const checkUsername = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) { setUsernameStatus('empty'); return; }
    // If unchanged from original, no need to check
    if (trimmed === originalUsername.current) { setUsernameStatus('available'); return; }

    setUsernameStatus('checking');
    if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);
    usernameDebounceRef.current = setTimeout(() => {
      const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
      const taken = users.some(u => u.username.toLowerCase() === trimmed.toLowerCase() && u.username !== originalUsername.current);
      setUsernameStatus(taken ? 'taken' : 'available');
      if (taken) {
        setErrors(prev => ({ ...prev, username: 'This username is already taken.' }));
      } else {
        setErrors(prev => { const next = { ...prev }; delete next.username; return next; });
      }
    }, 400);
  }, []);

  useEffect(() => { return () => { if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current); }; }, []);

  // ── Validation ────────────────────────────────────────────────────────────
  const validateField = (key: string, value: string): string => {
    if (key === 'username') {
      if (!value.trim()) return 'Username is required.';
      if (usernameStatus === 'taken') return 'This username is already taken.';
      return '';
    }
    const config = fieldConfig.find(f => f.key === key);
    if (!config) return '';
    if (!value.trim()) return config.errorMsg;
    if (key === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
    }
    return '';
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    // Validate username manually
    newTouched['username'] = true;
    if (!formData.username.trim()) newErrors['username'] = 'Username is required.';
    else if (usernameStatus === 'taken') newErrors['username'] = 'This username is already taken.';

    // Validate regular fields
    fieldConfig.forEach(f => {
      newTouched[f.key] = true;
      const val = (formData[f.key as keyof ProfileData] as string) ?? '';
      const err = validateField(f.key, val);
      if (err) newErrors[f.key] = err;
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (key: string, value: string) => {
    setFocusedField(null);
    setTouched(prev => ({ ...prev, [key]: true }));
    const err = validateField(key, value);
    setErrors(prev => ({ ...prev, [key]: err || '' }));
    if (!err && key === 'username') {/* status already set by checkUsername */}
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'username') {
      checkUsername(value);
      if (touched[field]) {
        if (!value.trim()) setErrors(prev => ({ ...prev, username: 'Username is required.' }));
      }
    } else if (touched[field]) {
      const err = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  // ── Photo ─────────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setRawImageSrc(ev.target?.result as string); setCropState({ x: 0, y: 0, scale: 1 }); setIsCropping(true); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onDragStart = useCallback((mx: number, my: number) => { setIsDragging(true); dragStart.current = { mx, my, cx: cropState.x, cy: cropState.y }; }, [cropState]);
  const onDragMove  = useCallback((mx: number, my: number) => {
    if (!isDragging || !dragStart.current) return;
    setCropState(prev => ({ ...prev, x: dragStart.current!.cx + mx - dragStart.current!.mx, y: dragStart.current!.cy + my - dragStart.current!.my }));
  }, [isDragging]);
  const onDragEnd   = useCallback(() => { setIsDragging(false); dragStart.current = null; }, []);

  const applyCrop = useCallback(() => {
    const img = cropImgRef.current;
    if (!img || !rawImageSrc) return;
    const canvas = document.createElement('canvas');
    const OUT = 400; canvas.width = canvas.height = OUT;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath(); ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2); ctx.clip();
    const ratio = (CROP_SIZE * cropState.scale) / img.naturalWidth;
    ctx.drawImage(img, -cropState.x / ratio, -cropState.y / ratio, CROP_SIZE / ratio, CROP_SIZE / ratio, 0, 0, OUT, OUT);
    setFormData(prev => ({ ...prev, profilePhoto: canvas.toDataURL('image/jpeg', 0.92) }));
    setIsCropping(false); setRawImageSrc(null);
  }, [rawImageSrc, cropState]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (usernameStatus === 'checking') return; // wait for debounce
    if (!validateAll()) return;
    setIsSaving(true);
    saveProfile(formData, originalUsername.current);
    // Update the original username ref after a successful save
    originalUsername.current = formData.username;
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => history.push('/profile'), 900);
    }, 900);
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  const getBorderColor = (key: string, isFocused: boolean) => {
    const hasError = touched[key] && !!errors[key];
    const isValid  = touched[key] && !errors[key] && !!(formData[key as keyof ProfileData] as string)?.trim();
    if (hasError)  return '#e53935';
    if (isFocused) return 'var(--c-purple)';
    if (isValid)   return '#34d399';
    return 'var(--c-border)';
  };

  // Username field (editable, with live duplicate status)
  const renderUsernameField = () => {
    const isFocused   = focusedField === 'username';
    const hasError    = touched['username'] && !!errors['username'];
    const isAvailable = usernameStatus === 'available';
    const isChecking  = usernameStatus === 'checking';
    const borderColor = getBorderColor('username', isFocused);
    const boxShadow   = hasError ? '0 0 0 3px rgba(229,57,53,0.15)' : isFocused ? '0 0 0 3px var(--c-purple-glow)' : 'none';

    return (
      <div key="username">
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--c-surface-2)', borderRadius: hasError ? '12px 12px 6px 6px' : 12, border: `1.5px solid ${borderColor}`, boxShadow, overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
          <div style={{ width: 44, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', color: hasError ? '#e53935' : 'var(--c-purple)', fontSize: 18, flexShrink: 0, background: hasError ? 'rgba(229,57,53,0.06)' : 'var(--c-surface-3)', borderRight: `1.5px solid ${borderColor}`, transition: 'color 0.2s, background 0.2s, border-color 0.2s' }}>
            <IonIcon icon={personOutline} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 12px' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: hasError ? '#e53935' : 'var(--c-text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' as const, marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>
              Username <span style={{ color: hasError ? '#e53935' : 'var(--c-purple)', opacity: 0.7 }}>*</span>
            </span>
            <input
              type="text"
              value={formData.username}
              onChange={e => handleChange('username', e.target.value)}
              onFocus={() => setFocusedField('username')}
              onBlur={e => handleBlur('username', e.target.value)}
              placeholder="Enter username"
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontWeight: 500, color: 'var(--c-text-primary)', padding: 0, lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          {/* Status indicator */}
          <div style={{ paddingRight: 12, flexShrink: 0, minWidth: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isChecking && (
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--c-purple)', borderTopColor: 'transparent', animation: 'spin 0.6s linear infinite' }} />
            )}
            {!isChecking && hasError && (
              <IonIcon icon={alertCircleOutline} style={{ fontSize: 18, color: '#e53935', display: 'block' }} />
            )}
            {!isChecking && isAvailable && touched['username'] && (
              <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: 18, color: '#34d399', display: 'block' }} />
            )}
          </div>
        </div>
        {/* Error message */}
        {hasError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px 7px', background: 'rgba(229,57,53,0.06)', border: '1.5px solid #e53935', borderTop: 'none', borderRadius: '0 0 8px 8px', marginBottom: 2 }}>
            <IonIcon icon={alertCircleOutline} style={{ fontSize: 13, color: '#e53935', flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: '#e53935', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{errors['username']}</span>
          </div>
        )}
        {/* "Available" hint */}
        {!hasError && isAvailable && touched['username'] && formData.username.trim() !== originalUsername.current && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px 6px', background: 'rgba(52,211,153,0.07)', border: '1.5px solid #34d399', borderTop: 'none', borderRadius: '0 0 8px 8px', marginBottom: 2 }}>
            <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: 13, color: '#34d399', flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: '#059669', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Username is available!</span>
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  };

  // Standard text/email field
  const renderField = (field: FieldConfig) => {
    const isFocused   = focusedField === field.key;
    const hasError    = touched[field.key] && !!errors[field.key];
    const isValid     = touched[field.key] && !errors[field.key] && !!(formData[field.key as keyof ProfileData] as string)?.trim();
    const borderColor = getBorderColor(field.key, isFocused);
    const boxShadow   = hasError ? '0 0 0 3px rgba(229,57,53,0.15)' : isFocused ? '0 0 0 3px var(--c-purple-glow)' : 'none';

    return (
      <div key={field.key}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--c-surface-2)', borderRadius: hasError ? '12px 12px 6px 6px' : 12, border: `1.5px solid ${borderColor}`, boxShadow, overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
          <div style={{ width: 44, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', color: hasError ? '#e53935' : 'var(--c-purple)', fontSize: 18, flexShrink: 0, background: hasError ? 'rgba(229,57,53,0.06)' : 'var(--c-surface-3)', borderRight: `1.5px solid ${borderColor}`, transition: 'color 0.2s, background 0.2s, border-color 0.2s' }}>
            <IonIcon icon={field.icon} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 12px' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: hasError ? '#e53935' : 'var(--c-text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' as const, marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>
              {field.label} <span style={{ color: hasError ? '#e53935' : 'var(--c-purple)', opacity: 0.7 }}>*</span>
            </span>
            <input
              type={field.type}
              value={formData[field.key as keyof ProfileData] as string ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              onFocus={() => setFocusedField(field.key)}
              onBlur={e => handleBlur(field.key, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontWeight: 500, color: 'var(--c-text-primary)', padding: 0, lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          {(hasError || isValid) && (
            <div style={{ paddingRight: 12, flexShrink: 0 }}>
              <IonIcon icon={hasError ? alertCircleOutline : checkmarkCircleOutline} style={{ fontSize: 18, color: hasError ? '#e53935' : '#34d399', display: 'block' }} />
            </div>
          )}
        </div>
        {hasError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px 7px', background: 'rgba(229,57,53,0.06)', border: '1.5px solid #e53935', borderTop: 'none', borderRadius: '0 0 8px 8px', marginBottom: 2 }}>
            <IonIcon icon={alertCircleOutline} style={{ fontSize: 13, color: '#e53935', flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: '#e53935', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{errors[field.key]}</span>
          </div>
        )}
      </div>
    );
  };

  // Gender select
  const renderGenderField = () => {
    const isFocused   = focusedField === 'gender';
    const borderColor = isFocused ? 'var(--c-purple)' : 'var(--c-border)';
    const boxShadow   = isFocused ? '0 0 0 3px var(--c-purple-glow)' : 'none';
    return (
      <div key="gender">
        {/* Outer wrapper: position:relative so the select can be stretched over it */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--c-surface-2)', borderRadius: 12, border: `1.5px solid ${borderColor}`, boxShadow, overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s' }}>

          {/* Icon column */}
          <div style={{ width: 44, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-purple)', fontSize: 18, flexShrink: 0, background: 'var(--c-surface-3)', borderRight: `1.5px solid ${borderColor}`, transition: 'color 0.2s, border-color 0.2s', zIndex: 0 }}>
            <IonIcon icon={transgenderOutline} />
          </div>

          {/* Label + current value display */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 12px', pointerEvents: 'none' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--c-text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' as const, marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>Gender</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: formData.gender ? 'var(--c-text-primary)' : 'var(--c-text-muted)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
              {formData.gender || 'Select gender'}
            </span>
          </div>

          {/* Chevron */}
          <div style={{ paddingRight: 14, flexShrink: 0, color: 'var(--c-text-muted)', fontSize: 14, pointerEvents: 'none' }}>▾</div>

          {/* The actual <select> stretched over the whole row, fully transparent.
              IMPORTANT: The placeholder must NOT be `disabled` — a disabled first option
              causes iOS/Android WebView to skip onChange when the user picks the very
              next option (index 1 = "Male") on the first attempt, because the native
              picker considers the value unchanged from position 0.
              Using a normal (non-disabled) empty-value placeholder ensures the picker
              always starts at a value that differs from any real gender, so onChange
              fires reliably on the very first selection. */}
          <select
            value={formData.gender}
            onChange={e => {
              // Extra safety: always call handleChange even if value looks same
              const val = e.target.value;
              setFormData(prev => ({ ...prev, gender: val }));
            }}
            onFocus={() => setFocusedField('gender')}
            onBlur={() => setFocusedField(null)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              zIndex: 2,
            }}
          >
            <option value="">— Select gender —</option>
            {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
    );
  };

  // Birthday date input
  const renderBirthdayField = () => {
    const isFocused   = focusedField === 'birthday';
    const borderColor = isFocused ? 'var(--c-purple)' : 'var(--c-border)';
    const boxShadow   = isFocused ? '0 0 0 3px var(--c-purple-glow)' : 'none';
    return (
      <div key="birthday">
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--c-surface-2)', borderRadius: 12, border: `1.5px solid ${borderColor}`, boxShadow, overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
          <div style={{ width: 44, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-purple)', fontSize: 18, flexShrink: 0, background: 'var(--c-surface-3)', borderRight: `1.5px solid ${borderColor}`, transition: 'color 0.2s, border-color 0.2s' }}>
            <IonIcon icon={calendarOutline} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 12px' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--c-text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' as const, marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>Birthday</span>
            <input
              type="date"
              value={formData.birthday}
              onChange={e => handleChange('birthday', e.target.value)}
              onFocus={() => setFocusedField('birthday')}
              onBlur={() => setFocusedField(null)}
              max={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontWeight: 500, color: formData.birthday ? 'var(--c-text-primary)' : 'var(--c-text-muted)', padding: 0, lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    );
  };

  const personalFields     = fieldConfig.filter(f => f.section === 'personal');
  const professionalFields = fieldConfig.filter(f => f.section === 'professional');

  // Personal section order: Full Name → Username → Email → Gender → Birthday → Employee ID
  const renderPersonalSection = () => (
    <>
      {renderField(personalFields.find(f => f.key === 'fullName')!)}
      {renderUsernameField()}
      {renderField(personalFields.find(f => f.key === 'email')!)}
      {renderGenderField()}
      {renderBirthdayField()}
      {renderField(personalFields.find(f => f.key === 'employeeId')!)}
    </>
  );

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content">

        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

        {/* Hero */}
        <div className="sv-hero">
          <div className="sv-hero-bg" />
          <div className="sv-hero-inner">
            <button className="sv-back-btn" onClick={() => history.push('/profile')}>
              <IonIcon icon={arrowBackOutline} /> Back
            </button>
            <p className="sv-hero-sub">Account Settings</p>
            <h1 className="sv-hero-name">Edit Profile</h1>
          </div>
        </div>

        <div className="sv-body sv-body-account">

          {/* Photo card */}
          <div className="sv-card" style={{ marginTop: '8%' }}>
            <p className="sv-card-label" style={{ marginBottom: 12 }}>Profile Photo</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {formData.profilePhoto ? (
                  <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--c-purple)', boxShadow: '0 4px 16px var(--c-purple-glow)' }}>
                    <img src={formData.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ) : (
                  <div className="sv-profile-av" style={{ width: 72, height: 72 }}>
                    <IonIcon icon={personCircleOutline} style={{ fontSize: 38 }} />
                  </div>
                )}
                <button className="sv-profile-av-edit" onClick={() => fileInputRef.current?.click()} style={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <IonIcon icon={cameraOutline} />
                </button>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 16, color: 'var(--c-text-primary)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{formData.fullName}</p>
                <p style={{ fontSize: 13, color: 'var(--c-purple)', fontWeight: 600, margin: '0 0 8px' }}>{formData.role}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  <button onClick={() => fileInputRef.current?.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', border: '1.5px solid var(--c-purple)', background: 'var(--c-purple-glow)', color: 'var(--c-purple)', transition: 'all .18s' }}>
                    <IonIcon icon={imageOutline} style={{ fontSize: 14 }} />
                    {formData.profilePhoto ? 'Change' : 'Upload'}
                  </button>
                  {formData.profilePhoto && (
                    <button onClick={() => setFormData(p => ({ ...p, profilePhoto: null }))} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', border: '1.5px solid rgba(192,57,43,.25)', background: '#fff0f0', color: '#c0392b', transition: 'all .18s' }}>
                      <IonIcon icon={trashOutline} style={{ fontSize: 14 }} /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div><p className="sv-card-label">Update</p><h2 className="sv-card-title">Personal Information</h2></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {renderPersonalSection()}
            </div>
          </div>

          {/* Professional */}
          <div className="sv-card">
            <div className="sv-card-header">
              <div><p className="sv-card-label">Update</p><h2 className="sv-card-title">Professional Information</h2></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {professionalFields.map(renderField)}
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={isSaving || saved || usernameStatus === 'checking'} style={{
            width: '100%', padding: 15, borderRadius: 14, border: 'none',
            background: saved ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,var(--c-purple),var(--c-purple-light))',
            color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: (isSaving || saved || usernameStatus === 'checking') ? 'not-allowed' : 'pointer',
            opacity: (isSaving || usernameStatus === 'checking') ? 0.75 : 1,
            boxShadow: saved ? '0 4px 18px rgba(16,185,129,0.35)' : '0 4px 18px var(--c-purple-glow)',
            transition: 'all 0.3s',
          }}>
            <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: 20 }} />
            <span>{saved ? 'Saved!' : isSaving ? 'Saving…' : usernameStatus === 'checking' ? 'Checking username…' : 'Save Changes'}</span>
          </button>

        </div>

        {/* Cropper overlay */}
        {isCropping && rawImageSrc && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,20,0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <style>{`
              .ep-vp{position:relative;border-radius:50%;overflow:hidden;cursor:grab;user-select:none;touch-action:none}
              .ep-vp:active{cursor:grabbing}
              .ep-mask{position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 999px rgba(0,0,0,.65);pointer-events:none;z-index:2}
              .ep-ring{position:absolute;inset:0;border-radius:50%;border:2.5px solid rgba(199,82,240,.75);pointer-events:none;z-index:3}
              .ep-sl{flex:1;-webkit-appearance:none;appearance:none;height:4px;border-radius:99px;background:rgba(255,255,255,.15);outline:none;cursor:pointer}
              .ep-sl::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#c752f0;box-shadow:0 0 0 3px rgba(199,82,240,.3);cursor:pointer}
            `}</style>
            <div style={{ background: '#1a0a26', borderRadius: 22, width: '100%', maxWidth: 380, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.6)', border: '1px solid rgba(255,255,255,.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(95,0,118,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IonIcon icon={cameraOutline} style={{ fontSize: 18, color: '#c752f0' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Adjust your photo</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.45)', marginTop: 1 }}>Drag to reposition · Scroll or slide to zoom</div>
                  </div>
                </div>
                <button onClick={() => { setIsCropping(false); setRawImageSrc(null); }} style={{ background: 'rgba(255,255,255,.08)', border: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,.6)', fontSize: 18 }}>
                  <IonIcon icon={closeOutline} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0', background: '#0d0016' }}>
                <div className="ep-vp" style={{ width: CROP_SIZE, height: CROP_SIZE }}
                  onMouseDown={e => onDragStart(e.clientX, e.clientY)}
                  onMouseMove={e => { if (isDragging) onDragMove(e.clientX, e.clientY); }}
                  onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
                  onTouchStart={e => { const t = e.touches[0]; onDragStart(t.clientX, t.clientY); }}
                  onTouchMove={e => { const t = e.touches[0]; onDragMove(t.clientX, t.clientY); }}
                  onTouchEnd={onDragEnd}
                  onWheel={e => { e.preventDefault(); setCropState(p => ({ ...p, scale: Math.max(0.5, Math.min(4, p.scale - e.deltaY * 0.001)) })); }}
                >
                  <img ref={cropImgRef} src={rawImageSrc} alt="crop" draggable={false} style={{ position: 'absolute', transformOrigin: 'center center', transform: `translate(${cropState.x}px,${cropState.y}px) scale(${cropState.scale})`, maxWidth: 'none', userSelect: 'none', pointerEvents: 'none', width: CROP_SIZE, height: CROP_SIZE, objectFit: 'cover' }} />
                  <div className="ep-mask" /><div className="ep-ring" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 20px 16px' }}>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', fontWeight: 700, userSelect: 'none' }}>–</span>
                <input type="range" min="0.5" max="4" step="0.01" value={cropState.scale} onChange={e => setCropState(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="ep-sl" />
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', fontWeight: 700, userSelect: 'none' }}>+</span>
              </div>
              <div style={{ display: 'flex', gap: 10, padding: '0 18px 18px' }}>
                <button onClick={() => { setIsCropping(false); setRawImageSrc(null); }} style={{ flex: 1, padding: 12, borderRadius: 11, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', border: 'none', background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cancel</button>
                <button onClick={applyCrop} style={{ flex: 2, padding: 12, borderRadius: 11, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg,#5f0076,#9c27b0)', color: '#fff', boxShadow: '0 4px 16px rgba(95,0,118,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  <IonIcon icon={checkmarkOutline} style={{ fontSize: 16 }} /> Apply Crop
                </button>
              </div>
            </div>
          </div>
        )}

      </IonContent>
      <SupervisorBottomNav activeTab="profile" />
    </IonPage>
  );
};

export default EditProfile;