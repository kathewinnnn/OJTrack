import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline, timeOutline, calendarOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import SupervisorBottomNav from '../../components/SupervisorBottomNav';
import './supervisor.css';

interface DTRRecord {
  id: number;
  date: string;
  morningIn: string | null;
  morningOut: string | null;
  afternoonIn: string | null;
  afternoonOut: string | null;
  hours: number;
  status: 'Present' | 'Absent';
}

interface AttendanceRecord {
  id: number;
  studentName: string;
  timeIn: string | null;
  timeOut: string | null;
  status: 'Present' | 'Logged In' | 'Absent' | 'Late';
  verificationStatus: 'Pending' | 'Approved' | 'Disapproved';
  dtr: DTRRecord[];
}

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { 
      id: 1, 
      studentName: 'Katherine Mae', 
      timeIn: '8:00 AM', 
      timeOut: null, 
      status: 'Logged In', 
      verificationStatus: 'Pending',
      dtr: [
        { id: 1, date: '2026-02-21', morningIn: '8:00 AM', morningOut: '12:00 PM', afternoonIn: '1:00 PM', afternoonOut: null, hours: 4, status: 'Present' },
        { id: 2, date: '2026-02-20', morningIn: '8:05 AM', morningOut: '12:00 PM', afternoonIn: '1:00 PM', afternoonOut: '5:00 PM', hours: 7.92, status: 'Present' },
        { id: 3, date: '2026-02-19', morningIn: null, morningOut: null, afternoonIn: null, afternoonOut: null, hours: 0, status: 'Absent' },
      ]
    },
    { 
      id: 2, 
      studentName: 'Mark Romer', 
      timeIn: '9:30 AM', 
      timeOut: '4:00 PM', 
      status: 'Present', 
      verificationStatus: 'Approved',
      dtr: [
        { id: 1, date: '2026-02-21', morningIn: '9:30 AM', morningOut: '12:00 PM', afternoonIn: '1:00 PM', afternoonOut: '4:00 PM', hours: 6.5, status: 'Present' },
        { id: 2, date: '2026-02-20', morningIn: '8:00 AM', morningOut: '12:00 PM', afternoonIn: '1:00 PM', afternoonOut: '5:00 PM', hours: 8, status: 'Present' },
        { id: 3, date: '2026-02-19', morningIn: '8:00 AM', morningOut: '12:00 PM', afternoonIn: '1:00 PM', afternoonOut: '5:00 PM', hours: 8, status: 'Present' },
      ]
    },
    { 
      id: 3, 
      studentName: 'Samantha Lumpaodan', 
      timeIn: '9:45 AM', 
      timeOut: '4:15 PM', 
      status: 'Late', 
      verificationStatus: 'Pending',
      dtr: [
        { id: 1, date: '2026-02-21', morningIn: '9:45 AM', morningOut: '12:00 PM', afternoonIn: '1:00 PM', afternoonOut: '4:15 PM', hours: 6.5, status: 'Present' },
        { id: 2, date: '2026-02-20', morningIn: '10:00 AM', morningOut: '12:00 PM', afternoonIn: '1:00 PM', afternoonOut: '5:00 PM', hours: 6, status: 'Present' },
        { id: 3, date: '2026-02-19', morningIn: null, morningOut: null, afternoonIn: null, afternoonOut: null, hours: 0, status: 'Absent' },
      ]
    },
    { 
      id: 4, 
      studentName: 'Raffy Romero', 
      timeIn: null, 
      timeOut: null, 
      status: 'Absent', 
      verificationStatus: 'Disapproved',
      dtr: [
        { id: 1, date: '2026-02-21', morningIn: null, morningOut: null, afternoonIn: null, afternoonOut: null, hours: 0, status: 'Absent' },
        { id: 2, date: '2026-02-20', morningIn: null, morningOut: null, afternoonIn: null, afternoonOut: null, hours: 0, status: 'Absent' },
        { id: 3, date: '2026-02-19', morningIn: null, morningOut: null, afternoonIn: null, afternoonOut: null, hours: 0, status: 'Absent' },
      ]
    },
  ]);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleApprove = (id: number) =>
    setRecords(r => r.map(rec => rec.id === id ? { ...rec, verificationStatus: 'Approved' as const } : rec));

  const handleDisapprove = (id: number) =>
    setRecords(r => r.map(rec => rec.id === id ? { ...rec, verificationStatus: 'Disapproved' as const } : rec));

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const attendanceCfg: Record<string, { color: string; bg: string }> = {
    Present:     { color: 'var(--c-green)', bg: 'rgba(52,211,153,0.1)' },
    'Logged In': { color: 'var(--c-blue)',  bg: 'rgba(96,165,250,0.1)' },
    Late:        { color: 'var(--c-amber)', bg: 'rgba(251,191,36,0.1)' },
    Absent:      { color: 'var(--c-red)',   bg: 'rgba(248,113,113,0.1)' },
  };

  const verifyCfg: Record<string, { color: string; bg: string }> = {
    Approved:    { color: 'var(--c-green)', bg: 'rgba(52,211,153,0.12)' },
    Disapproved: { color: 'var(--c-red)',   bg: 'rgba(248,113,113,0.12)' },
    Pending:     { color: 'var(--c-amber)', bg: 'rgba(251,191,36,0.12)' },
  };

  const approved    = records.filter(r => r.verificationStatus === 'Approved').length;
  const pending     = records.filter(r => r.verificationStatus === 'Pending').length;
  const disapproved = records.filter(r => r.verificationStatus === 'Disapproved').length;

  return (
    <IonPage>
      <IonContent fullscreen className="sv-content">

        {/* Hero */}
        <div className="sv-hero">
          <div className="sv-hero-bg" />
          <div className="sv-hero-inner">
            <p className="sv-hero-sub">Review &amp; verify</p>
            <h1 className="sv-hero-name">Attendance</h1>
            <div className="sv-hero-meta">
              <span className="sv-hero-chip">
                <IonIcon icon={calendarOutline} />
                Today
              </span>
              <span className="sv-hero-chip sv-chip-amber">{pending} pending</span>
            </div>
          </div>
        </div>

        <div className="sv-body">

          {/* Summary Row */}
          <br/>
          <div className="sv-stats-grid sv-stats-3">
            <div className="sv-stat-card sv-stat-green">
              <div className="sv-stat-icon-wrap"><IonIcon icon={checkmarkCircleOutline} /></div>
              <p className="sv-stat-num">{approved}</p>
              <p className="sv-stat-lbl">Approved</p>
            </div>
            <div className="sv-stat-card sv-stat-amber">
              <div className="sv-stat-icon-wrap"><IonIcon icon={timeOutline} /></div>
              <p className="sv-stat-num">{pending}</p>
              <p className="sv-stat-lbl">Pending</p>
            </div>
            <div className="sv-stat-card sv-stat-red">
              <div className="sv-stat-icon-wrap"><IonIcon icon={closeCircleOutline} /></div>
              <p className="sv-stat-num">{disapproved}</p>
              <p className="sv-stat-lbl">Disapproved</p>
            </div>
          </div>

          {/* Section Header */}
          <div className="sv-list-header">
            <span className="sv-list-title">Attendance Records</span>
            <span className="sv-list-count">{records.length} students</span>
          </div>

          {/* Records */}
          <div className="sv-attend-list">
            {records.map(rec => {
              const aCfg = attendanceCfg[rec.status];
              const vCfg = verifyCfg[rec.verificationStatus];
              const isExpanded = expandedId === rec.id;

              return (
                <div key={rec.id} className="sv-attend-wrapper">

                  {/* ── Main Card ── */}
                  <div className="sv-attend-card">
                    {/* Avatar */}
                    <div className="sv-attend-avatar">{initials(rec.studentName)}</div>

                    {/* Info */}
                    <div className="sv-attend-info">
                      <div className="sv-attend-name-row">
                        <span className="sv-attend-name">{rec.studentName}</span>
                        <span
                          className="sv-attend-status-chip"
                          style={{ color: aCfg.color, background: aCfg.bg }}
                        >
                          {rec.status}
                        </span>
                      </div>

                      <div className="sv-attend-times">
                        {rec.timeIn
                          ? <span className="sv-time-pill sv-time-in">
                              <IonIcon icon={timeOutline} /> In: {rec.timeIn}
                            </span>
                          : <span className="sv-time-pill sv-time-absent">No time in</span>
                        }
                        {rec.timeOut &&
                          <span className="sv-time-pill sv-time-out">
                            <IonIcon icon={timeOutline} /> Out: {rec.timeOut}
                          </span>
                        }
                      </div>

                      <span
                        className="sv-verify-badge"
                        style={{ color: vCfg.color, background: vCfg.bg }}
                      >
                        {rec.verificationStatus}
                      </span>
                    </div>

                    {/* Right: actions + expand — always visible, never overlapping */}
                    <div className="sv-attend-right">
                      {rec.verificationStatus === 'Pending' && (
                        <div className="sv-attend-actions">
                          <button
                            className="sv-action-btn sv-btn-approve"
                            onClick={() => handleApprove(rec.id)}
                            title="Approve"
                          >
                            <IonIcon icon={checkmarkCircleOutline} />
                          </button>
                          <button
                            className="sv-action-btn sv-btn-reject"
                            onClick={() => handleDisapprove(rec.id)}
                            title="Disapprove"
                          >
                            <IonIcon icon={closeCircleOutline} />
                          </button>
                        </div>
                      )}

                      {/* Expand toggle — isolated button, never overlaps table */}
                      <button
                        className="sv-expand-btn"
                        onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                        title={isExpanded ? 'Collapse DTR' : 'View DTR'}
                      >
                        <IonIcon icon={isExpanded ? chevronUpOutline : chevronDownOutline} />
                      </button>
                    </div>
                  </div>

                  {/* ── DTR Panel — rendered BELOW the card, outside its flow ── */}
                  {isExpanded && (
                    <div className="sv-dtr-panel">
                      <p className="sv-dtr-panel-title">Daily Time Record</p>
                      <div className="sv-dtr-cards">
                        {rec.dtr.map(dtr => (
                          <div key={dtr.id} className="sv-dtr-day-card">
                            {/* Date + status row */}
                            <div className="sv-dtr-day-header">
                              <span className="sv-dtr-date">{dtr.date}</span>
                              <span
                                className="sv-dtr-status"
                                style={{
                                  color: dtr.status === 'Present' ? 'var(--c-green)' : 'var(--c-red)',
                                  background: dtr.status === 'Present' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                                }}
                              >
                                {dtr.status}
                              </span>
                            </div>

                            {/* Time slots grid */}
                            <div className="sv-dtr-slots">
                              <div className="sv-dtr-slot">
                                <span className="sv-dtr-slot-lbl">Morning In</span>
                                <span className="sv-dtr-slot-val">{dtr.morningIn || '—'}</span>
                              </div>
                              <div className="sv-dtr-slot">
                                <span className="sv-dtr-slot-lbl">Morning Out</span>
                                <span className="sv-dtr-slot-val">{dtr.morningOut || '—'}</span>
                              </div>
                              <div className="sv-dtr-slot">
                                <span className="sv-dtr-slot-lbl">Afternoon In</span>
                                <span className="sv-dtr-slot-val">{dtr.afternoonIn || '—'}</span>
                              </div>
                              <div className="sv-dtr-slot">
                                <span className="sv-dtr-slot-lbl">Afternoon Out</span>
                                <span className="sv-dtr-slot-val">{dtr.afternoonOut || '—'}</span>
                              </div>
                            </div>

                            {/* Hours */}
                            <div className="sv-dtr-hours">
                              <span className="sv-dtr-slot-lbl">Total Hours</span>
                              <span className="sv-dtr-hours-val">{dtr.hours.toFixed(2)} hrs</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </IonContent>
      <SupervisorBottomNav activeTab="attendance" />
    </IonPage>
  );
};

export default Attendance;