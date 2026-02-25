import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import AdminLayout from '../../components/AdminLayout';
import useNavigate from '../../hooks/useNavigate';

const AdminAddSupervisor: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent>
        <AdminLayout activeMenu="supervisors">

          {/* ─── TOPBAR ─────────────────────────── */}
          <div className="topbar">
            <div className="topbar-breadcrumb">
              <p>Admin</p>
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              <p>Supervisors</p>
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              <span className="crumb-active">Add New</span>
            </div>
            <div className="topbar-right">
              <span className="topbar-date">Feb 22, 2026</span>
              <button className="topbar-btn" title="Notifications">
                <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </button>
            </div>
          </div>

          {/* ─── PAGE CONTENT ────────────────────── */}
          <div className="page-content">

            {/* BACK BUTTON */}
            <button
              type="button"
              className="back-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin-supervisors');
              }}
            >
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              Back to Supervisors
            </button>

            <div className="page-header">
              <div>
                <div className="page-header-title">Add New Supervisor</div>
                <div className="page-header-sub">Fill in the details below to register a new OJT supervisor.</div>
              </div>
            </div>

            <div className="form-layout">
              {/* ─── LEFT COLUMN: FORM ─── */}
              <div>
                <form>
                  {/* Profile Photo */}
                  <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-head">
                      <div className="card-accent"></div>
                      <div className="card-title">Profile Photo</div>
                    </div>
                    <div className="card-body">
                      <div className="upload-zone">
                        <input type="file" id="upload-image" accept="image/*" />
                        <div className="upload-icon">📷</div>
                        <div className="upload-label">Click or drag to upload a photo</div>
                        <div className="upload-sub">PNG, JPG up to 5 MB</div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="card" style={{ marginBottom: '20px' }}>
                    <div className="card-head">
                      <div className="card-accent"></div>
                      <div className="card-title">Personal Information</div>
                    </div>
                    <div className="card-body">
                      <div className="form-grid">
                        <div className="form-group span-full">
                          <label htmlFor="full-name">Full Name <span className="req">*</span></label>
                          <input type="text" id="full-name" placeholder="e.g. Juan Dela Cruz" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="birthday">Date of Birth <span className="req">*</span></label>
                          <input type="date" id="birthday" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="age">Age</label>
                          <input type="number" id="age" placeholder="Auto-calculated" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email Address <span className="req">*</span></label>
                          <input type="email" id="email" placeholder="e.g. name@example.com" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="contact-number">Contact Number <span className="req">*</span></label>
                          <input type="text" id="contact-number" placeholder="e.g. 09123456789" />
                        </div>
                        <div className="form-group span-full">
                          <label htmlFor="address">Address</label>
                          <input type="text" id="address" placeholder="Street, City, Province" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Details */}
                  <div className="card">
                    <div className="card-head">
                      <div className="card-accent"></div>
                      <div className="card-title">Assignment Details</div>
                    </div>
                    <div className="card-body">
                      <div className="form-grid">
                        <div className="form-group span-full">
                          <label htmlFor="office">Office Assignment <span className="req">*</span></label>
                          <select id="office">
                            <option value="">Select office</option>
                            <option value="College of Computing Studies">College of Computing Studies</option>
                            <option value="College of Business">College of Business</option>
                            <option value="LTO Office – Candon City">LTO Office — Candon City</option>
                            <option value="DepEd Office">DepEd Office</option>
                            <option value="Municipal Hall">Municipal Hall</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/admin-supervisors');
                        }}
                      >
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Cancel
                      </button>
                      <button type="submit" className="btn-submit">
                        <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Save Supervisor
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* ─── RIGHT COLUMN: PREVIEW + TIPS ─── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card">
                  <div className="card-head">
                    <div className="card-accent"></div>
                    <div className="card-title">Preview</div>
                  </div>
                  <div className="card-body">
                    <div className="summary-avatar">+</div>
                    <div className="summary-placeholder">
                      <strong>New Supervisor</strong>
                      Fill in the form to see a preview
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-head">
                    <div className="card-accent"></div>
                    <div className="card-title">Quick Tips</div>
                  </div>
                  <div className="card-body">
                    <div className="tips-list">
                      <div className="tip-item">
                        <div className="tip-dot"></div>
                        Fields marked with <span style={{ color: 'var(--brand)', fontWeight: '700', margin: '0 2px' }}>*</span> are required before submitting.
                      </div>
                      <div className="tip-item">
                        <div className="tip-dot"></div>
                        Make sure the email is valid — it will be used to send login credentials.
                      </div>
                      <div className="tip-item">
                        <div className="tip-dot"></div>
                        Select the correct office so trainees can be properly assigned to this supervisor.
                      </div>
                      <div className="tip-item">
                        <div className="tip-dot"></div>
                        A profile photo is optional but helps with identification.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </AdminLayout>
      </IonContent>
    </IonPage>
  );
};

export default AdminAddSupervisor;