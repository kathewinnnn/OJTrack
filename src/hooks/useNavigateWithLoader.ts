import { useRef, useCallback } from 'react';
import { useIonRouter } from '@ionic/react';

export const useNavigateWithLoader = () => {
  const ionRouter = useIonRouter();
  const styleRef  = useRef<HTMLStyleElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);

  const navigate = useCallback(
    (
      path:      string,
      direction: 'forward' | 'back' | 'root' = 'root',
      animation: 'push'   | 'pop' | 'replace' = 'replace'
    ) => {
      if (activeRef.current) return;

      if (!styleRef.current) {
        const s = document.createElement('style');
        s.textContent = css;
        document.head.appendChild(s);
        styleRef.current = s;
      }

      const overlay = document.createElement('div');
      overlay.className = 'nl-overlay';
      overlay.innerHTML = `
        <div class="nl-card">
          <div class="nl-rings">
            <div class="nl-ring nl-ring-a"></div>
            <div class="nl-ring nl-ring-b"></div>
            <div class="nl-ring nl-ring-c"></div>
          </div>
          <div class="nl-dot"></div>
          <span class="nl-label">Loading…</span>
        </div>
      `;
      document.body.appendChild(overlay);
      activeRef.current = overlay;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add('nl-overlay--in'));
      });

      // After overlay is fully opaque, do a HARD location change.
      // This guarantees IonRouterOutlet re-evaluates the route tree
      // regardless of any router state conflicts.
      setTimeout(() => {
        window.location.href = path;
      }, 320);
    },
    [ionRouter]
  );

  return navigate;
};

const css = `
  .nl-overlay {
    position: fixed; inset: 0; z-index: 99999;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #5f0076 0%, #3a003e 55%, #4a4a4a 100%);
    opacity: 0; pointer-events: none;
  }
  .nl-overlay--in { pointer-events: all; animation: nl-enter 0.28s cubic-bezier(0.22,1,0.36,1) forwards; }
  .nl-card { display:flex; flex-direction:column; align-items:center; gap:18px; animation: nl-card-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
  .nl-rings { position:relative; width:64px; height:64px; }
  .nl-ring { position:absolute; border-radius:50%; border:2px solid transparent; }
  .nl-ring-a { inset:0;  border-top-color:rgba(255,255,255,0.90); border-right-color:rgba(255,255,255,0.15); animation:nl-spin 0.70s linear infinite; }
  .nl-ring-b { inset:9px; border-top-color:rgba(255,255,255,0.55); border-left-color:rgba(255,255,255,0.10); animation:nl-spin 0.90s linear infinite reverse; }
  .nl-ring-c { inset:18px; border-top-color:rgba(255,255,255,0.30); animation:nl-spin 1.10s linear infinite; }
  .nl-dot { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:9px; height:9px; border-radius:50%; background:#fff; box-shadow:0 0 14px rgba(255,255,255,0.7); animation:nl-pulse 0.80s ease-in-out infinite; }
  .nl-label { color:rgba(255,255,255,0.65); font-size:0.72rem; letter-spacing:3px; text-transform:uppercase; font-family:'Outfit','Nunito',sans-serif; }
  @keyframes nl-enter    { from{opacity:0} to{opacity:1} }
  @keyframes nl-card-pop { from{opacity:0;transform:scale(0.80)} to{opacity:1;transform:scale(1)} }
  @keyframes nl-spin     { to{transform:rotate(360deg)} }
  @keyframes nl-pulse    { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1} 50%{transform:translate(-50%,-50%) scale(1.45);opacity:0.45} }
`;