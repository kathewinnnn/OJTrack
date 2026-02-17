import React, { useEffect, useRef, useCallback } from 'react';
import { useIonRouter } from '@ionic/react';
import './LogoutModal.css';

interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const ionRouter = useIonRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) onCancel();
    },
    [isOpen, onCancel]
  );

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) onCancel();
  };

  useEffect(() => {
    if (isLoading) {
      // Navigate to login after animation completes
      const timer = setTimeout(() => {
        ionRouter.push('/login');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, ionRouter]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        (confirmButtonRef.current as unknown as HTMLElement)?.focus();
      }, 150);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
  }, [isOpen, handleKeyDown]);

  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
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
        className="lm-container"
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
        <div className="lm-icon-wrap">
          <div className="lm-icon-ring lm-ring-outer" />
          <div className="lm-icon-ring lm-ring-inner" />
          <div className="lm-icon">
            <span className="lm-icon-emoji">🚪</span>
          </div>
        </div>

        {/* Content */}
        <h2 className="lm-title" id="lm-title">Log Out</h2>
        <p className="lm-message" id="lm-message">
          Are you sure you want to end your current session?
        </p>

        {/* Divider */}
        <div className="lm-divider" />

        {/* Buttons */}
        <div className="lm-actions">
          <button
            ref={confirmButtonRef}
            className="lm-btn lm-btn-confirm"
            onClick={() => !isLoading && onConfirm()}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="lm-loading-row">
                <span className="lm-spinner" />
                Logging out…
              </span>
            ) : (
              <>
                <span className="lm-btn-icon lm-btn-icon-confirm">✓</span>
                Confirm
              </>
            )}
          </button>

          <button
            className="lm-btn lm-btn-cancel"
            onClick={() => !isLoading && onCancel()}
            disabled={isLoading}
          >
            <span className="lm-btn-icon lm-btn-icon-cancel">✕</span>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
