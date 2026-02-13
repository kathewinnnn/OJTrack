import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel } from '@ionic/react';
import { homeOutline, calendarOutline, documentTextOutline, personOutline, listOutline } from 'ionicons/icons';

const SideMenu: React.FC = () => {
  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button routerLink="/dashboard">
            <IonIcon icon={homeOutline} slot="start" />
            <IonLabel>Dashboard</IonLabel>
          </IonItem>
          <IonItem button routerLink="/dtr">
            <IonIcon icon={calendarOutline} slot="start" />
            <IonLabel>DTR</IonLabel>
          </IonItem>
          <IonItem button routerLink="/reports">
            <IonIcon icon={documentTextOutline} slot="start" />
            <IonLabel>Reports</IonLabel>
          </IonItem>
          <IonItem button routerLink="/profile">
            <IonIcon icon={personOutline} slot="start" />
            <IonLabel>Profile</IonLabel>
          </IonItem>
          <IonItem button routerLink="/summary">
            <IonIcon icon={listOutline} slot="start" />
            <IonLabel>Activity Summary</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
