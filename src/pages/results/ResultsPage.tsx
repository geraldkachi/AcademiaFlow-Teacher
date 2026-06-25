import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { resultsApi } from '../../api/services';

const mockResults = [
  { id: '1', title: 'Mathematics Finals', class: 'SS1 A,B,C', date: 'Feb 5, 2026', students: 62, avg_score: 70, pass_rate: 84, highest: 95, lowest: 40, submissions: '60/62', has_theory: true },
  { id: '2', title: 'Mathematics Finals', class: 'SS2 A,B,C', date: 'Feb 5, 2026', students: 87, avg_score: 64, pass_rate: 75, highest: 80, lowest: 42, submissions: '80/82', has_theory: false },
  { id: '3', title: 'Science Finals', class: 'SS2 A,B,C', date: 'Feb 6, 2026', students: 90, avg_score: 70, pass_rate: 78, highest: 85, lowest: 95, submissions: '72/82', has_theory: true },
  { id: '4', title: 'History Finals', class: 'SS2 A,B,C', date: 'Feb 7, 2026', students: 85, avg_score: 67, pass_rate: 73, highest: 82, lowest: 98, submissions: '65/82', has_theory: false },
];

const mockStudentResults = [
  { id: '1', name: 'Jane Doe', email: 'janedoe@springhill.com', student_id: 'STU1239', class: 'JSS 2', section: 'Section A', score: 78, grade: 'A', position: '2ND' },
  { id: '2', name: 'Jameson Black', email: 'jamesonblack@springhill.com', student_id: 'STU156', class: 'JSS 2', section: 'Section B', score: 56, grade: 'C', position: '6TH' },
  { id: '3', name: 'Amelia Spoon', email: 'aspoon@springhill.com', student_id: 'STU1278', class: 'JSS2', section: 'Section A', score: 62, grade: 'B', position: '5TH' },
  { id: '4', name: 'John Doe', email: 'johndoe@springhill.com', student_id: 'STU1309', class: 'JSS 2', section: 'Section B', score: 84, grade: 'A', position: '1ST' },
  { id: '5', name: 'Malcom Johnson', email: 'malcomyjohnson@springhill.com', student_id: 'STU678', class: 'JSS 2', section: 'Section C', score: 82, grade: 'A', position: '1ST' },
  { id: '6', name: 'Akemefuna Oluchi', email: 'Akemefuna...@springhill.com', student_id: 'STU1476', class: 'JSS 2', section: 'Section C', score: 66, grade: 'B', position: '5TH' },
  { id: '7', name: 'Celine Dion', email: 'celinedion@springhill.com', student_id: 'STU521', class: 'JSS 2', section: 'Section C', score: 74, grade: 'A', position: '3RD' },
  { id: '8', name: 'Sofia Vagara', email: 'sofiavagara@springhill.com', student_id: 'STU983', class: 'JSS 2', section: 'Section C', score: 70, grade: 'A', position: '4TH' },
];

// Theory grading screen
const mockTheoryGrading = {
  mcq_score: 40, mcq_total: 40,
  theory_questions: [
    { id: '1', type: 'Essay', marks: 15, text: 'Explain the theory of relativity', answer: 'Space and time are relative and interconnected.', score: 10, feedback: 'This was easy me' },
    { id: '2', type: 'Essay', marks: 10, text: 'Explain the usefulness of time', answer: 'Space and time are relative and interconnected.', score: 10, feedback: 'This was easy me' },
    { id: '3', type: 'Essay', marks: 0, text: 'If a man were to jump as high as 50m/s what is the amount energy needed for take off', answer: 'Space and time are relative and interconnected.', score: 10, feedback: 'This was easy me' },
  ],
};

const tabs = ['All Results', 'Pending', 'Published'];

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState('All Results');
  const [viewResult, setViewResult] = useState<any>(null);
  const [gradeTheory, setGradeTheory] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState(mockStudentResults[1]);
  const [grades, setGrades] = useState<Record<string, { score: string; feedback: string }>>(
    Object.fromEntries(mockTheoryGrading.theory_questions.map(q => [q.id, { score: String(q.score), feedback: q.feedback }]))
  );
  const [overallFeedback, setOverallFeedback] = useState('very good student');
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [checkedStudents, setCheckedStudents] = useState<Set<string>>(new Set(['1', '2', '3', '4']));
  const [publishConfirm, setPublishConfirm] = useState(false);
  const [published, setPublished] = useState(false);

  const { data } = useQuery({ queryKey: ['t-results'], queryFn: () => resultsApi.getAll(), placeholderData: mockResults as any });
  const results: any[] = (data as any[] | undefined) || mockResults;

  const theory_total = Object.values(grades).reduce((a, g) => a + Number(g.score || 0), 0);
  const total = mockTheoryGrading.mcq_score + theory_total;

  // Grade Theory screen
  if (gradeTheory) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => setGradeTheory(null)} className="hover:text-navy">Results</button>
          <span>›</span><span className="text-navy">Grade Theory</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setGradeTheory(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={16} className="text-gray-500"/>
            </button>
            <div>
              <h1 className="text-base font-bold text-navy">{gradeTheory.title}</h1>
              <p className="text-[11px] text-gray-400">{gradeTheory.class} · {gradeTheory.date} · {gradeTheory.students} students</p>
            </div>
          </div>
          <button onClick={() => setPublishConfirm(true)} className="btn-primary text-xs">Submit Result</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Student list */}
          <div className="lg:col-span-1 card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100"><h3 className="text-sm font-semibold text-navy">Students</h3></div>
            <div className="divide-y divide-gray-50 max-h-80 lg:max-h-none overflow-y-auto">
              {mockStudentResults.map(s => (
                <button key={s.id} onClick={() => setSelectedStudent(s)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedStudent.id === s.id ? 'bg-primary-light/30' : 'hover:bg-gray-50'}`}>
                  <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy truncate">{s.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{s.email}</p>
                  </div>
                  {checkedStudents.has(s.id)
                    ? <div className="w-4 h-4 bg-primary rounded flex items-center justify-center shrink-0"><svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg></div>
                    : <div className="w-4 h-4 border border-gray-200 rounded shrink-0"/>}
                </button>
              ))}
            </div>
          </div>

          {/* Grading panel */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center text-primary text-sm font-bold">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">{selectedStudent.name}</p>
                    <p className="text-[10px] text-gray-400">MCQ · 40 · Theory: 0/80</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-navy">{total}/100</span>
                  <span className="text-2xl font-black text-navy">{total >= 90 ? 'A' : total >= 80 ? 'B' : 'D'}</span>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h4 className="text-sm font-bold text-navy">MQC Section (Auto Graded)</h4>
                  <p className="text-[11px] text-gray-400">Multiple choice and true/false questions were marked automatically</p>
                </div>
                <span className="text-lg font-bold text-navy">{mockTheoryGrading.mcq_score}/{mockTheoryGrading.mcq_total}</span>
              </div>
            </div>

            <div className="card p-4">
              <h4 className="text-sm font-bold text-navy mb-4">Theory Section / Manual Grading</h4>
              <div className="space-y-5">
                {mockTheoryGrading.theory_questions.map((q, i) => (
                  <div key={q.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 bg-navy text-white rounded text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">Essay</span>
                      <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded">{q.marks} Marks</span>
                      <button onClick={() => setShowAnswers(a => ({...a, [q.id]: !a[q.id]}))} className="ml-auto text-xs text-primary font-medium flex items-center gap-1">
                        {showAnswers[q.id] ? 'Hide Answer' : 'Show Answer'}
                        {showAnswers[q.id] ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                      </button>
                    </div>
                    <p className="text-xs font-medium text-navy mb-2">{q.text}</p>
                    {showAnswers[q.id] && (
                      <div className="bg-primary-light/50 border border-primary/10 rounded-lg px-3 py-2 text-xs text-gray-600 mb-2">
                        The laws of physics are the same for all observers, regardless of their relative motion.
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mb-1">Student answer</p>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 mb-3">{q.answer}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Score / 15</label>
                        <input type="number" className="input-field text-xs" value={grades[q.id]?.score || ''}
                          onChange={e => setGrades(g => ({...g, [q.id]: {...g[q.id], score: e.target.value}}))} placeholder="Score"/>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Feedback</label>
                        <input className="input-field text-xs" value={grades[q.id]?.feedback || ''}
                          onChange={e => setGrades(g => ({...g, [q.id]: {...g[q.id], feedback: e.target.value}}))} placeholder="Feedback"/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium text-navy block mb-1">Overall Feedback for Student</label>
                <textarea className="input-field resize-none text-xs" rows={2} value={overallFeedback} onChange={e => setOverallFeedback(e.target.value)} placeholder="Overall feedback…"/>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                {[['MCQ', mockTheoryGrading.mcq_score], ['Theory', theory_total], ['Total', total]].map(([l, v]) => (
                  <div key={l} className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400">{l}</p><p className="text-lg font-bold text-navy">{v}</p></div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button className="btn-outline flex-1 text-xs">Next Student</button>
                <button onClick={() => { setCheckedStudents(p => { const s = new Set(p); s.add(selectedStudent.id); return s; }); toast.success('Grade saved!'); }} className="btn-primary flex-1 text-xs">Save Grade</button>
              </div>
            </div>
          </div>
        </div>

        {publishConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
              <h3 className="font-bold text-navy mb-2">Submit Result</h3>
              <p className="text-xs text-gray-500 mb-4">Are you sure you want to submit? Results will be published to students.</p>
              <div className="flex gap-3">
                <button onClick={() => setPublishConfirm(false)} className="btn-outline flex-1">Back</button>
                <button onClick={() => { setPublishConfirm(false); setPublished(true); }} className="btn-primary flex-1">Submit</button>
              </div>
            </div>
          </div>
        )}
        {published && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 3L3 8V15C3 20.5 8.7 25.5 16 27C23.3 25.5 29 20.5 29 15V8L16 3Z" fill="#16a34a" opacity=".2"/><path d="M11 16l4 4 7-7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="font-bold text-navy mb-1">Results Published</h3>
              <p className="text-xs text-gray-500 mb-4">Result has been submitted to admin for review.</p>
              <button onClick={() => { setPublished(false); setGradeTheory(null); }} className="btn-primary w-full">Done</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // View result detail (student list)
  if (viewResult) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => setViewResult(null)} className="hover:text-navy">Results</button>
          <span>›</span><span className="text-navy">View Results</span>
        </div>
        <div className="card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-bold text-navy text-base">{viewResult.title}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-xs">
                {[['Subject','Mathematics'],['Class','JSS 2'],['Section','JSS 2A, B, C'],['Duration','60 mins'],['Exam Date','20 Mar, 2026'],['Start Time','09:00 AM'],['End Time','10:00 AM'],['Access Code','EX-OVI5I5-'],['Questions','1'],['Total Marks','100'],['Pass Mark','50%'],['Mode','Online']].map(([l,v]) => (
                  <div key={l}><p className="text-gray-400 text-[10px]">{l}</p><p className="font-semibold text-navy">{v}</p></div>
                ))}
              </div>
            </div>
            <div className="card p-3 text-center">
              <p className="text-[10px] text-gray-400 mb-1">Status</p>
              <p className="text-sm font-bold text-primary">Published</p>
              <p className="text-[10px] text-gray-400">Results have been published by Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <select className="select-field py-1 w-auto text-xs"><option>All Sections</option></select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-100 text-gray-400">
                <th className="text-left px-3 py-2.5 font-medium">Students</th>
                <th className="text-left px-3 py-2.5 font-medium">Student ID</th>
                <th className="text-left px-3 py-2.5 font-medium">Class</th>
                <th className="text-left px-3 py-2.5 font-medium">Score</th>
                <th className="text-left px-3 py-2.5 font-medium">Grade</th>
                <th className="text-left px-3 py-2.5 font-medium">Class Position</th>
                <th className="px-3 py-2.5"/>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {mockStudentResults.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary-light rounded-full flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                          {s.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <div><p className="font-semibold text-navy">{s.name}</p><p className="text-[10px] text-gray-400">{s.email}</p></div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-500">{s.student_id}</td>
                    <td className="px-3 py-3 text-gray-500">{s.class}<br/><span className="text-[10px] text-gray-400">{s.section}</span></td>
                    <td className="px-3 py-3 font-bold text-navy">{s.score}<span className="text-gray-400 font-normal">(/100)</span></td>
                    <td className="px-3 py-3 font-bold text-primary">{s.grade}</td>
                    <td className="px-3 py-3 font-semibold text-navy">{s.position}</td>
                    <td className="px-3 py-3">
                      <button className="flex items-center gap-1 text-primary text-[11px] font-medium hover:underline">
                        👁 View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-navy">Results</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Results', value: 10, color: 'text-primary' },
          { label: 'Published', value: 5, color: 'text-blue-600' },
          { label: 'Avg Pass Rate', value: '75%', color: 'text-green-600' },
          { label: 'Pending', value: 4, color: 'text-orange-500' },
          { label: 'Scheduled', value: 2, color: 'text-teal-500' },
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
            {t}{t === 'Pending' && <span className="ml-1 bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>}
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-xs">
          <span className="text-gray-400 text-xs">🔍</span>
          <input placeholder="Search by name, subject" className="bg-transparent text-xs outline-none text-gray-600 w-full placeholder:text-gray-400"/>
        </div>
        <select className="select-field py-2 w-auto text-xs"><option>All Classes</option></select>
        <select className="select-field py-2 w-auto text-xs"><option>All Subjects</option></select>
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {results.map((r: any) => (
          <div key={r.id} className="card p-4">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-navy">{r.title}</h3>
                <p className="text-xs text-gray-400">{r.class} · {r.date} · {r.students} students</p>
              </div>
              <div className="flex gap-2">
                {r.has_theory && <button onClick={() => setGradeTheory(r)} className="btn-primary text-xs py-1.5 px-3">Grade Theory</button>}
                <button onClick={() => setViewResult(r)} className="btn-outline text-xs py-1.5 px-3">View Result</button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Avg Score', value: `${r.avg_score}%` },
                { label: 'Pass Rate', value: `${r.pass_rate}%` },
                { label: 'Highest score', value: `${r.highest}%` },
                { label: 'Lowest score', value: `${r.lowest}%` },
                { label: 'Submissions', value: r.submissions },
              ].map(({ label, value }) => (
                <div key={label} className="border border-gray-100 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-navy">{value}</p>
                  <p className="text-[10px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
