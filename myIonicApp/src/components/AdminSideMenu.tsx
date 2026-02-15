import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel } from '@ionic/react';
import { homeOutline, peopleOutline, businessOutline, calendarOutline, documentTextOutline, barChartOutline } from 'ionicons/icons';

const AdminSideMenu: React.FC = () => {
  return (
    <IonMenu contentId="admin-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button routerLink="/admin/dashboard">
            <IonIcon icon={homeOutline} slot="start" />
            <IonLabel>Home</IonLabel>
          </IonItem>
          <IonItem button routerLink="/admin/trainees">
            <IonIcon icon={peopleOutline} slot="start" />
            <IonLabel>Trainees</IonLabel>
          </IonItem>
          <IonItem button routerLink="/admin/supervisors">
            <IonIcon icon={businessOutline} slot="start" />
            <IonLabel>Supervisors</IonLabel>
          </IonItem>
          <IonItem button routerLink="/admin/attendance">
            <IonIcon icon={calendarOutline} slot="start" />
            <IonLabel>Attendance</IonLabel>
          </IonItem>
          <IonItem button routerLink="/admin/reports">
            <IonIcon icon={documentTextOutline} slot="start" />
            <IonLabel>Reports</IonLabel>
          </IonItem>
          <IonItem button routerLink="/admin/progress">
            <IonIcon icon={barChartOutline} slot="start" />
            <IonLabel>Progress</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default AdminSideMenu;