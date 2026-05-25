import { ProgressBar as PrimeProgressBar } from 'primereact/progressbar';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { useReportDataQuery } from '../../../hooks/payments/useGetCreditAmount';

export default function AvailableCredit() {
    const { creditData, isLoading, error } = useReportDataQuery();

    const availableCredit = creditData?.credit_balance ?? 0;
    const creditUsed = creditData?.outstanding_amt ?? 0;
    const totalCreditLimit = creditData?.credit_limit ?? 0;
    const usagePercentage = creditUsed && totalCreditLimit ? (creditUsed / totalCreditLimit) * 100 : 0;

    if (isLoading) {
        return <span className="font-ubuntu font-medium text-sm leading-10">Loading...</span>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Error: {error.message}</div>;
    }

    if (!creditData) {
        return <div className="p-4 text-gray-600">No credit information available</div>;
    }

    return (
        <div className="border border-gray-600 rounded-lg p-4 mb-6">
            <div className="mb-2 flex items-center gap-1">
                <CurrencySymbol className="font-ubuntu font-medium text-[32px] leading-10" />
                <CurrencyAmount value={availableCredit} className="font-ubuntu font-medium text-[32px] leading-10" />
            </div>
            <HeaderTitle text="Available Credit" size="md" weight="normal" disabled={false} className="leading-6 mb-3" />

            <PrimeProgressBar value={usagePercentage} showValue={false} className="credit-progress-bar h-3 mb-2" />

            <div className="text-sm font-normal text-gray-800 leading-[22px] text-right">
                <span>
                    Credit Used: <CurrencySymbol /> <CurrencyAmount value={creditUsed} /> of <CurrencySymbol />{' '}
                    <CurrencyAmount value={totalCreditLimit} />
                </span>
            </div>
        </div>
    );
}
