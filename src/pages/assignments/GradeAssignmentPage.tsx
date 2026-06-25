import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const mockStudents = [
  { id: '1', name: 'Jane Doe', email: 'janedoe@springhill.com', submitted: true, checked: true },
  { id: '2', name: 'Jameson Black', email: 'jamesonblack@springhill.com', submitted: true, checked: false },
  { id: '3', name: 'Amelia Spoon', email: 'aspoon@springhill.com', submitted: true, checked: false },
  { id: '4', name: 'John Doe', email: 'johndoe@springhill.com', submitted: true, checked: false },
  { id: '5', name: 'Malcom Johnson', email: 'malcomyjohnson@springhill.com', submitted: false, checked: false },
  { id: '6', name: 'Akemefuna Oluchi', email: 'Akemefuna...@springhill.com', submitted: false, checked: false },
  { id: '7', name: 'Celine Dion', email: 'celinedion@springhill.com', submitted: false, checked: false },
  { id: '8', name: 'Sofia Vagara', email: 'sofiavagara@springhill.com', submitted: false, checked: false },
];

const mockGrading = {
  id: '1',
  title: 'Mathematics Assignment',
  section: 'SS1 A,B,C',
  date: 'Feb 5, 2026',
  students: 62,
  instructions: 'Complete problems 1 – 20 from chapter 5. Show all working and explain your reasoning.',
  student_answer: 'Space and time are relative and interconnected.',
  mcq_score: 40,
  mcq_total: 40,
  theory_questions: [
    { id: '1', type: 'Essay', marks: 15, text: 'Explain the theory of relativity', answer: 'Space and time are relative and interconnected.', score: 10, feedback: 'This was easy me' },
    { id: '2', type: 'Essay', marks: 10, text: 'Explain the usefulness of time', answer: 'Space and time are relative and interconnected.', score: 10, feedback: 'This was easy me' },
    { id: '3', type: 'Essay', marks: 0, text: 'If a man were to jump as high as 50m/s what is the amount energy needed for take off', answer: 'Space and time are relative and interconnected.', score: 10, feedback: 'This was easy me' },
  ],
  overall_feedback: '',
};

export default function GradeAssignmentPage() {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[1]);
  const [grades, setGrades] = useState<Record<string, { score: string; feedback: string }>>(
    Object.fromEntries(mockGrading.theory_questions.map(q => [q.id, { score: String(q.score), feedback: q.feedback }]))
  );
  const [overallFeedback, setOverallFeedback] = useState(mockGrading.overall_feedback);
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [published, setPublished] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState<Set<string>>(new Set(['1']));

  const theory_total = grades ? Object.values(grades).reduce((a, g) => a + Number(g.score || 0), 0) : 0;
  const total = mockGrading.mcq_score + theory_total;

  const { mutate: saveGrade, isPending } = useMutation({
    mutationFn: async () => new Promise(r => setTimeout(r, 500)),
    onSuccess: () => {
      setCheckedStudents(prev => { const s = new Set(prev); s.add(selectedStudent.id); return s; });
      toast.success('Grade saved!');
    },
  });

  const handlePublish = () => {
    setShowPublishConfirm(false);
    setPublished(true);
  };

  if (published) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={28} className="text-primary"/>
          </div>
          <h3 className="font-bold text-navy mb-1">Results Published</h3>
          <p className="text-xs text-gray-500 mb-4">Result has been successfully published. Students will be notified.</p>
          <button onClick={() => navigate('/assignments')} className="btn-primary w-full">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button onClick={() => navigate('/assignments')} className="hover:text-navy">Assignments</button>
        <span>›</span>
        <span className="text-navy font-medium">Grade Assignments</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/assignments')} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={16} className="text-gray-500"/>
          </button>
          <div>
            <h1 className="text-base font-bold text-navy">{mockGrading.title}</h1>
            <p className="text-[11px] text-gray-400">{mockGrading.section} • {mockGrading.date} • {mockGrading.students} students</p>
          </div>
        </div>
        <button onClick={() => setShowPublishConfirm(true)} className="btn-primary text-xs">Publish Result</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Student list */}
        <div className="lg:col-span-1 card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-navy">Students</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-96 lg:max-h-none overflow-y-auto">
            {mockStudents.map(s => (
              <button key={s.id} onClick={() => setSelectedStudent(s)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedStudent.id === s.id ? 'bg-primary-light/30' : 'hover:bg-gray-50'}`}>
                <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-navy truncate">{s.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{s.email}</p>
                </div>
                {checkedStudents.has(s.id) && <CheckCircle2 size={14} className="text-primary shrink-0"/>}
                {!checkedStudents.has(s.id) && <div className="w-4 h-4 border border-gray-200 rounded shrink-0"/>}
              </button>
            ))}
          </div>
        </div>

        {/* Grading area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Student header */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center text-primary text-sm font-bold">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">{selectedStudent.name}</p>
                  <p className="text-[10px] text-gray-400">Submitted · 14 Mar 2026 · 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-navy">{total}/100</span>
                <span className="text-2xl font-black text-navy">{total >= 90 ? 'A' : total >= 80 ? 'B' : total >= 70 ? 'C' : 'D'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-navy mb-1">Instructions</p>
              <p className="text-xs text-gray-500">{mockGrading.instructions}</p>
            </div>
          </div>

          {/* MCQ section */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h4 className="text-sm font-bold text-navy">MCQ Section (Auto Graded)</h4>
                <p className="text-[11px] text-gray-400">Multiple choice and true/false questions were marked automatically</p>
              </div>
              <span className="text-lg font-bold text-navy">{mockGrading.mcq_score}/{mockGrading.mcq_total}</span>
            </div>
          </div>

          {/* Theory section */}
          <div className="card p-4">
            <h4 className="text-sm font-bold text-navy mb-4">Theory Section / Manual Grading</h4>
            <div className="space-y-5">
              {mockGrading.theory_questions.map((q, i) => (
                <div key={q.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 bg-navy text-white rounded text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">Essay</span>
                    <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded">{q.marks} Marks</span>
                    <button onClick={() => setShowAnswers(a => ({...a, [q.id]: !a[q.id]}))}
                      className="ml-auto text-xs text-primary font-medium flex items-center gap-1">
                      {showAnswers[q.id] ? 'Hide Answer' : 'Show Answer'}
                      {showAnswers[q.id] ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                    </button>
                  </div>
                  <p className="text-xs font-medium text-navy mb-2">{q.text}</p>
                  {showAnswers[q.id] && (
                    <div className="bg-primary-light/50 border border-primary/10 rounded-lg px-3 py-2 text-xs text-gray-600 mb-2">
                      The laws of physics are the same for all observers, regardless of their relative motion. Space and time are interwoven into a single continuum known as spacetime.
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mb-1">Student answer</p>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 mb-3">{q.answer}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Score / {q.marks || 15}</label>
                      <input type="number" className="input-field text-xs" value={grades[q.id]?.score || ''}
                        onChange={e => setGrades(g => ({...g, [q.id]: {...g[q.id], score: e.target.value}}))}
                        placeholder="Score"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Feedback</label>
                      <input className="input-field text-xs" value={grades[q.id]?.feedback || ''}
                        onChange={e => setGrades(g => ({...g, [q.id]: {...g[q.id], feedback: e.target.value}}))}
                        placeholder="This was easy me"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall feedback */}
            <div className="mt-4">
              <label className="text-xs font-medium text-navy block mb-1">Overall Feedback for Student</label>
              <textarea className="input-field resize-none text-xs" rows={2} placeholder="Space and time are relative and interconnected."
                value={overallFeedback} onChange={e => setOverallFeedback(e.target.value)}/>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              {[['MCQ', mockGrading.mcq_score], ['Theory', theory_total], ['Total', total]].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400">{label}</p>
                  <p className="text-lg font-bold text-navy">{val}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button className="btn-outline flex-1">Next Student</button>
              <button onClick={() => saveGrade()} disabled={isPending} className="btn-primary flex-1">{isPending ? 'Saving…' : 'Save Grade'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Publish confirm */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
            <h3 className="font-bold text-navy mb-2">Publish Result</h3>
            <p className="text-xs text-gray-500 mb-4">Are you sure you want to publish this result? Make sure you are done with grading before publishing results.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowPublishConfirm(false)} className="btn-outline flex-1">Back</button>
              <button onClick={handlePublish} className="btn-primary flex-1">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
