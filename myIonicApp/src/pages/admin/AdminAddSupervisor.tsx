import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import './AdminAddSupervisor.css';

const AdminAddSupervisor: React.FC = () => {
  return (
    <IonPage>
      <div className="admin-dashboard">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="icon home header-icon"></span>
            Admin Panel
          </div>
          <div className="sidebar-profile">
            <img src="/ccs-logo.png" alt="Admin" className="sidebar-profile-img" />
            <div className="sidebar-profile-name">Admin User</div>
            <div className="sidebar-profile-role">Administrator</div>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li><a href="AdminDashboard.html"><span className="icon home"></span> Home</a></li>
              <li><a href="AdminTrainees.html"><span className="icon people"></span> Trainees</a></li>
              <li><a href="AdminSupervisors.html"><span className="icon person-add"></span> Supervisors</a></li>
              <li><a href="AdminAttendance.html"><span className="icon calendar"></span> Attendance</a></li>
              <li><a href="AdminReports.html"><span className="icon document-text"></span> Reports</a></li>
              <li><a href="AdminProgress.html"><span className="icon bar-chart"></span> Progress</a></li>
              <li className="logout-item"><a href="#logout"><span className="icon log-out"></span> Logout</a></li>
            </ul>
          </nav>
        </aside>
        <IonContent>
          <main className="main-content">
            <div className="admin-add-supervisor-container">
              <h2 className="admin-add-supervisor-title">Add New Supervisor</h2>

              <form className="admin-add-supervisor-form">
                <div className="form-item">
                  <label htmlFor="upload-image">Upload Image</label>
                  <input type="file" id="upload-image" accept="image/*" />
                </div>

                <div className="form-item">
                  <label htmlFor="full-name">Full Name</label>
                  <input type="text" id="full-name" placeholder="Enter full name" />
                </div>

                <div className="form-item">
                  <label htmlFor="birthday">Birthday</label>
                  <input type="date" id="birthday" />
                </div>

                <div className="form-item">
                  <label htmlFor="age">Age</label>
                  <input type="number" id="age" placeholder="Enter age" />
                </div>

                <div className="form-item">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Enter email" />
                </div>

                <div className="form-item">
                  <label htmlFor="contact-number">Contact Number</label>
                  <input type="text" id="contact-number" placeholder="Enter contact number" />
                </div>

                <div className="form-item">
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" placeholder="Enter address" />
                </div>

                <div className="form-item">
                  <label htmlFor="office">Office</label>
                  <input type="text" id="office" placeholder="Enter office" />
                </div>

                <button type="submit" className="submit-btn">Submit</button>
              </form>
            </div>
          </main>
        </IonContent>
      </div>
    </IonPage>
  );
};

export default AdminAddSupervisor;