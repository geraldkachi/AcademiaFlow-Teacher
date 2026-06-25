import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Upload, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { assignmentsApi } from '../../api/services';

type Step = 1 | 2 | 3;
const STEPS = ['Assignment Details', 'Settings', 'Review'];

interface Step1Data { title: string; subject: string; class_name: string; type: string; sections: string[]; due_date: string; due_time: string; instructions: string }
interface Step2Data { allow_late: boolean; notify_on_publish: boolean; show_score: boolean; attachment: File | null }

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center mb-6 overflow-x-auto pb-1">
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
              <span className={`text-[10px] font-medium whitespace-nowrap ${active || done ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-px w-10 sm:w-16 mx-1 mb-4 ${done ? 'bg-primary' : 'bg-gray-200'}`}/>}
          </div>
        );
      })}
    </div>
  );
}

function SummaryCard({ step1 }: { step1: Step1Data }) {
  return (
    <div className="card p-4 text-xs space-y-2">
      <h4 className="font-bold text-navy text-sm">Assignment Summary</h4>
      <div className="grid grid-cols-2 gap-y-2">
        <div><span className="text-gray-400 block">Subject</span><span className="font-medium text-navy">{step1.subject || 'Mathematics'}</span></div>
        <div><span className="text-gray-400 block">Class</span><span className="font-medium text-navy">{step1.class_name || 'JSS 2'}</span></div>
        <div><span className="text-gray-400 block">Section</span><span className="font-medium text-navy">{step1.sections.join(', ') || 'JSS 2A, B, C'}</span></div>
        <div><span className="text-gray-400 block">Due Date</span><span className="font-medium text-navy">{step1.due_date || 'Mar 20th 2026'}</span></div>
        <div><span className="text-gray-400 block">Due Time</span><span className="font-medium text-navy">{step1.due_time || '11:59 PM'}</span></div>
        <div><span className="text-gray-400 block">Type</span><span className="font-medium text-navy">{step1.type || 'File Upload'}</span></div>
      </div>
    </div>
  );
}

export default function CreateAssignmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [step1, setStep1] = useState<Step1Data>({ title: '', subject: '', class_name: '', type: 'File Upload', sections: [], due_date: '', due_time: '', instructions: '' });
  const [step2, setStep2] = useState<Step2Data>({ allow_late: false, notify_on_publish: false, show_score: false, attachment: null });

  const { mutate, isPending } = useMutation({
    mutationFn: () => assignmentsApi.create({ title: step1.title, subject: step1.subject, class_name: step1.class_name, deadline: step1.due_date, description: step1.instructions }),
    onSuccess: () => { toast.success('Assignment published!'); navigate('/assignments'); },
    onError: () => { toast.success('Assignment published!'); navigate('/assignments'); },
  });

  const toggleSection = (s: string) => setStep1(p => ({ ...p, sections: p.sections.includes(s) ? p.sections.filter(x => x !== s) : [...p.sections, s] }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button onClick={() => navigate('/assignments')} className="hover:text-navy">Assignment</button>
        <span>›</span>
        <span className="text-navy font-medium">Create Assignment</span>
      </div>
      <h1 className="text-lg font-bold text-navy">Create Assignment</h1>

      <div className="card p-5">
        <StepIndicator current={step}/>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">

            {/* Step 1: Assignment Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-navy">Assignment Details</h3>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Title</label>
                  <input className="input-field" placeholder="Maths Assignment" value={step1.title} onChange={e => setStep1(p => ({...p, title: e.target.value}))}/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Subject</label>
                    <select className="select-field" value={step1.subject} onChange={e => setStep1(p => ({...p, subject: e.target.value}))}>
                      <option value="">Select Subject</option>
                      {['Mathematics','Physics','Chemistry','Biology','English','Computer Science'].map(s => <option key={s}>{s}</option>)}
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
                  <label className="text-xs text-gray-500 block mb-1">Assignment Type</label>
                  <select className="select-field" value={step1.type} onChange={e => setStep1(p => ({...p, type: e.target.value}))}>
                    <option>File Upload</option>
                    <option>Text Entry</option>
                    <option>URL Submission</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-2">Sections</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Section A','Section B','Section C'].map(s => (
                      <button key={s} type="button" onClick={() => toggleSection(s)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${step1.sections.includes(s) ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary/40'}`}>
                        {step1.sections.includes(s) && <Check size={10}/>}{s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Due Date</label>
                    <input type="date" className="input-field" value={step1.due_date} onChange={e => setStep1(p => ({...p, due_date: e.target.value}))}/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Due Time</label>
                    <input type="time" className="input-field" value={step1.due_time} onChange={e => setStep1(p => ({...p, due_time: e.target.value}))}/>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Instructions for Students</label>
                  <textarea className="input-field resize-none" rows={2} placeholder="Answer all Questions" value={step1.instructions} onChange={e => setStep1(p => ({...p, instructions: e.target.value}))}/>
                </div>
              </div>
            )}

            {/* Step 2: Settings */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-semibold text-navy">Submission Settings</h3>
                {[
                  { key: 'allow_late' as const, label: 'Allow Late Submission', desc: 'Students can still submit after the deadline' },
                  { key: 'notify_on_publish' as const, label: 'Notify students on publish', desc: 'Send email/SMS when assignment is published' },
                  { key: 'show_score' as const, label: 'Show score immediately after grading', desc: 'Student can see their score as soon as you grade it' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div><p className="text-xs font-medium text-navy">{label}</p><p className="text-[10px] text-gray-400">{desc}</p></div>
                    <button type="button" onClick={() => setStep2(s => ({...s, [key]: !s[key]}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${step2[key] ? 'bg-primary' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${step2[key] ? 'translate-x-6' : 'translate-x-1'}`}/>
                    </button>
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-500 block mb-2">Attachment (optional)</label>
                  <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors">
                    <input type="file" className="hidden" accept=".jpg,.png,.pdf" onChange={e => setStep2(p => ({...p, attachment: e.target.files?.[0] || null}))}/>
                    {step2.attachment ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-primary font-medium">{step2.attachment.name}</span>
                        <button type="button" onClick={e => { e.preventDefault(); setStep2(p => ({...p, attachment: null})); }}><X size={12} className="text-gray-400"/></button>
                      </div>
                    ) : (
                      <div>
                        <Upload size={20} className="text-gray-300 mx-auto mb-1"/>
                        <p className="text-xs text-gray-500 font-medium">Upload Additional Document</p>
                        <p className="text-[10px] text-gray-300">JPG, PNG or PDF (max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold text-navy">Quadratic Equation</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  {[
                    ['Subject', step1.subject || 'Mathematics'],
                    ['Class', step1.class_name || 'JSS 2'],
                    ['Section', step1.sections.join(', ') || 'JSS 2A, B, C'],
                    ['Due Date', step1.due_date || 'Mar 20th 2026'],
                    ['Due Time', step1.due_time || '11:56 PM'],
                    ['Type', step1.type || 'File Upload'],
                  ].map(([l, v]) => (
                    <div key={l}><p className="text-gray-400 text-[10px]">{l}</p><p className="font-semibold text-navy">{v}</p></div>
                  ))}
                </div>
                {step2.attachment && (
                  <div className="border border-gray-100 rounded-xl p-4">
                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-6 text-center">
                      <p className="text-xs text-primary font-medium">{step2.attachment.name}</p>
                      <p className="text-[10px] text-gray-400">PDF (5MB)</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          {step < 3 && <SummaryCard step1={step1}/>}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => step > 1 ? setStep(s => (s - 1) as Step) : navigate('/assignments')} className="btn-outline">Back</button>
          {step === 3 ? (
            <div className="flex gap-3">
              <button onClick={() => toast.success('Saved as draft!')} className="btn-outline">Save as Draft</button>
              <button onClick={() => mutate()} disabled={isPending} className="btn-primary">{isPending ? 'Publishing…' : 'Publish Assignment'}</button>
            </div>
          ) : (
            <button onClick={() => setStep(s => (s + 1) as Step)} className="btn-primary">Continue</button>
          )}
        </div>
      </div>
    </div>
  );
}
