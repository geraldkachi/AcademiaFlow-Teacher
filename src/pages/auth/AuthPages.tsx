import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import SchoolBadge from '../../components/SchoolBadge';
import { authApi } from '../../api/services';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.forgotPassword({ email }),
    onSuccess: () => navigate('/verify-code', { state: { email } }),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Email not found'),
  });
  return (
    <AuthLayout>
      <SchoolBadge name="Spring Hills Academy"/>
      <h2 className="text-lg font-bold text-navy text-center mb-1">Forgot Password</h2>
      <p className="text-xs text-gray-400 text-center mb-6">We will send you a verification code</p>
      <form onSubmit={e => { e.preventDefault(); if (!email) return toast.error('Enter email'); mutate(); }} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Student Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="JohnDoe23@springhills.edu" className="input-field"/>
        </div>
        <Link to="/login" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy w-fit">
          <ArrowLeft size={12}/> Back to Login
        </Link>
        <button type="submit" disabled={isPending} className="btn-primary w-full">
          {isPending ? 'Sending…' : 'Send Verification Code'}
        </button>
      </form>
    </AuthLayout>
  );
}

export function VerifyCodePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || '';
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.verifyCode({ email, code: code.join('') }),
    onSuccess: () => navigate('/reset-password', { state: { email, code: code.join('') } }),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Invalid code'),
  });
  const { mutate: resend } = useMutation({
    mutationFn: () => authApi.forgotPassword({ email }),
    onSuccess: () => toast.success('Code resent!'),
  });

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code]; next[i] = val.slice(-1); setCode(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <AuthLayout>
      <SchoolBadge name="Spring Hills Academy"/>
      <h2 className="text-lg font-bold text-navy text-center mb-1">Verify Account</h2>
      <p className="text-xs text-gray-400 text-center mb-6">We sent a code to <span className="text-navy font-medium">{email || 'Johndoe@gmail.com'}</span></p>
      <form onSubmit={e => { e.preventDefault(); if (code.join('').length < 6) return toast.error('Enter the 6-digit code'); mutate(); }} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Verification code</label>
          <div className="flex gap-2 justify-center">
            {Array(6).fill(0).map((_, i) => (
              <input key={i} ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
                value={code[i]} onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
                className={`w-10 h-11 text-center border rounded-lg text-sm font-semibold text-navy outline-none transition-all ${code[i] ? 'border-primary bg-primary-light text-primary' : 'border-gray-200 bg-gray-50'} focus:border-primary focus:ring-1 focus:ring-primary/20`}/>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <Link to="/login" className="flex items-center gap-1 text-gray-500 hover:text-navy"><ArrowLeft size={11}/> Back to Login</Link>
          <button type="button" onClick={() => resend()} className="text-primary font-medium hover:underline">Resend Code</button>
        </div>
        <button type="submit" disabled={isPending} className="btn-primary w-full">{isPending ? 'Verifying…' : 'Send Verification Code'}</button>
      </form>
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [show, setShow] = useState({ pwd: false, conf: false });
  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.resetPassword({ email: state?.email || '', code: state?.code || '', password: form.password, password_confirmation: form.confirm }),
    onSuccess: () => navigate('/password-reset-success'),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to reset password'),
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) return toast.error('Min 8 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    mutate();
  };
  return (
    <AuthLayout>
      <SchoolBadge name="Spring Hills Academy"/>
      <h2 className="text-lg font-bold text-navy text-center mb-1">Create New Password</h2>
      <p className="text-xs text-gray-400 text-center mb-6">Create new password for your account</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { label: 'Password', key: 'password' as const, showKey: 'pwd' as const },
          { label: 'Confirm Password', key: 'confirm' as const, showKey: 'conf' as const },
        ].map(({ label, key, showKey }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
            <div className="relative">
              <input type={show[showKey] ? 'text' : 'password'} required value={form[key]}
                onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                placeholder="••••••••••••••" className="input-field pr-10"/>
              <button type="button" onClick={() => setShow(s => ({...s, [showKey]: !s[showKey]}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {show[showKey] ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>
          </div>
        ))}
        <p className="text-[11px] text-gray-400">Password must be at least 8 characters</p>
        <button type="submit" disabled={isPending} className="btn-primary w-full">{isPending ? 'Setting…' : 'Set new password'}</button>
      </form>
    </AuthLayout>
  );
}

export function PasswordResetSuccessPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <SchoolBadge name="Spring Hills Academy"/>
      <h2 className="text-lg font-bold text-navy text-center mb-1">Password Reset</h2>
      <p className="text-xs text-gray-400 text-center mb-8">Your password reset was successful</p>
      <div className="flex justify-center mb-8">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="#dcfce7"/>
          <path d="M25 40l10 10 20-20" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="20" cy="20" r="3" fill="#16a34a" opacity=".4"/>
          <circle cx="60" cy="18" r="2" fill="#16a34a" opacity=".5"/>
          <circle cx="63" cy="58" r="3" fill="#16a34a" opacity=".3"/>
          <circle cx="17" cy="55" r="2" fill="#16a34a" opacity=".4"/>
        </svg>
      </div>
      <button onClick={() => navigate('/login')} className="btn-primary w-full">Go to Login</button>
    </AuthLayout>
  );
}
