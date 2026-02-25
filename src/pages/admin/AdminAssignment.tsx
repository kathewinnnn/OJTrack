import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Trainee {
  id: string;
  name: string;
  studentId: string;
  program: string;
  year: string;
  email: string;
  assignedSupervisorId: string | null;
}

interface Supervisor {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  email: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_TRAINEES: Trainee[] = [
  { id: 't1', name: 'Maria Santos',    studentId: '2021-00001', program: 'BSIT',  year: '4th Year', email: 'maria@school.edu',   assignedSupervisorId: null },
  { id: 't2', name: 'Juan dela Cruz',  studentId: '2021-00042', program: 'BSCS',  year: '3rd Year', email: 'juan@school.edu',    assignedSupervisorId: null },
  { id: 't3', name: 'Ana Reyes',       studentId: '2022-00011', program: 'BSIT',  year: '4th Year', email: 'ana@school.edu',     assignedSupervisorId: null },
  { id: 't4', name: 'Carlo Bautista',  studentId: '2020-00088', program: 'BSIS',  year: '4th Year', email: 'carlo@school.edu',   assignedSupervisorId: null },
  { id: 't5', name: 'Lea Mendoza',     studentId: '2022-00055', program: 'BSCS',  year: '3rd Year', email: 'lea@school.edu',     assignedSupervisorId: null },
  { id: 't6', name: 'Ramon Torres',    studentId: '2021-00076', program: 'BSIT',  year: '4th Year', email: 'ramon@school.edu',   assignedSupervisorId: null },
  { id: 't7', name: 'Sofia Garcia',    studentId: '2023-00003', program: 'BSCS',  year: '2nd Year', email: 'sofia@school.edu',   assignedSupervisorId: null },
  { id: 't8', name: 'Mikael Lim',      studentId: '2021-00099', program: 'BSIS',  year: '4th Year', email: 'mikael@school.edu',  assignedSupervisorId: null },
];

const MOCK_SUPERVISORS: Supervisor[] = [
  { id: 's1', name: 'Dr. Elena Cruz',      employeeId: 'EMP-001', department: 'IT Department',   email: 'ecruz@company.com'   },
  { id: 's2', name: 'Engr. Marco Reyes',   employeeId: 'EMP-002', department: 'Engineering',     email: 'mreyes@company.com'  },
  { id: 's3', name: 'Ms. Carla Santos',    employeeId: 'EMP-003', department: 'Web Development', email: 'csantos@company.com' },
  { id: 's4', name: 'Mr. Bien Villanueva', employeeId: 'EMP-004', department: 'Data Analytics',  email: 'bvilla@company.com'  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (name: string) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const AVATAR_COLORS = ['#5f0076','#7a1896','#9c27b0','#c752f0','#3d004c','#4a148c'];
const avatarColor = (id: string) =>
  AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

// ── Component ─────────────────────────────────────────────────────────────────
const AdminAssignment: React.FC = () => {
  const [trainees] = useState<Trainee[]>(() => {
    try { const s = localStorage.getItem('trainees'); return s ? JSON.parse(s) : MOCK_TRAINEES; }
    catch { return MOCK_TRAINEES; }
  });

  const [supervisors] = useState<Supervisor[]>(() => {
    try { const s = localStorage.getItem('supervisors'); return s ? JSON.parse(s) : MOCK_SUPERVISORS; }
    catch { return MOCK_SUPERVISORS; }
  });

  const [assignments, setAssignments] = useState<Record<string, string[]>>(() => {
    try { const s = localStorage.getItem('assignments'); return s ? JSON.parse(s) : {}; }
    catch { return {}; }
  });

  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [traineeSearch, setTraineeSearch]       = useState('');
  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [toast, setToast]   = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'assign' | 'overview'>('assign');

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const assignedTo = (supId: string): string[] => assignments[supId] ?? [];

  const getTraineeSupervisor = (traineeId: string): string | null => {
    for (const [supId, ids] of Object.entries(assignments)) {
      if (ids.includes(traineeId)) return supId;
    }
    return null;
  };

  const toggleAssignment = (traineeId: string) => {
    if (!selectedSupervisor) return;
    const currentSup = getTraineeSupervisor(traineeId);
    setAssignments(prev => {
      const next = { ...prev };
      if (currentSup && currentSup !== selectedSupervisor) {
        next[currentSup] = (next[currentSup] ?? []).filter(id => id !== traineeId);
      }
      const current = next[selectedSupervisor] ?? [];
      if (current.includes(traineeId)) {
        next[selectedSupervisor] = current.filter(id => id !== traineeId);
        showToast('Trainee unassigned.');
      } else {
        next[selectedSupervisor] = [...current, traineeId];
        showToast('Trainee assigned successfully!');
      }
      return next;
    });
  };

  const unassign = (supId: string, traineeId: string) => {
    setAssignments(prev => ({
      ...prev,
      [supId]: (prev[supId] ?? []).filter(id => id !== traineeId),
    }));
    showToast('Assignment removed.');
  };

  const filteredTrainees = trainees.filter(t =>
    t.name.toLowerCase().includes(traineeSearch.toLowerCase()) ||
    t.studentId.includes(traineeSearch) ||
    t.program.toLowerCase().includes(traineeSearch.toLowerCase())
  );

  const filteredSupervisors = supervisors.filter(s =>
    s.name.toLowerCase().includes(supervisorSearch.toLowerCase()) ||
    s.department.toLowerCase().includes(supervisorSearch.toLowerCase())
  );

  const totalAssigned   = Object.values(assignments).flat().length;
  const unassignedCount = trainees.length - totalAssigned;
  const selectedSup     = supervisors.find(s => s.id === selectedSupervisor);

  return (
    <AdminLayout activeMenu="assignment">
      <style>{`
        /* ─────────────────────────────────────────────
           SCROLLBAR FIX
           The topbar uses position:sticky so it stays
           at the top while the AdminLayout's own scroll
           container scrolls the rest of the page.
           No wrapper div needed — content just grows
           naturally and the parent scrolls.
        ───────────────────────────────────────────── */

        .asgn-topbar {
          height: 60px;
          background: #fff;
          border-bottom: 1px solid #ede6f2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          /* sticky keeps it pinned without breaking the
             parent's overflow/scroll chain */
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 1px 3px rgba(0,0,0,.06);
        }

        .asgn-breadcrumb { display:flex; align-items:center; gap:8px; font-size:.85rem; color:#7b6e89; }
        .asgn-breadcrumb .crumb-active { color:#1a1025; font-weight:600; }

        /* Page content — natural height, no overflow hidden */
        .asgn-page { padding:28px 32px 60px; box-sizing:border-box; }

        /* Stats */
        .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px; }
        .stat-card { background:#fff; border:1px solid #ede6f2; border-radius:14px; padding:18px 20px; display:flex; align-items:center; gap:14px; box-shadow:0 1px 3px rgba(0,0,0,.05); }
        .stat-icon { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .stat-icon svg { width:20px; height:20px; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
        .stat-val { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:800; color:#1a1025; line-height:1; }
        .stat-label { font-size:.75rem; color:#7b6e89; margin-top:3px; font-weight:500; }

        /* Tabs */
        .tab-row { display:flex; gap:4px; margin-bottom:24px; background:#f7f4fb; border-radius:12px; padding:4px; width:fit-content; border:1px solid #ede6f2; }
        .tab-btn { padding:8px 22px; border-radius:9px; border:none; background:none; font-family:'DM Sans',sans-serif; font-size:.875rem; font-weight:600; color:#7b6e89; cursor:pointer; transition:all .18s; }
        .tab-btn.active { background:#fff; color:#5f0076; box-shadow:0 1px 4px rgba(0,0,0,.1); }

        /* ── Assign layout: fluid left column, right fills rest ── */
        .assign-layout {
          display: grid;
          grid-template-columns: minmax(200px, 260px) 1fr;
          gap: 20px;
          align-items: start;
        }

        /* Panels */
        .panel { background:#fff; border:1px solid #ede6f2; border-radius:18px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,.05); min-width:0; }
        .panel-head { padding:16px 20px; border-bottom:1px solid #ede6f2; display:flex; align-items:center; gap:10px; }
        .panel-accent { width:3px; height:16px; background:#5f0076; border-radius:2px; flex-shrink:0; }
        .panel-title { font-family:'Syne',sans-serif; font-size:.95rem; font-weight:700; color:#1a1025; }
        .panel-search { padding:12px 16px; border-bottom:1px solid #ede6f2; }
        .search-input { width:100%; padding:8px 12px; border-radius:8px; border:1.5px solid #ede6f2; background:#f7f4fb; font-size:.85rem; font-family:'DM Sans',sans-serif; color:#1a1025; outline:none; transition:all .18s; box-sizing:border-box; }
        .search-input:focus { border-color:#5f0076; background:#fff; box-shadow:0 0 0 3px rgba(95,0,118,.1); }
        .search-input::placeholder { color:#7b6e89; }

        /* Supervisor list — scrolls internally with styled scrollbar */
        .panel-list {
          max-height: 460px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #c4a8d4 #f7f4fb;
        }
        .panel-list::-webkit-scrollbar { width:4px; }
        .panel-list::-webkit-scrollbar-track { background:#f7f4fb; }
        .panel-list::-webkit-scrollbar-thumb { background:#c4a8d4; border-radius:99px; }
        .panel-list::-webkit-scrollbar-thumb:hover { background:#5f0076; }

        .sup-item { display:flex; align-items:center; gap:12px; padding:12px 16px; cursor:pointer; border-bottom:1px solid #f7f4fb; transition:all .15s; }
        .sup-item:hover { background:#f7f4fb; }
        .sup-item.selected { background:#f3e6f8; border-left:3px solid #5f0076; }
        .sup-item .sup-av { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:.75rem; font-weight:700; color:#fff; flex-shrink:0; }
        .sup-item .sup-name { font-size:.875rem; font-weight:600; color:#1a1025; line-height:1.2; }
        .sup-item .sup-dept { font-size:.75rem; color:#7b6e89; }
        .sup-badge { margin-left:auto; background:#5f0076; color:#fff; font-size:.7rem; font-weight:700; padding:2px 8px; border-radius:99px; flex-shrink:0; }
        .sup-badge.zero { background:#ede6f2; color:#7b6e89; }

        /* Empty state */
        .trainee-panel-empty { padding:60px 20px; text-align:center; color:#7b6e89; }
        .trainee-panel-empty svg { width:48px; height:48px; stroke:#ede6f2; fill:none; stroke-width:1.5; margin:0 auto 14px; display:block; }
        .trainee-panel-empty p { font-size:.9rem; }
        .trainee-panel-empty strong { display:block; font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:700; color:#3d3049; margin-bottom:6px; }

        /* Trainee grid — fluid columns so it fills available width */
        .trainee-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
          gap: 12px;
          padding: 16px;
        }

        .trainee-card { border:1.5px solid #ede6f2; border-radius:12px; padding:14px; cursor:pointer; transition:all .18s; background:#fff; position:relative; min-width:0; }
        .trainee-card:hover { border-color:#7a1896; box-shadow:0 4px 14px rgba(95,0,118,.12); transform:translateY(-1px); }
        .trainee-card.assigned { border-color:#5f0076; background:#f3e6f8; }
        .trainee-card.assigned-elsewhere { border-color:#c4b5c9; background:#faf8fc; opacity:.75; }
        .trainee-card-check { position:absolute; top:10px; right:10px; width:20px; height:20px; border-radius:50%; border:2px solid #ede6f2; background:#fff; display:flex; align-items:center; justify-content:center; transition:all .18s; }
        .trainee-card.assigned .trainee-card-check { background:#5f0076; border-color:#5f0076; }
        .trainee-card-check svg { width:10px; height:10px; stroke:#fff; fill:none; stroke-width:3; stroke-linecap:round; stroke-linejoin:round; }
        .trainee-av { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:.8rem; font-weight:700; color:#fff; margin-bottom:10px; }
        .trainee-name { font-size:.875rem; font-weight:700; color:#1a1025; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .trainee-id { font-size:.72rem; color:#7b6e89; margin-bottom:4px; }
        .trainee-tag { display:inline-block; font-size:.68rem; font-weight:600; padding:2px 8px; border-radius:99px; background:#f3e6f8; color:#5f0076; }
        .trainee-elsewhere-label { font-size:.68rem; color:#9c27b0; font-weight:600; margin-top:4px; }

        /* Overview */
        .overview-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; }
        .ov-card { background:#fff; border:1px solid #ede6f2; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,.05); }
        .ov-card-head { padding:16px 20px; display:flex; align-items:center; gap:12px; border-bottom:1px solid #ede6f2; background:linear-gradient(135deg,#3d004c 0%,#5f0076 100%); }
        .ov-card-head .ov-av { width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,.2); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:.8rem; font-weight:700; color:#fff; flex-shrink:0; }
        .ov-card-head .ov-name { font-family:'Syne',sans-serif; font-size:.9rem; font-weight:700; color:#fff; }
        .ov-card-head .ov-dept { font-size:.72rem; color:rgba(255,255,255,.6); }
        .ov-count { margin-left:auto; background:rgba(255,255,255,.2); color:#fff; font-size:.75rem; font-weight:700; padding:4px 10px; border-radius:99px; white-space:nowrap; }
        .ov-trainee-list { padding:12px; display:flex; flex-direction:column; gap:8px; }
        .ov-trainee-row { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:9px; background:#f7f4fb; border:1px solid #ede6f2; }
        .ov-trainee-av { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:.65rem; font-weight:700; color:#fff; flex-shrink:0; }
        .ov-trainee-name { font-size:.8rem; font-weight:600; color:#1a1025; flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ov-trainee-prog { font-size:.7rem; color:#7b6e89; }
        .ov-remove-btn { width:24px; height:24px; border-radius:6px; border:1px solid #ede6f2; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; flex-shrink:0; }
        .ov-remove-btn:hover { background:#fff0f0; border-color:#ffb3b3; }
        .ov-remove-btn svg { width:10px; height:10px; stroke:#e05555; fill:none; stroke-width:2.5; stroke-linecap:round; }
        .ov-empty { padding:20px; text-align:center; color:#7b6e89; font-size:.82rem; }

        /* Toast */
        .toast { position:fixed; bottom:28px; right:28px; z-index:9999; padding:12px 20px; border-radius:10px; font-size:.875rem; font-weight:600; color:#fff; box-shadow:0 4px 20px rgba(0,0,0,.18); animation:toastIn .25s cubic-bezier(.4,0,.2,1); display:flex; align-items:center; gap:8px; }
        .toast.success { background:#5f0076; }
        .toast.error { background:#c0392b; }
        .toast svg { width:16px; height:16px; stroke:#fff; fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; }
        @keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }

        /* Page header */
        .pg-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px; }
        .pg-title { font-family:'Syne',sans-serif; font-size:1.55rem; font-weight:800; color:#1a1025; letter-spacing:-.02em; }
        .pg-sub { font-size:.875rem; color:#7b6e89; margin-top:4px; }

        /* Trainee panel header */
        .trainee-panel-header { padding:14px 16px; border-bottom:1px solid #ede6f2; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
        .trainee-panel-sup { display:flex; align-items:center; gap:10px; min-width:0; }
        .trainee-panel-sup-av { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:.75rem; font-weight:700; color:#fff; flex-shrink:0; }
        .trainee-panel-sup-name { font-size:.875rem; font-weight:700; color:#1a1025; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .trainee-panel-sup-dept { font-size:.72rem; color:#7b6e89; }
        .assigned-count-pill { background:#f3e6f8; color:#5f0076; font-size:.75rem; font-weight:700; padding:4px 12px; border-radius:99px; border:1px solid rgba(95,0,118,.15); white-space:nowrap; flex-shrink:0; }

        /* Responsive */
        @media (max-width:1000px) {
          .assign-layout { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width:600px) {
          .asgn-page { padding:16px 14px 40px; }
          .asgn-topbar { padding:0 16px; }
          .trainee-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width:440px) {
          .stats-row { grid-template-columns: 1fr; }
          .trainee-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Sticky topbar ── */}
      <div className="asgn-topbar">
        <div className="asgn-breadcrumb">
          <span>Admin</span>
          <svg viewBox="0 0 24 24" width="14" height="14" style={{ stroke:'#7b6e89', fill:'none', strokeWidth:2 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span className="crumb-active">Assignment</span>
        </div>
        <div style={{ fontSize:'.8rem', color:'#7b6e89', fontWeight:500 }}>
          {new Date().toLocaleDateString('en-PH', { weekday:'short', year:'numeric', month:'short', day:'numeric' })}
        </div>
      </div>

      {/* ── Page content — grows naturally, parent container scrolls ── */}
      <div className="asgn-page">

        <div className="pg-header">
          <div>
            <div className="pg-title">Trainee Assignment</div>
            <div className="pg-sub">Assign trainees to supervisors and manage their pairings</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon" style={{ background:'#f3e6f8' }}>
              <svg viewBox="0 0 24 24" style={{ stroke:'#5f0076' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div><div className="stat-val">{trainees.length}</div><div className="stat-label">Total Trainees</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background:'#e8f5e9' }}>
              <svg viewBox="0 0 24 24" style={{ stroke:'#2e7d32' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <div><div className="stat-val">{supervisors.length}</div><div className="stat-label">Supervisors</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background:'#e3f2fd' }}>
              <svg viewBox="0 0 24 24" style={{ stroke:'#1565c0' }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div><div className="stat-val">{totalAssigned}</div><div className="stat-label">Assigned</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background:'#fff3e0' }}>
              <svg viewBox="0 0 24 24" style={{ stroke:'#e65100' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div><div className="stat-val">{unassignedCount}</div><div className="stat-label">Unassigned</div></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-row">
          <button className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`} onClick={() => setActiveTab('assign')}>
            Assign Trainees
          </button>
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
        </div>

        {/* ══ ASSIGN TAB ══ */}
        {activeTab === 'assign' && (
          <div className="assign-layout">

            {/* Left: supervisor list */}
            <div className="panel">
              <div className="panel-head">
                <div className="panel-accent"/>
                <div className="panel-title">Supervisors</div>
              </div>
              <div className="panel-search">
                <input className="search-input" placeholder="Search supervisors..."
                  value={supervisorSearch} onChange={e => setSupervisorSearch(e.target.value)} />
              </div>
              <div className="panel-list">
                {filteredSupervisors.map(sup => {
                  const count = assignedTo(sup.id).length;
                  return (
                    <div key={sup.id}
                      className={`sup-item ${selectedSupervisor === sup.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSupervisor(sup.id)}
                    >
                      <div className="sup-av" style={{ background: avatarColor(sup.id) }}>
                        {initials(sup.name)}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="sup-name">{sup.name}</div>
                        <div className="sup-dept">{sup.department}</div>
                      </div>
                      <div className={`sup-badge ${count === 0 ? 'zero' : ''}`}>{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: trainee picker */}
            <div className="panel">
              {!selectedSupervisor ? (
                <div className="trainee-panel-empty">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <strong>No Supervisor Selected</strong>
                  <p>Select a supervisor on the left to start assigning trainees</p>
                </div>
              ) : (
                <>
                  <div className="trainee-panel-header">
                    <div className="trainee-panel-sup">
                      <div className="trainee-panel-sup-av" style={{ background: avatarColor(selectedSupervisor) }}>
                        {initials(selectedSup!.name)}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div className="trainee-panel-sup-name">{selectedSup!.name}</div>
                        <div className="trainee-panel-sup-dept">{selectedSup!.department}</div>
                      </div>
                    </div>
                    <div className="assigned-count-pill">
                      {assignedTo(selectedSupervisor).length} assigned
                    </div>
                  </div>
                  <div className="panel-search">
                    <input className="search-input" placeholder="Search trainees by name, ID or program..."
                      value={traineeSearch} onChange={e => setTraineeSearch(e.target.value)} />
                  </div>
                  <div className="trainee-grid">
                    {filteredTrainees.map(t => {
                      const isAssignedHere      = assignedTo(selectedSupervisor).includes(t.id);
                      const elsewhereSupId      = getTraineeSupervisor(t.id);
                      const isAssignedElsewhere = !isAssignedHere && elsewhereSupId !== null;
                      const elsewhereSupName    = isAssignedElsewhere
                        ? supervisors.find(s => s.id === elsewhereSupId)?.name : null;
                      return (
                        <div key={t.id}
                          className={`trainee-card ${isAssignedHere ? 'assigned' : ''} ${isAssignedElsewhere ? 'assigned-elsewhere' : ''}`}
                          onClick={() => toggleAssignment(t.id)}
                          title={isAssignedElsewhere ? `Currently assigned to ${elsewhereSupName}. Click to reassign.` : ''}
                        >
                          <div className="trainee-card-check">
                            {isAssignedHere && <svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg>}
                          </div>
                          <div className="trainee-av" style={{ background: avatarColor(t.id) }}>
                            {initials(t.name)}
                          </div>
                          <div className="trainee-name">{t.name}</div>
                          <div className="trainee-id">{t.studentId}</div>
                          <div>
                            <span className="trainee-tag">{t.program}</span>
                            {' '}
                            <span className="trainee-tag" style={{ background:'#f7f4fb', color:'#7b6e89' }}>{t.year}</span>
                          </div>
                          {isAssignedElsewhere && (
                            <div className="trainee-elsewhere-label">↪ {elsewhereSupName}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === 'overview' && (
          <div className="overview-grid">
            {supervisors.map(sup => {
              const assignedIds      = assignedTo(sup.id);
              const assignedTrainees = trainees.filter(t => assignedIds.includes(t.id));
              return (
                <div key={sup.id} className="ov-card">
                  <div className="ov-card-head">
                    <div className="ov-av">{initials(sup.name)}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="ov-name">{sup.name}</div>
                      <div className="ov-dept">{sup.department} · {sup.employeeId}</div>
                    </div>
                    <div className="ov-count">
                      {assignedTrainees.length} trainee{assignedTrainees.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="ov-trainee-list">
                    {assignedTrainees.length === 0 ? (
                      <div className="ov-empty">No trainees assigned yet</div>
                    ) : (
                      assignedTrainees.map(t => (
                        <div key={t.id} className="ov-trainee-row">
                          <div className="ov-trainee-av" style={{ background: avatarColor(t.id) }}>
                            {initials(t.name)}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div className="ov-trainee-name">{t.name}</div>
                            <div className="ov-trainee-prog">{t.studentId} · {t.program} · {t.year}</div>
                          </div>
                          <button className="ov-remove-btn" onClick={() => unassign(sup.id, t.id)} title="Remove assignment">
                            <svg viewBox="0 0 10 10">
                              <line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/>
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                    <button
                      onClick={() => { setSelectedSupervisor(sup.id); setActiveTab('assign'); }}
                      style={{ width:'100%', marginTop:4, padding:'8px', border:'1.5px dashed #ede6f2', borderRadius:9, background:'none', cursor:'pointer', color:'#7b6e89', fontSize:'.78rem', fontWeight:600, fontFamily:'DM Sans,sans-serif', transition:'all .15s' }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor='#5f0076'; (e.currentTarget as HTMLElement).style.color='#5f0076'; }}
                      onMouseOut={e  => { (e.currentTarget as HTMLElement).style.borderColor='#ede6f2'; (e.currentTarget as HTMLElement).style.color='#7b6e89'; }}
                    >
                      + Assign Trainees
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success'
            ? <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAssignment;