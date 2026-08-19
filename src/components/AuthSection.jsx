import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Download, Cloud, CloudOff } from 'lucide-react';

const AuthSection = ({ user, syncStatus, onSignOut, onOpenExport }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/profile')}
                    title="View profile"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{user.displayName || user.email}</p>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500">{user.email}</p>
                            {syncStatus === 'synced' && (
                                <div className="flex items-center gap-1 text-green-600 text-xs">
                                    <Cloud size={12} />
                                    <span>Synced</span>
                                </div>
                            )}
                            {syncStatus === 'syncing' && (
                                <div className="flex items-center gap-1 text-blue-600 text-xs">
                                    <Cloud size={12} className="animate-pulse" />
                                    <span>Syncing...</span>
                                </div>
                            )}
                            {syncStatus === 'local' && (
                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                    <CloudOff size={12} />
                                    <span>Local</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Export/Import Button */}
                    <button
                        onClick={onOpenExport}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all text-xs sm:text-sm"
                        title="Export & Import"
                    >
                        <Download size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Export/Import</span>
                    </button>

                    <button
                        onClick={onSignOut}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all text-xs sm:text-sm"
                    >
                        <LogOut size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthSection;
