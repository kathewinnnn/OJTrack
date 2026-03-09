import React, { useState, useRef, useCallback, useEffect } from 'react';
import { IonPage, IonContent, IonText, IonIcon, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  mailOutline, lockClosedOutline, personOutline, eyeOutline, eyeOffOutline,
  checkmarkCircleOutline, arrowBackOutline, arrowForwardOutline, schoolOutline,
  briefcaseOutline, alertCircleOutline, calendarOutline, documentTextOutline,
  closeOutline, checkmarkOutline, cameraOutline, imageOutline, trashOutline,
} from 'ionicons/icons';
import TermsModal from '../components/TermsModal';

type UserRole = 'student' | 'supervisor' | null;
type RegistrationStep = 'role' | 'username' | 'form' | 'photo';

interface CropState { x: number; y: number; scale: number; }

const Register: React.FC = () => {
  const history = useHistory();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('role');

  const [username, setUsername]               = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError]     = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const [firstName, setFirstName]             = useState('');
  const [middleName, setMiddleName]           = useState('');
  const [lastName, setLastName]               = useState('');
  const [extensionName, setExtensionName]     = useState('');
  const [gender, setGender]                   = useState('');
  const [birthday, setBirthday]               = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [studentId, setStudentId]             = useState('');
  const [program, setProgram]                 = useState('');
  const [year, setYear]                       = useState('');
  const [employeeId, setEmployeeId]           = useState('');
  const [department, setDepartment]           = useState('');

  const [isEmailValid, setIsEmailValid]               = useState(true);
  const [isPasswordValid, setIsPasswordValid]         = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  const [isFirstNameTouched, setIsFirstNameTouched]   = useState(false);
  const [isLastNameTouched, setIsLastNameTouched]     = useState(false);
  const [isMiddleNameTouched, setIsMiddleNameTouched] = useState(false);
  const [isGenderTouched, setIsGenderTouched]         = useState(false);
  const [isBirthdayTouched, setIsBirthdayTouched]     = useState(false);
  const [isEmailTouched, setIsEmailTouched]           = useState(false);
  const [isPasswordTouched, setIsPasswordTouched]     = useState(false);
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);
  const [isStudentIdTouched, setIsStudentIdTouched]   = useState(false);
  const [isProgramTouched, setIsProgramTouched]       = useState(false);
  const [isYearTouched, setIsYearTouched]             = useState(false);
  const [isEmployeeIdTouched, setIsEmployeeIdTouched] = useState(false);
  const [isDepartmentTouched, setIsDepartmentTouched] = useState(false);

  // Terms
  const [showTermsModal, setShowTermsModal] = useState(false);
  const pendingDataRef = useRef<Record<string, any> | null>(null);

  const [isRedirecting, setIsRedirecting]   = useState(false);
  const [redirectMessage, setRedirectMessage] = useState('');

  const [rawImageSrc, setRawImageSrc]   = useState<string | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<string | null>(null);
  const [isCropping, setIsCropping]     = useState(false);
  const [cropState, setCropState]       = useState<CropState>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging]     = useState(false);
  const dragStart    = useRef<{ mx: number; my: number; cx: number; cy: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImgRef   = useRef<HTMLImageElement>(null);

  const CROP_SIZE = 280;

  const maxBirthdayDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
    .toISOString().split('T')[0];

  const validateEmail    = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePassword = (v: string) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(v);

  const checkUsernameUnique = async (u: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1000));
    return !['admin','test','demo','user123','existing'].includes(u.toLowerCase());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setRawImageSrc(ev.target?.result as string); setCropState({ x: 0, y: 0, scale: 1 }); setIsCropping(true); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { mx: clientX, my: clientY, cx: cropState.x, cy: cropState.y };
  }, [cropState]);

  const onDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !dragStart.current) return;
    setCropState(prev => ({ ...prev, x: dragStart.current!.cx + clientX - dragStart.current!.mx, y: dragStart.current!.cy + clientY - dragStart.current!.my }));
  }, [isDragging]);

  const onDragEnd = useCallback(() => { setIsDragging(false); dragStart.current = null; }, []);

  const applyCrop = useCallback(() => {
    const img = cropImgRef.current;
    if (!img || !rawImageSrc) return;
    const canvas = document.createElement('canvas');
    const OUTPUT = 400;
    canvas.width = canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath(); ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2); ctx.clip();
    const displayRatio = (CROP_SIZE * cropState.scale) / img.naturalWidth;
    ctx.drawImage(img, (-cropState.x) / displayRatio, (-cropState.y) / displayRatio, CROP_SIZE / displayRatio, CROP_SIZE / displayRatio, 0, 0, OUTPUT, OUTPUT);
    setCroppedPhoto(canvas.toDataURL('image/jpeg', 0.92));
    setIsCropping(false); setRawImageSrc(null);
  }, [rawImageSrc, cropState]);

  const handleRegister = () => {
    setIsFirstNameTouched(true); setIsLastNameTouched(true);
    setIsGenderTouched(true); setIsBirthdayTouched(true);
    setIsEmailTouched(true); setIsPasswordTouched(true); setIsConfirmPasswordTouched(true);

    const ev = validateEmail(email);
    const pv = validatePassword(password);
    const cpv = confirmPassword === password && validatePassword(confirmPassword);
    const fnv = firstName.trim().length >= 2;
    const lnv = lastName.trim().length >= 2;
    const gv = gender.length > 0;
    const bv = birthday.length > 0;
    setIsEmailValid(ev); setIsPasswordValid(pv); setIsConfirmPasswordValid(cpv);

    if (selectedRole === 'student') {
      setIsStudentIdTouched(true); setIsProgramTouched(true); setIsYearTouched(true);
      if (!(fnv && lnv && gv && bv && ev && pv && cpv && studentId.length >= 5 && program.length >= 2 && year.length > 0)) return;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: any) => u.username === username)) { setUsernameError('Username already registered'); return; }
      pendingDataRef.current = { username, password, role: selectedRole, firstName, middleName, lastName, extensionName, gender, birthday, email, studentId, program, year };
    } else if (selectedRole === 'supervisor') {
      setIsEmployeeIdTouched(true); setIsDepartmentTouched(true);
      if (!(fnv && lnv && gv && bv && ev && pv && cpv && employeeId.length >= 3 && department.length >= 2)) return;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: any) => u.username === username)) { setUsernameError('Username already registered'); return; }
      pendingDataRef.current = { username, password, role: selectedRole, firstName, middleName, lastName, extensionName, gender, birthday, email, employeeId, department };
    }
    setRegistrationStep('photo');
  };

  const proceedToTerms = () => {
    if (pendingDataRef.current && croppedPhoto) pendingDataRef.current.profilePhoto = croppedPhoto;
    setShowTermsModal(true);
  };

  // Called by TermsModal onAccept
  const handleAcceptTerms = () => {
    if (!pendingDataRef.current) return;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(pendingDataRef.current);
    localStorage.setItem('users', JSON.stringify(users));
    pendingDataRef.current = null;
    setShowTermsModal(false);
    setRedirectMessage('Account created! Redirecting to login...');
    setIsRedirecting(true);
    setTimeout(() => history.push('/login'), 2200);
  };

  // Called by TermsModal onClose (Decline or ✕)
  const handleCloseTerms = () => {
    pendingDataRef.current = null;
    setShowTermsModal(false);
    setRedirectMessage('Returning to registration...');
    setIsRedirecting(true);
    setTimeout(() => { setIsRedirecting(false); setRedirectMessage(''); }, 1400);
  };

  const handleRoleSelect = (role: UserRole) => { setSelectedRole(role); setRegistrationStep('username'); };
  const handleBackFromUsername = () => { setSelectedRole(null); setRegistrationStep('role'); setUsername(''); setUsernameError(''); setUsernameAvailable(null); };
  const handleBack = () => {
    if (registrationStep === 'photo') setRegistrationStep('form');
    else if (registrationStep === 'form') setRegistrationStep('username');
    else if (registrationStep === 'username') handleBackFromUsername();
    else history.push('/login');
  };

  const handleUsernameCheck = async () => {
    if (!username || username.length < 3) { setUsernameError('Username must be at least 3 characters'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setUsernameError('Only letters, numbers, and underscores'); return; }
    setIsCheckingUsername(true); setUsernameError('');
    try {
      const ok = await checkUsernameUnique(username);
      if (ok) { setUsernameAvailable(true); setTimeout(() => setRegistrationStep('form'), 800); }
      else { setUsernameAvailable(false); setUsernameError('This username is already taken'); }
    } catch { setUsernameError('Error checking username. Try again.'); }
    finally { setIsCheckingUsername(false); }
  };

  // ─── RENDER HELPERS (unchanged) ───────────────────────────────────────────

  const renderRoleSelection = () => (
    <div className="role-selection-container">
      <div className="role-header">
        <div className="logo-wrapper"><div className="logo-circle"><span className="logo-icon">📊</span></div></div>
        <IonText className="header-text">
          <h1 className="title">Join OJTrack</h1>
          <p className="subtitle">Select your role to get started</p>
        </IonText>
      </div>
      <div className="role-cards">
        <button className={`role-card ${selectedRole === 'student' ? 'role-selected' : ''}`} onClick={() => handleRoleSelect('student')}>
          <div className="role-card-icon student-icon"><IonIcon icon={schoolOutline} /></div>
          <IonText className="role-card-text"><h3>Student</h3><p>Track your OJT hours and submit reports</p></IonText>
          <IonIcon icon={arrowForwardOutline} className="role-card-arrow" />
        </button>
        <button className={`role-card ${selectedRole === 'supervisor' ? 'role-selected' : ''}`} onClick={() => handleRoleSelect('supervisor')}>
          <div className="role-card-icon supervisor-icon"><IonIcon icon={briefcaseOutline} /></div>
          <IonText className="role-card-text"><h3>Supervisor</h3><p>Manage students and review their progress</p></IonText>
          <IonIcon icon={arrowForwardOutline} className="role-card-arrow" />
        </button>
      </div>
      <div className="login-link-section">
        <IonText className="login-text">Already have an account? <span className="login-link" onClick={() => history.push('/login')}>Log In</span></IonText>
      </div>
    </div>
  );

  const renderUsernameCheck = () => (
    <div className="username-check-container">
      <button className="back-button" onClick={handleBackFromUsername}><IonIcon icon={arrowBackOutline} /></button>
      <div className="register-header">
        <IonText className="header-text"><br/><br/><br/>
          <h1 className="title">Choose Username</h1>
          <p className="subtitle">Create a unique username for your {selectedRole === 'student' ? 'student' : 'supervisor'} account</p>
        </IonText>
      </div>
      <div className="register-form">
        <div className={`input-group ${usernameError ? 'input-error' : ''}`}>
          <label className="floating-label"><IonIcon icon={personOutline} className="label-icon" />Username</label>
          <div className="input-container">
            <input type="text" value={username}
              onChange={(e) => { const v = e.target.value.replace(/[^a-zA-Z0-9_]/g, ''); setUsername(v); setUsernameError(''); setUsernameAvailable(null); }}
              className={`styled-input ${username && !usernameError && usernameAvailable === true ? 'input-valid' : ''} ${usernameError ? 'input-invalid' : ''}`}
              placeholder="Choose a unique username" disabled={isCheckingUsername}
              onKeyPress={(e) => { if (e.key === 'Enter' && !isCheckingUsername) handleUsernameCheck(); }} />
            {username && usernameAvailable === true && <IonIcon icon={checkmarkCircleOutline} className="validation-icon success" />}
            {usernameError && <IonIcon icon={alertCircleOutline} className="validation-icon error" />}
          </div>
          {usernameError && <IonText className="error-message">{usernameError}</IonText>}
        </div>
        <div className="username-tips">
          <IonText className="tips-title">Username must:</IonText>
          <ul className="tips-list">
            <li className={username.length >= 3 ? 'tip-done' : ''}>Be at least 3 characters</li>
            <li className={/^[a-zA-Z0-9_]+$/.test(username) && username.length > 0 ? 'tip-done' : ''}>Letters, numbers, and underscores only</li>
            <li className={usernameAvailable === true ? 'tip-done' : ''}>Be unique (not taken)</li>
          </ul>
        </div>
        <button className={`register-button ${username.length >= 3 && !usernameError && usernameAvailable === true ? 'button-ready' : ''}`}
          onClick={handleUsernameCheck} disabled={username.length < 3 || isCheckingUsername}>
          {isCheckingUsername
            ? <span>Checking...</span>
            : usernameAvailable === true
              ? <><span>Username Available!</span><IonIcon icon={checkmarkCircleOutline} className="button-icon" /></>
              : <><span>Check Availability</span><IonIcon icon={arrowForwardOutline} className="button-icon" /></>}
        </button>
        {usernameAvailable === true && (
          <button className="continue-button" onClick={() => setRegistrationStep('form')}>
            <IonText className="continue-text">Continue to registration <IonIcon icon={arrowForwardOutline} /></IonText>
          </button>
        )}
      </div>
    </div>
  );

  const renderForm = () => {
    const formReady = firstName.trim().length >= 2 && lastName.trim().length >= 2 && gender.length > 0 && birthday.length > 0 &&
      email && validateEmail(email) && validatePassword(password) && confirmPassword === password && validatePassword(confirmPassword) &&
      (selectedRole === 'student' ? (studentId.length >= 5 && program.length >= 2 && year.length > 0) : (employeeId.length >= 3 && department.length >= 2));

    return (
      <div className="register-container">
        <button className="back-button" onClick={handleBack}><IonIcon icon={arrowBackOutline} /></button>
        <div className="register-header">
          <IonText className="header-text">
            <h1 className="title">{selectedRole === 'student' ? 'Student Registration' : 'Supervisor Registration'}</h1>
            <p className="subtitle">Complete your account setup</p>
          </IonText>
        </div>
        <div className="username-display">
          <IonIcon icon={personOutline} className="username-icon" />
          <IonText className="username-value">@{username}</IonText>
          <button className="change-username-btn" onClick={() => { setRegistrationStep('username'); setUsernameAvailable(null); }}>Change</button>
        </div>
        <div className="register-form">
          <div className={`input-group ${isFirstNameTouched && firstName.trim().length < 2 ? 'input-error' : ''}`}>
            <label className="floating-label"><IonIcon icon={personOutline} className="label-icon" />First Name</label>
            <div className="input-container">
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={() => setIsFirstNameTouched(true)}
                className={`styled-input ${isFirstNameTouched && firstName.trim().length < 2 ? 'input-invalid' : firstName.trim().length >= 2 ? 'input-valid' : ''}`}
                placeholder="Enter your first name" />
              {isFirstNameTouched && firstName.trim().length < 2 && <IonIcon icon={alertCircleOutline} className="validation-icon error" />}
            </div>
            {isFirstNameTouched && firstName.trim().length === 0 && <IonText className="error-message">First name is required</IonText>}
            {isFirstNameTouched && firstName.trim().length > 0 && firstName.trim().length < 2 && <IonText className="error-message">At least 2 characters</IonText>}
          </div>
          <div className="input-group">
            <label className="floating-label"><IonIcon icon={personOutline} className="label-icon" />Middle Name <span style={{ fontWeight:'normal', opacity:0.6, fontSize:'0.85em' }}>(optional)</span></label>
            <div className="input-container">
              <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="styled-input" placeholder="Middle name (optional)" />
            </div>
          </div>
          <div className={`input-group ${isLastNameTouched && lastName.trim().length < 2 ? 'input-error' : ''}`}>
            <label className="floating-label"><IonIcon icon={personOutline} className="label-icon" />Last Name</label>
            <div className="input-container">
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={() => setIsLastNameTouched(true)}
                className={`styled-input ${isLastNameTouched && lastName.trim().length < 2 ? 'input-invalid' : lastName.trim().length >= 2 ? 'input-valid' : ''}`}
                placeholder="Enter your last name" />
              {isLastNameTouched && lastName.trim().length < 2 && <IonIcon icon={alertCircleOutline} className="validation-icon error" />}
            </div>
            {isLastNameTouched && lastName.trim().length === 0 && <IonText className="error-message">Last name is required</IonText>}
            {isLastNameTouched && lastName.trim().length > 0 && lastName.trim().length < 2 && <IonText className="error-message">At least 2 characters</IonText>}
          </div>
          <div className="input-group">
            <label className="floating-label"><IonIcon icon={personOutline} className="label-icon" />Extension Name</label>
            <div className="input-container">
              <input type="text" value={extensionName} onChange={(e) => setExtensionName(e.target.value)} className="styled-input" placeholder="e.g. Jr., III (optional)" />
            </div>
          </div>
          <div className={`input-group ${isGenderTouched && gender.length === 0 ? 'input-error' : ''}`}>
            <label className="floating-label"><IonIcon icon={personOutline} className="label-icon" />Gender</label>
            <div className="input-container">
              <select value={gender} onChange={(e) => { setGender(e.target.value); setIsGenderTouched(true); }} onBlur={() => setIsGenderTouched(true)}
                className={`styled-input ${isGenderTouched && gender.length === 0 ? 'input-invalid' : gender.length > 0 ? 'input-valid' : ''}`}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {isGenderTouched && gender.length === 0 && <IonText className="error-message">Please select your gender</IonText>}
          </div>
          <div className={`input-group ${isBirthdayTouched && !birthday ? 'input-error' : ''}`}>
            <label className="floating-label"><IonIcon icon={calendarOutline} className="label-icon" />Birthday</label>
            <div className="input-container">
              <input type="date" value={birthday} onChange={(e) => { setBirthday(e.target.value); setIsBirthdayTouched(true); }} onBlur={() => setIsBirthdayTouched(true)}
                max={maxBirthdayDate} min="1900-01-01"
                className={`styled-input ${isBirthdayTouched && !birthday ? 'input-invalid' : birthday ? 'input-valid' : ''}`} />
              {birthday && <IonIcon icon={checkmarkCircleOutline} className="validation-icon success" />}
              {isBirthdayTouched && !birthday && <IonIcon icon={alertCircleOutline} className="validation-icon error" />}
            </div>
            {isBirthdayTouched && !birthday && <IonText className="error-message">Please select your birthday</IonText>}
          </div>
          <div className={`input-group ${isEmailTouched && !isEmailValid ? 'input-error' : ''}`}>
            <label className="floating-label"><IonIcon icon={mailOutline} className="label-icon" />Email</label>
            <div className="input-container">
              <input type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); if (isEmailTouched) setIsEmailValid(validateEmail(e.target.value)); }}
                onFocus={() => setIsEmailTouched(true)} onBlur={() => setIsEmailValid(validateEmail(email))}
                className={`styled-input ${email && validateEmail(email) ? 'input-valid' : ''} ${isEmailTouched && !isEmailValid ? 'input-invalid' : ''}`}
                placeholder="Enter your email" />
              {email && validateEmail(email) && <IonIcon icon={checkmarkCircleOutline} className="validation-icon success" />}
            </div>
            {isEmailTouched && !isEmailValid && <IonText className="error-message">Please enter a valid email address</IonText>}
          </div>
          {selectedRole === 'student' && (<>
            <div className="input-group">
              <label className="floating-label">Student ID</label>
              <div className="input-container">
                <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} onFocus={() => setIsStudentIdTouched(true)} onBlur={() => setIsStudentIdTouched(true)}
                  className={`styled-input ${isStudentIdTouched && studentId.length < 5 ? 'input-invalid' : studentId.length >= 5 ? 'input-valid' : ''}`}
                  placeholder="Enter your student ID" />
              </div>
              {isStudentIdTouched && studentId.length === 0 && <IonText className="error-message">Student ID is required</IonText>}
              {isStudentIdTouched && studentId.length > 0 && studentId.length < 5 && <IonText className="error-message">At least 5 characters</IonText>}
            </div>
            <div className="input-group">
              <label className="floating-label">Program/Course</label>
              <div className="input-container">
                <input type="text" value={program} onChange={(e) => setProgram(e.target.value)} onFocus={() => setIsProgramTouched(true)} onBlur={() => setIsProgramTouched(true)}
                  className={`styled-input ${isProgramTouched && program.length < 2 ? 'input-invalid' : program.length >= 2 ? 'input-valid' : ''}`}
                  placeholder="Enter your program" />
              </div>
              {isProgramTouched && program.length === 0 && <IonText className="error-message">Program is required</IonText>}
            </div>
            <div className={`input-group ${isYearTouched && year.length === 0 ? 'input-error' : ''}`}>
              <label className="floating-label">Year Level</label>
              <div className="input-container">
                <select value={year} onChange={(e) => { setYear(e.target.value); setIsYearTouched(true); }} onBlur={() => setIsYearTouched(true)}
                  className={`styled-input ${isYearTouched && year.length === 0 ? 'input-invalid' : year.length > 0 ? 'input-valid' : ''}`}>
                  <option value="">Select year level</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              {isYearTouched && year.length === 0 && <IonText className="error-message">Please select your year level</IonText>}
            </div>
          </>)}
          {selectedRole === 'supervisor' && (<>
            <div className="input-group">
              <label className="floating-label">Employee ID</label>
              <div className="input-container">
                <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} onFocus={() => setIsEmployeeIdTouched(true)} onBlur={() => setIsEmployeeIdTouched(true)}
                  className={`styled-input ${isEmployeeIdTouched && employeeId.length < 3 ? 'input-invalid' : employeeId.length >= 3 ? 'input-valid' : ''}`}
                  placeholder="Enter your employee ID" />
              </div>
              {isEmployeeIdTouched && employeeId.length === 0 && <IonText className="error-message">Employee ID is required</IonText>}
            </div>
            <div className="input-group">
              <label className="floating-label">Department</label>
              <div className="input-container">
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} onFocus={() => setIsDepartmentTouched(true)} onBlur={() => setIsDepartmentTouched(true)}
                  className={`styled-input ${isDepartmentTouched && department.length < 2 ? 'input-invalid' : department.length >= 2 ? 'input-valid' : ''}`}
                  placeholder="Enter your department" />
              </div>
              {isDepartmentTouched && department.length === 0 && <IonText className="error-message">Department is required</IonText>}
            </div>
          </>)}
          <div className={`input-group ${isPasswordTouched && !isPasswordValid ? 'input-error' : ''}`}>
            <label className="floating-label"><IonIcon icon={lockClosedOutline} className="label-icon" />Password</label>
            <div className="input-container">
              <input type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => { setPassword(e.target.value); if (isPasswordTouched) setIsPasswordValid(validatePassword(e.target.value)); }}
                onFocus={() => setIsPasswordTouched(true)} onBlur={() => setIsPasswordValid(validatePassword(password))}
                className={`styled-input ${validatePassword(password) ? 'input-valid' : ''} ${isPasswordTouched && password.length > 0 && !validatePassword(password) ? 'input-invalid' : ''}`}
                placeholder="Create a password" />
              <button className="password-toggle" onClick={() => setShowPassword(!showPassword)}><IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} /></button>
            </div>
            {isPasswordTouched && password.length > 0 && !validatePassword(password) && <IonText className="error-message">Min 6 chars, include letters, numbers &amp; a special character</IonText>}
          </div>
          <div className={`input-group ${isConfirmPasswordTouched && !isConfirmPasswordValid ? 'input-error' : ''}`}>
            <label className="floating-label"><IonIcon icon={lockClosedOutline} className="label-icon" />Confirm Password</label>
            <div className="input-container">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (isConfirmPasswordTouched) setIsConfirmPasswordValid(e.target.value === password && validatePassword(e.target.value)); }}
                onFocus={() => setIsConfirmPasswordTouched(true)} onBlur={() => setIsConfirmPasswordValid(confirmPassword === password && validatePassword(confirmPassword))}
                className={`styled-input ${confirmPassword && confirmPassword === password && validatePassword(confirmPassword) ? 'input-valid' : ''} ${isConfirmPasswordTouched && confirmPassword.length > 0 && (!validatePassword(confirmPassword) || confirmPassword !== password) ? 'input-invalid' : ''}`}
                placeholder="Confirm your password" />
              <button className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}><IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} /></button>
            </div>
            {isConfirmPasswordTouched && confirmPassword.length > 0 && confirmPassword !== password && <IonText className="error-message">Passwords do not match</IonText>}
          </div>
          <button className={`register-button ${formReady ? 'button-ready' : ''}`} onClick={handleRegister} disabled={!formReady}>
            <span>Continue</span><IonIcon icon={arrowForwardOutline} className="button-icon" />
          </button>
        </div>
      </div>
    );
  };

  const renderPhotoStep = () => (
    <div className="photo-step-container">
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileChange} />
      <button className="back-button" style={{color: 'black'}} onClick={handleBack}><IonIcon icon={arrowBackOutline} /></button>
      <div className="register-header" style={{ marginBottom: 8 }}>
        <IonText className="header-text">
          <h1 className="title" style={{color: 'black'}}>Profile Photo</h1>
          <p className="subtitle" style={{color: 'black'}}>Upload a photo so others can recognise you</p><br />
        </IonText>
      </div>
      <div className="photo-step-indicator">
        <div className="psi-step done"><span>1</span><small>Details</small></div>
        <div className="psi-line done"/>
        <div className="psi-step active"><span>2</span><small>Photo</small></div>
        <div className="psi-line"/>
        <div className="psi-step"><span>3</span><small>Terms</small></div>
      </div>
      <div className="photo-upload-card">
        {croppedPhoto ? (
          <div className="photo-preview-wrap">
            <div className="photo-preview-ring">
              <img src={croppedPhoto} alt="Profile" className="photo-preview-img" />
              <div className="photo-preview-check"><IonIcon icon={checkmarkCircleOutline} /></div>
            </div>
            <p className="photo-preview-name">{firstName} {lastName}</p>
            <p className="photo-preview-role">{selectedRole === 'student' ? `${program} · ${year}` : department}</p>
            <div className="photo-action-row">
              <button className="photo-action-btn secondary" onClick={() => fileInputRef.current?.click()}>
                <IonIcon icon={imageOutline} /> Change Photo
              </button>
              <button className="photo-action-btn danger" onClick={() => setCroppedPhoto(null)}>
                <IonIcon icon={trashOutline} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="photo-empty-zone" onClick={() => fileInputRef.current?.click()}>
            <div className="photo-empty-circle">
              <div className="photo-empty-initials">{firstName?.[0]}{lastName?.[0]}</div>
              <div className="photo-empty-overlay">
                <IonIcon icon={cameraOutline} /><span>Upload</span>
              </div>
            </div>
            <p className="photo-empty-label">Tap to upload a profile photo</p>
            <p className="photo-empty-sub">JPG or PNG · Max 10 MB</p>
          </div>
        )}
      </div>
      <div className="photo-cta-row">
        {!croppedPhoto && (
          <button className="photo-skip-btn" onClick={proceedToTerms}>Skip for now</button>
        )}
        <button className="register-button button-ready photo-proceed-btn" onClick={proceedToTerms}>
          <span>{croppedPhoto ? 'Continue with this photo' : 'Skip & Continue'}</span>
          <IonIcon icon={arrowForwardOutline} className="button-icon" />
        </button>
      </div>
      {isCropping && rawImageSrc && (
        <div className="cropper-overlay">
          <div className="cropper-modal">
            <div className="cropper-header">
              <div className="cropper-title-group">
                <div className="cropper-icon-badge"><IonIcon icon={cameraOutline} /></div>
                <div>
                  <div className="cropper-title">Adjust your photo</div>
                  <div className="cropper-subtitle">Drag to reposition · Pinch or scroll to zoom</div>
                </div>
              </div>
              <button className="cropper-close" onClick={() => { setIsCropping(false); setRawImageSrc(null); }}>
                <IonIcon icon={closeOutline} />
              </button>
            </div>
            <div className="cropper-viewport-wrap">
              <div className="cropper-viewport" style={{ width: CROP_SIZE, height: CROP_SIZE }}
                onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
                onMouseMove={(e) => { if (isDragging) onDragMove(e.clientX, e.clientY); }}
                onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
                onTouchStart={(e) => { const t = e.touches[0]; onDragStart(t.clientX, t.clientY); }}
                onTouchMove={(e) => { const t = e.touches[0]; onDragMove(t.clientX, t.clientY); }}
                onTouchEnd={onDragEnd}
                onWheel={(e) => { e.preventDefault(); setCropState(prev => ({ ...prev, scale: Math.max(0.5, Math.min(4, prev.scale - e.deltaY * 0.001)) })); }}
              >
                <img ref={cropImgRef} src={rawImageSrc} alt="crop" draggable={false} style={{
                  position: 'absolute', transformOrigin: 'center center',
                  transform: `translate(${cropState.x}px, ${cropState.y}px) scale(${cropState.scale})`,
                  maxWidth: 'none', userSelect: 'none', pointerEvents: 'none',
                  width: CROP_SIZE, height: CROP_SIZE, objectFit: 'cover',
                }} />
                <div className="cropper-mask" style={{ width: CROP_SIZE, height: CROP_SIZE }} />
                <div className="cropper-circle-border" style={{ width: CROP_SIZE, height: CROP_SIZE }} />
              </div>
            </div>
            <div className="cropper-zoom-row">
              <span className="cropper-zoom-label">–</span>
              <input type="range" min="0.5" max="4" step="0.01" value={cropState.scale}
                onChange={(e) => setCropState(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                className="cropper-zoom-slider" />
              <span className="cropper-zoom-label">+</span>
            </div>
            <div className="cropper-actions">
              <button className="cropper-btn secondary" onClick={() => { setIsCropping(false); setRawImageSrc(null); }}>Cancel</button>
              <button className="cropper-btn primary" onClick={applyCrop}>
                <IonIcon icon={checkmarkOutline} /> Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLoadingOverlay = () => (
    <div style={{ position:'fixed', inset:0, background:'rgba(255,255,255,0.96)', backdropFilter:'blur(10px)', zIndex:99999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28, animation:'fadeIn 0.25s ease' }}>
      <style>{`
        @keyframes fadeIn   { from{opacity:0}to{opacity:1} }
        @keyframes spin     { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:.75} }
        @keyframes dotBounce{ 0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1} }
      `}</style>
      <div style={{ position:'relative', width:88, height:88, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'4px solid #F3E6F8', borderTop:'4px solid #5f0076', animation:'spin 0.85s linear infinite' }} />
        <div style={{ width:60, height:60, borderRadius:'50%', background:'linear-gradient(135deg,#5f0076,#7a1896)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 24px rgba(95,0,118,0.4)', animation:'pulse 1.8s ease-in-out infinite' }}>
          <span style={{ fontSize:26 }}>📊</span>
        </div>
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:17, fontWeight:700, color:'#111827', marginBottom:10 }}>{redirectMessage}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
          {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#5f0076', animation:`dotBounce 1.3s ease-in-out ${i*0.18}s infinite` }} />)}
        </div>
      </div>
    </div>
  );

  return (
    <IonPage>
      <IonContent fullscreen className="register-page">
        <style>{`
          .photo-step-container { min-height:100vh; padding:32px 24px 48px; display:flex; flex-direction:column; align-items:center; background:#faf8fc; }
          .photo-step-indicator { display:flex; align-items:center; gap:0; margin:0 auto 28px; }
          .psi-step { display:flex; flex-direction:column; align-items:center; gap:4px; }
          .psi-step span { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; border:2px solid #ede6f2; background:#fff; color:#c4b5d4; transition:all .2s; }
          .psi-step small { font-size:10px; color:#c4b5d4; font-weight:600; letter-spacing:.04em; }
          .psi-step.done span { background:#5f0076; border-color:#5f0076; color:#fff; }
          .psi-step.done small { color:#5f0076; }
          .psi-step.active span { background:#fff; border-color:#5f0076; color:#5f0076; box-shadow:0 0 0 3px rgba(95,0,118,.15); }
          .psi-step.active small { color:#5f0076; }
          .psi-line { width:44px; height:2px; background:#ede6f2; margin:0 4px; margin-bottom:16px; transition:background .2s; }
          .psi-line.done { background:#5f0076; }
          .photo-upload-card { width:100%; max-width:360px; background:#fff; border-radius:20px; border:1px solid #ede6f2; box-shadow:0 4px 20px rgba(95,0,118,.08); padding:28px 24px; display:flex; flex-direction:column; align-items:center; margin-bottom:24px; }
          .photo-empty-zone { display:flex; flex-direction:column; align-items:center; cursor:pointer; }
          .photo-empty-circle { position:relative; width:140px; height:140px; border-radius:50%; background:linear-gradient(135deg,#f3e6f8,#ede6f2); border:3px dashed #c4a8d4; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:16px; transition:all .2s; }
          .photo-empty-circle:hover { border-color:#5f0076; transform:scale(1.03); }
          .photo-empty-initials { font-size:42px; font-weight:800; color:#9c27b0; letter-spacing:-.02em; font-family:'Syne',sans-serif; line-height:1; text-transform:uppercase; }
          .photo-empty-overlay { position:absolute; inset:0; background:rgba(95,0,118,0.72); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; opacity:0; transition:opacity .2s; border-radius:50%; }
          .photo-empty-zone:hover .photo-empty-overlay { opacity:1; }
          .photo-empty-overlay ion-icon { font-size:28px; color:#fff; }
          .photo-empty-overlay span { font-size:12px; font-weight:700; color:#fff; letter-spacing:.06em; text-transform:uppercase; }
          .photo-empty-label { font-size:14px; font-weight:600; color:#3d3049; margin-bottom:4px; }
          .photo-empty-sub { font-size:12px; color:#9b8aa8; }
          .photo-preview-wrap { display:flex; flex-direction:column; align-items:center; width:100%; }
          .photo-preview-ring { position:relative; width:140px; height:140px; border-radius:50%; margin-bottom:14px; }
          .photo-preview-img { width:140px; height:140px; border-radius:50%; object-fit:cover; border:4px solid #5f0076; box-shadow:0 4px 20px rgba(95,0,118,.3); }
          .photo-preview-check { position:absolute; bottom:4px; right:4px; width:28px; height:28px; border-radius:50%; background:#5f0076; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,.15); }
          .photo-preview-check ion-icon { font-size:14px; color:#fff; }
          .photo-preview-name { font-size:16px; font-weight:700; color:#1a1025; margin-bottom:3px; }
          .photo-preview-role { font-size:12px; color:#7b6e89; margin-bottom:20px; }
          .photo-action-row { display:flex; gap:10px; }
          .photo-action-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:9px; font-size:13px; font-weight:600; font-family:inherit; cursor:pointer; border:1.5px solid transparent; transition:all .18s; }
          .photo-action-btn.secondary { background:#f3e6f8; color:#5f0076; border-color:rgba(95,0,118,.2); }
          .photo-action-btn.secondary:hover { background:#e8d5f5; }
          .photo-action-btn.danger { background:#fff0f0; color:#c0392b; border-color:rgba(192,57,43,.2); }
          .photo-action-btn.danger:hover { background:#ffd5d5; }
          .photo-action-btn ion-icon { font-size:15px; }
          .photo-cta-row { width:100%; max-width:360px; display:flex; flex-direction:column; gap:10px; }
          .photo-skip-btn { width:100%; padding:11px; background:none; border:1.5px solid #ede6f2; border-radius:12px; font-size:14px; font-weight:600; color:#7b6e89; cursor:pointer; font-family:inherit; transition:all .18s; }
          .photo-skip-btn:hover { border-color:#5f0076; color:#5f0076; }
          .photo-proceed-btn { width:100%; }
          .cropper-overlay { position:fixed; inset:0; background:rgba(10,0,20,0.82); backdrop-filter:blur(8px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px; }
          .cropper-modal { background:#1a0a26; border-radius:22px; width:100%; max-width:380px; overflow:hidden; box-shadow:0 24px 80px rgba(0,0,0,.6); border:1px solid rgba(255,255,255,.08); }
          .cropper-header { display:flex; align-items:center; justify-content:space-between; padding:18px 18px 14px; border-bottom:1px solid rgba(255,255,255,.07); }
          .cropper-title-group { display:flex; align-items:center; gap:12px; }
          .cropper-icon-badge { width:36px; height:36px; border-radius:10px; background:rgba(95,0,118,.5); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
          .cropper-icon-badge ion-icon { font-size:18px; color:#c752f0; }
          .cropper-title { font-size:15px; font-weight:700; color:#fff; }
          .cropper-subtitle { font-size:11.5px; color:rgba(255,255,255,.45); margin-top:1px; }
          .cropper-close { background:rgba(255,255,255,.08); border:none; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:rgba(255,255,255,.6); font-size:18px; transition:all .15s; }
          .cropper-close:hover { background:rgba(255,255,255,.15); color:#fff; }
          .cropper-viewport-wrap { display:flex; align-items:center; justify-content:center; padding:20px 0; background:#0d0016; }
          .cropper-viewport { position:relative; border-radius:50%; overflow:hidden; cursor:grab; user-select:none; touch-action:none; }
          .cropper-viewport:active { cursor:grabbing; }
          .cropper-mask { position:absolute; top:0; left:0; border-radius:50%; box-shadow:0 0 0 999px rgba(0,0,0,.65); pointer-events:none; z-index:2; }
          .cropper-circle-border { position:absolute; top:0; left:0; border-radius:50%; border:2.5px solid rgba(199,82,240,.7); pointer-events:none; z-index:3; box-shadow:0 0 0 1px rgba(199,82,240,.25); }
          .cropper-zoom-row { display:flex; align-items:center; gap:10px; padding:4px 20px 16px; }
          .cropper-zoom-label { font-size:16px; color:rgba(255,255,255,.4); font-weight:700; user-select:none; }
          .cropper-zoom-slider { flex:1; -webkit-appearance:none; appearance:none; height:4px; border-radius:99px; background:rgba(255,255,255,.15); outline:none; cursor:pointer; }
          .cropper-zoom-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#c752f0; box-shadow:0 0 0 3px rgba(199,82,240,.3); cursor:pointer; }
          .cropper-actions { display:flex; gap:10px; padding:0 18px 18px; }
          .cropper-btn { flex:1; padding:12px; border-radius:11px; font-size:14px; font-weight:700; font-family:inherit; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .18s; border:none; }
          .cropper-btn.secondary { background:rgba(255,255,255,.08); color:rgba(255,255,255,.6); }
          .cropper-btn.secondary:hover { background:rgba(255,255,255,.14); color:#fff; }
          .cropper-btn.primary { background:linear-gradient(135deg,#5f0076,#9c27b0); color:#fff; box-shadow:0 4px 16px rgba(95,0,118,.4); }
          .cropper-btn.primary:hover { background:linear-gradient(135deg,#7a1896,#ab47bc); transform:translateY(-1px); }
          .cropper-btn ion-icon { font-size:16px; }
        `}</style>

        {registrationStep === 'role'     && renderRoleSelection()}
        {registrationStep === 'username' && renderUsernameCheck()}
        {registrationStep === 'form'     && renderForm()}
        {registrationStep === 'photo'    && renderPhotoStep()}
        {isRedirecting && renderLoadingOverlay()}
      </IonContent>

      {showTermsModal && (
        <TermsModal
          mode="register"
          onClose={handleCloseTerms}
          onAccept={handleAcceptTerms}
        />
      )}
    </IonPage>
  );
};

export default Register;