interface CurrencySymbolProperties {
    symbol?: string;
    className?: string;
}

/**
 * Displays a currency symbol with optional custom styling.
 *
 * @param symbol - The currency symbol to render. Defaults to the Nigerian naira (₦).
 * @param className - Optional utility classes to customize the wrapping span.
 */
export function CurrencySymbol({ symbol = '₦', className = 'mr-1' }: CurrencySymbolProperties) {
    return <span className={className}>{symbol}</span>;
}
