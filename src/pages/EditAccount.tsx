import React, { useState, useRef, useCallback, useEffect } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  arrowBackOutline, personOutline, mailOutline, schoolOutline,
  calendarOutline, shieldCheckmarkOutline, callOutline, locationOutline,
  checkmarkCircleOutline, saveOutline, cameraOutline, closeOutline,
  checkmarkOutline, imageOutline, trashOutline, personCircleOutline,
  transgenderOutline, alertCircleOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './EditAccount.css';

const STUDENT_PROFILE_KEY = 'studentProfile';

interface StudentProfile {
  name: string; email: string; phone: string; address: string;
  profilePhoto: string | null;
  program: string; year: string; studentId: string;
  username: string;
  gender: string;
  birthday: string;
}

const loadStudentProfile = (): StudentProfile => {
  try {
    const saved = localStorage.getItem(STUDENT_PROFILE_KEY);
    const loggedInUsername = localStorage.getItem('loggedInUsername');

    const getUserData = () => {
      const cu = localStorage.getItem('currentUser');
      if (cu) return JSON.parse(cu);
      if (loggedInUsername) {
        const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(u => u.username === loggedInUsername) ?? null;
      }
      return null;
    };
    const src = getUserData();

    if (saved) {
      const p = JSON.parse(saved);
      return {
        name:         p.name         ?? 'Student',
        email:        p.email        ?? '',
        phone:        p.phone        ?? '',
        address:      p.address      ?? '',
        profilePhoto: p.profilePhoto ?? null,
        program:      p.program      ?? '',
        year:         p.year         ?? '1st Year',
        studentId:    p.studentId    ?? '',
        username:     p.username     ?? src?.username  ?? loggedInUsername ?? '',
        gender:       p.gender       ?? src?.gender    ?? '',
        birthday:     p.birthday     ?? src?.birthday  ?? '',
      };
    }

    if (src) {
      const seeded: StudentProfile = {
        name:         `${src.firstName ?? ''} ${src.lastName ?? ''}`.trim() || 'Student',
        email:        src.email        ?? '',
        phone:        src.phone        ?? '',
        address:      src.address      ?? '',
        profilePhoto: src.profilePhoto ?? null,
        program:      src.program      ?? '',
        year:         src.year         ?? '1st Year',
        studentId:    src.studentId    ?? '',
        username:     src.username     ?? loggedInUsername ?? '',
        gender:       src.gender       ?? '',
        birthday:     src.birthday     ?? '',
      };
      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(seeded));
      return seeded;
    }
  } catch (e) { console.error('EditAccount load error:', e); }

  return {
    name: 'Katherine Guzman', email: 'kathewinnnn@gmail.com',
    phone: '', address: '', profilePhoto: null,
    program: 'Bachelor of Science in Information Technology',
    year: '3rd Year', studentId: 'A23-00502',
    username: 'katheguzman', gender: '', birthday: '',
  };
};

/**
 * Saves the profile and also updates the username key in both the users[]
 * array and currentUser so the session stays consistent.
 */
const saveStudentProfile = (data: StudentProfile, oldUsername: string) => {
  try {
    localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(data));

    const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.username === oldUsername);
    if (idx !== -1) {
      users[idx].username     = data.username;   // ← update username
      users[idx].email        = data.email;
      users[idx].phone        = data.phone;
      users[idx].address      = data.address;
      users[idx].profilePhoto = data.profilePhoto;
      users[idx].year         = data.year;
      users[idx].gender       = data.gender;
      users[idx].birthday     = data.birthday;
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Keep loggedInUsername in sync so future loads find the right record
    localStorage.setItem('loggedInUsername', data.username);

    const cu = localStorage.getItem('currentUser');
    if (cu) {
      const parsed = JSON.parse(cu);
      parsed.username     = data.username;
      parsed.email        = data.email;
      parsed.phone        = data.phone;
      parsed.address      = data.address;
      parsed.profilePhoto = data.profilePhoto;
      parsed.year         = data.year;
      parsed.gender       = data.gender;
      parsed.birthday     = data.birthday;
      localStorage.setItem('currentUser', JSON.stringify(parsed));
    }

    // Notify Account.tsx (same tab) that the profile changed
    window.dispatchEvent(new Event('profileUpdated'));
  } catch (e) { console.error('EditAccount save error:', e); }
};

// ── Username availability checker ─────────────────────────────────────────────
type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

const checkUsernameAvailability = (
  newUsername: string,
  currentUsername: string,
): UsernameStatus => {
  const trimmed = newUsername.trim().toLowerCase();
  if (!trimmed) return 'idle';
  if (trimmed.length < 3) return 'invalid';
  if (!/^[a-z0-9._]+$/.test(trimmed)) return 'invalid';
  // Same as the current user's own username — always fine
  if (trimmed === currentUsername.trim().toLowerCase()) return 'available';
  const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
  const taken = users.some(u => u.username?.toLowerCase() === trimmed);
  return taken ? 'taken' : 'available';
};

interface CropState { x: number; y: number; scale: number; }
const CROP_SIZE = 260;
const YEAR_OPTIONS   = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const EditAccount: React.FC = () => {
  const history = useHistory();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved]       = useState(false);
  const [form, setForm]         = useState<StudentProfile>(loadStudentProfile);
  const [touched, setTouched]   = useState<Record<string, boolean>>({});
  const [errors, setErrors]     = useState<Record<string, string>>({});

  // Track the username at load time so we know what record to update
  const originalUsername = useRef(form.username);

  // Username availability state
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const usernameDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropping, setIsCropping]   = useState(false);
  const [cropState, setCropState]     = useState<CropState>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging]   = useState(false);
  const dragStart    = useRef<{ mx: number; my: number; cx: number; cy: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImgRef   = useRef<HTMLImageElement>(null);

  // Check username whenever it changes (debounced)
  useEffect(() => {
    if (usernameDebounce.current) clearTimeout(usernameDebounce.current);
    const val = form.username?.trim() ?? '';
    if (!val) { setUsernameStatus('idle'); return; }
    setUsernameStatus('checking');
    usernameDebounce.current = setTimeout(() => {
      setUsernameStatus(checkUsernameAvailability(val, originalUsername.current));
    }, 400);
    return () => { if (usernameDebounce.current) clearTimeout(usernameDebounce.current); };
  }, [form.username]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setRawImageSrc(ev.target?.result as string);
      setCropState({ x: 0, y: 0, scale: 1 });
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onDragStart = useCallback((mx: number, my: number) => {
    setIsDragging(true);
    dragStart.current = { mx, my, cx: cropState.x, cy: cropState.y };
  }, [cropState]);

  const onDragMove = useCallback((mx: number, my: number) => {
    if (!isDragging || !dragStart.current) return;
    setCropState(prev => ({
      ...prev,
      x: dragStart.current!.cx + mx - dragStart.current!.mx,
      y: dragStart.current!.cy + my - dragStart.current!.my,
    }));
  }, [isDragging]);

  const onDragEnd = useCallback(() => { setIsDragging(false); dragStart.current = null; }, []);

  const applyCrop = useCallback(() => {
    const img = cropImgRef.current;
    if (!img || !rawImageSrc) return;
    const canvas = document.createElement('canvas');
    const OUT = 400;
    canvas.width = canvas.height = OUT;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
    ctx.clip();
    const ratio = (CROP_SIZE * cropState.scale) / img.naturalWidth;
    ctx.drawImage(img, -cropState.x / ratio, -cropState.y / ratio, CROP_SIZE / ratio, CROP_SIZE / ratio, 0, 0, OUT, OUT);
    setForm(prev => ({ ...prev, profilePhoto: canvas.toDataURL('image/jpeg', 0.92) }));
    setIsCropping(false);
    setRawImageSrc(null);
  }, [rawImageSrc, cropState]);

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (key: string, value: string): string => {
    if (key === 'name'     && value.trim().length < 2) return 'Name must be at least 2 characters';
    if (key === 'email'    && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
    if (key === 'phone'    && value && !/^[+\d\s\-()]{7,}$/.test(value)) return 'Enter a valid phone number';
    if (key === 'username') {
      if (value.trim().length < 3) return 'Username must be at least 3 characters';
      if (!/^[a-zA-Z0-9._]+$/.test(value.trim())) return 'Only letters, numbers, dots and underscores';
    }
    return '';
  };

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (touched[key]) setErrors(prev => ({ ...prev, [key]: validate(key, value) }));
  };

  const handleBlur = (key: string) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: validate(key, (form as any)[key] ?? '') }));
  };

  const usernameOk = usernameStatus === 'available';
  const isFormValid =
    !errors.name && !errors.email && !errors.phone && !errors.username &&
    form.name.trim().length >= 2 &&
    form.email.trim().length > 0 &&
    form.username.trim().length >= 3 &&
    usernameOk;

  const handleSave = () => {
    if (!isFormValid) return;
    setIsSaving(true);
    saveStudentProfile(form, originalUsername.current);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => history.push('/account'), 1800);
    }, 1200);
  };

  if (saved) {
    return (
      <IonPage>
        <IonContent fullscreen className="ea-content">
          <div className="ea-success-screen">
            <div className="ea-success-icon"><IonIcon icon={checkmarkCircleOutline} /></div>
            <h2 className="ea-success-title">Changes Saved!</h2>
            <p className="ea-success-sub">Your profile has been updated successfully.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // ── Username status UI helpers ────────────────────────────────────────────────
  const usernameStatusUI: Record<UsernameStatus, { color: string; text: string; icon: any } | null> = {
    idle:      null,
    checking:  { color: '#888', text: 'Checking…', icon: null },
    available: { color: '#2e7d32', text: 'Username available', icon: checkmarkCircleOutline },
    taken:     { color: '#c62828', text: 'Username already taken', icon: alertCircleOutline },
    invalid:   { color: '#c62828', text: 'Min 3 chars; letters, numbers, dots, underscores only', icon: alertCircleOutline },
  };
  const uStatus = usernameStatusUI[usernameStatus];

  // ── Editable fields ───────────────────────────────────────────────────────────
  const editableFields = [
    { key: 'name',     label: 'Full Name',     icon: personOutline,      type: 'text',   placeholder: 'Your full name'    },
    { key: 'username', label: 'Username',       icon: personCircleOutline,type: 'text',   placeholder: 'e.g. john_doe'     },
    { key: 'email',    label: 'Email Address', icon: mailOutline,        type: 'email',  placeholder: 'your@email.com'    },
    { key: 'phone',    label: 'Phone Number',  icon: callOutline,        type: 'tel',    placeholder: '+63 9XX XXX XXXX'  },
    { key: 'address',  label: 'Home Address',  icon: locationOutline,    type: 'text',   placeholder: 'City, Province'    },
    { key: 'gender',   label: 'Gender',        icon: transgenderOutline, type: 'select', placeholder: 'Select gender',    options: GENDER_OPTIONS },
    { key: 'birthday', label: 'Birthday',      icon: calendarOutline,    type: 'date',   placeholder: 'YYYY-MM-DD'        },
    { key: 'year',     label: 'Year Level',    icon: calendarOutline,    type: 'select', placeholder: '1st Year',         options: YEAR_OPTIONS   },
  ];

  const lockedFields = [
    { key: 'program',   label: 'Academic Program', icon: schoolOutline,          hint: 'Contact your coordinator to change' },
    { key: 'studentId', label: 'Student ID',        icon: shieldCheckmarkOutline, hint: 'Cannot be changed' },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="ea-content">

        <input ref={fileInputRef} type="file" accept="image/*"
          style={{ display: 'none' }} onChange={handleFileChange} />

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

          <div className="ea-avatar-wrap">
            {form.profilePhoto ? (
              <div className="ea-avatar" style={{ overflow: 'hidden', background: 'transparent', padding: 0 }}>
                <img src={form.profilePhoto} alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }} />
              </div>
            ) : (
              <div className="ea-avatar">
                <IonIcon icon={personOutline} />
              </div>
            )}
            <button className="ea-avatar-edit" onClick={() => fileInputRef.current?.click()}>
              <IonIcon icon={cameraOutline} />
            </button>
          </div>
        </div>

        <div className="ea-container">

          {/* Photo action buttons */}
          <div style={{
            display: 'flex', gap: 10, marginBottom: 20,
            justifyContent: 'center', flexWrap: 'wrap' as const,
          }}>
            <button onClick={() => fileInputRef.current?.click()} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px',
              borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              border: '1.5px solid #5f0076', background: 'rgba(95,0,118,.07)',
              color: '#5f0076', transition: 'all .18s',
            }}>
              <IonIcon icon={imageOutline} style={{ fontSize: 15 }} />
              {form.profilePhoto ? 'Change Photo' : 'Upload Photo'}
            </button>
            {form.profilePhoto && (
              <button onClick={() => setForm(p => ({ ...p, profilePhoto: null }))} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px',
                borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                border: '1.5px solid rgba(192,57,43,.25)', background: '#fff0f0',
                color: '#c0392b', transition: 'all .18s',
              }}>
                <IonIcon icon={trashOutline} style={{ fontSize: 15 }} /> Remove Photo
              </button>
            )}
          </div>

          {/* Editable fields */}
          <div className="ea-section">
            <div className="ea-section-label">Personal Information</div>
            {editableFields.map(field => (
              <div key={field.key} className={[
                'ea-field',
                touched[field.key] && errors[field.key] ? 'ea-field--error' : '',
                touched[field.key] && !errors[field.key] && (form as any)[field.key] ? 'ea-field--valid' : '',
              ].join(' ')}>
                <label className="ea-field-label">
                  <IonIcon icon={field.icon} />{field.label}
                </label>
                <div className="ea-input-wrap">
                  {field.options ? (
                    <select
                      className="ea-input ea-select"
                      value={(form as any)[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      onBlur={() => handleBlur(field.key)}
                    >
                      {field.key === 'gender' && <option value="">Select gender</option>}
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="ea-input"
                      placeholder={field.placeholder}
                      value={(form as any)[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      onBlur={() => handleBlur(field.key)}
                      max={field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                    />
                  )}
                  {/* Valid tick for non-select/date fields (but NOT username — it has its own indicator) */}
                  {field.type !== 'select' && field.type !== 'date' && field.key !== 'username' &&
                   touched[field.key] && !errors[field.key] && (form as any)[field.key] && (
                    <IonIcon icon={checkmarkCircleOutline} className="ea-valid-icon" />
                  )}
                </div>

                {/* Username availability indicator */}
                {field.key === 'username' && uStatus && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    marginTop: 5, fontSize: 12, color: uStatus.color, fontWeight: 500,
                  }}>
                    {uStatus.icon && (
                      <IonIcon icon={uStatus.icon} style={{ fontSize: 14, color: uStatus.color }} />
                    )}
                    {usernameStatus === 'checking' && (
                      <span style={{
                        display: 'inline-block', width: 12, height: 12,
                        border: '2px solid #ccc', borderTopColor: '#888',
                        borderRadius: '50%', animation: 'spin 0.6s linear infinite',
                        marginRight: 2,
                      }} />
                    )}
                    {uStatus.text}
                  </div>
                )}

                {touched[field.key] && errors[field.key] && field.key !== 'username' && (
                  <p className="ea-error-msg">{errors[field.key]}</p>
                )}
                {touched[field.key] && errors[field.key] && field.key === 'username' && (
                  <p className="ea-error-msg">{errors[field.key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Read-only fields */}
          <div className="ea-section">
            <div className="ea-section-label">Academic Details</div>
            <p className="ea-section-hint">These fields are managed by your institution</p>
            {lockedFields.map(field => (
              <div key={field.key} className="ea-field ea-field--locked">
                <label className="ea-field-label">
                  <IonIcon icon={field.icon} />{field.label}
                </label>
                <div className="ea-input-wrap">
                  <input type="text" className="ea-input ea-input--locked"
                    value={(form as any)[field.key] ?? ''} readOnly disabled />
                  <span className="ea-lock-badge">Locked</span>
                </div>
                {field.hint && <p className="ea-hint-msg">{field.hint}</p>}
              </div>
            ))}
          </div>

          {/* Save */}
          <button
            className={`ea-save-btn ${isFormValid ? 'ea-save-ready' : ''} ${isSaving ? 'ea-save-loading' : ''}`}
            onClick={handleSave} disabled={!isFormValid || isSaving}
          >
            {isSaving
              ? <><span className="ea-spinner" />Saving Changes…</>
              : <><IonIcon icon={saveOutline} />Save Changes</>}
          </button>

          <div className="ea-bottom-space" />
        </div>

        {/* Cropper overlay */}
        {isCropping && rawImageSrc && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(10,0,20,0.85)',
            backdropFilter: 'blur(8px)', zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}>
            <style>{`
              .ea-vp{position:relative;border-radius:50%;overflow:hidden;cursor:grab;user-select:none;touch-action:none}
              .ea-vp:active{cursor:grabbing}
              .ea-mask{position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 999px rgba(0,0,0,.65);pointer-events:none;z-index:2}
              .ea-ring{position:absolute;inset:0;border-radius:50%;border:2.5px solid rgba(95,0,118,.8);pointer-events:none;z-index:3}
              .ea-sl{flex:1;-webkit-appearance:none;appearance:none;height:4px;border-radius:99px;background:rgba(255,255,255,.15);outline:none;cursor:pointer}
              .ea-sl::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#9c27b0;box-shadow:0 0 0 3px rgba(95,0,118,.3);cursor:pointer}
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
            <div style={{
              background: '#1a0a26', borderRadius: 22, width: '100%', maxWidth: 380,
              overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.6)',
              border: '1px solid rgba(255,255,255,.08)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.07)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(95,0,118,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IonIcon icon={cameraOutline} style={{ fontSize: 18, color: '#9c27b0' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Adjust your photo</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.45)', marginTop: 1 }}>Drag to reposition · Scroll or slide to zoom</div>
                  </div>
                </div>
                <button onClick={() => { setIsCropping(false); setRawImageSrc(null); }} style={{
                  background: 'rgba(255,255,255,.08)', border: 'none', width: 32, height: 32,
                  borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(255,255,255,.6)', fontSize: 18,
                }}>
                  <IonIcon icon={closeOutline} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0', background: '#0d0016' }}>
                <div className="ea-vp" style={{ width: CROP_SIZE, height: CROP_SIZE }}
                  onMouseDown={e => onDragStart(e.clientX, e.clientY)}
                  onMouseMove={e => { if (isDragging) onDragMove(e.clientX, e.clientY); }}
                  onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
                  onTouchStart={e => { const t = e.touches[0]; onDragStart(t.clientX, t.clientY); }}
                  onTouchMove={e => { const t = e.touches[0]; onDragMove(t.clientX, t.clientY); }}
                  onTouchEnd={onDragEnd}
                  onWheel={e => { e.preventDefault(); setCropState(p => ({ ...p, scale: Math.max(0.5, Math.min(4, p.scale - e.deltaY * 0.001)) })); }}
                >
                  <img ref={cropImgRef} src={rawImageSrc} alt="crop" draggable={false} style={{
                    position: 'absolute', transformOrigin: 'center center',
                    transform: `translate(${cropState.x}px,${cropState.y}px) scale(${cropState.scale})`,
                    maxWidth: 'none', userSelect: 'none', pointerEvents: 'none',
                    width: CROP_SIZE, height: CROP_SIZE, objectFit: 'cover',
                  }} />
                  <div className="ea-mask" /><div className="ea-ring" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 20px 16px' }}>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', fontWeight: 700, userSelect: 'none' }}>–</span>
                <input type="range" min="0.5" max="4" step="0.01" value={cropState.scale}
                  onChange={e => setCropState(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="ea-sl" />
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', fontWeight: 700, userSelect: 'none' }}>+</span>
              </div>
              <div style={{ display: 'flex', gap: 10, padding: '0 18px 18px' }}>
                <button onClick={() => { setIsCropping(false); setRawImageSrc(null); }} style={{
                  flex: 1, padding: 12, borderRadius: 11, fontSize: 14, fontWeight: 700,
                  fontFamily: 'inherit', cursor: 'pointer', border: 'none',
                  background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>Cancel</button>
                <button onClick={applyCrop} style={{
                  flex: 2, padding: 12, borderRadius: 11, fontSize: 14, fontWeight: 700,
                  fontFamily: 'inherit', cursor: 'pointer', border: 'none',
                  background: 'linear-gradient(135deg,#5f0076,#9c27b0)', color: '#fff',
                  boxShadow: '0 4px 16px rgba(95,0,118,.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}>
                  <IonIcon icon={checkmarkOutline} style={{ fontSize: 16 }} /> Apply Crop
                </button>
              </div>
            </div>
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default EditAccount;