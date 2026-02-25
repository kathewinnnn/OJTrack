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

// Pages
import Splash              from './pages/Splash';
import Login               from './pages/Login';
import Register            from './pages/Register';
import Dashboard           from './pages/Dashboard';
import DTR                 from './pages/DTR';
import Reports             from './pages/Reports';
import Activity            from './pages/Activity';
import Account             from './pages/Account';
import ForgotPassword      from './pages/ForgotPassword';
import UploadReport        from './pages/UploadReport';
import EditAccount         from './pages/EditAccount';

import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import Profile             from './pages/supervisor/Profile';
import EditProfile         from './pages/supervisor/EditProfile';
import Trainees            from './pages/supervisor/Trainees';
import TraineeDetail       from './pages/supervisor/TraineeDetail';
import Attendance          from './pages/supervisor/Attendance';
import SupervisorReports   from './pages/supervisor/Reports';

import AdminDashboard      from './pages/admin/AdminDashboard';
import AdminTrainees       from './pages/admin/AdminTrainees';
import AdminAddSupervisor  from './pages/admin/AdminAddSupervisor';
import AdminSupervisors    from './pages/admin/AdminSupervisors';
import AdminAttendance     from './pages/admin/AdminAttendance';
import AdminReports        from './pages/admin/AdminReports';
import AdminProgress       from './pages/admin/AdminProgress';
import AdminAddTrainee     from './pages/admin/AdminAddTrainee';
import AdminSupervisorDetail from './pages/admin/AdminSupervisorDetail';
import AdminTraineeDetail from './pages/admin/AdminTraineeDetail';
import AdminAttendanceDetail from './pages/admin/AdminAttendanceDetail';
import AdminReportDetail from './pages/admin/AdminReportDetail';
import AdminAssignment from './pages/admin/AdminAssignment';

const App: React.FC = () => (
  <IonApp>
    {/*
      IonReactRouter + IonRouterOutlet MUST be used together.
      Removed RouterSync and URLSync — those components called history.push()
      which fights with IonReactRouter and causes views to not swap.
    */}
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Splash is the true entry — "/" redirects here */}
        <Route exact path="/splash"              component={Splash} />

        {/* Auth */}
        <Route exact path="/login"               component={Login} />
        <Route exact path="/register"            component={Register} />
        <Route exact path="/forgot-password"     component={ForgotPassword} />

        {/* Trainee */}
        <Route exact path="/dashboard"           component={Dashboard} />
        <Route exact path="/dtr"                 component={DTR} />
        <Route exact path="/reports"             component={Reports} />
        <Route exact path="/activity"            component={Activity} />
        <Route exact path="/account"             component={Account} />
        <Route exact path="/upload-report"       component={UploadReport} />
        <Route exact path="/edit-account"        component={EditAccount} />

        {/* Supervisor */}
        <Route exact path="/supervisor-dashboard" component={SupervisorDashboard} />
        <Route exact path="/profile"              component={Profile} />
        <Route exact path="/edit-profile"         component={EditProfile} />
        <Route exact path="/trainees"             component={Trainees} />
        <Route exact path="/trainee-detail/:id"   component={TraineeDetail} />
        <Route exact path="/attendance"           component={Attendance} />
        <Route exact path="/supervisor-reports"   component={SupervisorReports} />

        {/* Admin */}
        <Route exact path="/admin-dashboard"      component={AdminDashboard} />
        <Route exact path="/admin-trainees" render={(props) => <AdminTrainees {...props} key={props.location.pathname} />} />
        <Route exact path="/admin-add-supervisor" component={AdminAddSupervisor} />
        <Route exact path="/admin-supervisors"    component={AdminSupervisors} />
        <Route exact path="/admin-attendance"     component={AdminAttendance} />
        <Route exact path="/admin-reports"        component={AdminReports} />
        <Route exact path="/admin-progress"       component={AdminProgress} />
        <Route exact path="/admin-add-trainee"    component={AdminAddTrainee} />
        <Route exact path="/admin-supervisor-detail" component={AdminSupervisorDetail}/>
        <Route exact path="/admin-trainee-detail"  component={AdminTraineeDetail}/>
        <Route exact path="/admin-attendance-detail" component={AdminAttendanceDetail}/>
        <Route exact path="/admin-report-detail"  component={AdminReportDetail}/>
        <Route exact path="/admin-assignment"     component={AdminAssignment}/>

        {/* Catch-all → splash */}
        <Redirect to="/splash" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;