import { formatCurrency } from '../../utils/formatCurrency';

type CurrencyAmountProperties = {
    value: number;
    locale?: string;
    className?: string;
};

/**
 * Renders a localized currency value (symbol handled by the caller).
 */
export function CurrencyAmount({ value, locale = 'en-NG', className }: CurrencyAmountProperties) {
    const formattedValue = formatCurrency(value, locale);

    return <span className={className}>{formattedValue}</span>;
}
