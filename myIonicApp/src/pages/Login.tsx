import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonText, IonImg, IonIcon, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, checkmarkCircleOutline, arrowForwardOutline } from 'ionicons/icons';

interface LoginPageProps {}

const Login: React.FC<LoginPageProps> = () => {
  const history = useHistory();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isUsernameTouched, setIsUsernameTouched] = useState<boolean>(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);

  const validateUsername = (name: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/; // at least 3 chars, letters/numbers/underscore
    return usernameRegex.test(name);
  };

  const validatePassword = (pwd: string): boolean => {
    const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/; // min 6, at least one letter, one number, one special char
    return pwdRegex.test(pwd);
  };

  const [loginError, setLoginError] = useState<string>('');

  const handleLogin = () => {
    setIsUsernameTouched(true);
    setIsPasswordTouched(true);
    
    const usernameValid = validateUsername(username);
    const passwordValid = validatePassword(password);

    setIsUsernameValid(usernameValid);
    setIsPasswordValid(passwordValid);

    setLoginError('');

    if (usernameValid && passwordValid) {
      if (username === 'admin' && password === 'admin123_') {
        const adminUser = { username: 'admin', role: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        history.push('/admin/dashboard');
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const match = users.find((u: any) => u.username === username && u.password === password);
        if (match) {
          console.log('Login successful:', { username, role: match.role });
          localStorage.setItem('currentUser', JSON.stringify(match));
          if (match.role === 'supervisor') {
            history.push('/supervisor-dashboard');
          } else {
            history.push('/dashboard');
          }
        } else {
          setLoginError('Invalid username or password');
        }
      }
    }
  };

  const handleGoBack = () => {
    history.push('/');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-page">
        {/* Background */}
        <div className="login-background">
          <div className="bg-gradient"></div>
          <div className="bg-shape bg-shape-1"></div>
          <div className="bg-shape bg-shape-2"></div>
        </div>

        {/* Login Content */}
        <div className="login-container">
          {/* Header */}
          <div className="login-header">
            <div className="logo-wrapper">
                <IonImg src="/logo.png" alt="OJTrack Logo" className="logo-image" />
            </div>
            <IonText className="header-text">
              <h1 className="title">Welcome Back</h1>
              <p className="subtitle">Log in to continue to OJTrack</p>
            </IonText>
          </div>

          {/* Form */}
          <div className="login-form">
            {/* Username Input */}
            <div className={`input-group ${isUsernameTouched && !isUsernameValid ? 'input-error' : ''}`}>
              <label className="floating-label">
                <IonIcon icon={personOutline} className="label-icons" />
                Username
              </label>
              <div className="input-container">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (isUsernameTouched) {
                      setIsUsernameValid(validateUsername(e.target.value));
                    }
                  }}
                  onFocus={() => setIsUsernameTouched(true)}
                  onBlur={() => {
                    setIsUsernameValid(validateUsername(username));
                  }}
                  className={`styled-input ${username && validateUsername(username) ? 'input-valid' : ''} ${isUsernameTouched && !isUsernameValid ? 'input-invalid' : ''}`}
                  placeholder="Enter your username"
                />
                {username && validateUsername(username) && (
                  <IonIcon icon={checkmarkCircleOutline} className="validation-icon success" />
                )}
              </div>
              {isUsernameTouched && !isUsernameValid && (
                <IonText className="error-message">
                  Username must be at least 3 characters and contain only letters, numbers, or _
                </IonText>
              )}
            </div>

            {/* Password Input */}
            <div className={`input-group ${isPasswordTouched && !isPasswordValid ? 'input-error' : ''}`}>
              <label className="floating-label">
                <IonIcon icon={lockClosedOutline} className="label-icon" />
                Password
              </label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isPasswordTouched) {
                      setIsPasswordValid(validatePassword(e.target.value));
                    }
                  }}
                  onFocus={() => setIsPasswordTouched(true)}
                  onBlur={() => {
                    setIsPasswordValid(validatePassword(password));
                  }}
                  className={`styled-input ${validatePassword(password) ? 'input-valid' : ''} ${isPasswordTouched && password.length > 0 && !validatePassword(password) ? 'input-invalid' : ''}`}
                  placeholder="Enter your password"
                />
                <button 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </button>
              </div>
              {isPasswordTouched && password.length > 0 && !validatePassword(password) && (
                <IonText className="error-message">
                  Password must be at least 6 characters and include letters, numbers, and a special character
                </IonText>
              )}
            </div>

            {loginError && (
              <IonText className="error-message" style={{ marginTop: 8 }}>
                {loginError}
              </IonText>
            )}

            {/* Forgot Password */}
            <div className="forgot-password">
              <button 
                className="forgot-link" 
                onClick={() => history.push('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              className={`login-button ${username && validateUsername(username) && validatePassword(password) ? 'button-ready' : ''}`}
              onClick={handleLogin}
              disabled={!username || !validateUsername(username) || !validatePassword(password)}
            >
              <span>Log In</span>
              <IonIcon icon={arrowForwardOutline} className="button-icon" />
            </button>

            {/* Register Link */}
            <div className="register-section">
              <IonText className="register-text">
                Don't have an account?{' '}
                <span className="register-link" onClick={() => history.push('/register')}>
                  Sign Up
                </span>
              </IonText>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
