import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import {
  documentTextOutline, closeOutline, checkmarkCircleOutline,
  arrowForwardOutline, checkmarkOutline,
} from 'ionicons/icons';

// ─────────────────────────────────────────────────────────────────────────────
// Terms content — single source of truth
// ─────────────────────────────────────────────────────────────────────────────
export const TERMS_SECTIONS: [string, string][] = [
  ['1. Acceptance of Terms',       'By creating an account on OJTrack, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you may not use our service.'],
  ['2. User Accounts',             'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration.\n\nYou must not share your login credentials with any third party. OJTrack reserves the right to suspend or terminate accounts that violate these terms.'],
  ['3. Use of the Platform',       'OJTrack is intended solely for on-the-job training (OJT) management. Prohibited activities include submitting false attendance records, impersonating another user, or attempting unauthorised access.'],
  ['4. Privacy & Data Collection', 'We collect personal information such as your name, email, student/employee ID, and profile photo for the purpose of operating OJTrack. Your data will not be sold to third parties.\n\nBy registering, you consent to data collection per our Privacy Policy.'],
  ['5. Student Responsibilities',  'Students must accurately log their OJT hours and submit timely reports. Falsification of records may result in permanent account suspension.'],
  ['6. Supervisor Responsibilities','Supervisors must review and validate student submissions honestly and fairly.'],
  ['7. Intellectual Property',     'All content and features of OJTrack are the exclusive property of OJTrack and protected by applicable intellectual property laws.'],
  ['8. Limitation of Liability',   'OJTrack shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.'],
  ['9. Modifications to Terms',    'OJTrack may modify these Terms at any time. Continued use after changes constitutes acceptance of the revised terms.'],
  ['10. Contact',                  'Questions? Contact the OJTrack system administrator at your institution.'],
];

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface TermsModalProps {
  onClose: () => void;
  /**
   * 'register' — shows scroll-to-unlock banner, checkbox, and "I Agree & Create Account" button.
   * 'view'     — read-only, shows only a "Got it" close button. (default)
   */
  mode?: 'register' | 'view';
  /** Only used in register mode */
  onAccept?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const TermsModal: React.FC<TermsModalProps> = ({ onClose, mode = 'view', onAccept }) => {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [accepted, setAccepted]           = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) setScrolledToEnd(true);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 540, background: '#fff',
        borderRadius: '20px 20px 0 0', maxHeight: '88vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
        animation: 'termsSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <style>{`
          @keyframes termsSlideUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 0', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:'#F3E6F8', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IonIcon icon={documentTextOutline} style={{ fontSize:18, color:'#5f0076' }} />
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'#111827' }}>Terms &amp; Conditions</div>
              <div style={{ fontSize:11.5, color:'#9CA3AF' }}>
                {mode === 'register' ? 'Read carefully before creating your account' : 'OJTrack policies and guidelines'}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, color:'#6B7280', cursor:'pointer', display:'flex', padding:4 }}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        {/* ── Scroll hint (register only) ── */}
        {mode === 'register' && (
          <div style={{
            margin:'12px 20px 0', padding:'8px 14px', borderRadius:8, flexShrink:0,
            display:'flex', alignItems:'center', gap:8, fontSize:12, transition:'all 0.3s',
            background: scrolledToEnd ? 'rgba(34,197,94,0.08)' : 'rgba(95,0,118,0.07)',
            border: `1px solid ${scrolledToEnd ? 'rgba(34,197,94,0.25)' : 'rgba(95,0,118,0.2)'}`,
            color: scrolledToEnd ? '#16A34A' : '#5f0076',
          }}>
            <IonIcon icon={scrolledToEnd ? checkmarkCircleOutline : arrowForwardOutline}
              style={{ fontSize:14, transform:scrolledToEnd?'none':'rotate(90deg)', transition:'transform 0.3s' }} />
            {scrolledToEnd ? "You've finished reading — you may now accept below" : 'Scroll to the bottom to unlock the agreement checkbox'}
          </div>
        )}

        {/* ── Scrollable content ── */}
        <div style={{ overflowY:'auto', flex:1, padding:'14px 20px 8px' }} onScroll={mode === 'register' ? handleScroll : undefined}>
          {TERMS_SECTIONS.map(([title, body], i, arr) => (
            <div key={i} style={{ paddingBottom:16, marginBottom:16, borderBottom:i<arr.length-1?'1px solid #F3F4F6':'none' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#5f0076', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:7 }}>{title}</div>
              {body.split('\n\n').map((para, j, parts) => (
                <p key={j} style={{ fontSize:13, color:'#4B5563', lineHeight:1.75, marginBottom:j<parts.length-1?8:0 }}>{para}</p>
              ))}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding:'12px 20px 24px', borderTop:'1px solid #F3F4F6', flexShrink:0 }}>
          {mode === 'register' ? (
            <>
              <label style={{
                display:'flex', alignItems:'flex-start', gap:11, marginBottom:14,
                cursor:scrolledToEnd?'pointer':'default',
                opacity:scrolledToEnd?1:0.38,
                pointerEvents:scrolledToEnd?'auto':'none',
                transition:'opacity 0.25s',
              }}>
                <div onClick={() => scrolledToEnd && setAccepted(v => !v)}
                  style={{
                    width:20, height:20, borderRadius:5, flexShrink:0, marginTop:1,
                    border:`2px solid ${accepted?'#5f0076':'#D1D5DB'}`,
                    background:accepted?'#5f0076':'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s',
                  }}>
                  {accepted && <IonIcon icon={checkmarkOutline} style={{ color:'#fff', fontSize:13 }} />}
                </div>
                <span style={{ fontSize:13, color:'#374151', lineHeight:1.55 }}>
                  I have read and agree to the <strong style={{ color:'#111827' }}>Terms and Conditions</strong>
                </span>
              </label>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={onClose}
                  style={{ flex:1, padding:'12px', background:'#F9FAFB', border:'1.5px solid #E5E7EB', borderRadius:10, color:'#6B7280', fontFamily:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                  Decline
                </button>
                <button onClick={() => accepted && onAccept?.()} disabled={!accepted}
                  style={{
                    flex:2, padding:'12px', display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                    background:accepted?'#5f0076':'#E5E7EB', border:'none', borderRadius:10,
                    color:accepted?'#fff':'#9CA3AF', fontFamily:'inherit', fontSize:14, fontWeight:700,
                    cursor:accepted?'pointer':'default', transition:'background 0.2s, color 0.2s',
                  }}>
                  <IonIcon icon={checkmarkCircleOutline} /> I Agree &amp; Create Account
                </button>
              </div>
            </>
          ) : (
            <button onClick={onClose} style={{
              width:'100%', padding:'13px',
              background:'linear-gradient(135deg, #5f0076, #9e00c2)',
              border:'none', borderRadius:12,
              color:'#fff', fontFamily:'inherit', fontSize:15, fontWeight:700,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              <IonIcon icon={checkmarkCircleOutline} /> Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsModal;