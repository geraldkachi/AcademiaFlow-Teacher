import apiClient from './client';
import type {
  LoginRequest, ForgotPasswordRequest, VerifyCodeRequest, ResetPasswordRequest, AuthResponse,
  DashboardStats, MyClass, UpcomingExam, Activity, Notification,
  ClassItem, ClassStudent, ClassScheduleItem,
  Question, AddQuestionPayload,
  Exam, CreateExamStep1, CreateExamStep2, CreateExamQuestion, CreateExamSecurity,
  Assignment, ResultItem, TeacherProfile, NotificationSettings, Preferences,
} from '../types';

// ─── Auth ───────────────────────────────────────────────
export const authApi = {
  login: (d: LoginRequest) => apiClient.post<AuthResponse>('/auth/teacher/login', d).then(r => r.data),
  forgotPassword: (d: ForgotPasswordRequest) => apiClient.post('/auth/teacher/forgot-password', d).then(r => r.data),
  verifyCode: (d: VerifyCodeRequest) => apiClient.post('/auth/teacher/verify-code', d).then(r => r.data),
  resetPassword: (d: ResetPasswordRequest) => apiClient.post('/auth/teacher/reset-password', d).then(r => r.data),
  logout: () => apiClient.post('/auth/teacher/logout').then(r => r.data),
  me: () => apiClient.get<AuthResponse['user']>('/auth/teacher/me').then(r => r.data),
};

// ─── Dashboard ──────────────────────────────────────────
export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/teacher/dashboard/stats').then(r => r.data),
  getMyClasses: () => apiClient.get<MyClass[]>('/teacher/dashboard/classes').then(r => r.data),
  getUpcomingExams: () => apiClient.get<UpcomingExam[]>('/teacher/dashboard/upcoming-exams').then(r => r.data),
  getActivities: () => apiClient.get<Activity[]>('/teacher/dashboard/activities').then(r => r.data),
  getNotifications: () => apiClient.get<Notification[]>('/teacher/notifications').then(r => r.data),
};

// ─── Classes ────────────────────────────────────────────
export const classesApi = {
  getAll: () => apiClient.get<{ stats: Record<string, number>; classes: ClassItem[] }>('/teacher/classes').then(r => r.data),
  getStudents: (id: string) => apiClient.get<ClassStudent[]>(`/teacher/classes/${id}/students`).then(r => r.data),
  getSchedule: (id: string) => apiClient.get<ClassScheduleItem[]>(`/teacher/classes/${id}/schedule`).then(r => r.data),
};

// ─── Question Bank ──────────────────────────────────────
export const questionBankApi = {
  getAll: (filters?: Record<string, string>) => apiClient.get<{ stats: Record<string, number>; questions: Question[] }>('/teacher/question-bank', { params: filters }).then(r => r.data),
  add: (d: AddQuestionPayload) => apiClient.post<Question>('/teacher/question-bank', d).then(r => r.data),
  update: (id: string, d: Partial<AddQuestionPayload>) => apiClient.put<Question>(`/teacher/question-bank/${id}`, d).then(r => r.data),
  delete: (id: string) => apiClient.delete(`/teacher/question-bank/${id}`).then(r => r.data),
};

// ─── Exams ──────────────────────────────────────────────
export const examsApi = {
  getAll: (filter?: string) => apiClient.get<{ stats: Record<string, number>; exams: Exam[] }>('/teacher/exams', { params: { filter } }).then(r => r.data),
  getById: (id: string) => apiClient.get<Exam>(`/teacher/exams/${id}`).then(r => r.data),
  create: (d: { step1: CreateExamStep1; step2: CreateExamStep2; questions: CreateExamQuestion[]; security: CreateExamSecurity }) =>
    apiClient.post<Exam>('/teacher/exams', d).then(r => r.data),
  saveDraft: (d: Partial<Exam>) => apiClient.post<Exam>('/teacher/exams/draft', d).then(r => r.data),
  schedule: (id: string) => apiClient.post(`/teacher/exams/${id}/schedule`).then(r => r.data),
  delete: (id: string) => apiClient.delete(`/teacher/exams/${id}`).then(r => r.data),
};

// ─── Assignments ────────────────────────────────────────
export const assignmentsApi = {
  getAll: () => apiClient.get<Assignment[]>('/teacher/assignments').then(r => r.data),
  create: (d: Partial<Assignment> & { file?: File }) => {
    const fd = new FormData();
    Object.entries(d).forEach(([k, v]) => { if (v instanceof File) fd.append(k, v); else if (v !== undefined) fd.append(k, String(v)); });
    return apiClient.post<Assignment>('/teacher/assignments', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
};

// ─── Results ────────────────────────────────────────────
export const resultsApi = {
  getAll: (examId?: string) => apiClient.get<ResultItem[]>('/teacher/results', { params: { exam_id: examId } }).then(r => r.data),
  publish: (examId: string) => apiClient.post(`/teacher/results/${examId}/publish`).then(r => r.data),
};

// ─── Notifications ──────────────────────────────────────
export const notificationsApi = {
  getAll: () => apiClient.get<Notification[]>('/teacher/notifications').then(r => r.data),
  getById: (id: string) => apiClient.get<Notification>(`/teacher/notifications/${id}`).then(r => r.data),
  create: (d: { type: string; title: string; message: string; send_to: string; class_id?: string; student_id?: string }) =>
    apiClient.post<Notification>('/teacher/notifications', d).then(r => r.data),
  resend: (id: string) => apiClient.post(`/teacher/notifications/${id}/resend`).then(r => r.data),
  delete: (id: string) => apiClient.delete(`/teacher/notifications/${id}`).then(r => r.data),
};

// ─── Settings ───────────────────────────────────────────
export const settingsApi = {
  getProfile: () => apiClient.get<TeacherProfile>('/teacher/settings/profile').then(r => r.data),
  getNotifications: () => apiClient.get<NotificationSettings>('/teacher/settings/notifications').then(r => r.data),
  updateNotifications: (d: NotificationSettings) => apiClient.put('/teacher/settings/notifications', d).then(r => r.data),
  updatePassword: (d: { current_password: string; new_password: string; confirm_password: string }) =>
    apiClient.put('/teacher/settings/security', d).then(r => r.data),
  getPreferences: () => apiClient.get<Preferences>('/teacher/settings/preferences').then(r => r.data),
  updatePreferences: (d: Preferences) => apiClient.put('/teacher/settings/preferences', d).then(r => r.data),
};
