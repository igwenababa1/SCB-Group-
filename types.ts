
// FIX: Removed self-import of 'ViewType' that was causing a conflict.
export type ViewType =
  | 'dashboard'
  | 'transactions'
  | 'cards'
  | 'payments'
  | 'budgeting'
  | 'investments'
  | 'loans'
  | 'settings'
  | 'crypto'
  | 'charity'
  | 'network'
  | 'apps'
  | 'alerts'
  | 'receipts'
  | 'support'
  | 'recurring-payments'
  | 'loan-application'
  | 'congratulations';

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface Testimonial {
    quote: string;
    author: {
        avatarUrl: string;
        name: string;
        title: string;
    };
}

export interface Account {
    id: string;
    type: 'Checking' | 'Savings' | 'Investment' | 'Credit';
    number: string;
    balance: number; // Balance is always in USD
    change?: number; // Change is always in USD
}

export interface Transaction {
    id:string;
    type: 'income' | 'expense';
    description: string;
    date: string;
    amount: number; // Amount is always in USD
    accountId: string;
    category: string;
    status: 'Completed' | 'Pending' | 'Failed';
    runningBalance: number; // Balance is always in USD
    merchantLogoUrl?: string;
}

export interface Contact {
    id: string;
    name: string;
    avatarUrl: string;
}

export interface Card {
    id: string;
    type: 'Visa' | 'Mastercard';
    number: string;
    nameOnCard: string;
    expiry: string;
    isFrozen: boolean;
    imageUrl: string;
    recentTransactions: {
        description: string;
        date: string;
        amount: number;
    }[];
}

export interface BudgetCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    allocated: number;
    spent: number;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
}

export interface Holding {
    id: string;
    symbol: string;
    name: string;
    logoUrl: string;
    shares: number;
    price: number;
    change: number;
    changePercent: number;
    historicalData: number[];
    marketCap?: number;
    peRatio?: number;
    dividendYield?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    about?: string;
}

export interface AssetAllocationItem {
    name: string;
    value: number;
}

export interface MarketMover {
    id: string;
    logoUrl: string;
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
}

export interface WatchlistItem {
    id: string;
    logoUrl: string;
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
}

export interface Loan {
    id: string;
    type: string;
    totalAmount: number;
    paidAmount: number;
    interestRate: number;
    nextPayment: number;
    nextPaymentDate: string;
    imageUrl: string;
}

export interface LoanApplicationData {
    loanType: 'Personal' | 'Auto' | 'Mortgage' | '';
    amount: string;
    purpose: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dob: string;
    employmentStatus: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Student' | '';
    annualIncome: string;
}

export interface UserSettings {
    profile: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
    };
    security: {
        twoFactorAuth: boolean;
        biometricLogin: boolean;
        loginHistory: {
            device: string;
            location: string;
            date: string;
        }[];
        managedDevices: {
            id: string;
            device: string;
            location: string;
            lastLogin: string;
            icon: string;
        }[];
    };
    notifications: {
        communication: { email: boolean; sms: boolean; push: boolean; };
        alerts: {
            largeTransactions: { email: boolean; sms: boolean; push: boolean; };
            lowBalance: { email: boolean; sms: boolean; push: boolean; };
            creditScoreChange: { email: boolean; sms: boolean; push: boolean; };
            paymentDue: { email: boolean; sms: boolean; push: boolean; };
            recurringActivity: { email: boolean; sms: boolean; push: boolean; };
        };
    };
}

export interface RecurringPayment {
    id: string;
    recipient: string;
    amount: number;
    frequency: 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Yearly';
    nextDate: string;
    category: 'Utilities' | 'Rent' | 'Subscription' | 'Loan' | 'Other';
}

export interface PaymentActivity {
    id: string;
    contactName: string;
    contactAvatarUrl: string;
    type: 'sent' | 'received';
    date: string;
    amount: number;
}

export interface CryptoHolding {
    id: string;
    name: string;
    symbol: string;
    iconUrl: string;
    balanceUSD: number;
    balanceCrypto: number;
    priceUSD: number;
    dayChangePercent: number;
    historicalData: number[];
}

export interface Charity {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    imageUrl: string;
}

export interface Donation {
    id: string;
    charityName: string;
    charityLogo: string;
    date: string;
    amount: number;
    isRecurring: boolean;
}

export interface GlobalPartnerBank {
    id: string;
    name: string;
    country: string;
    logoUrl: string;
}

export interface InternationalAccount {
    id: string;
    bankName: string;
    country: string;
    accountNumber: string;
    balance: number;
    currency: string;
}

export interface CurrencyRate {
    code: string;
    rate: number;
}

export interface InternationalTransfer {
    id: string;
    recipient: string;
    country: string;
    date: string;
    amountUSD: number;
    amountLocal: number;
    currency: string;
}

export interface ConnectedApp {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    isConnected: boolean;
}

export interface ConnectedAppActivity {
    id: string;
    appName: string;
    appLogoUrl: string;
    description: string;
    date: string;
    amount: number;
    type: 'sent' | 'received';
}

export interface Alert {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'critical';
    isRead: boolean;
    action?: {
        label: string;
        view: ViewType;
    };
}

export interface Receipt {
    id: string;
    vendor: string;
    vendorLogo: string;
    date: string;
    total: number;
    category: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface SupportCategory {
    icon: string;
    title: string;
}

export interface SystemStatus {
    service: string;
    status: 'Operational' | 'High Volume' | 'Outage';
}

export interface CultureValue {
    src: string;
    alt: string;
    title: string;
    description: string;
}

// --- I18n & Currency ---
export interface Language {
    code: 'en' | 'sv' | 'de';
    name: string;
    flag: string;
}

export interface Currency {
    code: 'USD' | 'SEK' | 'EUR' | 'GBP';
    name: string;
    symbol: string;
    // FIX: Added 'flag' property to support currency flags in the UI.
    flag: string;
}

export type TranslationKey = 
    | 'login' | 'home' | 'testimonials' | 'contact'
    | 'heroTitle' | 'heroSubtitle' | 'exploreFeatures' | 'contactUs'
    | 'welcomeBack' | 'dashboardSubtitle'
    | 'transactionsTitle' | 'transactionsSubtitle'
    | 'cardsTitle' | 'cardsSubtitle'
    | 'paymentsTitle' | 'paymentsSubtitle'
    | 'budgetingTitle' | 'budgetingSubtitle'
    | 'investmentsTitle' | 'investmentsSubtitle'
    | 'cryptoTitle' | 'cryptoSubtitle'
    | 'loansTitle' | 'loansSubtitle'
    | 'loanApplicationTitle' | 'loanApplicationSubtitle'
    | 'charityTitle' | 'charitySubtitle'
    | 'networkTitle' | 'networkSubtitle'
    | 'appsTitle' | 'appsSubtitle'
    | 'alertsTitle' | 'alertsSubtitle'
    | 'receiptsTitle' | 'receiptsSubtitle'
    | 'supportTitle' | 'supportSubtitle'
    | 'settingsTitle' | 'settingsSubtitle'
    | 'recurringPaymentsTitle' | 'recurringPaymentsSubtitle'
    | 'netWorthTitle' | 'netWorthSubtitle';

export type Translations = {
    [key in Language['code']]: {
        [key in TranslationKey]: string;
    }
};