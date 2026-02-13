import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonText, IonImg, IonIcon, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, checkmarkCircleOutline, arrowForwardOutline } from 'ionicons/icons';

interface LoginPageProps {}

const Login: React.FC<LoginPageProps> = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    setIsEmailTouched(true);
    setIsPasswordTouched(true);
    
    const emailValid = validateEmail(email);
    const passwordValid = password.length >= 6;

    setIsEmailValid(emailValid);
    setIsPasswordValid(passwordValid);

    if (emailValid && passwordValid) {
      console.log('Login successful:', { email, password });
      history.push('/dashboard');
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
            {/* Email Input */}
            <div className={`input-group ${isEmailTouched && !isEmailValid ? 'input-error' : ''}`}>
              <label className="floating-label">
                <IonIcon icon={mailOutline} className="label-icon" />
                Email Address
              </label>
              <div className="input-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isEmailTouched) {
                      setIsEmailValid(validateEmail(e.target.value));
                    }
                  }}
                  onFocus={() => setIsEmailTouched(true)}
                  onBlur={() => {
                    setIsEmailValid(validateEmail(email));
                  }}
                  className={`styled-input ${email && validateEmail(email) ? 'input-valid' : ''} ${isEmailTouched && !isEmailValid ? 'input-invalid' : ''}`}
                  placeholder="Enter your email"
                />
                {email && validateEmail(email) && (
                  <IonIcon icon={checkmarkCircleOutline} className="validation-icon success" />
                )}
              </div>
              {isEmailTouched && !isEmailValid && (
                <IonText className="error-message">
                  <IonIcon icon={mailOutline} className="error-icon" />
                  Please enter a valid email address
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
                      setIsPasswordValid(e.target.value.length >= 6);
                    }
                  }}
                  onFocus={() => setIsPasswordTouched(true)}
                  onBlur={() => {
                    setIsPasswordValid(password.length >= 6);
                  }}
                  className={`styled-input ${password.length >= 6 ? 'input-valid' : ''} ${isPasswordTouched && password.length > 0 && password.length < 6 ? 'input-invalid' : ''}`}
                  placeholder="Enter your password"
                />
                <button 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </button>
              </div>
              {isPasswordTouched && password.length > 0 && password.length < 6 && (
                <IonText className="error-message">
                  <IonIcon icon={lockClosedOutline} className="error-icon" />
                  Password must be at least 6 characters
                </IonText>
              )}
            </div>

            {/* Forgot Password */}
            <div className="forgot-password">
              <button 
                className="forgot-link" 
                onClick={() => console.log('Forgot password clicked')}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              className={`login-button ${email && validateEmail(email) && password.length >= 6 ? 'button-ready' : ''}`}
              onClick={handleLogin}
              disabled={!email || !validateEmail(email) || password.length < 6}
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
