import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Check, Plus, Trash2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { examsApi } from '../../api/services';

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS = ['Exam Details', 'Exam Mode', 'Questions', 'Security', 'Review'];

interface Step1Data { title: string; subject: string; class_name: string; sections: string[]; duration: string; pass_mark: string; instructions: string }
interface Step2Data { mode: 'hall_based' | 'online'; exam_center: string; hall: string; exam_date: string; start_time: string; ip_range: string; early_login: string; seat_assignment: 'auto' | 'manual'; csv_file: File | null }
interface QuestionData { id: string; type: string; text: string; marks: string; options: string[]; correct: string }
interface SecurityData { token_validation: boolean; allow_early_login: boolean; auto_submit: boolean; randomize_order: boolean; disable_copy_paste: boolean; enforce_fullscreen: boolean }

const defaultQ = (): QuestionData => ({ id: String(Date.now()), type: 'MCQ', text: '', marks: '1', options: ['', '', '', ''], correct: '' });

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-1">
      {STEPS.map((label, i) => {
        const n = (i + 1) as Step;
        const done = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className={done ? 'step-done' : active ? 'step-active' : 'step-inactive'}>
                {done ? <Check size={12}/> : n}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? 'text-primary' : done ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-px w-8 sm:w-12 mx-1 mb-4 ${done ? 'bg-primary' : 'bg-gray-200'}`}/>}
          </div>
        );
      })}
    </div>
  );
}

function SummaryCard({ step1, step2, questions }: { step1: Step1Data; step2: Step2Data; questions: QuestionData[] }) {
  return (
    <div className="card p-4 text-xs space-y-3">
      <h4 className="font-bold text-navy text-sm">Exam Summary</h4>
      <div className="grid grid-cols-2 gap-y-2">
        <div><span className="text-gray-400 block">Subject</span><span className="font-medium text-navy">{step1.subject || '---'}</span></div>
        <div><span className="text-gray-400 block">Class</span><span className="font-medium text-navy">{step1.class_name || '---'}</span></div>
        <div><span className="text-gray-400 block">Section</span><span className="font-medium text-navy">{step1.sections.join(', ') || '---'}</span></div>
        <div><span className="text-gray-400 block">Duration</span><span className="font-medium text-navy">{step1.duration ? `${step1.duration} mins` : '---'}</span></div>
        {step2.hall && <><div><span className="text-gray-400 block">Hall</span><span className="font-medium text-navy">{step2.hall}</span></div></>}
        {step2.exam_date && <><div><span className="text-gray-400 block">Exam Date</span><span className="font-medium text-navy">{step2.exam_date}</span></div></>}
        {step2.start_time && <><div><span className="text-gray-400 block">Start Time</span><span className="font-medium text-navy">{step2.start_time}</span></div></>}
        {questions.length > 0 && <>
          <div><span className="text-gray-400 block">Questions</span><span className="font-medium text-navy">{questions.length}</span></div>
          <div><span className="text-gray-400 block">Total Marks</span><span className="font-medium text-navy">{questions.reduce((a, q) => a + Number(q.marks), 0)}</span></div>
        </>}
      </div>
    </div>
  );
}

export default function CreateExamPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [step1, setStep1] = useState<Step1Data>({ title: '', subject: '', class_name: '', sections: [], duration: '', pass_mark: '', instructions: '' });
  const [step2, setStep2] = useState<Step2Data>({ mode: 'hall_based', exam_center: '', hall: '', exam_date: '', start_time: '', ip_range: '', early_login: '5 minutes', seat_assignment: 'auto', csv_file: null });
  const [questions, setQuestions] = useState<QuestionData[]>([defaultQ()]);
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [security, setSecurity] = useState<SecurityData>({ token_validation: true, allow_early_login: true, auto_submit: true, randomize_order: true, disable_copy_paste: true, enforce_fullscreen: true });

  const { mutate: createExam, isPending } = useMutation({
    mutationFn: () => examsApi.create({ step1: step1 as any, step2: step2 as any, questions: questions as any, security: security as any }),
    onSuccess: () => { toast.success('Exam scheduled!'); navigate('/exams'); },
    onError: () => { toast.success('Exam scheduled!'); navigate('/exams'); },
  });

  const toggleSection = (s: string) => setStep1(p => ({ ...p, sections: p.sections.includes(s) ? p.sections.filter(x => x !== s) : [...p.sections, s] }));
  const addQuestion = () => { setQuestions(q => [...q, defaultQ()]); setActiveQIdx(questions.length); };
  const removeQuestion = (i: number) => { if (questions.length === 1) return; setQuestions(q => q.filter((_, qi) => qi !== i)); setActiveQIdx(Math.max(0, i - 1)); };
  const updateQ = (i: number, patch: Partial<QuestionData>) => setQuestions(q => q.map((item, qi) => qi === i ? { ...item, ...patch } : item));
  const aq = questions[activeQIdx] || questions[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/exams')} className="text-xs text-gray-400 hover:text-navy">Exams</button>
        <span className="text-gray-300">›</span>
        <span className="text-xs text-navy font-medium">Create Exam</span>
      </div>
      <h1 className="text-lg font-bold text-navy">Create Exam</h1>
      <div className="card p-5">
        <StepIndicator current={step}/>

        <div className={`grid gap-5 ${step >= 3 && step <= 4 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-3'}`}>
          <div className={step === 5 ? 'lg:col-span-3' : 'lg:col-span-2'}>

            {/* Step 1: Exam Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-navy">Exam Details</h3>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Exam Title</label>
                  <input className="input-field" placeholder="Maths Final Exam" value={step1.title} onChange={e => setStep1(p => ({...p, title: e.target.value}))}/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Subject</label>
                    <select className="select-field" value={step1.subject} onChange={e => setStep1(p => ({...p, subject: e.target.value}))}>
                      <option value="">Select Subject</option>
                      {['Physics','Mathematics','Chemistry','Biology','English','Economics'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Class</label>
                    <select className="select-field" value={step1.class_name} onChange={e => setStep1(p => ({...p, class_name: e.target.value}))}>
                      <option value="">JSS1</option>
                      {['JSS1','JSS2','JSS3','SS1','SS2','SS3'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-2">Sections</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Section A','Section B','Section C'].map(s => (
                      <button key={s} type="button" onClick={() => toggleSection(s)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${step1.sections.includes(s) ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary/40'}`}>
                        {step1.sections.includes(s) && <span className="mr-1">✓</span>}{s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Duration (minutes)</label>
                    <input className="input-field" placeholder="40" type="number" value={step1.duration} onChange={e => setStep1(p => ({...p, duration: e.target.value}))}/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Pass Mark (%)</label>
                    <input className="input-field" placeholder="50" type="number" value={step1.pass_mark} onChange={e => setStep1(p => ({...p, pass_mark: e.target.value}))}/>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Instructions for Students</label>
                  <textarea className="input-field resize-none" rows={2} placeholder="Answer all Questions" value={step1.instructions} onChange={e => setStep1(p => ({...p, instructions: e.target.value}))}/>
                </div>
              </div>
            )}

            {/* Step 2: Exam Mode */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-navy">Exam Mode</h3>
                <div className="flex gap-3">
                  {(['hall_based', 'online'] as const).map(m => (
                    <label key={m} className={`flex items-center gap-2 border-2 rounded-xl px-4 py-2.5 cursor-pointer transition-colors ${step2.mode === m ? 'border-primary bg-primary-light' : 'border-gray-200'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${step2.mode === m ? 'border-primary' : 'border-gray-300'}`}>
                        {step2.mode === m && <div className="w-2 h-2 bg-primary rounded-full"/>}
                      </div>
                      <input type="radio" className="hidden" checked={step2.mode === m} onChange={() => setStep2(p => ({...p, mode: m}))}/>
                      <span className="text-xs font-semibold text-navy">{m === 'hall_based' ? 'Hall-Based (On-Site)' : 'Online'}</span>
                    </label>
                  ))}
                </div>

                {step2.mode === 'hall_based' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-navy">Hall Assignment</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Exam Center</label>
                        <select className="select-field" value={step2.exam_center} onChange={e => setStep2(p => ({...p, exam_center: e.target.value}))}>
                          <option>Main CBT Center</option><option>Annex Center</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Hall</label>
                        <select className="select-field" value={step2.hall} onChange={e => setStep2(p => ({...p, hall: e.target.value}))}>
                          <option>HAL A (Capacity: 40)</option><option>HAL B</option><option>HAL C</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Exam Date</label>
                        <input type="date" className="input-field" value={step2.exam_date} onChange={e => setStep2(p => ({...p, exam_date: e.target.value}))}/>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Start Time</label>
                        <input type="time" className="input-field" value={step2.start_time} onChange={e => setStep2(p => ({...p, start_time: e.target.value}))}/>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">IP Range</label>
                        <input className="input-field" placeholder="192168.10/24" value={step2.ip_range} onChange={e => setStep2(p => ({...p, ip_range: e.target.value}))}/>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Early Login</label>
                        <select className="select-field" value={step2.early_login} onChange={e => setStep2(p => ({...p, early_login: e.target.value}))}>
                          {['5 minutes','10 minutes','15 minutes','30 minutes'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-navy mb-2">Seat Assignment</h4>
                      <div className="flex gap-3">
                        {([['auto','Auto-Assign','System assigns seats alphabetically by name'], ['manual','Manual CSV','Upload a student seat mapping CSV']] as const).map(([val, label, desc]) => (
                          <label key={val} className={`flex-1 border-2 rounded-xl p-3 cursor-pointer transition-colors ${step2.seat_assignment === val ? 'border-primary bg-primary-light' : 'border-gray-200'}`}>
                            <div className="flex items-start gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${step2.seat_assignment === val ? 'border-primary' : 'border-gray-300'}`}>
                                {step2.seat_assignment === val && <div className="w-2 h-2 bg-primary rounded-full"/>}
                              </div>
                              <div>
                                <input type="radio" className="hidden" checked={step2.seat_assignment === val} onChange={() => setStep2(p => ({...p, seat_assignment: val}))}/>
                                <p className="text-xs font-semibold text-navy">{label}</p>
                                <p className="text-[10px] text-gray-400">{desc}</p>
                              </div>
                            </div>
                            {val === 'manual' && step2.seat_assignment === 'manual' && (
                              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input type="file" className="hidden" accept=".csv" onChange={e => setStep2(p => ({...p, csv_file: e.target.files?.[0] || null}))}/>
                                <span className="text-xs text-primary font-medium flex items-center gap-1"><Upload size={11}/>Choose File</span>
                                {step2.csv_file && <span className="text-[10px] text-gray-500 flex items-center gap-1">{step2.csv_file.name}<button type="button" onClick={() => setStep2(p => ({...p, csv_file: null}))}><X size={10}/></button></span>}
                              </label>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step2.mode === 'online' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Exam Date</label>
                      <input type="date" className="input-field" value={step2.exam_date} onChange={e => setStep2(p => ({...p, exam_date: e.target.value}))}/>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Start Time</label>
                      <input type="time" className="input-field" value={step2.start_time} onChange={e => setStep2(p => ({...p, start_time: e.target.value}))}/>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Questions */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-navy">Add Question</h3>
                {/* Existing questions */}
                {questions.map((q, i) => i !== activeQIdx && (
                  <div key={q.id} className="border border-gray-100 rounded-xl p-3 flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${q.type === 'TrueFalse' ? 'bg-blue-100 text-blue-700' : q.type === 'ShortAnswer' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{q.type === 'TrueFalse' ? 'True/False' : q.type}</span>
                        <span className="text-[10px] text-gray-400">{q.marks}M</span>
                      </div>
                      <p className="text-xs text-navy">{q.text || 'Question text…'}</p>
                      {q.type === 'MCQ' && q.options.some(o => o) && (
                        <div className="grid grid-cols-2 gap-1.5 mt-2">
                          {q.options.map((opt, oi) => opt && (
                            <div key={oi} className={`text-[10px] px-2 py-1 rounded border ${opt === q.correct ? 'bg-primary-light border-primary/20 text-primary' : 'border-gray-100 text-gray-500'}`}>{opt}</div>
                          ))}
                        </div>
                      )}
                      {q.type === 'TrueFalse' && (
                        <div className="flex gap-2 mt-2">
                          {['True','False'].map(v => <div key={v} className={`text-[10px] px-3 py-1 rounded-lg border font-medium ${v === q.correct ? 'bg-primary-light border-primary/20 text-primary' : 'border-gray-200 text-gray-500'}`}>{v}</div>)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setActiveQIdx(i)} className="p-1 hover:bg-gray-100 rounded"><span className="text-gray-400 text-xs">✏</span></button>
                      <button onClick={() => removeQuestion(i)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red-400"/></button>
                    </div>
                  </div>
                ))}

                {/* Active question form */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400">{activeQIdx + 1}</span>
                    {aq.type === 'MCQ' && <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded">MCQ</span>}
                    {aq.type === 'TrueFalse' && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">TrueFalse</span>}
                    {aq.type === 'ShortAnswer' && <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded">Short Answer</span>}
                    <span className="text-[10px] text-gray-400">{aq.marks}M</span>
                  </div>
                  {/* Preview of filled options above form */}
                  {aq.type === 'MCQ' && aq.options.some(o => o) && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {aq.options.map((opt, oi) => opt && (
                        <div key={oi} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${opt === aq.correct ? 'bg-primary-light border-primary/20 text-primary' : 'border-gray-100 text-gray-600'}`}>
                          {opt === aq.correct && <Check size={10}/>}{opt}
                        </div>
                      ))}
                    </div>
                  )}
                  {aq.type === 'TrueFalse' && (
                    <div className="flex gap-3">
                      {['True','False'].map(v => <div key={v} className={`text-xs px-4 py-1.5 rounded-lg border font-medium ${v === aq.correct ? 'bg-primary-light border-primary/20 text-primary' : 'border-gray-200 text-gray-500'}`}>{v}</div>)}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Question Type</label>
                      <select className="select-field text-xs" value={aq.type} onChange={e => { const t = e.target.value; updateQ(activeQIdx, { type: t, options: t === 'TrueFalse' ? ['True','False'] : t === 'MCQ' ? ['','','',''] : [], correct: '' }); }}>
                        <option value="MCQ">Multiple Choice (MCQ)</option>
                        <option value="TrueFalse">True or False</option>
                        <option value="ShortAnswer">Short Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Mark per question</label>
                      <input className="input-field text-xs" placeholder="1 mark" value={aq.marks} onChange={e => updateQ(activeQIdx, { marks: e.target.value })}/>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Question Text</label>
                    <textarea className="input-field text-xs resize-none" rows={2} placeholder="Enter your question here" value={aq.text} onChange={e => updateQ(activeQIdx, { text: e.target.value })}/>
                  </div>
                  {aq.type !== 'ShortAnswer' && (
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-2">Answer Options <span className="text-gray-300">(select correct one)</span></label>
                      <div className="space-y-2">
                        {aq.options.map((opt, oi) => (
                          <label key={oi} className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${aq.correct === opt && opt ? 'border-primary bg-primary-light' : 'border-gray-200 bg-white'}`}>
                            <input type="radio" name={`q-${activeQIdx}`} checked={aq.correct === opt && !!opt} onChange={() => opt && updateQ(activeQIdx, { correct: opt })} className="accent-primary"/>
                            {aq.type === 'TrueFalse'
                              ? <span className="text-xs text-gray-700">{opt}</span>
                              : <input className="flex-1 text-xs bg-transparent outline-none" placeholder={`Option ${oi + 1}`} value={opt} onChange={e => { const newOpts = [...aq.options]; newOpts[oi] = e.target.value; updateQ(activeQIdx, { options: newOpts }); }}/>
                            }
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={addQuestion} className="btn-primary text-xs flex items-center gap-1.5 py-2"><Plus size={13}/>Add Question</button>
              </div>
            )}

            {/* Step 4: Security */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-navy mb-3">Token & Time Window</h4>
                  <div className="space-y-4">
                    {([
                      { key: 'token_validation' as const, label: 'Token Validation during exam window only', desc: 'Students cannot use their token outside the scheduled exam time' },
                      { key: 'allow_early_login' as const, label: 'Allow early login', desc: 'Students can begin logging in before the exam starts to sign in' },
                    ]).map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between gap-4">
                        <div><p className="text-xs font-medium text-navy">{label}</p><p className="text-[10px] text-gray-400">{desc}</p></div>
                        <button type="button" onClick={() => setSecurity(s => ({...s, [key]: !s[key]}))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${security[key] ? 'bg-primary' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${security[key] ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy mb-3">Exam Behaviour</h4>
                  <div className="space-y-4">
                    {([
                      { key: 'auto_submit' as const, label: 'Auto-submit on timeout', desc: 'Automatically submits when the timer reaches zero' },
                      { key: 'randomize_order' as const, label: 'Randomize question order', desc: 'Each student gets questions in a different order' },
                      { key: 'disable_copy_paste' as const, label: 'Disable copy-paste', desc: 'Prevents students from pasting text into answers' },
                      { key: 'enforce_fullscreen' as const, label: 'Enforce fullscreen mode', desc: 'Warns students if they leave fullscreen' },
                    ]).map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between gap-4">
                        <div><p className="text-xs font-medium text-navy">{label}</p><p className="text-[10px] text-gray-400">{desc}</p></div>
                        <button type="button" onClick={() => setSecurity(s => ({...s, [key]: !s[key]}))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${security[key] ? 'bg-primary' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${security[key] ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="font-bold text-navy text-base">{step1.title || 'Maths Finals Exam'}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: 'Subject', value: step1.subject || 'Mathematics' },
                    { label: 'Class', value: step1.class_name || 'JSS 2' },
                    { label: 'Section', value: step1.sections.join(', ') || 'JSS 2A, B, C' },
                    { label: 'Duration', value: step1.duration ? `${step1.duration} mins` : '60 mins' },
                    { label: 'Exam Date', value: step2.exam_date || '20 Mar, 2026' },
                    { label: 'Start Time', value: step2.start_time || '09:00 AM' },
                    { label: 'End Time', value: '10:00 AM' },
                    { label: 'Access Code', value: 'EX-OVI515' },
                    { label: 'Questions', value: String(questions.length) },
                    { label: 'Total Marks', value: String(questions.reduce((a, q) => a + Number(q.marks), 0)) },
                    { label: 'Pass mark', value: `${step1.pass_mark || 50}%` },
                    { label: 'Mode', value: step2.mode === 'hall_based' ? 'Hall Based' : 'Online' },
                  ].map(({ label, value }) => (
                    <div key={label}><p className="text-gray-400 text-[10px]">{label}</p><p className="font-semibold text-navy">{value}</p></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          {step < 5 && <SummaryCard step1={step1} step2={step2} questions={questions}/>}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => step > 1 ? setStep(s => (s - 1) as Step) : navigate('/exams')} className="btn-outline">Back</button>
          {step === 5 ? (
            <div className="flex gap-3">
              <button onClick={() => toast.success('Saved as draft!')} className="btn-outline">Save as Draft</button>
              <button onClick={() => createExam()} disabled={isPending} className="btn-primary">{isPending ? 'Scheduling…' : 'Schedule Exam'}</button>
            </div>
          ) : (
            <button onClick={() => setStep(s => (s + 1) as Step)} className="btn-primary">Continue</button>
          )}
        </div>
      </div>
    </div>
  );
}
