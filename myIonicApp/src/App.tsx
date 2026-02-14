import React from 'react';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DTR from './pages/DTR';
import Reports from './pages/Reports';
import Activity from './pages/Activity';
import Account from './pages/Account';
import ForgotPassword from './pages/ForgotPassword';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import Profile from './pages/supervisor/Profile';
import EditProfile from './pages/supervisor/EditProfile';
import Trainees from './pages/supervisor/Trainees';
import TraineeDetail from './pages/supervisor/TraineeDetail';
import Attendance from './pages/supervisor/Attendance';
import SupervisorReports from './pages/supervisor/Reports';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={Splash} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/dtr" component={DTR} />
        <Route exact path="/reports" component={Reports} />
        <Route exact path="/activity" component={Activity} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/supervisor-dashboard" component={SupervisorDashboard} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <Route exact path="/trainees" component={Trainees} />
        <Route exact path="/trainee-detail/:id" component={TraineeDetail} />
        <Route exact path="/attendance" component={Attendance} />
        <Route exact path="/supervisor-reports" component={SupervisorReports} />
        <Redirect to="/" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
