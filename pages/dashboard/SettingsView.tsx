
import React, { useState, useMemo, useEffect } from 'react';
import type { UserSettings } from '../../types';
import { formatDate } from '../../utils/formatters';
import ChangePasswordModal from '../../components/dashboard/settings/ChangePasswordModal';
import { bankingSystem } from '../../services/BankingSystem';

type SettingsSection = 'profile' | 'security' | 'notifications';

const SectionButton: React.FC<{ label: string; icon: string; section: SettingsSection; activeSection: SettingsSection; onClick: () => void }> = ({ label, icon, section, activeSection, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full p-3 rounded-lg text-left transition-colors ${activeSection === section ? 'bg-yellow-400 text-gray-900 font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}>
        <i className={`fas ${icon} w-8 text-center`}></i>
        <span>{label}</span>
    </button>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button onClick={onChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-green-500' : 'bg-gray-600'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const NotificationToggleRow: React.FC<{ label: string; channels: { email: boolean; sms: boolean; push: boolean; }; onToggle: (channel: 'email' | 'sms' | 'push') => void }> = ({ label, channels, onToggle }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/10">
        <span className="text-gray-300">{label}</span>
        <div className="flex items-center gap-4">
            <ToggleSwitch checked={channels.email} onChange={() => onToggle('email')} />
            <ToggleSwitch checked={channels.sms} onChange={() => onToggle('sms')} />
            <ToggleSwitch checked={channels.push} onChange={() => onToggle('push')} />
        </div>
    </div>
);

const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

const SettingsView: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SettingsSection>('security');
    
    // Load initial state from Banking System
    const currentUser = bankingSystem.getCurrentUser();
    const initialSettings = currentUser ? currentUser.settings : null;

    const [settings, setSettings] = useState<UserSettings | null>(initialSettings);
    const [draftSettings, setDraftSettings] = useState<UserSettings | null>(initialSettings);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const hasChanges = useMemo(() => JSON.stringify(settings) !== JSON.stringify(draftSettings), [settings, draftSettings]);
    
    if (!settings || !draftSettings) return <div className="text-white p-8">Loading secure profile...</div>;

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraftSettings(s => s ? ({ ...s, profile: { ...s.profile, [e.target.name]: e.target.value } }) : null);
    };

    const handleSecurityToggle = (key: 'twoFactorAuth' | 'biometricLogin') => {
        setDraftSettings(s => s ? ({ ...s, security: { ...s.security, [key]: !s.security[key] } }) : null);
    };
    
    const handleNotificationToggle = (category: keyof UserSettings['notifications']['alerts'] | 'communication', channel: 'email' | 'sms' | 'push') => {
        setDraftSettings(s => {
            if (!s) return null;
            if (category === 'communication') {
                return {
                    ...s,
                    notifications: {
                        ...s.notifications,
                        communication: {
                            ...s.notifications.communication,
                            [channel]: !s.notifications.communication[channel]
                        }
                    }
                };
            } else {
                const currentAlertSetting = s.notifications.alerts[category];
                return {
                    ...s,
                    notifications: {
                        ...s.notifications,
                        alerts: {
                            ...s.notifications.alerts,
                            [category]: {
                                ...currentAlertSetting,
                                [channel]: !currentAlertSetting[channel]
                            }
                        }
                    }
                };
            }
        });
    };
    
    const alertLabels: { [key in keyof UserSettings['notifications']['alerts']]: string } = {
        largeTransactions: "Large Transactions",
        lowBalance: "Low Balance Warning",
        creditScoreChange: "Credit Score Changes",
        paymentDue: "Payment Due Reminders",
        recurringActivity: "Recurring Payments & Automations"
    };

    const handleSaveChanges = async () => {
        if (draftSettings) {
            await bankingSystem.updateProfile(draftSettings);
            setSettings(draftSettings);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
        }
    };

    const handleCancelChanges = () => {
        setDraftSettings(settings);
    };

    const handleSignOutDevice = (deviceId: string) => {
        if (window.confirm("This device will be removed from your managed list when you save changes. Are you sure?")) {
            setDraftSettings(s => s ? ({
                ...s,
                security: {
                    ...s.security,
                    managedDevices: s.security.managedDevices.filter(d => d.id !== deviceId),
                }
            }) : null);
        }
    };
    
    const renderSection = () => {
        switch (activeSection) {
            case 'security':
                return (
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6">Security Center</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-900/50 p-6 rounded-lg">
                                <h4 className="font-bold mb-4">Core Security</h4>
                                <div className="flex items-center justify-between py-3 border-b border-white/10">
                                    <div>
                                        <p className="font-semibold">Two-Factor Authentication</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Require a verification code when logging in</p>
                                    </div>
                                    <ToggleSwitch checked={draftSettings.security.twoFactorAuth} onChange={() => handleSecurityToggle('twoFactorAuth')} />
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-semibold">Biometric Login</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Use FaceID or TouchID for faster access</p>
                                    </div>
                                    <ToggleSwitch checked={draftSettings.security.biometricLogin} onChange={() => handleSecurityToggle('biometricLogin')} />
                                </div>
                            </div>
                             <div className="bg-gray-900/50 p-6 rounded-lg">
                                <h4 className="font-bold mb-4">Password</h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Last changed 3 months ago</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Strong password enabled</p>
                                    </div>
                                    <button onClick={() => setIsPasswordModalOpen(true)} className="px-4 py-2 text-sm font-semibold rounded-md bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40">Change Password</button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-bold text-lg mb-4">Managed Devices</h4>
                            <div className="space-y-3">
                                {draftSettings.security.managedDevices.map(device => (
                                    <div key={device.id} className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <i className={`fas ${device.icon} text-2xl text-gray-400 w-8 text-center`}></i>
                                            <div>
                                                <p className="font-semibold">{device.device}</p>
                                                <p className="text-sm text-gray-400">{device.location} &bull; Last login: {timeAgo(device.lastLogin)}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleSignOutDevice(device.id)} className="px-3 py-1 text-sm rounded-md font-semibold text-red-300 bg-red-500/20 hover:bg-red-500/40">Sign Out</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="mt-8">
                            <h4 className="font-bold text-lg mb-4">Security Recommendations</h4>
                             <div className="bg-green-900/50 border border-green-500/50 text-green-300 p-4 rounded-lg flex items-start gap-3">
                                 <i className="fas fa-check-circle mt-1"></i>
                                 <div>
                                     <h5 className="font-bold">Your account is secure</h5>
                                     <p className="text-sm">No critical actions are needed at this time.</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                );
            case 'notifications':
                 return (
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6">Notification Preferences</h3>
                        <div className="flex justify-end gap-4 text-sm font-semibold text-center mb-2 px-2">
                            <span className="w-11">Email</span><span className="w-11">SMS</span><span className="w-11">Push</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Communication</h3>
                        <NotificationToggleRow label="Marketing & Promotions" channels={draftSettings.notifications.communication} onToggle={(c) => handleNotificationToggle('communication', c)} />
                        <h3 className="font-bold text-lg mt-6 mb-2">Credit & Account Alerts</h3>
                        {(Object.keys(alertLabels) as Array<keyof typeof alertLabels>).map(key => (
                           <NotificationToggleRow 
                                key={key}
                                label={alertLabels[key]}
                                channels={draftSettings.notifications.alerts[key]}
                                onToggle={(c) => handleNotificationToggle(key, c)}
                           />
                        ))}
                    </div>
                );
            case 'profile':
            default:
                return (
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6">Profile & Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="text-sm text-gray-400">Full Name</label><input type="text" name="fullName" value={draftSettings.profile.fullName} onChange={handleProfileChange} className="w-full bg-gray-900/50 border-gray-600 rounded-md text-white mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Email Address</label><input type="email" name="email" value={draftSettings.profile.email} onChange={handleProfileChange} className="w-full bg-gray-900/50 border-gray-600 rounded-md text-white mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Phone Number</label><input type="tel" name="phone" value={draftSettings.profile.phone} onChange={handleProfileChange} className="w-full bg-gray-900/50 border-gray-600 rounded-md text-white mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Mailing Address</label><input type="text" name="address" value={draftSettings.profile.address} onChange={handleProfileChange} className="w-full bg-gray-900/50 border-gray-600 rounded-md text-white mt-1" /></div>
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div 
            className="min-h-full bg-gray-900 text-white p-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 bg-gray-800/50 p-4 rounded-2xl self-start">
                        <SectionButton label="Profile & Personal Info" icon="fa-user-circle" section="profile" activeSection={activeSection} onClick={() => setActiveSection('profile')} />
                        <SectionButton label="Security Center" icon="fa-shield-alt" section="security" activeSection={activeSection} onClick={() => setActiveSection('security')} />
                        <SectionButton label="Notifications" icon="fa-bell" section="notifications" activeSection={activeSection} onClick={() => setActiveSection('notifications')} />
                    </div>
                    {/* Right Content */}
                    <div className="lg:col-span-3 bg-gray-800/50 p-8 rounded-2xl">
                        {renderSection()}
                    </div>
                </div>

                {hasChanges && (
                    <div className="fixed bottom-8 right-8 z-50 flex gap-4 animate-fade-in-scale-up">
                        <button
                            onClick={handleCancelChanges}
                            className="px-6 py-3 rounded-lg bg-gray-500 text-white font-bold shadow-lg hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            className="px-6 py-3 rounded-lg bg-yellow-400 text-gray-900 font-bold shadow-lg hover:bg-yellow-300 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
                
                {showSuccess && (
                    <div className="fixed bottom-8 right-8 z-50 bg-green-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg animate-fade-in-scale-up">
                        <i className="fas fa-check-circle mr-2"></i>
                        Settings Saved!
                    </div>
                )}
                
                <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
            </div>
        </div>
    );
};

export default SettingsView;
