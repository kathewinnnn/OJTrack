import React, { useState, useRef, useCallback } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  arrowBackOutline, personOutline, mailOutline, schoolOutline,
  calendarOutline, shieldCheckmarkOutline, callOutline, locationOutline,
  checkmarkCircleOutline, saveOutline, cameraOutline, closeOutline,
  checkmarkOutline, imageOutline, trashOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './EditAccount.css';

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE KEY  — never wiped by logout, so edits survive across sessions
// ─────────────────────────────────────────────────────────────────────────────
const STUDENT_PROFILE_KEY = 'studentProfile';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface StudentProfile {
  // Editable
  name: string; email: string; phone: string; address: string;
  profilePhoto: string | null;
  // Read-only (locked — set at registration, never changed here)
  program: string; year: string; studentId: string;
}

interface FormField {
  key: string; label: string; icon: string;
  type: string; placeholder: string; editable: boolean; hint?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOAD  ── durable key first, then seed from users[] on first visit
// ─────────────────────────────────────────────────────────────────────────────
const loadStudentProfile = (): StudentProfile => {
  try {
    const saved = localStorage.getItem(STUDENT_PROFILE_KEY);
    if (saved) return JSON.parse(saved);           // already edited → always wins

    // Seed from registration data
    const username = localStorage.getItem('loggedInUsername');
    const getUserData = () => {
      // Try currentUser first (fastest)
      const cu = localStorage.getItem('currentUser');
      if (cu) return JSON.parse(cu);
      // Fallback: scan users[]
      if (username) {
        const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(u => u.username === username) ?? null;
      }
      return null;
    };

    const src = getUserData();
    if (src) {
      const seeded: StudentProfile = {
        name:         `${src.firstName ?? ''} ${src.lastName ?? ''}`.trim() || 'Student',
        email:        src.email      ?? '',
        phone:        src.phone      ?? '',
        address:      src.address    ?? '',
        profilePhoto: src.profilePhoto ?? null,
        program:      src.program    ?? '',
        year:         src.year       ?? '',
        studentId:    src.studentId  ?? '',
      };
      // Persist immediately so future loads hit the saved branch
      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(seeded));
      return seeded;
    }
  } catch (e) { console.error('EditAccount load error:', e); }

  return {
    name: 'Katherine Guzman', email: 'kathewinnnn@gmail.com',
    phone: '', address: '', profilePhoto: null,
    program: 'Bachelor of Science in Information Technology',
    year: '3rd Year', studentId: 'A23-00502',
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SAVE  ── write to durable key + mirror into users[] entry
// ─────────────────────────────────────────────────────────────────────────────
const saveStudentProfile = (data: StudentProfile) => {
  try {
    // 1. Durable profile (survives logout)
    localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(data));

    // 2. Mirror editable fields into users[] so other pages stay consistent
    const username = localStorage.getItem('loggedInUsername');
    if (username) {
      const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
      const idx = users.findIndex(u => u.username === username);
      if (idx !== -1) {
        users[idx].email        = data.email;
        users[idx].phone        = data.phone;
        users[idx].address      = data.address;
        users[idx].profilePhoto = data.profilePhoto;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }

    // 3. Mirror into currentUser for same-session reads
    const cu = localStorage.getItem('currentUser');
    if (cu) {
      const parsed = JSON.parse(cu);
      parsed.email        = data.email;
      parsed.phone        = data.phone;
      parsed.address      = data.address;
      parsed.profilePhoto = data.profilePhoto;
      localStorage.setItem('currentUser', JSON.stringify(parsed));
    }
  } catch (e) { console.error('EditAccount save error:', e); }
};

// ─────────────────────────────────────────────────────────────────────────────
// CROP
// ─────────────────────────────────────────────────────────────────────────────
interface CropState { x: number; y: number; scale: number; }
const CROP_SIZE = 260;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const EditAccount: React.FC = () => {
  const history = useHistory();
  const [isSaving, setIsSaving]   = useState(false);
  const [saved, setSaved]         = useState(false);
  const [form, setForm]           = useState<StudentProfile>(loadStudentProfile);
  const [touched, setTouched]     = useState<Record<string, boolean>>({});
  const [errors, setErrors]       = useState<Record<string, string>>({});

  // Photo / crop
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropping, setIsCropping]   = useState(false);
  const [cropState, setCropState]     = useState<CropState>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging]   = useState(false);
  const dragStart    = useRef<{ mx: number; my: number; cx: number; cy: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImgRef   = useRef<HTMLImageElement>(null);

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

  const fields: FormField[] = [
    { key: 'name',      label: 'Full Name',        icon: personOutline,          type: 'text',  placeholder: 'Your full name',   editable: true },
    { key: 'email',     label: 'Email Address',    icon: mailOutline,            type: 'email', placeholder: 'your@email.com',   editable: true },
    { key: 'phone',     label: 'Phone Number',     icon: callOutline,            type: 'tel',   placeholder: '+63 9XX XXX XXXX', editable: true },
    { key: 'address',   label: 'Home Address',     icon: locationOutline,        type: 'text',  placeholder: 'City, Province',   editable: true },
    { key: 'program',   label: 'Academic Program', icon: schoolOutline,          type: 'text',  placeholder: 'Your program',     editable: false, hint: 'Contact your coordinator to change' },
    { key: 'year',      label: 'Year Level',       icon: calendarOutline,        type: 'text',  placeholder: '3rd Year',         editable: false, hint: 'Updated automatically' },
    { key: 'studentId', label: 'Student ID',       icon: shieldCheckmarkOutline, type: 'text',  placeholder: 'A00-00000',        editable: false, hint: 'Cannot be changed' },
  ];

  const validate = (key: string, value: string) => {
    if (key === 'name'  && value.trim().length < 2) return 'Name must be at least 2 characters';
    if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
    if (key === 'phone' && value && !/^[+\d\s\-()]{7,}$/.test(value)) return 'Enter a valid phone number';
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

  const isFormValid = !errors.name && !errors.email && !errors.phone &&
    form.name.trim().length >= 2 && form.email.trim().length > 0;

  const handleSave = () => {
    if (!isFormValid) return;
    setIsSaving(true);
    saveStudentProfile(form);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => history.push('/account'), 1800);
    }, 1800);
  };

  // Success screen
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

          {/* Avatar in hero */}
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
            {fields.filter(f => f.editable).map(field => (
              <div key={field.key} className={[
                'ea-field',
                touched[field.key] && errors[field.key] ? 'ea-field--error' : '',
                touched[field.key] && !errors[field.key] && (form as any)[field.key] ? 'ea-field--valid' : '',
              ].join(' ')}>
                <label className="ea-field-label">
                  <IonIcon icon={field.icon} />{field.label}
                </label>
                <div className="ea-input-wrap">
                  <input
                    type={field.type} className="ea-input"
                    placeholder={field.placeholder}
                    value={(form as any)[field.key] ?? ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    onBlur={() => handleBlur(field.key)}
                  />
                  {touched[field.key] && !errors[field.key] && (form as any)[field.key] && (
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
                  <IonIcon icon={field.icon} />{field.label}
                </label>
                <div className="ea-input-wrap">
                  <input type={field.type} className="ea-input ea-input--locked"
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