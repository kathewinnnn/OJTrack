import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton } from '@ionic/react';
import AdminSideMenu from '../../components/AdminSideMenu';

const AdminAttendance: React.FC = () => {
  return (
    <>
      <AdminSideMenu />
      <IonPage id="admin-content">
        <IonHeader>
          <IonToolbar>
            <IonMenuButton slot="start" />
            <IonTitle>Attendance</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <h1>Attendance Page</h1>
          {/* Add attendance content here */}
        </IonContent>
      </IonPage>
    </>
  );
};

export default AdminAttendance;