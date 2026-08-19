    import React, { useState } from 'react';
    import { Calendar, Sparkles, CheckCircle, Zap, Cloud } from 'lucide-react';
    import { signInWithGoogle } from '../firebase';

    const AuthPage = () => {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        const handleGoogleSignIn = async () => {
            setLoading(true);
            setError('');
            try {
                await signInWithGoogle();
                // Navigation will be handled by App.js auth state listener
            } catch (err) {
                setError(err.message || 'Failed to sign in. Please try again.');
                setLoading(false);
            }
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Branding & Features */}
                    <div className="text-white space-y-8 lg:pr-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Calendar size={32} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black">Daily Todo</h1>
                                    <p className="text-purple-200 text-lg">Your Smart Task Manager</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold">
                                Transform Your Productivity
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CheckCircle size={20} className="text-green-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Smart Organization</h3>
                                        <p className="text-purple-200 text-sm">Priorities, categories, and recurring tasks</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Cloud size={20} className="text-blue-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Cloud Sync</h3>
                                        <p className="text-purple-200 text-sm">Access your tasks from anywhere</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Zap size={20} className="text-purple-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Lightning Fast</h3>
                                        <p className="text-purple-200 text-sm">Beautiful, responsive interface</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <p className="text-purple-200 text-sm">
                                Join thousands of users staying organized every day
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Auth Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8">
                        <div className="text-center space-y-2">
                            <div className="flex justify-center mb-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                    <Sparkles size={40} className="text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Welcome Back!
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Sign in with Google to access your tasks
                            </p>
                            <p className="text-sm text-gray-500">
                                New user? Your account will be created automatically
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-700 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="font-semibold text-gray-700 group-hover:text-purple-700">
                                    {loading ? 'Signing in...' : 'Continue with Google'}
                                </span>
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">
                                        Secure authentication powered by Firebase
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle size={16} className="text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle size={16} className="text-green-500" />
                                <span>Free forever</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle size={16} className="text-green-500" />
                                <span>Your data is encrypted and secure</span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 text-center pt-4">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    export default AuthPage;
