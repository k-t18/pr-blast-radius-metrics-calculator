/**
 * Formats a given date as DD-MM-YYYY (e.g., 10-12-2025).
 *
 * @param input - A Date object or a valid date string.
 * @returns The formatted date string.
 */
export function dateDashFormat(input: string | Date): string {
    const date = typeof input === 'string' ? new Date(input) : input;
    if (Number.isNaN(date.getTime())) return ''; // handle invalid date

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

/**
 * Formats a given date/time as hh:mm AM/PM (12-hour format).
 *
 * @param input - A Date object or a valid date string.
 * @returns The formatted time string.
 */
export function time12hFormat(input: string | Date): string {
    const date = typeof input === 'string' ? new Date(input) : input;
    if (Number.isNaN(date.getTime())) return ''; // handle invalid date

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 -> 12 for midnight
    const formattedHours = String(hours).padStart(2, '0');

    return `${formattedHours}:${minutes} ${ampm}`;
}
