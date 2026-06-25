import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Users, BookOpen, X } from 'lucide-react';
import { classesApi } from '../../api/services';

const mockClasses = [
  { id: '1', name: 'SS 1', subject: 'Physics', section: 'SS 1 A', students: 92 },
  { id: '2', name: 'SS 2', subject: 'Physics', section: 'SS 2 A', students: 63 },
  { id: '3', name: 'SS 3', subject: 'Physics', section: 'SS 3 A', students: 87 },
  { id: '4', name: 'SS 1', subject: 'Physics', section: 'SS 1 B', students: 92 },
  { id: '5', name: 'SS 2', subject: 'Physics', section: 'SS 2 B', students: 63 },
  { id: '6', name: 'SS 3', subject: 'Physics', section: 'SS 3 B', students: 87 },
  { id: '7', name: 'SS 1', subject: 'Physics', section: 'SS 1 C', students: 92 },
  { id: '8', name: 'SS 2', subject: 'Physics', section: 'SS 2 C', students: 63 },
  { id: '9', name: 'SS 3', subject: 'Physics', section: 'SS 3 C', students: 87 },
];
const mockStudents = [
  { id: '1', name: 'Jane Doe', email: 'janedoe@springhill.com' },
  { id: '2', name: 'Jameson Black', email: 'jamesonblack@springhill.com' },
  { id: '3', name: 'Amelia Spoon', email: 'aspoon@springhill.com' },
  { id: '4', name: 'John Doe', email: 'johndoe@springhill.com' },
  { id: '5', name: 'Malcom Johnson', email: 'malcomyjohnson@springhill.com' },
  { id: '6', name: 'Akemefuna Oluchi', email: 'Akemefuna...@springhill.com' },
  { id: '7', name: 'Celine Dion', email: 'celinedion@springhill.com' },
  { id: '8', name: 'Sofia Vagara', email: 'sofiavagara@springhill.com' },
];
const mockSchedule = [
  { id: '1', title: 'Mathematics Finals', date: 'Feb 5, 2026 · 120 minutes · Online', duration: 120, type: 'exam' },
  { id: '2', title: 'Biology Finals', date: 'Feb 5, 2026 · 120 minutes · Online', duration: 120, type: 'exam' },
  { id: '3', title: 'Physics Assignment', date: 'Feb 5, 2026 · 120 minutes · Online', duration: 120, type: 'assignment' },
  { id: '4', title: 'Chemistry Quiz', date: 'Feb 5, 2026 · 120 minutes · Online', duration: 120, type: 'exam' },
];

export default function ClassesPage() {
  const [modalClass, setModalClass] = useState<any>(null);
  const [modalTab, setModalTab] = useState<'students' | 'schedule'>('students');

  const { data } = useQuery({ queryKey: ['t-classes'], queryFn: classesApi.getAll, placeholderData: { stats: { total_classes: 10, total_students: 5, average_performance: 75, primary_class: 'SS 1A' }, classes: mockClasses } as any });
  const classes = (data as any)?.classes || mockClasses;
  const statsData = (data as any)?.stats || { total_classes: 10, total_students: 5, average_performance: 75, primary_class: 'SS 1A' };

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-navy">My Classes</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Classes', value: statsData.total_classes, icon: BookOpen, color: 'text-primary' },
          { label: 'Total Students', value: statsData.total_students, icon: Users, color: 'text-purple-500' },
          { label: 'Average Performance', value: `${statsData.average_performance}%`, icon: BookOpen, color: 'text-orange-500' },
          { label: 'Primary Class', value: statsData.primary_class, icon: BookOpen, color: 'text-blue-500' },
        ].map(({ label, value }) => (
          <div key={label} className="card p-3">
            <p className="text-xl font-bold text-navy">{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Classes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(classes as any[]).map((c: any) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-navy">{c.name}</h3>
              <button onClick={() => { setModalClass(c); setModalTab('students'); }}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
                <Eye size={12}/>View
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2">Subject : {c.subject}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Users size={11}/>{c.students} Students
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Section</p>
              <span className="text-xs font-medium text-navy">{c.section}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Class modal */}
      {modalClass && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs shadow-modal overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="font-bold text-navy">{modalClass.section}</h3>
              <button onClick={() => setModalClass(null)}><X size={16} className="text-gray-400"/></button>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4">
              {(['students', 'schedule'] as const).map(tab => (
                <button key={tab} onClick={() => setModalTab(tab)}
                  className={`capitalize text-sm font-medium pb-2 mr-5 border-b-2 transition-colors ${modalTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-4 max-h-72 overflow-y-auto">
              {modalTab === 'students' ? (
                <div className="space-y-3">
                  {mockStudents.map(s => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {s.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-navy">{s.name}</p>
                        <p className="text-[10px] text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {mockSchedule.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-navy">{s.title}</p>
                        <p className="text-[10px] text-gray-400">{s.date}</p>
                      </div>
                      <button className="text-xs text-primary font-medium hover:underline">View</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 pb-4">
              <button onClick={() => setModalClass(null)} className="btn-primary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
