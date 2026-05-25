import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import ActionButton from '../../../components/common/ActionButton';
import { Money } from '../../../components/icons';
import HeaderTitle from '../../../components/common/HeaderTitle';
import DescriptionText from '../../../components/common/DescriptionText';
import { Banner } from '../../../components/common/Banner';

interface SettleOutstandingAmountProperties {
    onPayOutstanding: () => void;
    totalOutstanding: number;
    isLoading: boolean;
    error: Error | null;
}

export function SettleOutstandingAmount({ onPayOutstanding, totalOutstanding, isLoading, error }: SettleOutstandingAmountProperties) {
    // Determine what to display based on state
    let amountDisplay;
    if (isLoading) {
        amountDisplay = <span className="font-ubuntu font-normal text-sm leading-5">Loading...</span>;
    } else if (error) {
        amountDisplay = <span className="font-ubuntu font-normal text-sm leading-5 text-red-600">Error: {error.message}</span>;
    } else if (totalOutstanding === undefined || totalOutstanding === null) {
        amountDisplay = <span className="font-ubuntu font-normal text-sm leading-5 text-gray-600">No outstanding amount found</span>;
    } else {
        amountDisplay = (
            <>
                <CurrencySymbol className="font-ubuntu font-medium text-[32px] leading-10" />
                <CurrencyAmount value={totalOutstanding} className="font-ubuntu font-medium text-[32px] leading-10" />
            </>
        );
    }

    return (
        <Banner className="mb-6">
            <div className="flex justify-center gap-10">
                {/* Left Side - Amount Display */}
                <div className="flex items-center gap-4 p-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Money size={24} />
                        </div>
                        <div className="flex items-center gap-1">{amountDisplay}</div>
                        <HeaderTitle
                            text="Total Outstanding"
                            size="xl"
                            weight="medium"
                            disabled={false}
                            color="text-gray-900"
                            className="leading-7"
                        />
                    </div>
                </div>

                {/* Right Side - Description and Buttons */}
                <div className="flex max-w-[638px] flex-col gap-4">
                    <HeaderTitle text="Settle Outstanding Amount" size="md" weight="medium" disabled={false} className="leading-6" />
                    <DescriptionText
                        text="You can settle entire outstanding amount or pay multiple invoices in full or partially. Enter the total amount you'd like to pay and we'll automatically allocate it to your oldest invoices first."
                        size="sm"
                        color="text-primary-text"
                        weight="normal"
                        className="leading-[22px]"
                    />

                    <div className="flex flex-wrap gap-4">
                        <ActionButton
                            borderRadius="rounded"
                            width="auto"
                            className="min-h-9 w-fit text-xs font-normal leading-5 focus-visible:outline focus-visible:outline-offset-2"
                            onClick={onPayOutstanding}
                        >
                            Pay Outstanding Amount
                        </ActionButton>
                        {/* <ActionButton
                            bgColor="bg-white"
                            textColor="text-brand-primary-500"
                            borderColor="text-primary-text"
                            borderRadius="rounded"
                            width="auto"
                            className="min-h-9 w-fit text-xs font-normal leading-5 text-primary-text border hover:bg-brand-50 focus-visible:outline focus-visible:outline-offset-2"
                            onClick={onPayCustom}
                        >
                            Pay Custom Amount
                        </ActionButton> */}
                    </div>
                </div>
            </div>
        </Banner>
    );
}
