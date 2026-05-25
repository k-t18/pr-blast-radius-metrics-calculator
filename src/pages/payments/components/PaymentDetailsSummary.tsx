import ActionButton from '../../../components/common/ActionButton';
import HeaderTitle from '../../../components/common/HeaderTitle';
import DescriptionText from '../../../components/common/DescriptionText';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';

interface PaymentDetail {
    id: string;
    status: string;
    amount: number;
}

interface PaymentDetailsSummaryProperties {
    paymentDetails: PaymentDetail[];
    subtotal: number;
    pspFee: number;
    total: number;
    totalPayAmount: number;
    isSubmitting?: boolean;
}

export default function PaymentDetailsSummary({
    paymentDetails,
    subtotal,
    pspFee,
    total,
    totalPayAmount,
    isSubmitting = false,
}: PaymentDetailsSummaryProperties) {
    return (
        <div className="max-w-[517px] w-full">
            <div className="w-full rounded-lg bg-brand-50 p-4 max-h-[276px]">
                <HeaderTitle text="Payment Details" size="md" weight="medium" className="leading-6" disabled={false} />
                <div className="mt-6 space-y-4">
                    {paymentDetails.map(detail => (
                        <div key={detail.id} className="flex items-center justify-between text-sm">
                            <div>
                                <DescriptionText text={`${detail?.id}`} size="xs" color="text-primary-text" weight="normal" className="leading-5" />
                            </div>
                            <div>
                                <DescriptionText text={detail.status} size="xs" color="text-primary-text" weight="normal" className="leading-5" />
                            </div>
                            <span>
                                <CurrencySymbol className="text-xs font-normal leading-5" />
                                <CurrencyAmount value={detail.amount} className="text-xs font-normal leading-5" />
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-sm font-medium leading-[22px] text-primary-text">
                    <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span>
                            <CurrencySymbol /> <CurrencyAmount value={subtotal} />
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span>PSP fee</span>
                        <span>
                            <CurrencySymbol /> <CurrencyAmount value={pspFee} />
                        </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xl font-medium leading-7">
                        <span>Total Amount</span>
                        <span>
                            <CurrencySymbol /> <CurrencyAmount value={total} />
                        </span>
                    </div>
                </div>
                <div />
            </div>
            <ActionButton
                type="submit"
                borderRadius="rounded"
                width="auto"
                isDisabled={isSubmitting || total === 0}
                className="mt-6 min-h-9 w-fit text-xs font-normal leading-5 px-[202px] py-3 focus-visible:outline focus-visible:outline-offset-2"
            >
                <span className="text-sm font-medium leading-5">
                    {isSubmitting ? (
                        'Processing...'
                    ) : (
                        <>
                            Pay
                            <CurrencySymbol className="ml-1" />
                            <CurrencyAmount value={totalPayAmount} className="ml-1" />
                        </>
                    )}
                </span>
            </ActionButton>
        </div>
    );
}
