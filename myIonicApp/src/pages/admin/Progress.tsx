import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton } from '@ionic/react';
import AdminSideMenu from '../../components/AdminSideMenu';

const AdminProgress: React.FC = () => {
  return (
    <>
      <AdminSideMenu />
      <IonPage id="admin-content">
        <IonHeader>
          <IonToolbar>
            <IonMenuButton slot="start" />
            <IonTitle>Progress</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <h1>Progress Page</h1>
          {/* Add progress content here */}
        </IonContent>
      </IonPage>
    </>
  );
};

export default AdminProgress;