
import { USER_SETTINGS, ACCOUNTS } from '../constants';
import type { UserSettings } from '../types';

// --- Secure Database Simulation ---

const DB_KEY = 'scb_global_vault_secure_v1';
const SESSION_KEY = 'scb_active_session_token';

// Simulated Encryption (XOR + Base64) - For demonstration of "protected" storage
const encrypt = (text: string): string => {
    const key = 'SCB_SECURE_KEY';
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
};

const decrypt = (cipher: string): string => {
    const key = 'SCB_SECURE_KEY';
    const text = atob(cipher);
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
};

export interface UserRecord {
    id: string;
    email: string;
    passwordHash: string; // Storing mocked hash
    profile: UserSettings['profile'];
    settings: UserSettings;
    createdAt: string;
}

class BankingSystem {
    private users: UserRecord[] = [];
    private currentUser: UserRecord | null = null;

    constructor() {
        this.loadDatabase();
    }

    private loadDatabase() {
        const storedData = localStorage.getItem(DB_KEY);
        if (storedData) {
            try {
                this.users = JSON.parse(decrypt(storedData));
            } catch (e) {
                console.error("Database integrity error. Resetting vault.", e);
                this.seedDatabase();
            }
        } else {
            this.seedDatabase();
        }
    }

    private saveDatabase() {
        const cipher = encrypt(JSON.stringify(this.users));
        localStorage.setItem(DB_KEY, cipher);
    }

    private seedDatabase() {
        // Initial "Seed" User - Collins William
        const defaultUser: UserRecord = {
            id: 'usr_collins_001',
            email: 'collinwilll360@gmail.com',
            passwordHash: 'ColW!@887', // In a real app, this would be bcrypt hash
            profile: USER_SETTINGS.profile,
            settings: USER_SETTINGS,
            createdAt: new Date().toISOString()
        };
        this.users = [defaultUser];
        this.saveDatabase();
    }

    // --- Public API ---

    public authenticate(email: string, password: string): Promise<UserRecord> {
        return new Promise((resolve, reject) => {
            // Simulate network delay for realism
            setTimeout(() => {
                const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
                
                if (!user) {
                    reject(new Error("Identity not found in secure ledger."));
                    return;
                }

                // In real app: compare bcrypt hash
                if (user.passwordHash !== password) {
                    reject(new Error("Access Key invalid. Security incident logged."));
                    return;
                }

                this.currentUser = user;
                localStorage.setItem(SESSION_KEY, user.id);
                resolve(user);
            }, 1200);
        });
    }

    public register(data: { firstName: string; lastName: string; email: string; phone: string; country: string; password?: string }): Promise<UserRecord> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.users.find(u => u.email === data.email)) {
                    reject(new Error("User already exists in system."));
                    return;
                }

                const newUser: UserRecord = {
                    id: `usr_${Date.now()}`,
                    email: data.email,
                    passwordHash: data.password || 'Password123!', // Default if not provided in UI flow
                    profile: {
                        fullName: `${data.firstName} ${data.lastName}`,
                        email: data.email,
                        phone: data.phone,
                        address: `${data.country} (Pending KYC Verification)`
                    },
                    settings: {
                        ...USER_SETTINGS, // Copy default structure
                        profile: {
                            fullName: `${data.firstName} ${data.lastName}`,
                            email: data.email,
                            phone: data.phone,
                            address: `${data.country}`
                        }
                    },
                    createdAt: new Date().toISOString()
                };

                this.users.push(newUser);
                this.saveDatabase();
                this.currentUser = newUser;
                localStorage.setItem(SESSION_KEY, newUser.id);
                resolve(newUser);
            }, 2000);
        });
    }

    public updateProfile(updatedSettings: UserSettings): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.currentUser) {
                const storedId = localStorage.getItem(SESSION_KEY);
                if (storedId) {
                    this.currentUser = this.users.find(u => u.id === storedId) || null;
                }
            }

            if (!this.currentUser) {
                reject(new Error("No active session."));
                return;
            }

            const index = this.users.findIndex(u => u.id === this.currentUser!.id);
            if (index !== -1) {
                this.users[index].settings = updatedSettings;
                this.users[index].profile = updatedSettings.profile;
                this.currentUser = this.users[index];
                this.saveDatabase();
                resolve();
            } else {
                reject(new Error("User record corruption."));
            }
        });
    }

    public getCurrentUser(): UserRecord | null {
        if (!this.currentUser) {
            const storedId = localStorage.getItem(SESSION_KEY);
            if (storedId) {
                this.currentUser = this.users.find(u => u.id === storedId) || null;
            }
        }
        // Fallback to seed user if mostly for demo purposes and no session
        if (!this.currentUser && this.users.length > 0) {
             return this.users[0];
        }
        return this.currentUser;
    }

    public logout() {
        this.currentUser = null;
        localStorage.removeItem(SESSION_KEY);
    }
}

export const bankingSystem = new BankingSystem();
