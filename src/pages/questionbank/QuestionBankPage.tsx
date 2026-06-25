import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { questionBankApi } from '../../api/services';

const mockStats = { total: 10, multi_choice: 5, true_false: 3, short_answer: 4, used_in_exam: 2 };
const mockQuestions = [
  { id: '1', type: 'MCQ', subject: 'Physics', topic: 'Waves', text: "Which of the following is Newton's Second Law of Motion?", marks: 2, options: ['An object at rest stays at rest unless acted upon by an external force', 'F = ma (Force equals mass times acceleration)', 'For every action, there is an equal and opposite reaction', 'Energy cannot be created or destroyed'], correct_answer: 'B', used_in_exam: false },
  { id: '2', type: 'MCQ', subject: 'Physics', topic: 'Electricity', text: 'What is the SI unit of electric current?', marks: 1, options: ['A. Volt', 'B. Watt', 'C. Ampere', 'D. Ohm'], correct_answer: 'C', used_in_exam: false },
  { id: '3', type: 'TrueFalse', subject: 'Physics', topic: 'Electricity', text: 'What is the SI unit of electric current?', marks: 1, options: ['True', 'False'], correct_answer: 'False', used_in_exam: false },
  { id: '4', type: 'ShortAnswer', subject: 'Physics', topic: 'Momentum', text: 'State the principle of conservation of momentum.', marks: 5, used_in_exam: false },
];

type QType = 'MCQ' | 'TrueFalse' | 'ShortAnswer';

const typeBadge = (t: string) => {
  const map: Record<string, string> = { MCQ: 'bg-purple-100 text-purple-700', TrueFalse: 'bg-blue-100 text-blue-700', ShortAnswer: 'bg-orange-100 text-orange-700' };
  const labels: Record<string, string> = { MCQ: 'MCQ', TrueFalse: 'True/False', ShortAnswer: 'Short Answer' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${map[t] || 'bg-gray-100 text-gray-600'}`}>{labels[t] || t}</span>;
};

interface InlineEditProps { question: any; onSave: (id: string, data: any) => void; onCancel: () => void }
function InlineEdit({ question, onSave, onCancel }: InlineEditProps) {
  const [type, setType] = useState<QType>(question.type as QType);
  const [text, setText] = useState(question.text);
  const [marks, setMarks] = useState(String(question.marks));
  const [options, setOptions] = useState<string[]>(question.options || ['', '', '', '']);
  const [correct, setCorrect] = useState(question.correct_answer || '');

  return (
    <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-gray-400 block mb-1">Question Type</label>
          <select className="select-field text-xs" value={type} onChange={e => { setType(e.target.value as QType); if (e.target.value === 'TrueFalse') setOptions(['True', 'False']); else if (e.target.value === 'MCQ') setOptions(['', '', '', '']); }}>
            <option value="MCQ">Multiple Choice (MCQ)</option>
            <option value="TrueFalse">True or False</option>
            <option value="ShortAnswer">Short Answer</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-gray-400 block mb-1">Mark per question</label>
          <input className="input-field text-xs" value={marks} onChange={e => setMarks(e.target.value)} placeholder="1 mark"/>
        </div>
      </div>
      <div>
        <label className="text-[10px] text-gray-400 block mb-1">Question Text</label>
        <textarea className="input-field text-xs resize-none" rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Enter your Question"/>
      </div>
      {(type === 'MCQ' || type === 'TrueFalse') && (
        <div>
          <label className="text-[10px] text-gray-400 block mb-2">Answer Options <span className="text-gray-300">(select the correct one)</span></label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <label key={i} className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition-colors ${correct === opt ? 'border-primary bg-primary-light' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name={`correct-edit-${question.id}`} checked={correct === opt} onChange={() => setCorrect(opt)} className="accent-primary"/>
                {type === 'TrueFalse' ? (
                  <span className="text-xs text-gray-700">{opt}</span>
                ) : (
                  <input className="flex-1 text-xs bg-transparent outline-none text-gray-700" value={opt}
                    onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n); if (correct === options[i]) setCorrect(e.target.value); }}
                    placeholder={`Option ${i + 1}`}/>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={() => onSave(question.id, { type, text, marks: Number(marks), options: type !== 'ShortAnswer' ? options : undefined, correct_answer: correct })} className="btn-primary text-xs py-2 px-4 flex items-center gap-1"><CheckCircle2 size={12}/>Save</button>
        <button onClick={onCancel} className="btn-outline text-xs py-2 px-3">Cancel</button>
      </div>
    </div>
  );
}

interface AddModalProps { onClose: () => void; onAdd: (data: any) => void; isPending: boolean }
function AddModal({ onClose, onAdd, isPending }: AddModalProps) {
  const [subject, setSubject] = useState('Physics');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<QType>('MCQ');
  const [marks, setMarks] = useState('1');
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState('');

  const handleTypeChange = (t: QType) => {
    setType(t);
    if (t === 'TrueFalse') setOptions(['True', 'False']);
    else if (t === 'MCQ') setOptions(['', '', '', '']);
    setCorrect('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-modal max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-navy">Add Question</h3>
          <button onClick={onClose}><X size={16} className="text-gray-400"/></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Subject</label>
              <select className="select-field text-xs" value={subject} onChange={e => setSubject(e.target.value)}>
                {['Physics','Mathematics','Chemistry','Biology','English'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Topic</label>
              <input className="input-field text-xs" placeholder="Waves" value={topic} onChange={e => setTopic(e.target.value)}/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Question Type</label>
              <select className="select-field text-xs" value={type} onChange={e => handleTypeChange(e.target.value as QType)}>
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="TrueFalse">True or False</option>
                <option value="ShortAnswer">Short Answer</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Mark per question</label>
              <input className="input-field text-xs" placeholder="1 mark" value={marks} onChange={e => setMarks(e.target.value)}/>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Question Text</label>
            <textarea className="input-field text-xs resize-none" rows={3} placeholder="Enter your Question" value={text} onChange={e => setText(e.target.value)}/>
          </div>
          {type !== 'ShortAnswer' && (
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Answer Options <span className="text-gray-400 text-[10px]">(select the correct one)</span></label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <label key={i} className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition-colors ${correct === (type === 'TrueFalse' ? opt : opt) ? 'border-primary bg-primary-light' : 'border-gray-200'}`}>
                    <input type="radio" name="add-correct" checked={correct === opt} onChange={() => setCorrect(opt)} className="accent-primary"/>
                    {type === 'TrueFalse' ? (
                      <span className="text-xs text-gray-700">{opt}</span>
                    ) : (
                      <input className="flex-1 text-xs bg-transparent outline-none" placeholder={`Option ${i + 1}`} value={opt}
                        onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n); }}/>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => onAdd({ subject, topic, type, marks: Number(marks), text, options: type !== 'ShortAnswer' ? options : undefined, correct_answer: correct })}
            disabled={isPending} className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={14}/>{isPending ? 'Adding…' : 'Add Question'}
          </button>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn-outline flex-1">Back</button>
          <button onClick={onClose} className="btn-outline flex-1">Continue</button>
        </div>
      </div>
    </div>
  );
}

export default function QuestionBankPage() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletedSuccess, setDeletedSuccess] = useState(false);
  const [localQuestions, setLocalQuestions] = useState(mockQuestions);

  const { data } = useQuery({ queryKey: ['t-question-bank'], queryFn: () => questionBankApi.getAll(), placeholderData: { stats: mockStats, questions: mockQuestions } as any });
  const statsData = (data as any)?.stats || mockStats;

  const { mutate: addQ, isPending: adding } = useMutation({
    mutationFn: (d: any) => questionBankApi.add(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['t-question-bank'] }); setShowAdd(false); toast.success('Question added!'); },
    onError: (_, d: any) => { setLocalQuestions(q => [...q, { id: String(Date.now()), ...d }]); setShowAdd(false); toast.success('Question added!'); },
  });

  const { mutate: updateQ } = useMutation({
    mutationFn: ({ id, d }: { id: string; d: any }) => questionBankApi.update(id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['t-question-bank'] }); setEditId(null); toast.success('Saved!'); },
    onError: (_, { id, d }) => { setLocalQuestions(q => q.map(item => item.id === id ? { ...item, ...d } : item)); setEditId(null); toast.success('Saved!'); },
  });

  const { mutate: deleteQ, isPending: deleting } = useMutation({
    mutationFn: (id: string) => questionBankApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['t-question-bank'] }); setDeleteId(null); setDeletedSuccess(true); },
    onError: (_, id) => { setLocalQuestions(q => q.filter(item => item.id !== id)); setDeleteId(null); setDeletedSuccess(true); },
  });

  const questions = localQuestions;

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-navy">Question Bank</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Questions', value: statsData.total, color: 'text-primary' },
          { label: 'Multi-choice', value: statsData.multi_choice, color: 'text-purple-600' },
          { label: 'True/False', value: statsData.true_false, color: 'text-blue-600' },
          { label: 'Short Answer', value: statsData.short_answer, color: 'text-orange-500' },
          { label: 'Used in exam', value: statsData.used_in_exam, color: 'text-teal-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Questions list */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-navy">Questions Preview</h3>
            <p className="text-[10px] text-gray-400">Showing {questions.length} of 40 questions · 0 marks</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[10px] text-gray-400">Randomized in actual exam</p>
            <select className="select-field py-1 w-auto text-xs"><option>All Status</option></select>
            <select className="select-field py-1 w-auto text-xs"><option>All Topics</option></select>
            <select className="select-field py-1 w-auto text-xs"><option>All Types</option></select>
            <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1.5 py-2"><Plus size={13}/>Add Questions</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {questions.map((q, i) => (
            <div key={q.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                    {typeBadge(q.type)}
                    <span className="text-[10px] text-gray-400">{q.marks}M</span>
                  </div>
                  <p className="text-sm text-navy mb-3">{q.text}</p>
                  {q.type === 'MCQ' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`text-xs px-3 py-2 rounded-lg border ${opt === q.correct_answer || opt.startsWith(q.correct_answer || '') ? 'bg-primary-light border-primary/20 text-primary' : 'border-gray-100 text-gray-600'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === 'TrueFalse' && (
                    <div className="flex gap-3">
                      {['True','False'].map(v => (
                        <div key={v} className={`text-xs px-4 py-1.5 rounded-lg border font-medium ${v === q.correct_answer ? 'bg-primary-light border-primary/20 text-primary' : 'border-gray-200 text-gray-500'}`}>{v}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditId(editId === q.id ? null : q.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><Pencil size={13} className="text-gray-400"/></button>
                  <button onClick={() => setDeleteId(q.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} className="text-red-400"/></button>
                </div>
              </div>
              {editId === q.id && (
                <InlineEdit question={q}
                  onSave={(id, d) => updateQ({ id, d })}
                  onCancel={() => setEditId(null)}/>
              )}
              {i < questions.length - 1 && <div className="border-b border-gray-100 mt-4"/>}
            </div>
          ))}
        </div>
      </div>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={(d) => addQ(d)} isPending={adding}/>}

      {deleteId && !deletedSuccess && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
            <h3 className="font-bold text-navy mb-2">Delete Question</h3>
            <p className="text-xs text-gray-500 mb-4">Are you sure you want to delete this question? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => deleteQ(deleteId)} disabled={deleting} className="btn-danger flex-1">{deleting ? 'Deleting…' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {deletedSuccess && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} className="text-red-500"/>
            </div>
            <h3 className="font-bold text-navy mb-1">Question Deleted</h3>
            <p className="text-xs text-gray-500 mb-4">Your question has been deleted.</p>
            <button onClick={() => setDeletedSuccess(false)} className="btn-primary w-full">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
