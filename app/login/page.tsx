'use client';

import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
      useEffect(() => {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      login(data.user.email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white  p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">YogaLand TV</h1>
          <p className="text-gray-600">Admin Portal Login</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            className='w-full h-8 p-1.5 border border-gray-300 rounded'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@yogaland.com"
            required
          />

          <FormInput
            label="Password"
            type="password"
            className='w-full h-8 p-1.5 border border-gray-300 rounded'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary bg-amber-500 text-white py-2 rounded hover:bg-amber-600 transition-colors cursor-pointer" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
