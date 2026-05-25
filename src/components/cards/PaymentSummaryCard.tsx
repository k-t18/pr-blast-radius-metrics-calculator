import type { SummaryCardProperties } from '../../interfaces/payments/payments.types';
import HeaderTitle from '../common/HeaderTitle';

function PaymentSummaryCard({ icon, value, label, isLoading, error }: SummaryCardProperties) {
    let displayValue;
    if (isLoading) {
        displayValue = <span className="font-ubuntu font-normal text-sm leading-5">Loading...</span>;
    } else if (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        displayValue = <span className="font-ubuntu font-normal text-sm leading-5 text-red-600">Error: {errorMessage}</span>;
    } else {
        displayValue = value;
    }

    return (
        <div className="rounded border border-gray-600 p-4">
            <div className="mb-2 flex items-center gap-2">{icon}</div>
            <div className="mb-2 flex items-center gap-1">{displayValue}</div>
            <HeaderTitle text={label} size="md" weight="normal" color="text-gray-850" disabled={false} className="leading-6" />
        </div>
    );
}

export default PaymentSummaryCard;
