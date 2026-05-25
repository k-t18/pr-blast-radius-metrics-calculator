import ActionButton from './ActionButton';

/**
 * A reusable error banner component that displays error messages
 * with an optional retry button.
 *
 * Supports two layout variants:
 * - 'horizontal' (default): Message and retry button side by side
 * - 'vertical': Message and retry button stacked vertically (useful for drawers/modals)
 *
 * @component
 * @param {string} message - The error message to display
 * @param {() => void} [onRetry] - Optional retry callback function
 * @param {string} [retryLabel='Retry'] - Label for the retry button
 * @param {'horizontal' | 'vertical'} [variant='horizontal'] - Layout variant
 * @param {string} [title] - Optional title/heading above the message
 * @param {string} [className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * {error && (
 *   <ErrorBanner
 *     message={errorMessage}
 *     onRetry={() => refetch()}
 *   />
 * )}
 * ```
 *
 * @example
 * ```tsx
 * {error && (
 *   <ErrorBanner
 *     title="Failed to load quote details"
 *     message={errorMessage}
 *     onRetry={retryFetchDetail}
 *     variant="vertical"
 *   />
 * )}
 * ```
 */
export interface ErrorBannerProperties {
    message: string | Error;
    onRetry?: () => void;
    retryLabel?: string;
    className?: string;
}

function ErrorBanner({ message, onRetry, retryLabel = 'Retry', className = '' }: ErrorBannerProperties) {
    return (
        <div
            className={`mb-4 flex flex-wrap items-center justify-between gap-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 ${className}`}
        >
            <span>{message as string}</span>
            {onRetry && (
                <ActionButton borderRadius="rounded" width="auto" onClick={onRetry} className="min-h-9 text-xs font-medium leading-5">
                    {retryLabel}
                </ActionButton>
            )}
        </div>
    );
}

export default ErrorBanner;
