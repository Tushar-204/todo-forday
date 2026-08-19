import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, AtSign, Mail, Save, Loader, Check, X } from 'lucide-react';
import { getUserProfile, updateUserProfile, checkUsernameAvailability } from '../firebase';

const ProfilePage = ({ user }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [profile, setProfile] = useState({
        displayName: '',
        username: '',
        email: ''
    });

    const [editedProfile, setEditedProfile] = useState({});
    const [usernameChecking, setUsernameChecking] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(null);

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const profileData = await getUserProfile(user.uid);
            const mergedProfile = {
                displayName: profileData.displayName || user.displayName || '',
                username: profileData.username || '',
                email: user.email || profileData.email || ''
            };
            setProfile(mergedProfile);
            setEditedProfile(mergedProfile);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = async (newUsername) => {
        setEditedProfile({ ...editedProfile, username: newUsername });

        if (!newUsername || newUsername === profile.username) {
            setUsernameAvailable(null);
            return;
        }

        // Validate username format
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(newUsername)) {
            setUsernameAvailable(false);
            return;
        }

        setUsernameChecking(true);
        try {
            const available = await checkUsernameAvailability(newUsername, user.uid);
            setUsernameAvailable(available);
        } catch (error) {
            console.error('Error checking username:', error);
        } finally {
            setUsernameChecking(false);
        }
    };

    const handleSave = async () => {
        // Validate
        if (!editedProfile.displayName || editedProfile.displayName.trim().length === 0) {
            setMessage({ type: 'error', text: 'Display name is required' });
            return;
        }

        if (editedProfile.username && usernameAvailable === false) {
            setMessage({ type: 'error', text: 'Username is not available' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await updateUserProfile(user.uid, editedProfile);
            setProfile(editedProfile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Reload to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = JSON.stringify(profile) !== JSON.stringify(editedProfile);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                    <p className="text-white">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-white ml-4">Profile Settings</h1>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
                    {/* Message Display */}
                    {message.text && (
                        <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            <div className="flex items-center gap-2">
                                {message.type === 'success' ? <Check size={18} /> : <X size={18} />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <UserIcon size={18} />
                                    Display Name
                                </div>
                            </label>
                            <input
                                type="text"
                                value={editedProfile.displayName}
                                onChange={(e) => setEditedProfile({ ...editedProfile, displayName: e.target.value })}
                                placeholder="Enter your display name"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Your name as it appears throughout the app</p>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <AtSign size={18} />
                                    Username <span className="text-gray-400 font-normal">(optional)</span>
                                </div>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={editedProfile.username}
                                    onChange={(e) => handleUsernameChange(e.target.value.toLowerCase())}
                                    placeholder="username"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                                />
                                {usernameChecking && (
                                    <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                                )}
                                {!usernameChecking && editedProfile.username && editedProfile.username !== profile.username && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {usernameAvailable ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                3-20 characters, letters, numbers, and underscores only
                                {usernameAvailable === false && (
                                    <span className="text-red-500 block mt-1">⚠️ Username not available</span>
                                )}
                            </p>
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={18} />
                                    Email
                                </div>
                            </label>
                            <input
                                type="email"
                                value={editedProfile.email}
                                disabled
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setEditedProfile(profile);
                                setMessage({ type: '', text: '' });
                                setUsernameAvailable(null);
                            }}
                            disabled={!hasChanges || saving}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving || (editedProfile.username && usernameAvailable === false)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
