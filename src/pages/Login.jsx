import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { AuthCard, AuthInput, AuthError, AuthSubmitButton } from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

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
    <AuthLayout variant="purple">
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to your account"
        icon={LogIn}
        variant="purple"
      >
        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Enter your username"
            autoComplete="username"
            required
            icon={User}
            delay={0}
          />

          <AuthInput
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            icon={Lock}
            delay={0.08}
            suffix={(
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-purple-400"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          />

          <AuthSubmitButton loading={loading} loadingText="Signing in..." icon={LogIn} delay={0.16}>
            Sign In
          </AuthSubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-purple-400 transition-colors hover:text-purple-300 hover:underline">
            Register
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
