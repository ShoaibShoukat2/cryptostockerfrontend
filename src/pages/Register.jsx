import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, EyeOff, UserPlus, User, Mail, Lock, Gift,
} from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { AuthCard, AuthInput, AuthError, AuthSubmitButton } from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    first_name: '', last_name: '', referral_code: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

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
              onChange={set('first_name')}
              placeholder="First name"
              required
              icon={User}
              delay={0}
            />
            <AuthInput
              label="Last Name"
              value={form.last_name}
              onChange={set('last_name')}
              placeholder="Last name"
              icon={User}
              delay={0.04}
            />
          </div>

          <AuthInput
            label="Username"
            value={form.username}
            onChange={set('username')}
            placeholder="Choose a username"
            required
            icon={User}
            delay={0.08}
          />

          <AuthInput
            label="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="your@email.com"
            required
            icon={Mail}
            delay={0.12}
          />

          <AuthInput
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            placeholder="Min 8 characters"
            autoComplete="new-password"
            required
            icon={Lock}
            delay={0.16}
            suffix={(
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-orange-400"
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
            onChange={set('password2')}
            placeholder="Confirm password"
            required
            icon={Lock}
            delay={0.2}
          />

          <AuthInput
            label="Referral Code (Optional)"
            value={form.referral_code}
            onChange={set('referral_code')}
            placeholder="Enter referral code"
            icon={Gift}
            delay={0.24}
          />

          <AuthSubmitButton loading={loading} loadingText="Creating account..." icon={UserPlus} delay={0.28}>
            Create Account
          </AuthSubmitButton>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-purple-400 transition-colors hover:text-purple-300 hover:underline">
            Sign In
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
