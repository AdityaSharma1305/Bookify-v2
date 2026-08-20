import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import { CheckCircle2, XCircle } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token');
      return;
    }

    api.verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification token is invalid or has expired.');
      });
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-6 shadow-sm">
        {status === 'loading' && (
          <div className="py-8 space-y-3">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6 space-y-4">
            <CheckCircle2 className="text-green-500 mx-auto" size={54} />
            <h2 className="font-serif text-2xl font-bold text-primary">Email Verified!</h2>
            <p className="text-xs text-gray-600">{message}</p>
            <Link to="/login" className="inline-block px-6 py-2.5 bg-accent text-white font-semibold text-xs rounded-xl hover:bg-accent-hover">
              Sign In Now
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6 space-y-4">
            <XCircle className="text-red-500 mx-auto" size={54} />
            <h2 className="font-serif text-2xl font-bold text-primary">Verification Failed</h2>
            <p className="text-xs text-gray-600">{message}</p>
            <Link to="/register" className="inline-block px-6 py-2.5 bg-primary text-white font-semibold text-xs rounded-xl">
              Back to Registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
