import type { QuoteSidebarProperties } from '../../../../interfaces/quotes/quotes.types';
import { QuoteHeader } from './drawer/QuoteHeader';
import { QuoteBody } from './drawer/QuoteBody';
import { QuoteFooter } from './drawer/QuoteFooter';
import CircularLoader from '../../../../components/common/CircularLoader';
import ErrorBanner from '../../../../components/common/ErrorBanner';

export function QuoteSidebar({ quote, onClose, isFetchingDetail, detailError, retryFetchDetail, activeIndex = 0 }: QuoteSidebarProperties) {
    if (isFetchingDetail) {
        return <CircularLoader label="Loading quote details…" />;
    }
    if (detailError) {
        return (
            <div className="p-6">
                <ErrorBanner message={detailError} onRetry={retryFetchDetail} />
            </div>
        );
    }
    if (!quote || Object.keys(quote).length === 0) {
        return <div className="p-4 text-gray-600">No Quotation data available</div>;
    }

    return (
        <div className={`custom-detail-sidebar`.trim()}>
            {quote ? (
                <div className="mt-4 flex h-full flex-col">
                    <QuoteHeader quote={quote} onClose={onClose} activeIndex={activeIndex} />
                    <QuoteBody quote={quote} />
                    <QuoteFooter quote={quote} />
                </div>
            ) : (
                <div className="flex h-full items-center justify-center text-sm text-black">Select a quote to view its details.</div>
            )}
        </div>
    );
}
