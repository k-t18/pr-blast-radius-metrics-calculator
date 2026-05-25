interface HyphenatedDateProperties {
    date: string | Date;
    locale?: string;
    className?: string;
}

/**
 * Displays a date formatted as DD-MM-YYYY regardless of delimiter in the input.
 *
 * @param date - ISO string or Date instance to format.
 * @param locale - Locale used for initial formatting before replacing slashes with hyphen.
 * @param className - Optional classes applied to the span.
 */
export function HyphenatedDate({ date, locale = 'en-GB', className }: HyphenatedDateProperties) {
    if (!date) return <span className={className}>--</span>;

    const normalizedDate = typeof date === 'string' ? new Date(date) : date;
    const formatted = normalizedDate
        .toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        .replaceAll('/', '-');

    return <span className={className}>{formatted}</span>;
}
