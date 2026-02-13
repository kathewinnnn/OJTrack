import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonText, IonIcon, IonLabel, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { mailOutline, lockClosedOutline, personOutline, eyeOutline, eyeOffOutline, checkmarkCircleOutline, arrowBackOutline, arrowForwardOutline, schoolOutline, briefcaseOutline, alertCircleOutline } from 'ionicons/icons';

interface RegisterPageProps {}

type UserRole = 'student' | 'supervisor' | null;

// Username check flow: 'role' -> 'username' -> 'form'
type RegistrationStep = 'role' | 'username' | 'form';

const Register: React.FC<RegisterPageProps> = () => {
  const history = useHistory();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('role');
  
  // Username check states
  const [username, setUsername] = useState<string>('');
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  
  // Common fields
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Student-specific fields
  const [studentId, setStudentId] = useState<string>('');
  const [program, setProgram] = useState<string>('');
  const [year, setYear] = useState<string>('');
  
  // Supervisor-specific fields
  const [employeeId, setEmployeeId] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  
  // Validation states
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean>(true);
  
  // Touched states
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState<boolean>(false);
  const [isStudentIdTouched, setIsStudentIdTouched] = useState<boolean>(false);
  const [isProgramTouched, setIsProgramTouched] = useState<boolean>(false);
  const [isYearTouched, setIsYearTouched] = useState<boolean>(false);
  const [isEmployeeIdTouched, setIsEmployeeIdTouched] = useState<boolean>(false);
  const [isDepartmentTouched, setIsDepartmentTouched] = useState<boolean>(false);

  // Simulated username check - in a real app, this would call your backend API
  const checkUsernameUnique = async (usernameToCheck: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated taken usernames for demo
    const takenUsernames = ['admin', 'test', 'demo', 'user123', 'existing'];
    return !takenUsernames.includes(usernameToCheck.toLowerCase());
  };

  const validateEmail = (emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const validatePassword = (pwd: string): boolean => {
    return pwd.length >= 6;
  };

  const handleRegister = () => {
    setIsEmailTouched(true);
    setIsPasswordTouched(true);
    setIsConfirmPasswordTouched(true);
    
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const confirmPasswordValid = confirmPassword === password && validatePassword(confirmPassword);

    setIsEmailValid(emailValid);
    setIsPasswordValid(passwordValid);
    setIsConfirmPasswordValid(confirmPasswordValid);

    if (selectedRole === 'student') {
      setIsStudentIdTouched(true);
      setIsProgramTouched(true);
      setIsYearTouched(true);
      const isValid = emailValid && passwordValid && confirmPasswordValid && studentId.length >= 5 && program.length >= 2 && year.length > 0;
      if (isValid) {
        console.log('Student registration successful');
        history.push('/login');
      }
    } else if (selectedRole === 'supervisor') {
      setIsEmployeeIdTouched(true);
      setIsDepartmentTouched(true);
      const isValid = emailValid && passwordValid && confirmPasswordValid && employeeId.length >= 3 && department.length >= 2;
      if (isValid) {
        console.log('Supervisor registration successful');
        history.push('/login');
      }
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setRegistrationStep('username');
  };

  const handleUsernameCheck = async () => {
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return;
    }
    
    setIsCheckingUsername(true);
    setUsernameError('');
    
    try {
      const isUnique = await checkUsernameUnique(username);
      if (isUnique) {
        setUsernameAvailable(true);
        setTimeout(() => {
          setRegistrationStep('form');
        }, 800);
      } else {
        setUsernameAvailable(false);
        setUsernameError('This username is already taken');
      }
    } catch (error) {
      setUsernameError('Error checking username. Please try again.');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleBackFromUsername = () => {
    setSelectedRole(null);
    setRegistrationStep('role');
    setUsername('');
    setUsernameError('');
    setUsernameAvailable(null);
  };

  const handleBack = () => {
    if (registrationStep === 'form') {
      setRegistrationStep('username');
    } else if (registrationStep === 'username') {
      handleBackFromUsername();
    } else {
      history.push('/login');
    }
  };

  // Render role selection
  const renderRoleSelection = () => (
    <div className="role-selection-container">
      <div className="role-header">
        <div className="logo-wrapper">
          <div className="logo-circle">
            <span className="logo-icon">📊</span>
          </div>
        </div>
        <IonText className="header-text">
          <h1 className="title">Join OJTrack</h1>
          <p className="subtitle">Select your role to get started</p>
        </IonText>
      </div>

      <div className="role-cards">
        {/* Student Card */}
        <button
          className={`role-card ${selectedRole === 'student' ? 'role-selected' : ''}`}
          onClick={() => handleRoleSelect('student')}
        >
          <div className="role-card-icon student-icon">
            <IonIcon icon={schoolOutline} />
          </div>
          <IonText className="role-card-text">
            <h3>Student</h3>
            <p>Track your OJT hours and submit reports</p>
          </IonText>
          <IonIcon icon={arrowForwardOutline} className="role-card-arrow" />
        </button>

        {/* Supervisor Card */}
        <button
          className={`role-card ${selectedRole === 'supervisor' ? 'role-selected' : ''}`}
          onClick={() => handleRoleSelect('supervisor')}
        >
          <div className="role-card-icon supervisor-icon">
            <IonIcon icon={briefcaseOutline} />
          </div>
          <IonText className="role-card-text">
            <h3>Supervisor</h3>
            <p>Manage students and review their progress</p>
          </IonText>
          <IonIcon icon={arrowForwardOutline} className="role-card-arrow" />
        </button>
      </div>

      <div className="login-link-section">
        <IonText className="login-text">
          Already have an account?{' '}
          <span className="login-link" onClick={() => history.push('/login')}>
            Log In
          </span>
        </IonText>
      </div>
    </div>
  );

  // Render username check form
  const renderUsernameCheck = () => (
    <div className="username-check-container">
      {/* Back Button */}
      <button className="back-button" onClick={handleBackFromUsername}>
        <IonIcon icon={arrowBackOutline} />
      </button>

      {/* Header */}
      <div className="register-header">
        <IonText className="header-text">
          <h1 className="title">Choose Username</h1>
          <p className="subtitle">
            Create a unique username for your{' '}
            {selectedRole === 'student' ? 'student' : 'supervisor'} account
          </p>
        </IonText>
      </div>

      {/* Username Input */}
      <div className="register-form">
        <div className={`input-group ${usernameError ? 'input-error' : ''}`}>
          <label className="floating-label">
            <IonIcon icon={personOutline} className="label-icon" />
            Username
          </label>
          <div className="input-container">
            <input
              type="text"
              value={username}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                setUsername(value);
                setUsernameError('');
                setUsernameAvailable(null);
              }}
              className={`styled-input ${username && !usernameError && usernameAvailable === true ? 'input-valid' : ''} ${usernameError ? 'input-invalid' : ''}`}
              placeholder="Choose a unique username"
              disabled={isCheckingUsername}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isCheckingUsername) {
                  handleUsernameCheck();
                }
              }}
            />
            {username && usernameAvailable === true && (
              <IonIcon icon={checkmarkCircleOutline} className="validation-icon success" />
            )}
            {usernameError && (
              <IonIcon icon={alertCircleOutline} className="validation-icon error" />
            )}
          </div>
          {usernameError && (
            <IonText className="error-message">{usernameError}</IonText>
          )}
        </div>

        {/* Username Tips */}
        <div className="username-tips">
          <IonText className="tips-title">Username must:</IonText>
          <ul className="tips-list">
            <li className={username.length >= 3 ? 'tip-done' : ''}>Be at least 3 characters</li>
            <li className={/^[a-zA-Z0-9_]+$/.test(username) && username.length > 0 ? 'tip-done' : ''}>Contain only letters, numbers, and underscores</li>
            <li className={usernameAvailable === true ? 'tip-done' : ''}>Be unique (not taken)</li>
          </ul>
        </div>

        {/* Check Availability Button */}
        <button
          className={`register-button ${
            username.length >= 3 && !usernameError && usernameAvailable === true ? 'button-ready' : ''
          }`}
          onClick={handleUsernameCheck}
          disabled={username.length < 3 || isCheckingUsername}
        >
          {isCheckingUsername ? (
            <IonLoading message="Checking..." spinner="circular" />
          ) : usernameAvailable === true ? (
            <>
              <span>Username Available!</span>
              <IonIcon icon={checkmarkCircleOutline} className="button-icon" />
            </>
          ) : (
            <>
              <span>Check Availability</span>
              <IonIcon icon={arrowForwardOutline} className="button-icon" />
            </>
          )}
        </button>

        {/* Continue Button (shown when username is available) */}
        {usernameAvailable === true && (
          <button
            className="continue-button"
            onClick={() => setRegistrationStep('form')}
          >
            <IonText className="continue-text">
              Continue to registration <IonIcon icon={arrowForwardOutline} />
            </IonText>
          </button>
        )}
      </div>
    </div>
  );

  // Render registration form
  const renderForm = () => (
    <div className="register-container">

      {/* Back Button */}
      <button className="back-button" onClick={handleBack}>
        <IonIcon icon={arrowBackOutline} />
      </button>

      {/* Header */}
      <div className="register-header">
        <IonText className="header-text">
          <h1 className="title">
            {selectedRole === 'student' ? 'Student Registration' : 'Supervisor Registration'}
          </h1>
          <p className="subtitle">Complete your account setup</p>
        </IonText>
      </div>

      {/* Username Display */}
      <div className="username-display">
        <IonIcon icon={personOutline} className="username-icon" />
        <IonText className="username-value">@{username}</IonText>
        <button 
          className="change-username-btn"
          onClick={() => {
            setRegistrationStep('username');
            setUsernameAvailable(null);
          }}
        >
          Change
        </button>
      </div>

      {/* Form */}
      <div className="register-form">
        {/* Full Name */}
        <div className="input-group">
          <label className="floating-label">
            <IonIcon icon={personOutline} className="label-icon" />
            Full Name
          </label>
          <div className="input-container">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="styled-input"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div className={`input-group ${isEmailTouched && !isEmailValid ? 'input-error' : ''}`}>
          <label className="floating-label">
            <IonIcon icon={mailOutline} className="label-icon" />
            Email
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
              onBlur={() => setIsEmailValid(validateEmail(email))}
              className={`styled-input ${email && validateEmail(email) ? 'input-valid' : ''} ${isEmailTouched && !isEmailValid ? 'input-invalid' : ''}`}
              placeholder="Enter your email"
            />
            {email && validateEmail(email) && (
              <IonIcon icon={checkmarkCircleOutline} className="validation-icon success" />
            )}
          </div>
          {isEmailTouched && !isEmailValid && (
            <IonText className="error-message">Please enter a valid email address</IonText>
          )}
        </div>

        {/* Student-specific fields */}
        {selectedRole === 'student' && (
          <>
            <div className="input-group">
              <label className="floating-label">Student ID</label>
              <div className="input-container">
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  onFocus={() => setIsStudentIdTouched(true)}
                  className={`styled-input ${isStudentIdTouched && studentId.length < 5 ? 'input-invalid' : ''}`}
                  placeholder="Enter your student ID"
                />
              </div>
              {isStudentIdTouched && studentId.length > 0 && studentId.length < 5 && (
                <IonText className="error-message">Student ID must be at least 5 characters</IonText>
              )}
            </div>

            <div className="input-group">
              <label className="floating-label">Program/Course</label>
              <div className="input-container">
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  onFocus={() => setIsProgramTouched(true)}
                  className={`styled-input ${isProgramTouched && program.length < 2 ? 'input-invalid' : ''}`}
                  placeholder="Enter your program"
                />
              </div>
            </div>

            {/* Year Level Dropdown */}
            <div className="input-group">
              <label className="floating-label">Select Level</label>
              <div className="input-container">
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setIsYearTouched(true);
                  }}
                  onFocus={() => setIsYearTouched(true)}
                  className={`styled-input ${isYearTouched && year.length === 0 ? 'input-invalid' : ''}`}
                >
                  <option value="">Select your year level</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              {isYearTouched && year.length === 0 && (
                <IonText className="error-message">Please select your year level</IonText>
              )}
            </div>
          </>
        )}

        {/* Supervisor-specific fields */}
        {selectedRole === 'supervisor' && (
          <>
            <div className="input-group">
              <label className="floating-label">Employee ID</label>
              <div className="input-container">
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  onFocus={() => setIsEmployeeIdTouched(true)}
                  className={`styled-input ${isEmployeeIdTouched && employeeId.length < 3 ? 'input-invalid' : ''}`}
                  placeholder="Enter your employee ID"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="floating-label">Department</label>
              <div className="input-container">
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  onFocus={() => setIsDepartmentTouched(true)}
                  className={`styled-input ${isDepartmentTouched && department.length < 2 ? 'input-invalid' : ''}`}
                  placeholder="Enter your department"
                />
              </div>
            </div>
          </>
        )}

        {/* Password */}
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
              onBlur={() => setIsPasswordValid(validatePassword(password))}
              className={`styled-input ${password.length >= 6 ? 'input-valid' : ''} ${isPasswordTouched && password.length > 0 && password.length < 6 ? 'input-invalid' : ''}`}
              placeholder="Create a password"
            />
            <button 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
            </button>
          </div>
          {isPasswordTouched && password.length > 0 && password.length < 6 && (
            <IonText className="error-message">Password must be at least 6 characters</IonText>
          )}
        </div>

        {/* Confirm Password */}
        <div className={`input-group ${isConfirmPasswordTouched && !isConfirmPasswordValid ? 'input-error' : ''}`}>
          <label className="floating-label">
            <IonIcon icon={lockClosedOutline} className="label-icon" />
            Confirm Password
          </label>
          <div className="input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (isConfirmPasswordTouched) {
                  setIsConfirmPasswordValid(e.target.value === password && validatePassword(e.target.value));
                }
              }}
              onFocus={() => setIsConfirmPasswordTouched(true)}
              onBlur={() => setIsConfirmPasswordValid(confirmPassword === password && validatePassword(confirmPassword))}
              className={`styled-input ${confirmPassword && confirmPassword === password ? 'input-valid' : ''} ${isConfirmPasswordTouched && confirmPassword.length > 0 && confirmPassword !== password ? 'input-invalid' : ''}`}
              placeholder="Confirm your password"
            />
            <button 
              className="password-toggle" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
            </button>
          </div>
          {isConfirmPasswordTouched && confirmPassword.length > 0 && confirmPassword !== password && (
            <IonText className="error-message">Passwords do not match</IonText>
          )}
        </div>

        {/* Register Button */}
        <button
          className={`register-button ${
            email && validateEmail(email) && 
            password.length >= 6 && 
            confirmPassword === password &&
            (selectedRole === 'student' ? (studentId.length >= 5 && program.length >= 2 && year.length > 0) : (employeeId.length >= 3 && department.length >= 2))
            ? 'button-ready' : ''}`}
          onClick={handleRegister}
          disabled={
            !email || !validateEmail(email) || 
            password.length < 6 || 
            confirmPassword !== password ||
            (selectedRole === 'student' ? (studentId.length < 5 || program.length < 2 || year.length === 0) : (employeeId.length < 3 || department.length < 2))
          }
        >
          <span>Create Account</span>
          <IonIcon icon={arrowForwardOutline} className="button-icon" />
        </button>
      </div>
    </div>
  );

  return (
    <IonPage>
      <IonContent fullscreen className="register-page">
        {registrationStep === 'role' && renderRoleSelection()}
        {registrationStep === 'username' && renderUsernameCheck()}
        {registrationStep === 'form' && renderForm()}
      </IonContent>
    </IonPage>
  );
};

export default Register;
