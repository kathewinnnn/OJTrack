import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton } from '@ionic/react';
import AdminSideMenu from '../../components/AdminSideMenu';

const AdminTrainees: React.FC = () => {
  return (
    <>
      <AdminSideMenu />
      <IonPage id="admin-content">
        <IonHeader>
          <IonToolbar>
            <IonMenuButton slot="start" />
            <IonTitle>Trainees</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <h1>Trainees Page</h1>
          {/* Add trainees content here */}
        </IonContent>
      </IonPage>
    </>
  );
};

export default AdminTrainees;