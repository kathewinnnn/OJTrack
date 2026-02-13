import React, { useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router';

const Splash: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const timer = setTimeout(() => {
      history.push('/login');
    }, 2500);

    return () => {
      clearTimeout(timer);
      // Clean up style element on unmount
      if (styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, [history]);

  return (
    <IonPage>
      <IonContent 
        fullscreen 
        className="splash-content"
        style={{ '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="splash-container">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-icon">📊</span>
            </div>
            <h1 className="app-title">OJTrack</h1>
            <p className="app-tagline">Track Your Online Judge Progress</p>
          </div>
          
          <div className="loading-container">
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
            <span className="loading-text">Loading...</span>
          </div>

          <div className="version-info">Version 1.0.0</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Splash;

// Add these styles via a style tag for better component encapsulation
const styles = `
  .splash-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .splash-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .logo-container {
    text-align: center;
    margin-bottom: 4rem;
    animation: fadeInDown 1s ease-out;
  }

  .logo-circle {
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: pulse 2s infinite;
  }

  .logo-icon {
    font-size: 3.5rem;
  }

  .app-title {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: 2px;
  }

  .app-tagline {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1rem;
    margin-top: 0.5rem;
    font-weight: 400;
  }

  .loading-container {
    width: 100%;
    text-align: center;
    animation: fadeInUp 1s ease-out 0.5s both;
  }

  .loading-bar {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    margin: 0 auto 0.75rem;
    overflow: hidden;
  }

  .loading-progress {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 2px;
    animation: loading 2s ease-in-out infinite;
  }

  .loading-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .version-info {
    position: absolute;
    bottom: 2rem;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    animation: fadeIn 1s ease-out 1s both;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
    }
  }

  @keyframes loading {
    0% {
      width: 0%;
      margin-left: 0;
    }
    50% {
      width: 60%;
      margin-left: 20%;
    }
    100% {
      width: 0%;
      margin-left: 100%;
    }
  }
`;
