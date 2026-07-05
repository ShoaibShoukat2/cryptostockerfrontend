import { useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Eye, EyeOff, UserPlus, User, Mail, Lock, Gift,
} from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { AuthCard, AuthInput, AuthError, AuthSubmitButton } from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const refFromUrl = searchParams.get('ref') || searchParams.get('referral_code') || '';
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    first_name: '', last_name: '', referral_code: refFromUrl,
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = useCallback((name) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }
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

  const togglePass = useCallback(() => setShowPass((v) => !v), []);

  return (
    <AuthLayout variant="orange">
      <AuthCard
        title="Create Account"
        subtitle="Join Crypto Stacker today"
        icon={UserPlus}
        variant="orange"
      >
        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AuthInput
              label="First Name"
              value={form.first_name}
              onChange={update('first_name')}
              placeholder="First name"
              required
              icon={User}
            />
            <AuthInput
              label="Last Name"
              value={form.last_name}
              onChange={update('last_name')}
              placeholder="Last name"
              icon={User}
            />
          </div>

          <AuthInput
            label="Username"
            value={form.username}
            onChange={update('username')}
            placeholder="Choose a username"
            required
            icon={User}
          />

          <AuthInput
            label="Email"
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="your@email.com"
            required
            icon={Mail}
          />

          <AuthInput
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={update('password')}
            placeholder="Min 8 characters"
            autoComplete="new-password"
            required
            icon={Lock}
            suffix={(
              <button
                type="button"
                onClick={togglePass}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            value={form.password2}
            onChange={update('password2')}
            placeholder="Confirm password"
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
