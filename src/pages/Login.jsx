import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

const inputClass =
  'w-full min-w-0 bg-cs-dark border border-cs-border rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-cs-purple transition-colors';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(form.username, form.password);
      if (userData.user?.is_staff) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card-dark w-full p-5 glow-purple sm:p-6 md:p-8">
        <h2 className="mb-1 text-center text-lg font-bold sm:text-xl">Welcome Back</h2>
        <p className="mb-6 text-center text-sm text-gray-500">Sign in to your account</p>

        {error && (
          <div className="mb-4 rounded-lg border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={inputClass}
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`${inputClass} pr-11`}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white disabled:opacity-50"
          >
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-cs-purple hover:underline">
            Register
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
