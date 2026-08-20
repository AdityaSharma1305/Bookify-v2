import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { UserProfile } from '../types';
import { useAuthStore } from '../store/authStore';
import { User, Shield, Key } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { setUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [readingGoal, setReadingGoal] = useState(10);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMe().then((res) => {
      setProfile(res.data.data);
      setName(res.data.data.name);
      setBio(res.data.data.bio || '');
      setReadingGoal(res.data.data.readingGoal || 10);
    }).finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateProfile({ name, bio, readingGoal });
      setProfile(res.data.data);
      setUser(res.data.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setMessage('Password changed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Account &amp; Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage personal info, reading goals, and security</p>
      </div>

      {message && (
        <div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs font-semibold border border-green-100">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <form onSubmit={handleUpdateProfile} className="p-6 bg-white border border-gray-200 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
            <User size={18} className="text-accent" /> Profile Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
              placeholder="Tell other readers about your tastes..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Yearly Reading Goal (books)</label>
            <input
              type="number"
              min={1}
              value={readingGoal}
              onChange={(e) => setReadingGoal(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-accent-hover">
            Save Profile
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="p-6 bg-white border border-gray-200 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
            <Key size={18} className="text-accent" /> Change Password
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">New Password (min 8 chars)</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};
