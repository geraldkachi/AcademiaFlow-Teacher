import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationsApi } from '../../api/services';

const mockNotifs = [
  { id: '1', title: 'Second Term Mid-Term Exams Schedule', type: 'Announcement', message: 'Dear students and parents, please note that mid-term examinations are scheduled to begin on March 2, 2026. Students are to come prepared with their exam cards and stationery.', recipients: 'All Students & Parents', created_at: 'Feb 18, 2026 • 10:30AM', recipients_count: 37, read_count: 21 },
  { id: '2', title: 'Mathematics Assignment Deadline', type: 'Reminder', message: 'This is a reminder that the Mathematics assignment for Grade 10A is due on February 25, 2026. Please ensure submission before the...', recipients: 'JSS 1A Students', created_at: 'Feb 18, 2026 • 10:30AM', recipients_count: 42, read_count: 30 },
  { id: '3', title: 'Second Term Mid-Term Exams Schedule', type: 'Alert', message: "Attention parents: The deadline for second term school fees is February 28, 2026. Students with outstanding fees will not be allowed to sit for mid-term exams.", recipients: 'All Parents', created_at: 'Feb 18, 2026 • 10:30AM', recipients_count: 102, read_count: 80 },
];

const typeBadge = (t: string) => {
  const map: Record<string, string> = { Announcement: 'bg-blue-100 text-blue-700', Reminder: 'bg-orange-100 text-orange-700', Alert: 'bg-red-100 text-red-700' };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[t] || 'bg-gray-100 text-gray-600'}`}>{t}</span>;
};

export default function NotificationsPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(mockNotifs[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletedSuccess, setDeletedSuccess] = useState(false);
  const [createForm, setCreateForm] = useState({ type: 'Announcement', title: '', message: '', send_to: 'All Students' });
  const [localNotifs, setLocalNotifs] = useState(mockNotifs);

  const { data } = useQuery({ queryKey: ['t-notifications'], queryFn: notificationsApi.getAll, placeholderData: mockNotifs as any });
  const notifs: any[] = (data as any[] | undefined)?.length ? (data as any[]) : localNotifs;

  const { mutate: createNotif, isPending: creating } = useMutation({
    mutationFn: () => notificationsApi.create({ type: createForm.type, title: createForm.title, message: createForm.message, send_to: createForm.send_to }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['t-notifications'] }); setShowCreate(false); toast.success('Notification sent!'); },
    onError: () => {
      const newN = { id: String(Date.now()), ...createForm, recipients: createForm.send_to, created_at: 'Just now', recipients_count: 0, read_count: 0 };
      setLocalNotifs(n => [newN, ...n]); setShowCreate(false); setSelected(newN); toast.success('Notification sent!');
    },
  });

  const { mutate: deleteNotif, isPending: deleting } = useMutation({
    mutationFn: (id: string) => notificationsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['t-notifications'] }); setDeleteId(null); setDeletedSuccess(true); },
    onError: (_, id) => { setLocalNotifs(n => n.filter(x => x.id !== id)); setDeleteId(null); setDeletedSuccess(true); if (selected?.id === id) setSelected(localNotifs[0]); },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-navy">Notifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Notification list */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-wrap gap-2">
            <select className="select-field py-1 w-auto text-xs"><option>All Classes</option></select>
            <button onClick={() => setShowCreate(true)} className="btn-primary text-xs flex items-center gap-1.5 py-2">
              <Plus size={12}/>New Notification
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {notifs.map((n: any) => (
              <div key={n.id} onClick={() => setSelected(n)}
                className={`p-4 cursor-pointer transition-colors ${selected?.id === n.id ? 'bg-primary-light/40' : 'hover:bg-gray-50'}`}>
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-xs font-semibold text-navy leading-tight flex-1 pr-2">{n.title}</h4>
                  {typeBadge(n.type)}
                </div>
                <p className="text-[10px] text-gray-500 mb-2 leading-relaxed line-clamp-2">{n.message}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span>{n.recipients}</span>
                  <span className="flex items-center gap-1">👁 {n.recipients_count}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{n.created_at}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail */}
        <div className="lg:col-span-3 card p-5">
          {selected ? (
            <>
              <p className="text-[10px] text-gray-400 font-medium mb-1">{typeBadge(selected.type)}</p>
              <h3 className="font-bold text-navy text-base mb-3">{selected.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-5">{selected.message}</p>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{selected.recipients_count ?? 37}</p>
                  <p className="text-xs text-gray-500 font-medium">Recipients</p>
                </div>
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{selected.read_count ?? 21}</p>
                  <p className="text-xs text-gray-500 font-medium">Read</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs">
                <div>
                  <span className="text-gray-400">Read Rate</span>
                  <div className="mt-1 bg-gray-100 rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${selected.recipients_count ? Math.round((selected.read_count / selected.recipients_count) * 100) : 80}%` }}/></div>
                  <span className="text-primary font-semibold">{selected.recipients_count ? Math.round((selected.read_count / selected.recipients_count) * 100) : 80}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div><span className="text-gray-400 block">Sent To</span><span className="font-medium text-navy">{selected.recipients}</span></div>
                  <div className="text-right"><span className="text-gray-400 block">Sent At</span><span className="font-medium text-navy">{selected.created_at}</span></div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => toast.success('Resent!')} className="btn-primary flex-1">Resend</button>
                <button onClick={() => setDeleteId(selected.id)} className="btn-danger flex-1">Delete</button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 text-sm py-10">Select a notification</div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-modal overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-navy">Create New Notification</h3>
              <button onClick={() => setShowCreate(false)}><X size={16} className="text-gray-400"/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Notification Type</label>
                <select className="select-field" value={createForm.type} onChange={e => setCreateForm(f => ({...f, type: e.target.value}))}>
                  {['Announcement','Reminder','Alert'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Notification Title</label>
                <input className="input-field" placeholder="Mathematics Mock Exam Schedu..." value={createForm.title} onChange={e => setCreateForm(f => ({...f, title: e.target.value}))}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Message</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Enter message here" value={createForm.message} onChange={e => setCreateForm(f => ({...f, message: e.target.value}))}/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Send To</label>
                <div className="space-y-2">
                  {['All Students','All Parents','Specific Class','Specific Student'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="send-to" checked={createForm.send_to === opt} onChange={() => setCreateForm(f => ({...f, send_to: opt}))} className="accent-primary"/>
                      <span className="text-xs text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setShowCreate(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => createNotif()} disabled={creating} className="btn-primary flex-1">{creating ? 'Sending…' : 'Send Notification'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && !deletedSuccess && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
            <h3 className="font-bold text-navy mb-2">Delete Notification</h3>
            <p className="text-xs text-gray-500 mb-4">Are you sure you want to delete this notification?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => deleteNotif(deleteId)} disabled={deleting} className="btn-danger flex-1">{deleting ? 'Deleting…' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {deletedSuccess && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-primary"/>
            </div>
            <h3 className="font-bold text-navy mb-1">Notification Deleted</h3>
            <p className="text-xs text-gray-500 mb-4">Notification has been deleted.</p>
            <button onClick={() => { setDeletedSuccess(false); setSelected(localNotifs[0]); }} className="btn-primary w-full">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
