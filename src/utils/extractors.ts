/**
 * Determines the icon type based on the provided name.
 *
 * Checks if the string contains keywords like "powered" or "title"
 * (case-insensitive), and returns a corresponding icon type.
 * Defaults to "square" if no matching keyword is found.
 *
 * @param name - The name string used to infer the icon type.
 * @returns One of 'powered', 'title', or 'square' based on keyword match.
 */

export const getIconType = (name?: string | null) => {
    const normalized = name?.toLowerCase() ?? '';
    if (normalized.includes('powered')) {
        return 'powered';
    }
    if (normalized.includes('title')) {
        return 'title';
    }
    return 'square';
};

/**
 * Extracts the last numeric sequence from a given identifier string
 * and removes leading zeros.
 *
 * Example:
 * "SAL-QTN-25-0000041" → "41"
 * "Rap-uit-45-00034541" → "34541"
 *
 * @param name - The identifier string containing digits.
 * @returns The last number found in the string without leading zeros,
 *          or "0" if none found.
 */
export const extractIdNumber = (name: string): string => {
    if (!name) return '';
    const match = name.match(/(\d+)(?!.*\d)/); // Find last number sequence
    if (!match) return '0';

    const cleaned = match[0].replace(/^0+/, ''); // Remove leading zeros
    return cleaned || '0'; // Ensure at least "0" returned
};

/**
 * Formats duration values coming from API (e.g. "3.00000") into clean whole numbers.
 *
 * Why this is needed:
 * - API sends duration as decimal with trailing zeros (e.g. "3.00000")
 * - UI should show a clean readable value (e.g. "3")
 *
 * Behavior:
 * - Converts string/number input → number
 * - Removes unnecessary decimal places
 * - Shows "0" if value is zero (e.g. "0.00000")
 * - Returns an empty string if input is invalid
 *
 * @param value - Duration value from API (string or number)
 * @returns A formatted whole number string (e.g. "3")
 */
export const formatNumber = (value: string | number | undefined | null): string => {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return '';

    return numberValue.toFixed(0);
};
