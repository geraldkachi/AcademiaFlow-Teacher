import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Download, Eye, X, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { assignmentsApi } from '../../api/services';

const mockAssignments = [
  { id: '1', title: 'Quadratic Equations Problem Set', subject: 'Mathematics', class_name: 'SS1A', teacher: 'Dr. Sarah Johnson', description: 'Complete problems 1 – 20 from chapter 5. Show all working and explain your reasoning.', deadline: '11th Feb 2026', status: 'pending', submitted: 40, total: 45, progress: 100, attachment: 'Chapter 5, Q1 – Q20' },
  { id: '2', title: 'Binary Search Tree Implementation', subject: 'Computer Science', class_name: 'SS1B', teacher: 'Prof Michael Chen', description: 'Implement a balanced BST with insert, delete, and search operations.', deadline: '10th Feb 2026', status: 'active', submitted: 20, total: 35, progress: 35, attachment: 'Chapter 5, Q1 – Q20' },
  { id: '3', title: 'Chemical Equations', subject: 'Chemistry', class_name: 'SS1C', teacher: 'Mr. Ignecia', description: 'Complete problems 1 – 20 from chapter 5. Show all working and explain your reasoning.', deadline: '10th Feb 2026', status: 'graded', average: 92, submitted: 20, total: 35, progress: 85.7 },
];

const mockStudents = [
  { id: '1', name: 'Jane Doe', email: 'janedoe@springhill.com', submitted: true, score: null },
  { id: '2', name: 'Jameson Black', email: 'jamesonblack@springhill.com', submitted: true, score: null },
  { id: '3', name: 'Amelia Spoon', email: 'aspoon@springhill.com', submitted: true, score: null },
  { id: '4', name: 'John Doe', email: 'johndoe@springhill.com', submitted: true, score: null },
  { id: '5', name: 'Malcom Johnson', email: 'malcomyjohnson@springhill.com', submitted: true, score: null },
  { id: '6', name: 'Akemefuna Oluchi', email: 'Akemefuna...@springhill.com', submitted: false, score: null },
  { id: '7', name: 'Celine Dion', email: 'celinedion@springhill.com', submitted: false, score: null },
  { id: '8', name: 'Sofia Vagara', email: 'sofiavagara@springhill.com', submitted: false, score: null },
];

const mockStudentsGraded = mockStudents.map((s, i) => ({
  ...s,
  score: s.submitted ? [20, 25, 23, 28, 21, null, null, null][i] : null,
}));

const statusBadge = (s: string) => {
  const map: Record<string, string> = { active: 'badge-online', pending: 'badge-pending', graded: 'badge-scheduled', closed: 'badge-rejected' };
  const l: Record<string, string> = { active: 'Active', pending: 'Pending', graded: 'Graded', closed: 'Closed' };
  return <span className={`${map[s] || 'badge-pending'} capitalize`}>{l[s] || s}</span>;
};

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showSubmissionList, setShowSubmissionList] = useState(false);


  const { data = [] } = useQuery({ queryKey: ['t-assignments'], queryFn: () => assignmentsApi.getAll(), placeholderData: mockAssignments as any });
  const assignments = (data as any[]).length ? data : mockAssignments;

  const handleViewDetail = (a: any) => {
    setSelectedAssignment(a);
    setShowSubmissionList(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-bold text-navy">Assignments</h1>
        <div className="flex items-center gap-2">
          <select className="select-field py-1.5 w-auto text-xs"><option>All Assignments</option></select>
          <select className="select-field py-1.5 w-auto text-xs"><option>SS1</option></select>
          <button onClick={() => navigate('/assignments/create')} className="btn-primary text-xs flex items-center gap-1.5">
            <Plus size={13}/>Create Assignment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Assignments', value: 10, color: 'text-primary' },
          { label: 'Active', value: 5, color: 'text-blue-600' },
          { label: 'Submission Rate', value: '65%', color: 'text-green-600' },
          { label: 'Pending Review', value: 4, color: 'text-orange-500' },
          { label: 'Graded', value: 2, color: 'text-teal-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Assignment Cards */}
      <div className="space-y-3">
        {(assignments as any[]).map((a: any) => (
          <div key={a.id} className="card p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h3 className="text-sm font-bold text-navy">{a.title}</h3>
                  {statusBadge(a.status)}
                  {a.average && <span className="text-xs font-semibold text-primary">Average: {a.average}%</span>}
                </div>
                <p className="text-xs text-gray-500">{a.subject} • {a.class_name}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 mb-3">{a.description}</div>
            {a.attachment && (
              <div className="flex items-center gap-2 text-xs text-primary mb-2">
                <Download size={11}/><span className="font-medium">{a.attachment}</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{a.submitted}/{a.total} Submitted</span>
              <span className="text-xs font-semibold text-gray-600">{a.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
              <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${a.progress}%` }}/>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-red-500">
                <Clock size={11}/><span>Due date: {a.deadline}</span>
              </div>
              <div className="flex gap-2">
                {(a.status === 'pending' || a.status === 'active') && (
                  <button onClick={() => navigate(`/assignments/${a.id}/grade`)} className="btn-primary text-xs py-1.5 px-3">Grade</button>
                )}
                <button onClick={() => handleViewDetail(a)} className="btn-outline text-xs py-1.5 px-3">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View detail side panel */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-modal overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-navy text-sm">{selectedAssignment.title}</h3>
                <button onClick={() => setSelectedAssignment(null)}><X size={15} className="text-gray-400"/></button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div><span className="text-gray-400 block">Subject</span><span className="font-medium text-navy">{selectedAssignment.subject}</span></div>
                <div><span className="text-gray-400 block">Class</span><span className="font-medium text-navy">{selectedAssignment.class_name}</span></div>
                <div><span className="text-gray-400 block">Deadline</span><span className="font-medium text-navy">{selectedAssignment.deadline}</span></div>
                <div><span className="text-gray-400 block">Instructor</span><span className="font-medium text-navy">Dr. Sarah Johnson</span></div>
                <div><span className="text-gray-400 block">Status</span><span>{statusBadge(selectedAssignment.status)}</span></div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs font-semibold text-navy mb-1">Instructions</p>
                <p className="text-xs text-gray-500">{selectedAssignment.description}</p>
              </div>
              {selectedAssignment.attachment && (
                <div className="flex items-center justify-between bg-primary-light rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <Download size={11}/>{selectedAssignment.attachment}
                  </div>
                  <Eye size={13} className="text-primary"/>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-navy mb-1">
                  {selectedAssignment.status === 'graded' ? 'Submission/Grades' : 'Submission'}
                </p>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{selectedAssignment.submitted}/{selectedAssignment.total} Submitted</span>
                  <span className="text-xs font-semibold">{selectedAssignment.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${selectedAssignment.progress}%` }}/>
                </div>
                <button onClick={() => setShowSubmissionList(true)}
                  className="text-xs text-primary font-medium hover:underline">View list</button>
                {selectedAssignment.status === 'graded' && selectedAssignment.average && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">Average Grade</p>
                    <p className="text-lg font-bold text-primary">{selectedAssignment.average}%</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setSelectedAssignment(null)} className="btn-primary w-full">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Submission list modal */}
      {showSubmissionList && selectedAssignment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs shadow-modal overflow-hidden">
            <div className="p-5 border-b border-gray-100 text-center">
              <h3 className="font-bold text-navy">{selectedAssignment.title}</h3>
              <p className="text-xs text-gray-400 mt-1">Submission List</p>
              {selectedAssignment.status === 'graded' && <p className="text-sm font-bold text-navy mt-1">{selectedAssignment.submitted}/{selectedAssignment.total}</p>}
            </div>
            <div className="p-4 max-h-72 overflow-y-auto space-y-3">
              {(selectedAssignment.status === 'graded' ? mockStudentsGraded : mockStudents).map((s: any) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-navy">{s.name}</p>
                    <p className="text-[10px] text-gray-400">{s.email}</p>
                  </div>
                  {selectedAssignment.status === 'graded' && s.score !== null ? (
                    <span className="text-xs font-bold text-navy">{s.score}/30</span>
                  ) : (
                    s.submitted
                      ? <CheckCircle2 size={16} className="text-primary shrink-0"/>
                      : <X size={16} className="text-red-400 shrink-0"/>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4">
              <button onClick={() => setShowSubmissionList(false)} className="btn-primary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
