import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, MoreHorizontal, Eye, RotateCcw, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { examsApi } from '../../api/services';

const mockExams = [
  { id: '1', title: 'Mathematics Finals', subject: 'Mathematics', class_name: 'SS1', mode: 'hall_based' as const, section: 'Section A,B,C', schedule: 'Jan 15, 2026\n02:50 PM – 04:00 PM', duration: 90, status: 'scheduled' as const },
  { id: '2', title: 'Biology Practical Assessment', subject: 'Biology', class_name: 'SS3', mode: 'online' as const, section: 'Section B', schedule: 'Feb 20, 2026\n02:50 PM – 04:00 PM', duration: 120, status: 'scheduled' as const },
  { id: '3', title: 'Physics Quiz 3', subject: 'Physics', class_name: 'JSS2', mode: 'hall_based' as const, section: 'Section A', schedule: 'Mar 8, 2026\n02:50 AM – 03:00 AM', duration: 90, status: 'scheduled' as const },
  { id: '4', title: 'English Mid-Term', subject: 'English', class_name: 'JSS3', mode: 'online' as const, section: 'Section A,C,D', schedule: 'Feb 25, 2026\n02:50 AM – 03:00 AM', duration: 120, status: 'pending_review' as const },
  { id: '5', title: 'Government Mock Exam', subject: 'Government', class_name: 'SS3', mode: 'hall_based' as const, section: 'Section A,B', schedule: 'Jan 29, 2026\n00:00 AM – 1:00 AM', duration: 90, status: 'pending_review' as const },
  { id: '6', title: 'Chemistry Test', subject: 'Chemistry', class_name: 'JSS1', mode: 'online' as const, section: 'Section C', schedule: 'Feb 12, 2026\n00:00 AM – 1:00 AM', duration: 120, status: 'completed' as const },
  { id: '7', title: 'Commerce Mid-term', subject: 'Commerce', class_name: 'SS1', mode: 'hall_based' as const, section: 'Section A', schedule: 'Mar 13, 2026\n00:00 AM – 1:00 AM', duration: 90, status: 'completed' as const },
  { id: '8', title: 'Accounting Mock Exam', subject: 'Accounting', class_name: 'SS2', mode: 'online' as const, section: 'Section A', schedule: 'Mar 22, 2026\n00:00 AM – 1:00 AM', duration: 120, status: 'rejected' as const },
];

const mockExamDetail = {
  id: '4', title: 'Maths Finals Exam', subject: 'Mathematics', class_name: 'JSS 2', section: 'JSS 2A, B, C',
  duration: '60 mins', exam_date: '20 Mar, 2026', start_time: '09:00 AM', end_time: '10:00 AM',
  access_code: 'EX-OVI5I5', questions_count: 1, total_marks: 1, pass_mark: '50%', mode: 'Online',
  status: 'pending' as const, status_label: 'Pending', admin_feedback: '',
  security: ['Token Window Restricted', 'Auto Submit on timeout', 'Randomize questions', 'Randomize options', 'Copy-paste disabled'],
  questions: [
    { id: '1', type: 'MCQ', marks: 2, text: "Which of the following is Newton's Second Law of Motion?", options: ['An object at rest stays at rest unless acted upon by an external force', 'F = ma (Force equals mass times acceleration)', 'For every action, there is an equal and opposite reaction', 'Energy cannot be created or destroyed'], correct: 'B' },
    { id: '2', type: 'MCQ', marks: 1, text: 'What is the SI unit of electric current?', options: ['A. Volt', 'B. Watt', 'C. Ampere', 'D. Ohm'], correct: 'C' },
    { id: '3', type: 'TrueFalse', marks: 1, text: 'What is the SI unit of electric current?', options: ['True', 'False'], correct: 'False' },
    { id: '4', type: 'ShortAnswer', marks: 1, text: 'State the principle of conservation of momentum.' },
  ],
};

const mockRejectedDetail = { ...mockExamDetail, status: 'rejected' as const, status_label: 'Rejected', admin_feedback: 'Question 2 and 3 are the same' };

const statusBadge = (s: string) => {
  const map: Record<string, string> = { scheduled: 'badge-scheduled', pending_review: 'badge-pending', completed: 'badge-completed', rejected: 'badge-rejected' };
  const labels: Record<string, string> = { scheduled: 'Scheduled', pending_review: 'Pending Review', completed: 'Completed', rejected: 'Rejected' };
  return <span className={map[s] || 'badge-pending'}>{labels[s] || s}</span>;
};

const typeBadge = (t: string) => {
  const map: Record<string, string> = { MCQ: 'bg-purple-100 text-purple-700', TrueFalse: 'bg-blue-100 text-blue-700', ShortAnswer: 'bg-orange-100 text-orange-700' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${map[t] || 'bg-gray-100 text-gray-600'}`}>{t === 'TrueFalse' ? 'True/False' : t}</span>;
};

const tabs = ['All Exams', 'Pending Reviews', 'Rejected'];

export default function ExamsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Exams');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [viewExam, setViewExam] = useState<any>(null);
  const [resubmitConfirm, setResubmitConfirm] = useState(false);
  const [resubmitted, setResubmitted] = useState(false);
  const [localExams] = useState(mockExams);

  const { data } = useQuery({ queryKey: ['t-exams'], queryFn: () => examsApi.getAll(), placeholderData: { stats: { total: 10, hall_based: 5, online: 5, pending_review: 4, scheduled: 2 }, exams: mockExams } as any });
  const statsData = (data as any)?.stats || { total: 10, hall_based: 5, online: 5, pending_review: 4, scheduled: 2 };
  const exams = localExams;

  const { mutate: resubmit } = useMutation({
    mutationFn: (id: string) => examsApi.schedule(id),
    onSuccess: () => { setResubmitConfirm(false); setResubmitted(true); },
    onError: () => { setResubmitConfirm(false); setResubmitted(true); },
  });

  const filtered = activeTab === 'Pending Reviews' ? exams.filter(e => e.status === 'pending_review')
    : activeTab === 'Rejected' ? exams.filter(e => e.status === 'rejected') : exams;

  const handleViewExam = (ex: any) => {
    const detail = ex.status === 'rejected' ? { ...mockRejectedDetail, title: ex.title, subject: ex.subject, status: 'rejected', status_label: 'Rejected' }
      : { ...mockExamDetail, title: ex.title, subject: ex.subject, status: ex.status === 'pending_review' ? 'pending' : ex.status, status_label: ex.status === 'pending_review' ? 'Pending' : ex.status };
    setViewExam(detail);
  };

  // Exam detail view
  if (viewExam) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => setViewExam(null)} className="hover:text-navy">Exams</button>
          <span>›</span>
          <span className="text-navy">Review: English Mid-Term</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card p-5">
              <h2 className="font-bold text-navy text-base mb-4">{viewExam.title}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-5">
                {[
                  ['Subject', viewExam.subject], ['Class', viewExam.class_name], ['Section', viewExam.section],
                  ['Duration', viewExam.duration], ['Exam Date', viewExam.exam_date], ['Start Time', viewExam.start_time],
                  ['End Time', viewExam.end_time], ['Access Code', viewExam.access_code],
                  ['Questions', String(viewExam.questions_count)], ['Total Marks', String(viewExam.total_marks)],
                  ['Pass mark', viewExam.pass_mark], ['Mode', viewExam.mode],
                ].map(([l, v]) => (
                  <div key={l}><p className="text-gray-400 text-[10px]">{l}</p><p className="font-semibold text-navy">{v}</p></div>
                ))}
              </div>
              {/* Questions */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-navy">Questions Preview</h3>
                    <p className="text-[10px] text-gray-400">Showing 6 of 40 questions · 10 marks</p>
                  </div>
                  <span className="text-[10px] text-gray-400">Randomized in actual exam</span>
                </div>
                <div className="space-y-4">
                  {viewExam.questions.map((q: any, i: number) => (
                    <div key={q.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400 font-bold">{i + 1}</span>
                            {typeBadge(q.type)}
                            <span className="text-[10px] text-gray-400">{q.marks}M</span>
                          </div>
                          <p className="text-sm text-navy mb-3">{q.text}</p>
                          {q.type === 'MCQ' && q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt: string, oi: number) => (
                                <div key={oi} className={`text-xs px-3 py-2 rounded-lg border ${oi === 1 || opt.includes('F = ma') || opt === 'C. Ampere' ? 'bg-primary-light border-primary/20 text-primary' : 'border-gray-100 text-gray-600'}`}>{opt}</div>
                              ))}
                            </div>
                          )}
                          {q.type === 'TrueFalse' && (
                            <div className="flex gap-3">
                              {['True', 'False'].map(v => (
                                <div key={v} className={`text-xs px-4 py-1.5 rounded-lg border font-medium ${v === 'True' ? 'bg-primary-light border-primary/20 text-primary' : 'border-gray-200 text-gray-500'}`}>{v}</div>
                              ))}
                            </div>
                          )}
                        </div>
                        {viewExam.status === 'rejected' && (
                          <div className="flex gap-1 shrink-0">
                            <button className="p-1.5 hover:bg-gray-100 rounded"><Pencil size={12} className="text-gray-400"/></button>
                            <button className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red-400"/></button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Security rules */}
            <div className="card p-4">
              <h4 className="text-sm font-bold text-navy mb-3">Security Rules</h4>
              <div className="space-y-2">
                {viewExam.security.map((rule: string) => (
                  <div key={rule} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 size={13} className="text-primary shrink-0"/>
                    {rule}
                  </div>
                ))}
              </div>
            </div>
            {/* Status */}
            <div className="card p-4">
              <h4 className="text-sm font-bold text-navy mb-2">Status</h4>
              <p className={`text-sm font-bold mb-1 ${viewExam.status === 'rejected' ? 'text-red-500' : 'text-orange-500'}`}>
                {viewExam.status_label}
              </p>
              <p className="text-[11px] text-gray-400 mb-3">
                {viewExam.status === 'rejected' ? 'Review from School Admin' : 'Awaiting review from School Admin'}
              </p>
              {viewExam.status === 'rejected' && viewExam.admin_feedback && (
                <div className="mb-3">
                  <p className="text-[11px] font-medium text-navy mb-1">Feedback</p>
                  <p className="text-[11px] text-gray-500">{viewExam.admin_feedback}</p>
                </div>
              )}
              {viewExam.status === 'rejected' && (
                <button onClick={() => setResubmitConfirm(true)} className="btn-primary w-full text-xs">Resubmit</button>
              )}
            </div>
          </div>
        </div>

        {/* Resubmit confirm modal */}
        {resubmitConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
              <h3 className="font-bold text-navy mb-2">Resubmit Exam</h3>
              <p className="text-xs text-gray-500 mb-4">Are you sure you want to resubmit this exam? The exam will be scheduled once approved.</p>
              <div className="flex gap-3">
                <button onClick={() => setResubmitConfirm(false)} className="btn-outline flex-1">Back</button>
                <button onClick={() => resubmit(viewExam.id)} className="btn-primary flex-1">Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* Resubmitted success */}
        {resubmitted && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-primary"/>
              </div>
              <h3 className="font-bold text-navy mb-1">Exam Submitted</h3>
              <p className="text-xs text-gray-500 mb-4">Exam has been resubmitted. Admin will also be notified. Status is now pending</p>
              <button onClick={() => { setResubmitted(false); setViewExam(null); }} className="btn-primary w-full">Done</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-navy">Exams</h1>
        <button onClick={() => navigate('/exams/create')} className="btn-primary text-xs flex items-center gap-1.5">
          <Plus size={13}/>Create Exam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Exams', value: statsData.total, color: 'text-primary' },
          { label: 'Hall-Based', value: statsData.hall_based, color: 'text-purple-600' },
          { label: 'Online', value: statsData.online, color: 'text-blue-600' },
          { label: 'Pending Review', value: statsData.pending_review, color: 'text-orange-500' },
          { label: 'Scheduled', value: statsData.scheduled, color: 'text-teal-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`text-sm font-medium pb-2 px-3 border-b-2 transition-colors ${activeTab === t ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-navy'}`}>
            {t}{t === 'Pending Reviews' && <span className="ml-1 bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{exams.filter(e => e.status === 'pending_review').length}</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-wrap gap-2">
          <select className="select-field py-1 w-auto text-xs"><option>All Status</option></select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100 text-gray-400">
              <th className="text-left px-4 py-2.5 font-medium">Exam</th>
              <th className="text-left px-4 py-2.5 font-medium">Class</th>
              <th className="text-left px-4 py-2.5 font-medium">Mode</th>
              <th className="text-left px-4 py-2.5 font-medium">Schedule</th>
              <th className="text-left px-4 py-2.5 font-medium">Duration</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5"/>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((ex: any) => (
                <tr key={ex.id} className="hover:bg-gray-50/50 relative">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-navy">{ex.title}</p>
                    <p className="text-[10px] text-gray-400">{ex.subject} · {ex.section}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{ex.class_name}</td>
                  <td className="px-4 py-3">
                    <span className={ex.mode === 'online' ? 'badge-online' : 'badge-hallbased'}>{ex.mode === 'online' ? 'Online' : 'Hall-Based'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-pre-line text-[10px]">{ex.schedule}</td>
                  <td className="px-4 py-3 text-gray-600">{ex.duration} Minutes</td>
                  <td className="px-4 py-3">{statusBadge(ex.status)}</td>
                  <td className="px-4 py-3 relative">
                    <button onClick={() => setOpenMenu(openMenu === ex.id ? null : ex.id)}
                      className="p-1 hover:bg-gray-100 rounded"><MoreHorizontal size={14} className="text-gray-400"/></button>
                    {openMenu === ex.id && (
                      <div className="absolute right-4 top-8 bg-white border border-gray-100 rounded-xl shadow-modal w-36 py-1 z-20">
                        <button onClick={() => { handleViewExam(ex); setOpenMenu(null); }}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                          <Eye size={12} className="text-primary"/>View Exam
                        </button>
                        {ex.status === 'rejected' && (
                          <button onClick={() => { handleViewExam(ex); setOpenMenu(null); setResubmitConfirm(true); }}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                            <RotateCcw size={12} className="text-orange-500"/>Resubmit
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Click outside to close menu */}
      {openMenu && <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)}/>}
    </div>
  );
}
