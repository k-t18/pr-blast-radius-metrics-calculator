import ActionButton from '../../../components/common/ActionButton';
import DescriptionText from '../../../components/common/DescriptionText';
import HeaderTitle from '../../../components/common/HeaderTitle';
import ModalWrapper from '../../../components/common/ModalWrapper';
import StatusBadge from '../../../components/common/StatusBadge';
import { Confetti } from '../../../components/icons';

interface CreativesSubmissionModalProperties {
    visible: boolean;
    onHide: () => void;
    onViewSubmittedCreatives?: () => void;
    onSubmitNewCreatives?: () => void;
}

export default function CreativesSubmissionModal({
    visible,
    onHide,
    onViewSubmittedCreatives,
    onSubmitNewCreatives,
}: CreativesSubmissionModalProperties) {
    return (
        <ModalWrapper
            visible={visible}
            onHide={onHide}
            icon={<Confetti size={32} color="#111827" />}
            title="Creatives Submitted!"
            titleSize="2xl"
            titleWeight="medium"
            modalSize="lg"
        >
            <div className="w-full rounded-md">
                <StatusBadge
                    statusKey="pending_review"
                    variant="filled"
                    className="text-[10px] font-normal w-fit rounded-lg leading-4 mb-2 p-[6px] creatives-modal-status"
                />
                <DescriptionText
                    text="Your files have been received and are now under review by our team. You'll be notified if any updates or revisions are required."
                    size="sm"
                    color="text-primary-text"
                    weight="normal"
                    className="leading-[22px] border-b border-gray-600 pb-4"
                />

                <div className="mt-4 flex flex-col gap-3">
                    <HeaderTitle text="What happens next?" size="md" color="text-primary-text" weight="medium" className="font-poppins" />
                    <ul className="list-disc list-inside space-y-2 text-sm text-primary-text leading-[22px]">
                        <li>We will validate file formats, dimensions, and content.</li>
                        <li>Once approved, your creatives will be locked for production.</li>
                        <li>You&apos;ll receive notification via email and dashboard after approval.</li>
                    </ul>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                    <ActionButton
                        bgColor="bg-white"
                        textColor="text-primary-text"
                        borderColor="border-gray-600"
                        borderRadius="rounded"
                        width="auto"
                        onClick={onViewSubmittedCreatives}
                        className="min-h-9 text-sm font-ubuntu font-normal leading-[22px] border w-fit focus-visible:outline focus-visible:outline-offset-2"
                    >
                        View Submitted Creatives
                    </ActionButton>
                    <ActionButton
                        borderRadius="rounded"
                        width="auto"
                        onClick={onSubmitNewCreatives}
                        className="min-h-9 w-fit text-sm font-ubuntu font-normal leading-[22px] focus-visible:outline focus-visible:outline-offset-2"
                    >
                        Submit new Creatives
                    </ActionButton>
                </div>
            </div>
        </ModalWrapper>
    );
}
