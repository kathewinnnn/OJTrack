import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LogoutModal.css';

interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  onComplete?: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
  onComplete,
}) => {
  const history = useHistory();
  const [navigateToLogin, setNavigateToLogin] = useState(false);
  const modalRef         = useRef<HTMLDivElement>(null);
  const confirmButtonRef   = useRef<HTMLButtonElement>(null);
  const previousActiveEl   = useRef<HTMLElement | null>(null);
  const hasNavigatedRef    = useRef(false);
  const timerRef           = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) onCancel();
    },
    [isOpen, isLoading, onCancel]
  );

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !isLoading) onCancel();
  };

  /* ── Wait for the progress-bar animation, THEN navigate ── */
  useEffect(() => {
    // Not loading — clear everything and reset the guard
    if (!isLoading) {
      if (timerRef.current) clearTimeout(timerRef.current);
      hasNavigatedRef.current = false;
      return;
    }

    // Already scheduled — don't double-fire
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    timerRef.current = setTimeout(() => {
      // Cleanup auth state before leaving
      onComplete?.();
      // Set state to trigger navigation - this ensures the component re-renders properly
      setNavigateToLogin(true);
    }, 1500); // ← must equal the CSS animation duration in LogoutModal.css

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLoading, onComplete]);

  /* ── Handle navigation when state changes ── */
  useEffect(() => {
    if (navigateToLogin) {
      history.replace('/login');
    }
  }, [navigateToLogin, history]);

  /* ── Focus management ── */
  useEffect(() => {
    if (isOpen) {
      previousActiveEl.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => confirmButtonRef.current?.focus(), 150);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(t);
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      previousActiveEl.current?.focus();
      hasNavigatedRef.current = false;
    }
  }, [isOpen, handleKeyDown]);

  /* ── Tab trap ── */
  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="lm-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lm-title"
      aria-describedby="lm-message"
    >
      <div
        ref={modalRef}
        className={`lm-container${isLoading ? ' lm-container--loading' : ''}`}
        onKeyDown={handleModalKeyDown}
      >
        {/* Close × */}
        <button
          className="lm-close-btn"
          onClick={onCancel}
          disabled={isLoading}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Icon */}
        <div className={`lm-icon-wrap${isLoading ? ' lm-icon-wrap--spin' : ''}`}>
          <div className="lm-icon-ring lm-ring-outer" />
          <div className="lm-icon-ring lm-ring-inner" />
          <div className="lm-icon">
            <span className="lm-icon-emoji">{isLoading ? '👋' : '🚪'}</span>
          </div>
        </div>

        {/* Content */}
        <h2 className="lm-title" id="lm-title">
          {isLoading ? 'Logging out…' : 'Log Out'}
        </h2>
        <p className="lm-message" id="lm-message">
          {isLoading
            ? 'Please wait while we end your session.'
            : 'Are you sure you want to end your current session?'}
        </p>

        {/* Progress bar — only during loading */}
        {isLoading && (
          <div className="lm-progress-track">
            <div className="lm-progress-fill" />
          </div>
        )}

        {/* Divider + buttons — hidden during loading */}
        {!isLoading && <div className="lm-divider" />}
        {!isLoading && (
          <div className="lm-actions">
            <button
              ref={confirmButtonRef}
              className="lm-btn lm-btn-confirm"
              onClick={onConfirm}
            >
              <span className="lm-btn-icon lm-btn-icon-confirm">✓</span>
              Confirm
            </button>
            <button className="lm-btn lm-btn-cancel" onClick={onCancel}>
              <span className="lm-btn-icon lm-btn-icon-cancel">✕</span>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoutModal;
