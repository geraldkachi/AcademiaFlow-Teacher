import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { User, Bell, Lock, Settings as Gear, BookOpen, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsApi } from '../../api/services';
import apiClient from '../../api/client';

type Tab = 'profile' | 'grading' | 'notification' | 'security' | 'preference';

const mockProfile = { name: 'Jane Doe', email: 'Janedoe@springhills.edu', staff_id: 'STF-10374', subject: 'Physics', gender: 'Female', dob: '20th April 1990', nationality: 'Nigerian', phone: '+234568845555', address: '1, Admiralty way Lekki' };
const mockNotif = { new_exam_scheduled: true, result_published: true, new_assignment: true, assignment_graded: true, deadlines_reminder: true, deadline_lead_time: '60 minutes before', school_announcements: true };
const mockPrefs = { language: 'English', timezone: '+1 GMT', date_format: 'DD/MM/YYYY', font_size: '30' };
const mockGrading = { grading_scale: 'Percentage 1-100 %', default_pass_mark: '40', default_exam_duration: '60 min', assignment_weight: '30', exam_weight: '70', pass_mark: '50%', auto_grade: true, show_correct_answers: true, show_feedback: true, allow_late: true, late_penalty: '10', max_late_days: '3' };

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${checked ? 'bg-primary' : 'bg-gray-200'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}/>
    </button>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'grading', label: 'Grading', icon: BookOpen },
    { key: 'notification', label: 'Notification', icon: Bell },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'preference', label: 'Preference', icon: Gear },
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-navy">Settings</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-48 card p-2 h-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-primary-light text-primary' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Icon size={15}/>{label}
            </button>
          ))}
        </div>
        <div className="flex-1 card p-5">
          {tab === 'profile' && <ProfileTab/>}
          {tab === 'grading' && <GradingTab/>}
          {tab === 'notification' && <NotificationTab/>}
          {tab === 'security' && <SecurityTab/>}
          {tab === 'preference' && <PreferenceTab/>}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { data: profile } = useQuery({ queryKey: ['t-settings-profile'], queryFn: settingsApi.getProfile, placeholderData: mockProfile as any });
  const p = profile || mockProfile;
  return (
    <div>
      <h2 className="font-bold text-navy text-center mb-5">Profile</h2>
      <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl mb-5">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"><User size={20} className="text-gray-400"/></div>
        <div>
          <p className="font-bold text-navy">{p.name}</p>
          <div className="flex gap-3 text-[11px] text-gray-400 flex-wrap"><span>{p.email}</span><span>{p.staff_id}</span></div>
        </div>
      </div>
      <h3 className="text-sm font-bold text-navy mb-3">Personal Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[['Gender',p.gender],['Date of Birth',p.dob],['Nationality',p.nationality],['Phone',p.phone],['Address',p.address],['Subject',p.subject]].map(([l,v]) => (
          <div key={l}><p className="text-[11px] text-gray-400 mb-0.5">{l}</p><p className="font-medium text-navy text-xs">{v}</p></div>
        ))}
      </div>
    </div>
  );
}

function GradingTab() {
  const [settings, setSettings] = useState(mockGrading);
  const { mutate, isPending } = useMutation({ mutationFn: async () => apiClient.put('/teacher/settings/grading', settings), onSuccess: () => toast.success('Saved!') });
  return (
    <div>
      <h2 className="font-bold text-navy text-center mb-5">Grading Settings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Default Grading Scale</label>
          <select className="select-field text-xs" value={settings.grading_scale} onChange={e => setSettings(s => ({...s, grading_scale: e.target.value}))}>
            <option>Percentage 1-100 %</option><option>Letter Grade</option><option>GPA</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Default Pass Mark</label>
          <input className="input-field text-xs" value={settings.default_pass_mark} onChange={e => setSettings(s => ({...s, default_pass_mark: e.target.value}))} placeholder="40"/>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Default Exam Duration</label>
          <input className="input-field text-xs" value={settings.default_exam_duration} onChange={e => setSettings(s => ({...s, default_exam_duration: e.target.value}))} placeholder="60 min"/>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Assignment weight (%)</label>
          <input className="input-field text-xs" value={settings.assignment_weight} onChange={e => setSettings(s => ({...s, assignment_weight: e.target.value}))} placeholder="30"/>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Exam Weight (%)</label>
          <input className="input-field text-xs" value={settings.exam_weight} onChange={e => setSettings(s => ({...s, exam_weight: e.target.value}))} placeholder="70"/>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Pass Mark</label>
          <select className="select-field text-xs" value={settings.pass_mark} onChange={e => setSettings(s => ({...s, pass_mark: e.target.value}))}>
            <option>50%</option><option>40%</option><option>60%</option>
          </select>
        </div>
      </div>
      <div className="space-y-4 mb-5">
        {[
          { key: 'auto_grade' as const, label: 'Auto Grade Objective Questions', desc: 'Automatically grade MCQ and True/False questions' },
          { key: 'show_correct_answers' as const, label: 'Show Correct Answers After Exam', desc: 'Reveal correct answers to students after grading' },
          { key: 'show_feedback' as const, label: 'Show Feedback by Default', desc: 'Display written feedback alongside grades' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div><p className="text-xs font-medium text-navy">{label}</p><p className="text-[10px] text-gray-400">{desc}</p></div>
            <Toggle checked={settings[key]} onChange={v => setSettings(s => ({...s, [key]: v}))}/>
          </div>
        ))}
      </div>
      <h3 className="text-sm font-bold text-navy mb-3">Assignment Settings</h3>
      <div className="space-y-4 mb-5">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-medium text-navy">Allow Late Submissions</p><p className="text-[10px] text-gray-400">Accept assignments after the deadline with a penalty</p></div>
          <Toggle checked={settings.allow_late} onChange={v => setSettings(s => ({...s, allow_late: v}))}/>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Late Penalty (%)</label>
          <input className="input-field text-xs" value={settings.late_penalty} onChange={e => setSettings(s => ({...s, late_penalty: e.target.value}))} placeholder="10"/>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Max Late Days</label>
          <select className="select-field text-xs" value={settings.max_late_days} onChange={e => setSettings(s => ({...s, max_late_days: e.target.value}))}>
            {['1','2','3','5','7'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <button onClick={() => mutate()} disabled={isPending} className="btn-primary w-full">{isPending ? 'Saving…' : 'Save'}</button>
    </div>
  );
}

function NotificationTab() {
  const { data } = useQuery({ queryKey: ['t-notif-settings'], queryFn: settingsApi.getNotifications, placeholderData: mockNotif as any });
  const [settings, setSettings] = useState(data || mockNotif);
  const { mutate, isPending } = useMutation({ mutationFn: () => settingsApi.updateNotifications(settings as any), onSuccess: () => toast.success('Saved!') });
  return (
    <div>
      <h2 className="font-bold text-navy text-center mb-5">Notification Settings</h2>
      <div className="space-y-4">
        {[
          { key: 'new_exam_scheduled', label: 'New Exam Scheduled', desc: 'When a new exam is created for your class' },
          { key: 'result_published', label: 'Result Published', desc: 'When exam results are available' },
          { key: 'new_assignment', label: 'New Assignment', desc: 'Notify when a new assignment is created' },
          { key: 'assignment_graded', label: 'Assignment Graded', desc: 'When an assignment is graded' },
          { key: 'deadlines_reminder', label: 'Deadlines & Reminder', desc: 'Remind you about upcoming deadlines' },
          { key: 'school_announcements', label: 'School Announcements', desc: 'Receive school-wide announcements' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div><p className="text-sm font-medium text-navy">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
            <Toggle checked={(settings as any)[key] ?? true} onChange={v => setSettings(s => ({...s, [key]: v}))}/>
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Deadline Reminder Lead Time</label>
          <select className="select-field" value={(settings as any).deadline_lead_time} onChange={e => setSettings(s => ({...s, deadline_lead_time: e.target.value}))}>
            {['15 minutes before','30 minutes before','60 minutes before','2 hours before','1 day before'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <button onClick={() => mutate()} disabled={isPending} className="btn-primary w-full mt-6">{isPending ? 'Saving…' : 'Save'}</button>
    </div>
  );
}

function SecurityTab() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [show, setShow] = useState({ cur: false, new: false, conf: false });
  const { mutate, isPending } = useMutation({
    mutationFn: () => settingsApi.updatePassword(form),
    onSuccess: () => { toast.success('Password updated!'); setForm({ current_password: '', new_password: '', confirm_password: '' }); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed'),
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) return toast.error('Passwords do not match');
    if (form.new_password.length < 8) return toast.error('Min 8 characters');
    mutate();
  };
  return (
    <div>
      <h2 className="font-bold text-navy text-center mb-5">Security Settings</h2>
      <form onSubmit={handleSubmit}>
        <h3 className="text-sm font-semibold text-navy mb-3">Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {([['current_password','Current Password','cur'],['new_password','New Password','new']] as const).map(([k, label, showKey]) => (
            <div key={k}>
              <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
              <div className="relative">
                <input type={show[showKey] ? 'text' : 'password'} value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))} className="input-field pr-9" placeholder="••••••••••"/>
                <button type="button" onClick={() => setShow(s => ({...s, [showKey]: !s[showKey]}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show[showKey] ? <EyeOff size={13}/> : <Eye size={13}/>}</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600 block mb-1">Confirm New Password</label>
          <div className="relative">
            <input type={show.conf ? 'text' : 'password'} value={form.confirm_password} onChange={e => setForm(f => ({...f, confirm_password: e.target.value}))} className="input-field pr-9" placeholder="••••••••••"/>
            <button type="button" onClick={() => setShow(s => ({...s, conf: !s.conf}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show.conf ? <EyeOff size={13}/> : <Eye size={13}/>}</button>
          </div>
        </div>
        <button type="submit" disabled={isPending} className="btn-primary w-full">{isPending ? 'Updating…' : 'Update Password'}</button>
      </form>
    </div>
  );
}

function PreferenceTab() {
  const { data } = useQuery({ queryKey: ['t-preferences'], queryFn: settingsApi.getPreferences, placeholderData: mockPrefs as any });
  const [prefs, setPrefs] = useState(data || mockPrefs);
  const { mutate, isPending } = useMutation({ mutationFn: () => settingsApi.updatePreferences(prefs as any), onSuccess: () => toast.success('Saved!') });
  return (
    <div>
      <h2 className="font-bold text-navy text-center mb-5">Preferences</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Language</label>
          <select className="select-field" value={(prefs as any).language} onChange={e => setPrefs(p => ({...p, language: e.target.value}))}>
            {['English','French','Spanish'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Time Zone</label>
          <select className="select-field" value={(prefs as any).timezone} onChange={e => setPrefs(p => ({...p, timezone: e.target.value}))}>
            {['+1 GMT','+2 GMT','UTC'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Data Format</label>
          <input className="input-field" value={(prefs as any).date_format} onChange={e => setPrefs(p => ({...p, date_format: e.target.value}))}/>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Font size</label>
          <input className="input-field" value={(prefs as any).font_size} onChange={e => setPrefs(p => ({...p, font_size: e.target.value}))} placeholder="30"/>
        </div>
      </div>
      <button onClick={() => mutate()} disabled={isPending} className="btn-primary w-full">{isPending ? 'Saving…' : 'Save'}</button>
    </div>
  );
}
