// A simple currency formatter
export const formatCurrency = (amount: number, currencyCode: string = 'USD', locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
};

// A simple date formatter
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// Formats large numbers into M, B, T
export const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    }
    if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    }
    return num.toString();
};