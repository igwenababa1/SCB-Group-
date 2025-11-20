import React, { useState } from 'react';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleCloseAndReset = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setIsSuccess(false);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        // Simulate API call
        console.log("Password change requested.");
        setIsSuccess(true);
        setTimeout(handleCloseAndReset, 2000);
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={handleCloseAndReset}>
            <div className="bg-gray-800 border border-white/10 rounded-lg shadow-xl p-8 w-full max-w-md text-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Change Password</h2>
                    <button onClick={handleCloseAndReset} className="text-gray-400 hover:text-white"><i className="fas fa-times text-xl"></i></button>
                </div>
                
                {isSuccess ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-green-400 text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-bold">Password Updated</h3>
                        <p className="text-gray-400 mt-2">Your password has been changed successfully.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-gray-900 border-gray-600 rounded-md text-white" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-gray-900 border-gray-600 rounded-md text-white" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-900 border-gray-600 rounded-md text-white" required />
                            </div>
                        </div>
                        <button type="submit" className="mt-8 w-full py-3 rounded-md bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400">
                            Update Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordModal;