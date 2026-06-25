// LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import SchoolBadge from '../../components/SchoolBadge';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { 
    // login
   } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    email: 'admin@school.com', 
    password: 'password123', 
    remember: true 
  });
  const [showPwd, setShowPwd] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      return toast.error('Please fill all fields');
    }

    setIsPending(true);

    try {
      // const result = await login(form.email, form.password, form.remember);
      navigate('/dashboard');
      toast.success(`Welcome back!`);
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsPending(false);
    }
  };

  // Demo accounts helper
  const fillDemoAccount = (email: string) => {
    setForm(f => ({ ...f, email }));
  };

  return (
    <AuthLayout>
      <SchoolBadge name="Spring Hills Academy" />
      
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-navy mb-1">Welcome Back</h2>
        <p className="text-xs text-gray-400">Let's get the learning started</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@school.edu"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••••••••"
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
              className="w-3.5 h-3.5 accent-primary rounded"
            />
            Keep me signed in
          </label>
          <Link 
            to="/forgot-password" 
            className="text-xs text-primary font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="btn-primary w-full mt-1"
        >
          {isPending ? 'Logging in…' : 'Login'}
        </button>
      </form>

      {/* Demo Accounts - Remove in production */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center mb-3">Demo Accounts</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['admin@school.com', 'teacher@school.com', 'student@school.com', 'parent@school.com'].map(email => (
            <button
              key={email}
              onClick={() => fillDemoAccount(email)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {email.split('@')[0]}
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Eye, EyeOff } from 'lucide-react';
// import { useMutation } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import AuthLayout from '../../components/AuthLayout';
// import SchoolBadge from '../../components/SchoolBadge';
// import { authApi } from '../../api/services';
// import { useAuth } from '../../context/AuthContext';

// export default function LoginPage() {
//   const { setAuth } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: '', password: '', remember: true });
//   const [showPwd, setShowPwd] = useState(false);

//   const { mutate, isPending } = useMutation({
//     mutationFn: () => authApi.login({ email: form.email, password: form.password, remember_me: form.remember }),
//     onSuccess: (data) => { setAuth(data.token, data.user); navigate('/dashboard'); },
//     onError: (err: any) => toast.error(err?.response?.data?.message || 'Invalid credentials'),
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.email || !form.password) return toast.error('Please fill all fields');
//     mutate();
//   };

//   return (
//     <AuthLayout>
//       <SchoolBadge name="Spring Hills Academy"/>
//       <h2 className="text-lg font-bold text-navy text-center mb-1">Welcome Back</h2>
//       <p className="text-xs text-gray-400 text-center mb-6">Let's get the teaching started</p>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <div>
//           <label className="block text-xs font-medium text-gray-600 mb-1.5">Teacher Email</label>
//           <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
//             placeholder="Johndoe23@springhills.edu" className="input-field"/>
//         </div>
//         <div>
//           <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
//           <div className="relative">
//             <input type={showPwd ? 'text' : 'password'} required value={form.password}
//               onChange={e => setForm(f => ({...f, password: e.target.value}))}
//               placeholder="••••••••••••••" className="input-field pr-10"/>
//             <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//               {showPwd ? <EyeOff size={14}/> : <Eye size={14}/>}
//             </button>
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
//             <input type="checkbox" checked={form.remember} onChange={e => setForm(f => ({...f, remember: e.target.checked}))}
//               className="w-3.5 h-3.5 accent-primary rounded"/>
//             Keep me signed in
//           </label>
//           <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">Forgot Password?</Link>
//         </div>
//         <button type="submit" disabled={isPending} className="btn-primary w-full mt-1">
//           {isPending ? 'Logging in…' : 'Login'}
//         </button>
//       </form>
//     </AuthLayout>
//   );
// }
