










import type {
    Feature,
    Testimonial,
    Account,
    Transaction,
    Contact,
    Card,
    BudgetCategory,
    SavingsGoal,
    Holding,
    AssetAllocationItem,
    MarketMover,
    WatchlistItem,
    Loan,
    UserSettings,
    RecurringPayment,
    PaymentActivity,
    CryptoHolding,
    Charity,
    Donation,
    GlobalPartnerBank,
    InternationalAccount,
    CurrencyRate,
    InternationalTransfer,
    ConnectedApp,
    ConnectedAppActivity,
    Alert,
    Receipt,
    FaqItem,
    SupportCategory,
    CultureValue,
    SystemStatus
} from './types';

export const FEATURES: Feature[] = [
    {
        icon: 'fa-globe',
        title: 'Global Mobile Access',
        description: 'Manage your finances from anywhere in the world with our secure, intuitive mobile app. 24/7 access to your complete financial portfolio.'
    },
    {
        icon: 'fa-brain',
        title: 'Intelligent Financial Insights',
        description: 'Leverage AI-powered analytics to understand your spending, identify savings opportunities, and receive personalized financial advice.'
    },
    {
        icon: 'fa-shield-alt',
        title: 'Biometric Security & Fraud Shield',
        description: 'Protect your assets with cutting-edge security, including biometric login, real-time transaction monitoring, and advanced fraud detection.'
    },
    {
        icon: 'fa-hand-holding-usd',
        title: 'Tailored Lending Solutions',
        description: 'Access personalized loan and mortgage options with competitive rates, tailored to your unique financial situation and goals.'
    },
    {
        icon: 'fa-headset',
        title: 'Dedicated 24/7 Concierge',
        description: 'Enjoy priority access to a dedicated team of financial experts, ready to assist you with any request, anytime.'
    },
    {
        icon: 'fa-chart-line',
        title: 'Global Investment Marketplace',
        description: 'Explore and invest in a curated selection of global stocks, bonds, and alternative assets with expert guidance and powerful tools.'
    }
];

export const PRODUCT_FEATURES = {
    personal: {
        title: "Personal Banking, Perfected",
        description: "Effortless daily banking designed for your lifestyle. From seamless payments to intelligent savings tools, manage your finances with confidence and clarity.",
        features: [
            { icon: "fa-mobile-alt", title: "Mobile-First Banking", description: "Access all your accounts, transfer funds, and pay bills on the go with our top-rated mobile app." },
            { icon: "fa-piggy-bank", title: "Automated Savings Goals", description: "Set your financial goals and let our smart tools help you save automatically." },
            { icon: "fa-credit-card", title: "Personalized Card Controls", description: "Instantly freeze your card, set spending limits, and manage your security from anywhere." }
        ],
        backgroundImage: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2070&auto=format&fit=crop"
    },
    business: {
        title: "Powering Your Business Growth",
        description: "Robust financial tools and dedicated support for your business. Manage cash flow, process payments, and access lending solutions built for scale.",
        features: [
            { icon: "fa-file-invoice-dollar", title: "Integrated Invoicing", description: "Create, send, and track professional invoices directly from your business account." },
            { icon: "fa-users", title: "Multi-User Access", description: "Securely delegate financial tasks to your team with customizable roles and permissions." },
            { icon: "fa-briefcase", title: "Tailored Business Loans", description: "Access flexible financing and credit lines to seize new opportunities and manage expenses." }
        ],
        backgroundImage: "https://images.unsplash.com/photo-1522881193457-31ae824a8e25?q=80&w=2070&auto=format&fit=crop"
    },
    wealth: {
        title: "Strategic Wealth Management",
        description: "Preserve and grow your wealth with expert guidance and a sophisticated investment platform. We provide the insights and opportunities to build your legacy.",
        features: [
            { icon: "fa-chart-line", title: "Global Investment Access", description: "Diversify your portfolio across global markets, including stocks, bonds, and alternative assets." },
            { icon: "fa-user-tie", title: "Dedicated Advisors", description: "Partner with a dedicated wealth advisor to craft a personalized financial strategy." },
            { icon: "fa-shield-alt", title: "Estate & Trust Planning", description: "Secure your financial future for generations to come with our expert estate planning services." }
        ],
        backgroundImage: "https://images.unsplash.com/photo-1642792691535-96195b3a8d7a?q=80&w=2070&auto=format&fit=crop"
    }
};


export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "Swedish Construction Bank transformed how we manage our project finances. Their digital platform is intuitive, secure, and has saved us countless hours. Their support is second to none.",
        author: {
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
            name: 'Helena Bergqvist',
            title: 'CFO, Nordic Builders AB'
        }
    },
    {
        quote: "As a private investor, the insights and global access SCB provides are invaluable. Their wealth management team is proactive and has helped grow my portfolio significantly. A truly premium experience.",
        author: {
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
            name: 'Lars Magnusson',
            title: 'Private Investor'
        }
    },
    {
        quote: "The security features, especially the real-time fraud alerts, give me complete peace of mind. I trust SCB with my personal and business accounts without hesitation. They are always one step ahead.",
        author: {
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
            name: 'Sofia Nyström',
            title: 'Tech Entrepreneur'
        }
    }
];

export const ACCOUNTS: Account[] = [
    { id: 'acc-1', type: 'Checking', number: '•••• 1234', balance: 127822.04, change: 1200.50 },
    { id: 'acc-2', type: 'Savings', number: '•••• 5678', balance: 300000.00, change: 550.00 },
    { id: 'acc-3', type: 'Investment', number: '•••• 9012', balance: 500000.00, change: 3250.80 },
    { id: 'acc-4', type: 'Credit', number: '•••• 3456', balance: -1250.00, change: -250.00 }
];

export const TRANSACTION_CATEGORIES_WITH_ICONS: { [key: string]: string } = {
    'Groceries': 'fa-shopping-cart',
    'Salary': 'fa-briefcase',
    'Shopping': 'fa-tshirt',
    'Subscription': 'fa-sync-alt',
    'Dividends': 'fa-chart-pie',
    'Transport': 'fa-car',
    'Dining': 'fa-utensils',
    'Utilities': 'fa-lightbulb',
    'Rent': 'fa-home',
    'Travel': 'fa-plane',
    'Electronics': 'fa-laptop',
    'Other': 'fa-receipt',
};

export const TRANSACTIONS: Transaction[] = [
    { id: 'tx-9', type: 'expense', description: 'Pending - Uber Trip', date: '2024-07-26T11:00:00Z', amount: 25.50, accountId: 'acc-4', category: 'Transport', status: 'Pending', runningBalance: -1275.50, merchantLogoUrl: 'https://logo.clearbit.com/uber.com' },
    { id: 'tx-1', type: 'expense', description: 'Apple Store', date: '2024-07-25T14:00:00Z', amount: 1250.00, accountId: 'acc-4', category: 'Electronics', status: 'Completed', runningBalance: -1250.00, merchantLogoUrl: 'https://logo.clearbit.com/apple.com' },
    { id: 'tx-2', type: 'expense', description: 'Costco Wholesale', date: '2024-07-22T10:30:00Z', amount: 250.75, accountId: 'acc-4', category: 'Groceries', status: 'Completed', runningBalance: 0.00, merchantLogoUrl: 'https://logo.clearbit.com/costco.com' },
    { id: 'tx-3', type: 'income', description: 'Direct Deposit - Car Dealership', date: '2024-07-21T09:00:00Z', amount: 15500.00, accountId: 'acc-1', category: 'Salary', status: 'Completed', runningBalance: 127822.04 },
    { id: 'tx-4', type: 'expense', description: 'Shell Gas Station', date: '2024-07-20T17:45:00Z', amount: 55.20, accountId: 'acc-1', category: 'Transport', status: 'Completed', runningBalance: 112322.04, merchantLogoUrl: 'https://logo.clearbit.com/shell.com' },
    { id: 'tx-5', type: 'expense', description: 'Amazon.com', date: '2024-07-20T14:00:00Z', amount: 75.99, accountId: 'acc-4', category: 'Shopping', status: 'Completed', runningBalance: -250.75, merchantLogoUrl: 'https://logo.clearbit.com/amazon.com' },
    { id: 'tx-6', type: 'expense', description: 'Netflix Subscription', date: '2024-07-19T18:00:00Z', amount: 15.99, accountId: 'acc-4', category: 'Subscription', status: 'Completed', runningBalance: -174.76, merchantLogoUrl: 'https://logo.clearbit.com/netflix.com' },
    { id: 'tx-7', type: 'income', description: 'Stock Dividend - AAPL', date: '2024-07-18T12:00:00Z', amount: 120.50, accountId: 'acc-3', category: 'Dividends', status: 'Completed', runningBalance: 500000.00 },
    { id: 'tx-8', type: 'expense', description: 'The Cheesecake Factory', date: '2024-07-17T19:30:00Z', amount: 112.40, accountId: 'acc-1', category: 'Dining', status: 'Completed', runningBalance: 112377.24, merchantLogoUrl: 'https://logo.clearbit.com/thecheesecakefactory.com' },
    { id: 'tx-10', type: 'expense', description: 'Con Edison', date: '2024-07-15T09:00:00Z', amount: 85.60, accountId: 'acc-1', category: 'Utilities', status: 'Completed', runningBalance: 112489.64 },
    { id: 'tx-11', type: 'income', description: 'Venmo Payment from Jane', date: '2024-07-14T15:20:00Z', amount: 50.00, accountId: 'acc-1', category: 'Other', status: 'Completed', runningBalance: 112575.24, merchantLogoUrl: 'https://logo.clearbit.com/venmo.com' },
];


export const CONTACTS: Contact[] = [
    { id: 'con-1', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'con-2', name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { id: 'con-3', name: 'Emily Jones', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    { id: 'con-4', name: 'Michael Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
    { id: 'con-5', name: 'Sarah Miller', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704h' },
    { id: 'con-6', name: 'David Wilson', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704i' },
];

export const CARDS: Card[] = [
    {
        id: 'card-1', type: 'Visa', number: '4214 •••• •••• 1234', nameOnCard: 'COLLINS WILLIAM', expiry: '12/26', isFrozen: false,
        imageUrl: 'https://images.unsplash.com/photo-1536514072410-50c818303852?q=80&w=2564&auto=format&fit=crop',
        recentTransactions: [
            { description: 'Starbucks', date: 'July 22', amount: -7.50 },
            { description: 'Amazon.com', date: 'July 21', amount: -120.45 },
            { description: 'Spotify', date: 'July 20', amount: -10.99 },
        ]
    },
    {
        id: 'card-2', type: 'Mastercard', number: '5521 •••• •••• 5678', nameOnCard: 'COLLINS WILLIAM', expiry: '08/25', isFrozen: true,
        imageUrl: 'https://images.unsplash.com/photo-1634117622592-114e3024ff27?q=80&w=2532&auto=format&fit=crop',
        recentTransactions: [
             { description: 'Apple Store', date: 'July 19', amount: -999.00 },
             { description: 'Uber Eats', date: 'July 18', amount: -35.20 },
        ]
    }
];

export const BUDGET_CATEGORIES: BudgetCategory[] = [
    { id: 'b-1', name: 'Housing', icon: 'fa-home', color: 'bg-blue-500', allocated: 4500, spent: 4450 },
    { id: 'b-2', name: 'Groceries', icon: 'fa-shopping-cart', color: 'bg-green-500', allocated: 1200, spent: 950.75 },
    { id: 'b-3', name: 'Transportation', icon: 'fa-car', color: 'bg-yellow-500', allocated: 800, spent: 650.20 },
    { id: 'b-4', name: 'Entertainment', icon: 'fa-film', color: 'bg-purple-500', allocated: 500, spent: 380.00 },
];

export const SAVINGS_GOALS: SavingsGoal[] = [
    { id: 'sg-1', name: 'Luxury Vacation', targetAmount: 15000, currentAmount: 8500 },
    { id: 'sg-2', name: 'New Supercar', targetAmount: 250000, currentAmount: 110000 },
];

export const HOLDINGS: Holding[] = [
    { 
        id: 'h-1', symbol: 'AAPL', name: 'Apple Inc.', logoUrl: 'https://logo.clearbit.com/apple.com', shares: 150, price: 195.50, change: 2.75, changePercent: 1.42, historicalData: [180, 182, 185, 183, 190, 192, 195.50],
        marketCap: 3000000000000, peRatio: 32.5, dividendYield: 0.5, fiftyTwoWeekHigh: 200.10, fiftyTwoWeekLow: 165.21,
        about: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide."
    },
    { 
        id: 'h-2', symbol: 'MSFT', name: 'Microsoft Corp.', logoUrl: 'https://logo.clearbit.com/microsoft.com', shares: 100, price: 340.20, change: -1.50, changePercent: -0.44, historicalData: [350, 348, 345, 346, 342, 341, 340.20],
        marketCap: 2500000000000, peRatio: 35.1, dividendYield: 0.8, fiftyTwoWeekHigh: 351.47, fiftyTwoWeekLow: 275.38,
        about: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide."
    },
    { 
        id: 'h-3', symbol: 'TSLA', name: 'Tesla, Inc.', logoUrl: 'https://logo.clearbit.com/tesla.com', shares: 50, price: 280.90, change: 5.60, changePercent: 2.03, historicalData: [260, 265, 270, 268, 275, 278, 280.90],
        marketCap: 890000000000, peRatio: 95.8, dividendYield: 0, fiftyTwoWeekHigh: 299.29, fiftyTwoWeekLow: 152.37,
        about: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems."
    },
];

export const ASSET_ALLOCATION: AssetAllocationItem[] = [
    { name: 'Stocks', value: 65 },
    { name: 'Bonds', value: 20 },
    { name: 'Real Estate', value: 10 },
    { name: 'Cash', value: 5 },
];

export const MARKET_MOVERS: MarketMover[] = [
    { id: 'mm-1', logoUrl: 'https://logo.clearbit.com/nvidia.com', symbol: 'NVDA', name: 'NVIDIA Corp', price: 450.75, changePercent: 5.21 },
    { id: 'mm-2', logoUrl: 'https://logo.clearbit.com/amazon.com', symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 135.20, changePercent: 2.11 },
    { id: 'mm-3', logoUrl: 'https://logo.clearbit.com/meta.com', symbol: 'META', name: 'Meta Platforms, Inc.', price: 310.45, changePercent: -1.89 },
];

export const WATCHLIST: WatchlistItem[] = [
    { id: 'wl-1', logoUrl: 'https://logo.clearbit.com/google.com', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 130.80, changePercent: 0.78 },
    { id: 'wl-2', logoUrl: 'https://logo.clearbit.com/netflix.com', symbol: 'NFLX', name: 'Netflix, Inc.', price: 440.50, changePercent: -2.31 },
];

export const LOANS: Loan[] = [
    { id: 'l-1', type: 'Mortgage', totalAmount: 950000, paidAmount: 320000, interestRate: 3.75, nextPayment: 4100.50, nextPaymentDate: '2024-08-01T00:00:00Z', imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop' },
    { id: 'l-2', type: 'Auto Loan', totalAmount: 85000, paidAmount: 35000, interestRate: 5.20, nextPayment: 1250.00, nextPaymentDate: '2024-08-15T00:00:00Z', imageUrl: 'https://images.unsplash.com/photo-1553440569-2244356baa3c?q=80&w=2070&auto=format&fit=crop' },
];

export const USER_SETTINGS: UserSettings = {
    profile: {
        fullName: 'Collins William', email: 'collinwilll360@gmail.com', phone: '+44 20 7946 0123', address: '12 Park Lane, Mayfair, London W1K 7AA, UK'
    },
    security: {
        twoFactorAuth: true, biometricLogin: true,
        loginHistory: [
            { device: 'iPhone 15 Pro', location: 'London, UK', date: '2024-07-22T10:00:00Z' },
            { device: 'Macbook Pro', location: 'London, UK', date: '2024-07-21T14:30:00Z' },
        ],
        managedDevices: [
            { id: 'dev-1', device: 'iPhone 15 Pro', location: 'London, UK', lastLogin: '2024-07-26T10:00:00Z', icon: 'fa-mobile-alt' },
            { id: 'dev-2', device: 'Chrome on Windows', location: 'London, UK', lastLogin: '2024-07-25T14:30:00Z', icon: 'fa-desktop' },
            { id: 'dev-3', device: 'Safari on Macbook Pro', location: 'Canary Wharf, UK', lastLogin: '2024-07-23T11:00:00Z', icon: 'fa-laptop' },
        ]
    },
    notifications: {
        communication: { email: true, sms: false, push: true },
        alerts: {
            largeTransactions: { email: true, sms: true, push: true },
            lowBalance: { email: false, sms: false, push: true },
            creditScoreChange: { email: true, sms: false, push: true },
            paymentDue: { email: true, sms: true, push: true },
            recurringActivity: { email: true, sms: false, push: true },
        }
    }
};

export const RECURRING_PAYMENTS: RecurringPayment[] = [
    { id: 'rec-1', recipient: 'Luxury Leasing', amount: 1250.00, frequency: 'Monthly', nextDate: '2024-08-10', category: 'Loan' },
    { id: 'rec-2', recipient: 'Con Edison', amount: 120.50, frequency: 'Monthly', nextDate: '2024-08-15', category: 'Utilities' },
    { id: 'rec-3', recipient: 'Mortgage Payment', amount: 4100.50, frequency: 'Monthly', nextDate: '2024-08-01', category: 'Loan' },
];

export const PAYMENT_ACTIVITIES: PaymentActivity[] = [
    { id: 'pa-1', contactName: 'Jane Doe', contactAvatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', type: 'sent', date: '2024-07-22T11:00:00Z', amount: 50.00 },
    { id: 'pa-2', contactName: 'John Smith', contactAvatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', type: 'received', date: '2024-07-21T15:00:00Z', amount: 100.00 },
];

export const CRYPTO_HOLDINGS: CryptoHolding[] = [
    { id: 'c-1', name: 'Bitcoin', symbol: 'BTC', iconUrl: 'https://img.icons8.com/color/48/bitcoin--v1.png', balanceUSD: 50200.50, balanceCrypto: 0.75, priceUSD: 66934.00, dayChangePercent: 2.5, historicalData: [65000, 65500, 66000, 65800, 66500, 66800, 66934] },
    { id: 'c-2', name: 'Ethereum', symbol: 'ETH', iconUrl: 'https://img.icons8.com/color/48/ethereum.png', balanceUSD: 15100.00, balanceCrypto: 4.2, priceUSD: 3595.24, dayChangePercent: -1.2, historicalData: [3650, 3630, 3600, 3610, 3580, 3590, 3595.24] },
    { id: 'c-3', name: 'Solana', symbol: 'SOL', iconUrl: 'https://img.icons8.com/fluency/48/solana.png', balanceUSD: 5200.75, balanceCrypto: 30.0, priceUSD: 173.36, dayChangePercent: 4.8, historicalData: [160, 162, 165, 168, 170, 172, 173.36] },
];

export const CHARITIES: Charity[] = [
    { 
        id: 'char-1', 
        name: 'Red Cross International', 
        description: 'Delivering vital emergency assistance and disaster relief to vulnerable communities worldwide.', 
        logoUrl: 'https://logo.clearbit.com/redcross.org', 
        imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2032&auto=format&fit=crop' 
    },
    { 
        id: 'char-2', 
        name: 'World Wildlife Fund', 
        description: 'Protecting the future of nature. Conserving biodiversity and reducing humanity\'s footprint.', 
        logoUrl: 'https://logo.clearbit.com/worldwildlife.org', 
        imageUrl: 'https://images.unsplash.com/photo-1504826260979-242151ee45b7?q=80&w=2232&auto=format&fit=crop' 
    },
    { 
        id: 'char-3', 
        name: "Habitat for Humanity", 
        description: 'Building strength, stability, and self-reliance through affordable shelter and community development.', 
        logoUrl: 'https://logo.clearbit.com/habitat.org', 
        imageUrl: 'https://images.unsplash.com/photo-1444419988131-046ed4e5ffd6?q=80&w=2070&auto=format&fit=crop' 
    },
];

export const DONATION_HISTORY: Donation[] = [
    { id: 'd-1', charityName: 'Red Cross', charityLogo: 'https://logo.clearbit.com/redcross.org', date: '2024-07-01', amount: 100, isRecurring: false },
    { id: 'd-2', charityName: 'WWF', charityLogo: 'https://logo.clearbit.com/worldwildlife.org', date: '2024-07-15', amount: 50, isRecurring: true },
];

export const GLOBAL_PARTNER_BANKS: GlobalPartnerBank[] = [
    { id: 'gb-1', name: 'Barclays', country: 'United Kingdom', logoUrl: 'https://logo.clearbit.com/barclays.co.uk' },
    { id: 'gb-2', name: 'Deutsche Bank', country: 'Germany', logoUrl: 'https://logo.clearbit.com/db.com' },
    { id: 'gb-3', name: 'BNP Paribas', country: 'France', logoUrl: 'https://logo.clearbit.com/bnpparibas.com' },
    { id: 'gb-4', name: 'Bank of America', country: 'United States', logoUrl: 'https://logo.clearbit.com/bankofamerica.com' },
];

export const INTERNATIONAL_ACCOUNTS: InternationalAccount[] = [
    { id: 'ia-1', bankName: 'Barclays', country: 'UK', accountNumber: 'GB29 NWBK 6016 1331 9268 19', balance: 15250.80, currency: 'GBP' },
    // FIX: Changed 'name' property to 'bankName' to match the InternationalAccount type.
    { id: 'ia-2', bankName: 'Deutsche Bank', country: 'DE', accountNumber: 'DE89 3704 0044 0532 0130 00', balance: 22500.50, currency: 'EUR' },
];

export const CURRENCY_RATES: CurrencyRate[] = [
    { code: 'EUR', rate: 0.93 },
    { code: 'GBP', rate: 0.79 },
    { code: 'JPY', rate: 157.73 },
];

export const INTERNATIONAL_TRANSFERS: InternationalTransfer[] = [
    { id: 'it-1', recipient: 'John Smith', country: 'United Kingdom', date: '2024-07-10', amountUSD: 1000, amountLocal: 790, currency: 'GBP' },
    { id: 'it-2', recipient: 'Klaus Müller', country: 'Germany', date: '2024-06-25', amountUSD: 2500, amountLocal: 2325, currency: 'EUR' },
];

export const CONNECTED_APPS: ConnectedApp[] = [
    { id: 'app-1', name: 'PayPal', description: 'Global online payments system.', logoUrl: 'https://logo.clearbit.com/paypal.com', isConnected: true },
    { id: 'app-2', name: 'Cash App', description: 'Mobile payment service.', logoUrl: 'https://logo.clearbit.com/cash.app', isConnected: true },
    { id: 'app-3', name: 'Venmo', description: 'Social payments app.', logoUrl: 'https://logo.clearbit.com/venmo.com', isConnected: false },
    { id: 'app-4', name: 'Zelle', description: 'U.S.-based digital payments network.', logoUrl: 'https://logo.clearbit.com/zellepay.com', isConnected: false },
    { id: 'app-5', name: 'Plaid', description: 'Connect your financial accounts.', logoUrl: 'https://logo.clearbit.com/plaid.com', isConnected: false },
];

export const CONNECTED_APP_ACTIVITIES: ConnectedAppActivity[] = [
    { id: 'caa-1', appName: 'PayPal', appLogoUrl: 'https://logo.clearbit.com/paypal.com', description: 'Payment to Jane Doe', date: '2024-07-20', amount: 75, type: 'sent' },
    { id: 'caa-2', appName: 'Cash App', appLogoUrl: 'https://logo.clearbit.com/cash.app', description: 'Payment from John Smith', date: '2024-07-18', amount: 120, type: 'received' },
];

export const ALERTS: Alert[] = [
    { id: 'al-1', title: 'Large Transaction Alert', description: 'A purchase of $1,250.00 was made at Apple Store.', timestamp: '2024-07-22T14:30:00Z', severity: 'warning', isRead: false, action: { label: 'View Transaction', view: 'transactions' } },
    { id: 'al-2', title: 'Credit Score Update', description: 'Your credit score has increased by 10 points to 780!', timestamp: '2024-07-21T09:00:00Z', severity: 'info', isRead: false, action: { label: 'View Dashboard', view: 'dashboard' } },
    { id: 'al-3', title: 'Security Alert: New Device Login', description: 'A new device (Chrome on Windows) logged into your account.', timestamp: '2024-07-20T11:00:00Z', severity: 'critical', isRead: true, action: { label: 'Review Security Settings', view: 'settings' } },
    { id: 'al-4', title: 'Payment Due Reminder', description: 'Your credit card payment of $250.00 is due in 3 days.', timestamp: '2024-07-19T08:00:00Z', severity: 'warning', isRead: true, action: { label: 'Make a Payment', view: 'payments' } },
];

export const RECEIPTS: Receipt[] = [
    { id: 'rcpt-1', vendor: 'Apple Store', vendorLogo: 'https://logo.clearbit.com/apple.com', date: '2024-07-22T14:30:00Z', total: 1250.00, category: 'Electronics', items: [{ name: 'MacBook Pro 14"', quantity: 1, price: 1250.00 }] },
    { id: 'rcpt-2', vendor: 'Costco Wholesale', vendorLogo: 'https://logo.clearbit.com/costco.com', date: '2024-07-20T10:30:00Z', total: 250.75, category: 'Groceries', items: [{ name: 'Groceries', quantity: 1, price: 250.75 }] },
];

export const MONTHLY_SUMMARY = {
    income: 15500,
    expenses: 4820.50,
    savings: 10679.50
};

export const EXPENSE_CHART_DATA = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    income: [15500, 15500, 15600, 15500, 15700, 15500],
    expenses: [4200, 4500, 4350, 5100, 4700, 4820],
};

export const PORTFOLIO_SUMMARY = {
    totalValue: 500000.00,
    dayChange: 3250.80,
    dayChangePercent: 1.05,
    buyingPower: 15230.40,
};

export const NET_WORTH_SUMMARY = {
    assets: [
        { name: 'Cash & Bank Accounts', value: 427822.04 },
        { name: 'Investments', value: 500000.00 },
        { name: 'Real Estate', value: 1200000 },
    ],
    liabilities: [
        { name: 'Mortgage', value: 630000 },
        { name: 'Credit Card Debt', value: 1250 },
        { name: 'Auto Loan', value: 50000 },
    ],
    last30DaysChange: 5230.75
};

export const SPENDING_CATEGORIES = [
    { name: 'Housing', amount: 4450, color: 'bg-blue-500' },
    { name: 'Groceries', amount: 950.75, color: 'bg-green-500' },
    { name: 'Transportation', amount: 650.20, color: 'bg-yellow-500' },
    { name: 'Entertainment', amount: 380, color: 'bg-red-500' },
    { name: 'Other', amount: 990, color: 'bg-gray-400' },
];

export const ACTIVITY_FEED_ITEMS = [
    { id: 'af-1', icon: 'fa-apple', iconBg: 'bg-gray-200 text-black', title: 'Apple Store Purchase', description: '$1,250.00 on your Visa Card', timestamp: '2 hours ago' },
    { id: 'af-2', icon: 'fa-arrow-down', iconBg: 'bg-green-100 text-green-600', title: 'Direct Deposit Received', description: 'From Car Dealership', timestamp: 'Yesterday' },
    { id: 'af-3', icon: 'fa-user-friends', iconBg: 'bg-blue-100 text-blue-600', title: 'Payment to Jane Doe', description: 'Sent via instant transfer', timestamp: '3 days ago' },
];

export const TRUST_LOGOS = [
    { name: 'Forbes', logoUrl: 'https://cdn.worldvectorlogo.com/logos/forbes.svg' },
    { name: 'Bloomberg', logoUrl: 'https://cdn.worldvectorlogo.com/logos/bloomberg.svg' },
    { name: 'TechCrunch', logoUrl: 'https://cdn.worldvectorlogo.com/logos/techcrunch.svg' },
    { name: 'The Wall Street Journal', logoUrl: 'https://cdn.worldvectorlogo.com/logos/the-wall-street-journal.svg' },
    { name: 'Financial Times', logoUrl: 'https://cdn.worldvectorlogo.com/logos/financial-times.svg' },
];

export const SOCIAL_LINKS = [
    { label: 'Facebook', href: 'https://facebook.com', icon: 'fab fa-facebook-f' },
    { label: 'Twitter', href: 'https://twitter.com', icon: 'fab fa-twitter' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'fab fa-linkedin-in' },
    { label: 'Instagram', href: 'https://instagram.com', icon: 'fab fa-instagram' },
];

export const FOOTER_COLUMNS = {
    about: {
        description: 'Building a Stronger Financial Future. Your premier banking partner for the construction industry and beyond.'
    },
    links: [
        {
            title: 'Solutions',
            links: [
                { label: 'Personal Banking', href: '#' },
                { label: 'Business Banking', href: '#' },
                { label: 'Wealth Management', href: '#' },
                { label: 'Loans & Mortgages', href: '#' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Press Center', href: '#' },
                { label: 'Investor Relations', href: '#' },
            ],
        },
        {
            title: 'Support',
            links: [
                { label: 'Contact Us', href: '#contact' },
                { label: 'Help Center', href: '#' },
                { label: 'Security', href: '#' },
                { label: 'Sitemap', href: '#' },
            ],
        },
    ],
};

export const CULTURE_VALUES: CultureValue[] = [
    {
        src: 'https://images.unsplash.com/photo-1549740425-5e9ed4d8cd34?q=80&w=2070&auto=format&fit=crop',
        alt: 'Modern, minimalist Swedish office interior',
        title: 'Historic Charm',
        description: 'Rooted in a tradition of trust and stability, we build financial foundations that last for generations.'
    },
    {
        src: 'https://images.unsplash.com/photo-1599481238642-4b24c325c3d9?q=80&w=1974&auto=format&fit=crop',
        alt: 'The Turning Torso skyscraper in Malmö, a feat of modern engineering',
        title: 'Modern Innovation',
        description: 'Engineering cutting-edge financial solutions and digital experiences for a seamless global future.'
    },
    {
        src: 'https://images.unsplash.com/photo-1621243623951-c53b70828889?q=80&w=2070&auto=format&fit=crop',
        alt: 'Offshore wind turbines representing sustainable energy investment',
        title: 'Natural Beauty',
        description: 'Committed to sustainable growth and the long-term prosperity of our clients and our world.'
    }
];

export const SUPPORT_CATEGORIES: SupportCategory[] = [
    { icon: 'fa-user-circle', title: 'Account Management' },
    { icon: 'fa-shield-alt', title: 'Security & Fraud' },
    { icon: 'fa-credit-card', title: 'Cards' },
    { icon: 'fa-paper-plane', title: 'Payments & Transfers' },
    { icon: 'fa-chart-line', title: 'Investments & Loans' },
];

export const SUPPORT_FAQS: FaqItem[] = [
    { question: "How do I reset my password?", answer: "You can reset your password by clicking the 'Forgot Password' link on the login screen. You will receive an email with instructions to set a new password." },
    { question: "What should I do if I see a transaction I don't recognize?", answer: "If you see an unfamiliar transaction, please freeze your card immediately from the 'Cards' section and contact our support team via live chat or phone to report it." },
    { question: "How long do wire transfers take?", answer: "Domestic wire transfers typically complete within one business day. International wire transfers can take between 1-5 business days depending on the destination country and intermediary banks." },
];

export const SYSTEM_STATUS: SystemStatus[] = [
    { service: 'Mobile & Online Banking', status: 'Operational' },
    { service: 'ATM Services', status: 'Operational' },
    { service: 'Customer Support Lines', status: 'High Volume' },
];
