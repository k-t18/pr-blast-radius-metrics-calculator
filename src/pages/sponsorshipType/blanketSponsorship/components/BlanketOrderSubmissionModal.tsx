import ActionButton from '../../../../components/common/ActionButton';
import DescriptionText from '../../../../components/common/DescriptionText';
import ModalWrapper from '../../../../components/common/ModalWrapper';
import StatusBadge from '../../../../components/common/StatusBadge';
import { Confetti } from '../../../../components/icons';
import type { BlanketOrderSubmissionModalProperties } from '../../../../interfaces/blanketSponsorship/blanketSponsorship.types';

export default function BlanketOrderSubmissionModal({
    visible,
    onHide,
    onViewSubmittedOrder,
    onSubmitNewOrder,
}: BlanketOrderSubmissionModalProperties) {
    return (
        <ModalWrapper
            visible={visible}
            onHide={onHide}
            icon={<Confetti size={32} color="#111827" />}
            title="Blanket Order Submitted!"
            titleSize="2xl"
            titleWeight="medium"
            modalSize="lg"
        >
            <div className="w-full rounded-md">
                <StatusBadge
                    statusKey="pending_review"
                    variant="filled"
                    shape="square"
                    className="text-[10px] rounded-lg font-normal w-fit leading-4"
                />
                <DescriptionText
                    text="Your blanket order has been successfully submitted. Our team will review the details and notify you once it's approved.."
                    size="sm"
                    color="text-primary-text"
                    weight="normal"
                    className="leading-[22px] mt-4"
                />
                <div className="mt-4 flex flex-wrap items-center gap-6">
                    <ActionButton
                        bgColor="bg-white"
                        textColor="text-primary-text"
                        borderColor="border-gray-600"
                        borderRadius="rounded"
                        width="auto"
                        onClick={onSubmitNewOrder}
                        className="min-h-9 text-sm font-normal leading-[22px] border w-fit focus-visible:outline focus-visible:outline-offset-2"
                    >
                        Submit New order
                    </ActionButton>
                    <ActionButton
                        borderRadius="rounded"
                        width="auto"
                        onClick={onViewSubmittedOrder}
                        className="min-h-9 w-fit text-sm font-normal leading-[22px] focus-visible:outline focus-visible:outline-offset-2"
                    >
                        View Submitted Order
                    </ActionButton>
                </div>
            </div>
        </ModalWrapper>
    );
}
