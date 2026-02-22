import React, { useEffect, useRef } from 'react';
import { IonContent, IonPage, useIonRouter } from '@ionic/react';

const SPLASH_DURATION = 2800; // ms — must match sp-bar-grow CSS duration below

const Splash: React.FC = () => {
  const ionRouter    = useIonRouter();   // ✅ useIonRouter instead of useHistory
  const hasNavigated = useRef(false);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const timer = setTimeout(() => {
      if (hasNavigated.current) return;
      hasNavigated.current = true;
      // 'root' clears history stack, 'replace' = instant (no slide animation)
      ionRouter.push('/login', 'root', 'replace');
    }, SPLASH_DURATION);

    return () => {
      clearTimeout(timer);
      styleEl.parentNode?.removeChild(styleEl);
    };
  }, [ionRouter]);

  return (
    <IonPage>
      <IonContent fullscreen className="sp-content">
        <div className="sp-bg">
          <div className="sp-orb sp-orb-1" />
          <div className="sp-orb sp-orb-2" />
          <div className="sp-orb sp-orb-3" />
        </div>

        <div className="sp-body">
          <div className="sp-logo-wrap">
            <div className="sp-logo-ring sp-ring-outer" />
            <div className="sp-logo-ring sp-ring-inner" />
            <div className="sp-logo-circle">
              <span className="sp-logo-emoji">📊</span>
            </div>
          </div>

          <h1 className="sp-title">OJTrack</h1>
          <p className="sp-tagline">Track Your OJT Progress</p>

          <div className="sp-bar-wrap">
            <div className="sp-bar-track">
              <div className="sp-bar-fill" />
            </div>
            <span className="sp-bar-label">Loading…</span>
          </div>
        </div>

        <span className="sp-version">Version 1.0.0</span>
      </IonContent>
    </IonPage>
  );
};

export default Splash;

const styles = `
  .sp-content { --background: transparent; overflow: hidden; }

  .sp-bg {
    position: fixed; inset: 0; z-index: 0;
    background: linear-gradient(135deg, #5f0076 0%, #3a003e 50%, #4a4a4a 100%);
  }
  .sp-orb { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.35; }
  .sp-orb-1 { width:340px;height:340px;background:#8b00a8;top:-100px;right:-80px;animation:sp-drift 6s ease-in-out infinite alternate; }
  .sp-orb-2 { width:260px;height:260px;background:#6b6b6b;bottom:-60px;left:-60px;animation:sp-drift 8s ease-in-out infinite alternate-reverse; }
  .sp-orb-3 { width:180px;height:180px;background:#5f0076;top:40%;left:30%;animation:sp-drift 5s ease-in-out infinite alternate; }
  @keyframes sp-drift { from{transform:translate(0,0) scale(1)} to{transform:translate(20px,30px) scale(1.08)} }

  .sp-body { position:relative;z-index:1;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem; }

  .sp-logo-wrap { position:relative;width:120px;height:120px;display:flex;align-items:center;justify-content:center;margin-bottom:28px;animation:sp-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) both; }
  .sp-logo-ring { position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,0.2); }
  .sp-ring-outer { inset:-14px;animation:sp-rotate 8s linear infinite; }
  .sp-ring-inner { inset:-6px;border-style:dashed;border-color:rgba(255,255,255,0.12);animation:sp-rotate 5s linear infinite reverse; }
  .sp-logo-circle { width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 40px rgba(0,0,0,0.25);animation:sp-pulse 2.4s ease-in-out infinite; }
  .sp-logo-emoji { font-size:3rem;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.3)); }

  .sp-title { color:#fff;font-size:2.6rem;font-weight:800;letter-spacing:3px;margin:0 0 6px;text-shadow:0 2px 16px rgba(0,0,0,0.25);animation:sp-fade-up 0.7s ease 0.25s both; }
  .sp-tagline { color:rgba(255,255,255,0.70);font-size:0.95rem;font-weight:400;letter-spacing:0.5px;margin:0 0 52px;animation:sp-fade-up 0.7s ease 0.4s both; }

  .sp-bar-wrap { display:flex;flex-direction:column;align-items:center;gap:10px;animation:sp-fade-up 0.7s ease 0.55s both; }
  .sp-bar-track { width:180px;height:4px;background:rgba(255,255,255,0.18);border-radius:99px;overflow:hidden; }
  .sp-bar-fill { height:100%;width:0%;border-radius:99px;background:linear-gradient(90deg,rgba(255,255,255,0.6) 0%,#fff 100%);box-shadow:0 0 10px rgba(255,255,255,0.5);animation:sp-bar-grow 2.8s cubic-bezier(0.4,0,0.2,1) forwards; }
  .sp-bar-label { color:rgba(255,255,255,0.55);font-size:0.75rem;letter-spacing:3px;text-transform:uppercase; }

  .sp-version { position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:1;color:rgba(255,255,255,0.35);font-size:0.72rem;letter-spacing:1px;animation:sp-fade 1s ease 1s both; }

  @keyframes sp-pop { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
  @keyframes sp-fade-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes sp-fade { from{opacity:0} to{opacity:1} }
  @keyframes sp-pulse { 0%,100%{transform:scale(1);box-shadow:0 8px 40px rgba(0,0,0,0.25)} 50%{transform:scale(1.05);box-shadow:0 12px 56px rgba(0,0,0,0.35)} }
  @keyframes sp-rotate { to{transform:rotate(360deg)} }
  @keyframes sp-bar-grow { 0%{width:0%} 100%{width:100%} }
`;