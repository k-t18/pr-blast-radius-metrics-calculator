/**
 * Formats a numeric value into a localized currency string.
 *
 * @param value - The numeric value to format.
 * @param locale - The locale for formatting (default: 'en-NG').
 * @param currency - The ISO 4217 currency code (default: 'NGN').
 * @returns A formatted currency string, e.g., "₦2,500.00"
 */
export function formatCurrency(value: number | undefined | null, locale: string = 'en-NG'): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '0.00';

    return value.toLocaleString(locale);
}
