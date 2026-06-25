import { useQuery } from '@tanstack/react-query';
import { Users, BookMarked, Clock, BookOpen, Calendar, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const mockStats = { total_students: 250, total_classes: 5, pending_grades: 5, upcoming_exams: 6, academic_session: '25/26' };
const mockClasses = [{ id: '1', name: 'SS 1', subject: 'Physics', section: 'SS 1 A', students: 92, role: 'Class Teacher' }];
const mockExams = [
  { id: '1', title: 'Mid Term Test', subject: 'Mathematics', type: 'online' as const, date: '30th Jan 2026', time: '9:00AM', duration: 120, students: 120, class_name: 'SS1' },
  { id: '2', title: 'Second Term Exam', subject: 'Chemistry', type: 'online' as const, date: '30th Jan 2026', time: '9:00AM', duration: 120, students: 120, class_name: 'SS2' },
];
const mockActivities = [
  { id: '1', title: 'New Exam Created', description: 'Mathematics. Pending Approval\n4:35 PM', type: 'success' as const },
  { id: '2', title: 'Physics Test scheduled', description: 'Test coming up on Friday 20th\n2:00 PM', type: 'info' as const },
  { id: '3', title: 'English Exam Graded', description: 'Results are now available\n11:10 PM', type: 'success' as const },
  { id: '4', title: 'Biology Assignment Deadline', description: 'Deadline in 3 hours\n2:00 PM', type: 'error' as const },
];

const ActivityIcon = ({ type }: { type: string }) => {
  if (type === 'success') return <CheckCircle2 className="w-5 h-5 text-primary shrink-0"/>;
  if (type === 'error') return <AlertCircle className="w-5 h-5 text-red-500 shrink-0"/>;
  return <Info className="w-5 h-5 text-blue-400 shrink-0"/>;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: stats } = useQuery({ queryKey: ['t-dashboard-stats'], queryFn: dashboardApi.getStats, placeholderData: mockStats });
  const { data: classes } = useQuery({ queryKey: ['t-my-classes-dash'], queryFn: dashboardApi.getMyClasses, placeholderData: mockClasses as any });
  const { data: exams } = useQuery({ queryKey: ['t-upcoming-exams-dash'], queryFn: dashboardApi.getUpcomingExams, placeholderData: mockExams as any });

  const s = stats || mockStats;
  const cls: any[] = (classes as any[] | undefined) || mockClasses;
  const exs: any[] = (exams as any[] | undefined) || mockExams;

  const statCards = [
    { label: 'Students', value: s.total_students, icon: Users, color: 'text-green-600' },
    { label: 'Classes', value: s.total_classes, icon: BookMarked, color: 'text-purple-600' },
    { label: 'Pending Grades', value: s.pending_grades, icon: Clock, color: 'text-orange-500' },
    { label: 'Upcoming Exams', value: s.upcoming_exams, icon: BookOpen, color: 'text-teal-500' },
    { label: 'Academic Session', value: s.academic_session, icon: Calendar, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-navy">Hello, {user?.name || 'Admin 1'}</h1>
        <p className="text-xs text-gray-400">What do you want to do today?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-3">
            <Icon size={16} className={`${color} mb-2`}/>
            <p className="text-xl font-bold text-navy">{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* My Classes */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-navy">My Classes</h3>
          </div>
          <div className="p-4 space-y-3">
            {cls.map((c: any) => (
              <div key={c.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-navy">{c.name}</span>
                  {c.role && <span className="text-xs text-gray-400 font-medium">{c.role}</span>}
                </div>
                <p className="text-xs text-gray-500 mb-2">Subject : {c.subject}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="bg-primary-light text-primary px-2 py-0.5 rounded font-medium text-[10px]">{c.section}</span>
                  </div>
                  <span className="flex items-center gap-1"><Users size={11}/>{c.students} Students</span>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/classes')} className="text-primary text-xs font-semibold hover:underline w-full text-center pt-1">View All</button>
          </div>
        </div>

        {/* Quick Actions + Activities */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-bold text-navy mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Create Assignment', path: '/assignments' },
                { label: 'Question Bank', path: '/question-bank' },
                { label: 'Create Exam', path: '/exams/create' },
                { label: 'View Result', path: '/results' },
              ].map(({ label, path }) => (
                <button key={label} onClick={() => navigate(path)}
                  className="bg-gray-50 hover:bg-primary-light hover:text-primary text-gray-600 rounded-xl py-3 px-2 text-xs font-semibold transition-colors border border-gray-100 leading-tight">
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-4">
            <h3 className="text-sm font-bold text-navy mb-3">Recent Activities</h3>
            <div className="space-y-3">
              {mockActivities.map(a => (
                <div key={a.id} className="flex items-start gap-2.5">
                  <ActivityIcon type={a.type}/>
                  <div>
                    <p className="text-xs font-semibold text-navy leading-tight">{a.title}</p>
                    <p className="text-[10px] text-gray-400 whitespace-pre-line">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-navy">Upcoming Exam</h3>
        </div>
        <div className="p-4 space-y-3">
          {exs.map((ex: any) => (
            <div key={ex.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-primary">{ex.title}</h4>
                <span className="badge-online">{ex.type === 'online' ? 'Online' : 'Hall Based'}</span>
              </div>
              <p className="text-xs text-primary font-medium mb-3">{ex.subject}</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px] text-gray-500">
                <div><span className="block text-gray-400">📅 Date</span><span className="font-medium text-navy">{ex.date}</span></div>
                <div><span className="block text-gray-400">⏰ Time</span><span className="font-medium text-navy">{ex.time}</span></div>
                <div><span className="block text-gray-400">⏱ Duration</span><span className="font-medium text-navy">{ex.duration} Minutes</span></div>
                <div><span className="block text-gray-400">👥 Students</span><span className="font-medium text-navy">{ex.students}</span></div>
                <div><span className="block text-gray-400">🏫 Class</span><span className="font-medium text-navy">{ex.class_name}</span></div>
              </div>
            </div>
          ))}
          <button onClick={() => navigate('/exams')} className="text-primary text-xs font-semibold hover:underline w-full text-center pt-1">View All</button>
        </div>
      </div>
    </div>
  );
}
