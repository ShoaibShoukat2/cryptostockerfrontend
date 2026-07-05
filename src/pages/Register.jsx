import { useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UserPlus, User, Lock, Gift, Mail } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { AuthCard, AuthInput, AuthError, AuthSubmitButton } from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const refFromUrl = searchParams.get('ref') || searchParams.get('referral_code') || '';
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    referral_code: refFromUrl,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = useCallback((name) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      window.location.href = '/dashboard';
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        setError(Object.values(data).flat().join(' '));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout variant="orange">
      <AuthCard
        title="Create Account"
        subtitle="Enter your username, email and password"
        icon={UserPlus}
        variant="orange"
      >
        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Username"
            value={form.username}
            onChange={update('username')}
            placeholder="Choose a username"
            autoComplete="username"
            required
            icon={User}
          />

          <AuthInput
            label="Email"
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="Enter your email"
            autoComplete="email"
            required
            icon={Mail}
          />

          <AuthInput
            label="Password"
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="Choose a password"
            autoComplete="new-password"
            required
            icon={Lock}
          />

          <AuthInput
            label="Referral Code (Optional)"
            value={form.referral_code}
            onChange={update('referral_code')}
            placeholder="Enter referral code"
            icon={Gift}
          />

          <AuthSubmitButton loading={loading} loadingText="Creating account..." icon={UserPlus}>
            Create Account
          </AuthSubmitButton>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
            Sign In
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
