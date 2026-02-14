import React, { useState } from 'react';
import { IonPage, IonContent, IonText, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, checkmarkCircleOutline, arrowBackOutline } from 'ionicons/icons';

const ForgotPassword: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [usernameTouched, setUsernameTouched] = useState<boolean>(false);
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);
  const [confirmTouched, setConfirmTouched] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const validateUsername = (name: string) => /^[a-zA-Z0-9_]{3,}$/.test(name);
  const validatePassword = (pwd: string) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(pwd);

  const handleReset = () => {
    setUsernameTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);
    setMessage('');
    setError('');

    if (!validateUsername(username)) {
      setError('Enter a valid username (min 3 chars, letters/numbers/_).');
      return;
    }
    if (!validatePassword(newPassword)) {
      setError('Password must be at least 6 characters and include letters, numbers, and a special character.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex((u: any) => u.username === username);
    if (idx === -1) {
      setError('Username not found.');
      return;
    }

    users[idx].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    setMessage('Password updated successfully. Redirecting to login...');
    setTimeout(() => history.push('/login'), 1200);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="forgot-page">
        <div className="auth-container">
          <button className="back-button" onClick={() => history.push('/login')}>
            <IonIcon icon={arrowBackOutline} />
          </button>

          <div className="auth-header">
            <IonText className="title">Forgot Password</IonText>
            <IonText className="subtitle"><br />Reset your password using your username</IonText>
          </div>

          <div className="auth-form">
            <div className={`input-group ${usernameTouched && !validateUsername(username) ? 'input-error' : ''}`}>
              <label className="floating-label">
                <IonIcon icon={personOutline} className="label-icon" />
                Username
              </label>
              <div className="input-container">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setUsernameTouched(true)}
                  placeholder="Enter your username"
                  className={`styled-input ${username && validateUsername(username) ? 'input-valid' : ''}`}
                />
              </div>
            </div>

            <div className={`input-group ${passwordTouched && !validatePassword(newPassword) ? 'input-error' : ''}`}>
              <label className="floating-label">
                <IonIcon icon={lockClosedOutline} className="label-icon" />
                New Password
              </label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onFocus={() => setPasswordTouched(true)}
                  placeholder="Enter new password"
                  className={`styled-input ${validatePassword(newPassword) ? 'input-valid' : ''}`}
                />
                <button className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </button>
              </div>
              {passwordTouched && newPassword.length > 0 && !validatePassword(newPassword) && (
                <IonText className="error-message">Password must be at least 6 characters and include letters, numbers, and a special character</IonText>
              )}
            </div>

            <div className={`input-group ${confirmTouched && (confirmPassword !== newPassword || !validatePassword(confirmPassword)) ? 'input-error' : ''}`}>
              <label className="floating-label">
                <IonIcon icon={lockClosedOutline} className="label-icon" />
                Confirm Password
              </label>
              <div className="input-container">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setConfirmTouched(true)}
                  placeholder="Confirm new password"
                  className={`styled-input ${confirmPassword && confirmPassword === newPassword && validatePassword(confirmPassword) ? 'input-valid' : ''}`}
                />
                <button className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  <IonIcon icon={showConfirm ? eyeOffOutline : eyeOutline} />
                </button>
              </div>
              {confirmTouched && confirmPassword.length > 0 && confirmPassword !== newPassword && (
                <IonText className="error-message">Passwords do not match</IonText>
              )}
            </div>

            <button
              className={`primary-button ${username && newPassword && confirmPassword && validateUsername(username) && validatePassword(newPassword) && newPassword === confirmPassword ? 'button-ready' : ''}`}
              onClick={handleReset}
              disabled={!(username && newPassword && confirmPassword && validateUsername(username) && validatePassword(newPassword) && newPassword === confirmPassword)}
            >
              Reset Password
            </button>

            {error && <IonText className="error-message" style={{ marginTop: 10 }}>{error}</IonText>}
            {message && <IonText className="success-message" style={{ marginTop: 10 }}>{message}</IonText>}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
