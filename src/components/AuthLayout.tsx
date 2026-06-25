import Logo from './Logo';
import type { ReactNode } from 'react';
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-6"><Logo size="lg" /></div>
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 w-full max-w-sm p-7">{children}</div>
    </div>
  );
}
