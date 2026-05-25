interface SlashDateProperties {
    date: string | Date;
    locale?: string;
    className?: string;
}

/**
 * Displays a date formatted using slashes (DD/MM/YYYY by default).
 *
 * @param date - ISO string or Date instance to display.
 * @param locale - Locale passed to `toLocaleDateString`; defaults to `en-GB`.
 * @param className - Optional classes for styling the span.
 */
export function SlashDate({ date, locale = 'en-GB', className }: SlashDateProperties) {
    const normalizedDate = typeof date === 'string' ? new Date(date) : date;
    const formatted = normalizedDate.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return <span className={className}>{formatted}</span>;
}
