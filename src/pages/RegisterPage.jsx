import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    rollOrEmployeeId: '',
    department: 'Computer Science & Engineering',
    phoneNumber: '',
    role: 'ROLE_STUDENT',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email address';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setErrors(err.response.data.validationErrors);
      } else {
        setServerError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-campus-500 to-campus-700 mx-auto flex items-center justify-center text-white shadow-lg shadow-campus-500/20 mb-3">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create CampusNav Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Join the digital navigation portal to save custom routes and access campus facilities.
          </p>
        </div>

        {serverError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-7 shadow-xl border border-slate-200/80">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                {errors.fullName && <span className="text-rose-500 text-[10px]">{errors.fullName}</span>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. mayalin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                {errors.username && <span className="text-rose-500 text-[10px]">{errors.username}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. student@college.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                {errors.email && <span className="text-rose-500 text-[10px]">{errors.email}</span>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                {errors.password && <span className="text-rose-500 text-[10px]">{errors.password}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Roll / Employee ID</label>
                <input
                  type="text"
                  value={formData.rollOrEmployeeId}
                  onChange={(e) => setFormData({ ...formData, rollOrEmployeeId: e.target.value })}
                  placeholder="e.g. 22CS089"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="ROLE_STUDENT">Student</option>
                  <option value="ROLE_FACULTY">Faculty Member</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-campus-600 to-campus-700 hover:from-campus-700 hover:to-campus-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-campus-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-campus-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
