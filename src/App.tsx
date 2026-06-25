import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import { ForgotPasswordPage, VerifyCodePage, ResetPasswordPage, PasswordResetSuccessPage } from './pages/auth/AuthPages';
import DashboardPage from './pages/dashboard/DashboardPage';
import ClassesPage from './pages/classes/ClassesPage';
import QuestionBankPage from './pages/questionbank/QuestionBankPage';
import ExamsPage from './pages/exams/ExamsPage';
import CreateExamPage from './pages/exams/CreateExamPage';
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import CreateAssignmentPage from './pages/assignments/CreateAssignmentPage';
import GradeAssignmentPage from './pages/assignments/GradeAssignmentPage';
import ResultsPage from './pages/results/ResultsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import SettingsPage from './pages/settings/SettingsPage';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } } });

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }}/>
          <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/verify-code" element={<VerifyCodePage/>}/>
            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
            <Route path="/password-reset-success" element={<PasswordResetSuccessPage/>}/>
            <Route element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage/>}/>
              <Route path="/classes" element={<ClassesPage/>}/>
              <Route path="/question-bank" element={<QuestionBankPage/>}/>
              <Route path="/exams" element={<ExamsPage/>}/>
              <Route path="/exams/create" element={<CreateExamPage/>}/>
              <Route path="/assignments" element={<AssignmentsPage/>}/>
              <Route path="/assignments/create" element={<CreateAssignmentPage/>}/>
              <Route path="/assignments/:id/grade" element={<GradeAssignmentPage/>}/>
              <Route path="/results" element={<ResultsPage/>}/>
              <Route path="/notifications" element={<NotificationsPage/>}/>
              <Route path="/settings" element={<SettingsPage/>}/>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
