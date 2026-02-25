import React, { useState, useRef, useCallback } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  personCircleOutline, mailOutline, businessOutline, arrowBackOutline,
  checkmarkCircleOutline, idCardOutline, briefcaseOutline, cameraOutline,
  closeOutline, checkmarkOutline, imageOutline, trashOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE KEY  — this key is NEVER wiped by logout logic, so edits survive
// ─────────────────────────────────────────────────────────────────────────────
const PROFILE_KEY = 'supervisorProfile';

// ─────────────────────────────────────────────────────────────────────────────
// FIELD CONFIG
// ─────────────────────────────────────────────────────────────────────────────
interface FieldConfig {
  key: string; icon: string; label: string;
  type: string; section: 'personal' | 'professional';
}
const fieldConfig: FieldConfig[] = [
  { key: 'fullName',   icon: personCircleOutline, label: 'Full Name',     type: 'text',  section: 'personal' },
  { key: 'email',      icon: mailOutline,          label: 'Email Address', type: 'email', section: 'personal' },
  { key: 'employeeId', icon: idCardOutline,         label: 'Employee ID',  type: 'text',  section: 'personal' },
  { key: 'department', icon: businessOutline,       label: 'Department',   type: 'text',  section: 'professional' },
  { key: 'role',       icon: briefcaseOutline,      label: 'Role / Title', type: 'text',  section: 'professional' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TYPES / DEFAULTS
// ─────────────────────────────────────────────────────────────────────────────
interface ProfileData {
  fullName: string; email: string; employeeId: string;
  department: string; role: string; profilePhoto: string | null;
}
const DEFAULT_PROFILE: ProfileData = {
  fullName:     'Dr. Mingyu Kim',
  email:        'mingyu@university.edu',
  employeeId:   'UIP-2024-001',
  department:   'Information Technology Department',
  role:         'Senior IT Supervisor',
  profilePhoto: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// LOAD  ── priority: supervisorProfile (durable) > registration seed
// ─────────────────────────────────────────────────────────────────────────────
const loadProfile = (): ProfileData => {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved);           // already saved → always wins

    // First-time: seed from the registered users[] entry
    const username = localStorage.getItem('loggedInUsername');
    if (username) {
      const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find(u => u.username === username);
      if (found) {
        const seeded: ProfileData = {
          fullName:     `${found.firstName ?? ''} ${found.lastName ?? ''}`.trim() || DEFAULT_PROFILE.fullName,
          email:        found.email      ?? DEFAULT_PROFILE.email,
          employeeId:   found.employeeId ?? DEFAULT_PROFILE.employeeId,
          department:   found.department ?? DEFAULT_PROFILE.department,
          role:         DEFAULT_PROFILE.role,
          profilePhoto: found.profilePhoto ?? null,
        };
        // Persist immediately so future loads always hit the saved branch
        localStorage.setItem(PROFILE_KEY, JSON.stringify(seeded));
        return seeded;
      }
    }
  } catch (e) { console.error('EditProfile load error:', e); }
  return { ...DEFAULT_PROFILE };
};

// ─────────────────────────────────────────────────────────────────────────────
// SAVE  ── write to durable key + mirror into users[] + currentUser
// ─────────────────────────────────────────────────────────────────────────────
const saveProfile = (data: ProfileData) => {
  try {
    // 1. Durable profile (survives logout)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));

    // 2. Mirror relevant fields into users[] so Account/Register reads stay consistent
    const username = localStorage.getItem('loggedInUsername');
    if (username) {
      const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
      const idx = users.findIndex(u => u.username === username);
      if (idx !== -1) {
        users[idx].email        = data.email;
        users[idx].profilePhoto = data.profilePhoto;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }

    // 3. Mirror into currentUser for same-session reads (optional but handy)
    const cu = localStorage.getItem('currentUser');
    if (cu) {
      const parsed = JSON.parse(cu);
      parsed.email        = data.email;
      parsed.profilePhoto = data.profilePhoto;
      localStorage.setItem('currentUser', JSON.stringify(parsed));
    }
  } catch (e) { console.error('EditProfile save error:', e); }
};

// ─────────────────────────────────────────────────────────────────────────────
// CROP
// ─────────────────────────────────────────────────────────────────────────────
interface CropState { x: number; y: number; scale: number; }
const CROP_SIZE = 260;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const EditProfile: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData]         = useState<ProfileData>(loadProfile);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSaving, setIsSaving]         = useState(false);
  const [saved, setSaved]               = useState(false);

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
    setFormData(prev => ({ ...prev, profilePhoto: canvas.toDataURL('image/jpeg', 0.92) }));
    setIsCropping(false);
    setRawImageSrc(null);
  }, [rawImageSrc, cropState]);

  const handleChange = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setIsSaving(true);
    saveProfile(formData);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => history.push('/profile'), 900);
    }, 900);
  };

  const personalFields     = fieldConfig.filter(f => f.section === 'personal');
  const professionalFields = fieldConfig.filter(f => f.section === 'professional');

  const renderField = (field: FieldConfig) => {
    const isFocused = focusedField === field.key;
    return (
      <div key={field.key} style={{
        display: 'flex', alignItems: 'center', background: 'var(--c-surface-2)',
        borderRadius: 12,
        border: `1.5px solid ${isFocused ? 'var(--c-purple)' : 'var(--c-border)'}`,
        boxShadow: isFocused ? '0 0 0 3px var(--c-purple-glow)' : 'none',
        overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        <div style={{
          width: 44, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--c-purple)', fontSize: 18, flexShrink: 0,
          background: 'var(--c-surface-3)', borderRight: '1.5px solid var(--c-border)',
        }}>
          <IonIcon icon={field.icon} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 12px' }}>
          <span style={{
            fontSize: 10, fontWeight: 600, color: 'var(--c-text-muted)',
            letterSpacing: '0.8px', textTransform: 'uppercase' as const,
            marginBottom: 2, fontFamily: "'DM Sans', sans-serif",
          }}>{field.label}</span>
          <input
            type={field.type}
            value={formData[field.key as keyof ProfileData] as string ?? ''}
            onChange={e => handleChange(field.key, e.target.value)}
            onFocus={() => setFocusedField(field.key)}
            onBlur={() => setFocusedField(null)}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              fontSize: 14, fontWeight: 500, color: 'var(--c-text-primary)',
              padding: 0, lineHeight: 1.4, fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content">

        <input ref={fileInputRef} type="file" accept="image/*"
          style={{ display: 'none' }} onChange={handleFileChange} />

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
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                    border: '3px solid var(--c-purple)', boxShadow: '0 4px 16px var(--c-purple-glow)',
                  }}>
                    <img src={formData.profilePhoto} alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ) : (
                  <div className="sv-profile-av" style={{ width: 72, height: 72 }}>
                    <IonIcon icon={personCircleOutline} style={{ fontSize: 38 }} />
                  </div>
                )}
                <button className="sv-profile-av-edit"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <IonIcon icon={cameraOutline} />
                </button>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 16,
                  color: 'var(--c-text-primary)', margin: '0 0 2px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                }}>{formData.fullName}</p>
                <p style={{ fontSize: 13, color: 'var(--c-purple)', fontWeight: 600, margin: '0 0 8px' }}>
                  {formData.role}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  <button onClick={() => fileInputRef.current?.click()} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 13px',
                    borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                    border: '1.5px solid var(--c-purple)', background: 'var(--c-purple-glow)',
                    color: 'var(--c-purple)', transition: 'all .18s',
                  }}>
                    <IonIcon icon={imageOutline} style={{ fontSize: 14 }} />
                    {formData.profilePhoto ? 'Change' : 'Upload'}
                  </button>
                  {formData.profilePhoto && (
                    <button onClick={() => setFormData(p => ({ ...p, profilePhoto: null }))} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 13px',
                      borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                      border: '1.5px solid rgba(192,57,43,.25)', background: '#fff0f0',
                      color: '#c0392b', transition: 'all .18s',
                    }}>
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
              {personalFields.map(renderField)}
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
          <button onClick={handleSave} disabled={isSaving || saved} style={{
            width: '100%', padding: 15, borderRadius: 14, border: 'none',
            background: saved
              ? 'linear-gradient(135deg,#10b981,#059669)'
              : 'linear-gradient(135deg,var(--c-purple),var(--c-purple-light))',
            color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: isSaving || saved ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.75 : 1,
            boxShadow: saved ? '0 4px 18px rgba(16,185,129,0.35)' : '0 4px 18px var(--c-purple-glow)',
            transition: 'all 0.3s',
          }}>
            <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: 20 }} />
            <span>{saved ? 'Saved!' : isSaving ? 'Saving…' : 'Save Changes'}</span>
          </button>

        </div>

        {/* Cropper overlay */}
        {isCropping && rawImageSrc && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(10,0,20,0.85)',
            backdropFilter: 'blur(8px)', zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}>
            <style>{`
              .ep-vp{position:relative;border-radius:50%;overflow:hidden;cursor:grab;user-select:none;touch-action:none}
              .ep-vp:active{cursor:grabbing}
              .ep-mask{position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 999px rgba(0,0,0,.65);pointer-events:none;z-index:2}
              .ep-ring{position:absolute;inset:0;border-radius:50%;border:2.5px solid rgba(199,82,240,.75);pointer-events:none;z-index:3}
              .ep-sl{flex:1;-webkit-appearance:none;appearance:none;height:4px;border-radius:99px;background:rgba(255,255,255,.15);outline:none;cursor:pointer}
              .ep-sl::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#c752f0;box-shadow:0 0 0 3px rgba(199,82,240,.3);cursor:pointer}
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
                    <IonIcon icon={cameraOutline} style={{ fontSize: 18, color: '#c752f0' }} />
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
                <div className="ep-vp" style={{ width: CROP_SIZE, height: CROP_SIZE }}
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
                  <div className="ep-mask" /><div className="ep-ring" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 20px 16px' }}>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', fontWeight: 700, userSelect: 'none' }}>–</span>
                <input type="range" min="0.5" max="4" step="0.01" value={cropState.scale}
                  onChange={e => setCropState(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="ep-sl" />
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
      <SupervisorBottomNav activeTab="profile" />
    </IonPage>
  );
};

export default EditProfile;