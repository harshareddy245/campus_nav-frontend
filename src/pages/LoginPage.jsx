import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LogIn, AlertCircle, KeyRound, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user, pass) => {
    setUsernameOrEmail(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-campus-500 to-campus-700 mx-auto flex items-center justify-center text-white shadow-lg shadow-campus-500/20 mb-3">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access saved routes, personal timetable navigations, and admin controls.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-7 shadow-xl border border-slate-200/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="e.g. student or admin"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-campus-600 to-campus-700 hover:from-campus-700 hover:to-campus-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-campus-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Fast Demo Accounts (Click to Autofill):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student', 'student123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-campus-50 text-slate-700 hover:text-campus-700 border border-slate-200 text-[11px] font-semibold transition-colors"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('faculty', 'faculty123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-campus-50 text-slate-700 hover:text-campus-700 border border-slate-200 text-[11px] font-semibold transition-colors"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-semibold transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-campus-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
