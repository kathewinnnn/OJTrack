import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton } from '@ionic/react';
import AdminSideMenu from '../../components/AdminSideMenu';

const AdminReports: React.FC = () => {
  return (
    <>
      <AdminSideMenu />
      <IonPage id="admin-content">
        <IonHeader>
          <IonToolbar>
            <IonMenuButton slot="start" />
            <IonTitle>Reports</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <h1>Reports Page</h1>
          {/* Add reports content here */}
        </IonContent>
      </IonPage>
    </>
  );
};

export default AdminReports;