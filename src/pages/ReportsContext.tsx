import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Report {
  id: number;
  title: string;
  date: string;
  status: 'Submitted' | 'Pending';
  type: string;
  description: string;
  fullDetails?: string;
  attachments?: string[];
  attachmentPreviews?: string[];
  submittedAt: number;
}

const SEED_REPORTS: Report[] = [
  {
    id: 1,
    title: 'Weekly Report – Week 1',
    date: 'Jan 6, 2025',
    status: 'Submitted',
    type: 'Weekly',
    description: 'First week of OJT activities and observations',
    fullDetails: "During the first week of OJT, I was oriented on the company's policies, workflows, and tools. I was introduced to the development team and assigned to shadow senior developers. Key activities included attending the project kickoff meeting, setting up the local development environment, and reviewing existing codebase documentation.",
    attachments: ['week1_photo1.jpg', 'week1_photo2.jpg'],
    attachmentPreviews: [],
    submittedAt: new Date('2025-01-06').getTime(),
  },
  {
    id: 2,
    title: 'Weekly Report – Week 2',
    date: 'Jan 13, 2025',
    status: 'Submitted',
    type: 'Weekly',
    description: 'Second week progress and learnings',
    fullDetails: "The second week focused on hands-on tasks. I was assigned minor bug fixes and UI improvements. I participated in the daily stand-up meetings and gained familiarity with the team's agile workflow. Learned about version control practices using Git and how pull requests are reviewed within the team.",
    attachments: ['week2_summary.jpg'],
    attachmentPreviews: [],
    submittedAt: new Date('2025-01-13').getTime(),
  },
  {
    id: 3,
    title: 'Weekly Report – Week 3',
    date: 'Jan 20, 2025',
    status: 'Pending',
    type: 'Weekly',
    description: 'Third week documentation pending',
    fullDetails: 'Report is currently being prepared. Activities this week included working on a feature branch, writing unit tests, and assisting in a client demo preparation.',
    attachments: [],
    attachmentPreviews: [],
    submittedAt: new Date('2025-01-20').getTime(),
  },
  {
    id: 5,
    title: 'Weekly Report – Week 4',
    date: 'Feb 3, 2025',
    status: 'Submitted',
    type: 'Weekly',
    description: 'Fourth week summary and achievements',
    fullDetails: 'Week 4 marked a significant milestone — the feature I worked on was merged into the main branch. I also completed my first solo task: implementing a responsive data table component. Received positive feedback from the supervisor and was given more responsibilities going into the next sprint.',
    attachments: ['week4_merge.jpg', 'week4_component.jpg', 'week4_feedback.jpg'],
    attachmentPreviews: [],
    submittedAt: new Date('2025-02-03').getTime(),
  },
  {
    id: 6,
    title: 'Midterm Report',
    date: 'Feb 10, 2025',
    status: 'Pending',
    type: 'Midterm',
    description: 'Midterm evaluation and progress report',
    fullDetails: 'The midterm report covers the first half of the OJT period. It includes a self-evaluation of skills acquired, challenges encountered, and goals for the remaining weeks. Currently pending supervisor signature before final submission.',
    attachments: ['midterm_eval.jpg'],
    attachmentPreviews: [],
    submittedAt: new Date('2025-02-10').getTime(),
  },
];

const STORAGE_KEY = 'ojt_user_reports';
const DELETED_SEED_KEY = 'ojt_deleted_seed_ids';
const EDITED_SEED_KEY = 'ojt_edited_seed_reports';

const loadUserReports = (): Report[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Report[]) : [];
  } catch { return []; }
};

const saveUserReports = (reports: Report[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reports)); }
  catch (e) { console.warn('ReportsContext: could not persist reports.', e); }
};

const loadDeletedSeedIds = (): Set<number> => {
  try {
    const raw = localStorage.getItem(DELETED_SEED_KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch { return new Set(); }
};

const saveDeletedSeedIds = (ids: Set<number>) => {
  try { localStorage.setItem(DELETED_SEED_KEY, JSON.stringify([...ids])); }
  catch (e) { console.warn('ReportsContext: could not persist deletedSeedIds.', e); }
};

const loadEditedSeedReports = (): Map<number, Report> => {
  try {
    const raw = localStorage.getItem(EDITED_SEED_KEY);
    if (!raw) return new Map();
    return new Map((JSON.parse(raw) as [number, Report][]));
  } catch { return new Map(); }
};

const saveEditedSeedReports = (map: Map<number, Report>) => {
  try { localStorage.setItem(EDITED_SEED_KEY, JSON.stringify([...map])); }
  catch (e) { console.warn('ReportsContext: could not persist editedSeedReports.', e); }
};

// ── Context ──────────────────────────────────────────────────────────────────
interface ReportsContextValue {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'submittedAt'>) => void;
  updateReport: (id: number, updates: Partial<Omit<Report, 'id' | 'submittedAt'>>) => void;
  deleteReport: (id: number) => void;
}

const ReportsContext = createContext<ReportsContextValue>({
  reports: SEED_REPORTS,
  addReport: () => {},
  updateReport: () => {},
  deleteReport: () => {},
});

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userReports, setUserReports] = useState<Report[]>(() => loadUserReports());
  const [deletedSeedIds, setDeletedSeedIds] = useState<Set<number>>(() => loadDeletedSeedIds());
  const [editedSeedReports, setEditedSeedReports] = useState<Map<number, Report>>(() => loadEditedSeedReports());

  const seedIds = new Set(SEED_REPORTS.map(r => r.id));
  const safeUserReports = userReports.filter(r => !seedIds.has(r.id));

  const visibleSeedReports = SEED_REPORTS
    .filter(r => !deletedSeedIds.has(r.id))
    .map(r => editedSeedReports.get(r.id) ?? r);

  const reports: Report[] = [...safeUserReports, ...visibleSeedReports];

  useEffect(() => { saveUserReports(safeUserReports); }, [userReports]);
  useEffect(() => { saveDeletedSeedIds(deletedSeedIds); }, [deletedSeedIds]);
  useEffect(() => { saveEditedSeedReports(editedSeedReports); }, [editedSeedReports]);

  const addReport = (report: Omit<Report, 'id' | 'submittedAt'>) => {
    const newReport: Report = { ...report, id: Date.now(), submittedAt: Date.now() };
    setUserReports(prev => [newReport, ...prev]);
  };

  const updateReport = (id: number, updates: Partial<Omit<Report, 'id' | 'submittedAt'>>) => {
    if (seedIds.has(id)) {
      setEditedSeedReports(prev => {
        const base = prev.get(id) ?? SEED_REPORTS.find(r => r.id === id)!;
        const updated = new Map(prev);
        updated.set(id, { ...base, ...updates });
        return updated;
      });
    } else {
      setUserReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    }
  };

  const deleteReport = (id: number) => {
    if (seedIds.has(id)) {
      setDeletedSeedIds(prev => new Set(prev).add(id));
    } else {
      setUserReports(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, updateReport, deleteReport }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);