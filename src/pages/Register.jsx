import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

const inputClass =
  'w-full min-w-0 bg-cs-dark border border-cs-border rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-cs-purple transition-colors';

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
        const msg = Object.values(data).flat().join(' ');
        setError(msg);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="min-w-0">
      <label className="mb-1 block text-xs text-gray-400">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className={inputClass}
        placeholder={placeholder}
        required={name !== 'last_name' && name !== 'referral_code'}
      />
    </div>
  );

  return (
    <AuthLayout variant="orange">
      <div className="card-dark w-full p-5 glow-purple sm:p-6 md:p-8">
        <h2 className="mb-1 text-center text-lg font-bold sm:text-xl">Create Account</h2>
        <p className="mb-5 text-center text-sm text-gray-500">Join Crypto Stacker today</p>

        {error && (
          <div className="mb-4 rounded-lg border border-cs-red/30 bg-cs-red/10 p-3 text-sm text-cs-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {field('first_name', 'First Name', 'text', 'Your first name')}
            {field('last_name', 'Last Name', 'text', 'Your last name')}
          </div>
          {field('username', 'Username', 'text', 'Choose username')}
          {field('email', 'Email', 'email', 'your@email.com')}
          <div className="min-w-0">
            <label className="mb-1 block text-xs text-gray-400">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`${inputClass} pr-11`}
                placeholder="Min 8 characters"
                autoComplete="new-password"
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
          {field('password2', 'Confirm Password', 'password', 'Confirm password')}
          {field('referral_code', 'Referral Code (Optional)', 'text', 'Enter referral code')}

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white disabled:opacity-50"
          >
            <UserPlus size={18} />
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cs-purple hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
