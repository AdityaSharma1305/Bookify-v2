import { Logo } from '../components/layout/Logo';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { BookOpen, CheckCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.register({ name: name.trim(), email: email.trim(), password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2"><Logo size="lg" clickable={false} /></div>
          <h2 className="font-serif text-2xl font-bold text-primary">Create an account</h2>
          <p className="text-xs text-gray-500">Join Bookify to build your reading universe</p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="text-green-500 mx-auto" size={48} />
            <h3 className="font-serif font-bold text-lg text-primary">Check your email!</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We sent a verification link to <strong>{email}</strong>. Please click the link to activate your account.
            </p>
            <Link to="/login" className="inline-block px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  placeholder="Jane Reader"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent text-white font-semibold text-sm rounded-xl hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
