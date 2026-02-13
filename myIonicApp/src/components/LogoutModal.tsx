import React, { useEffect, useRef, useCallback } from 'react';
import { IonIcon, IonButton, IonText } from '@ionic/react';
import { logOutOutline, closeOutline, checkmarkOutline, closeCircleOutline } from 'ionicons/icons';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLIonButtonElement>(null);
  const cancelButtonRef = useRef<HTMLIonButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onCancel();
      }
    },
    [isOpen, onCancel]
  );

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Disable body scroll
      document.body.style.overflow = 'hidden';

      // Focus the confirm button after a short delay for animation
      const timer = setTimeout(() => {
        const button = confirmButtonRef.current as unknown as HTMLElement;
        if (button) {
          button.focus();
        }
      }, 100);

      // Add escape key listener
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      // Re-enable body scroll
      document.body.style.overflow = '';

      // Restore focus to the previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, handleKeyDown]);

  // Handle confirm button click
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  // Handle keyboard navigation within modal
  const handleModalKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="logout-modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-message"
    >
      <div
        ref={modalRef}
        className="logout-modal-container"
        onKeyDown={handleModalKeyDown}
      >

        {/* Warning Icon */}
        <div className="logout-modal-icon-wrapper">
          <div className="logout-modal-icon">
            <IonIcon icon={logOutOutline} />
          </div>
        </div>

        {/* Modal Content */}
        <div className="logout-modal-content">
          <IonText className="logout-modal-title" id="logout-modal-title">
            Log Out
          </IonText>
          <IonText
            className="logout-modal-message"
            id="logout-modal-message"
          >
            Are you sure you want to log out?
          </IonText>
        </div>

        {/* Action Buttons */}
        <div className="logout-modal-actions">
          <button
            ref={confirmButtonRef}
            className="logout-modal-btn logout-modal-btn-confirm"
            onClick={handleConfirm}
            disabled={isLoading}
            fill="solid"
            tabIndex={0}
          >
            {isLoading ? (
              <span className="logout-modal-loading">
                <span className="logout-modal-spinner"></span>
                Logging out...
              </span>
            ) : (
              <>
                <IonIcon icon={checkmarkOutline} slot="start" />
                Confirm
              </>
            )}
          </button>
          <button
            ref={cancelButtonRef}
            className="logout-modal-btn logout-modal-btn-cancel"
            onClick={handleCancel}
            disabled={isLoading}
            fill="solid"
            tabIndex={0}
          >
            <IonIcon icon={closeCircleOutline} slot="start" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
