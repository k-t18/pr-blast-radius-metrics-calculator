import ModalWrapper from '../../../../../components/common/ModalWrapper';
import { Confetti } from '../../../../../components/icons';
import StatusBadge from '../../../../../components/common/StatusBadge';
import DescriptionText from '../../../../../components/common/DescriptionText';
import HeaderTitle from '../../../../../components/common/HeaderTitle';
import LinkButton from '../../../../../components/common/LinkButton';

interface QuoteRequestModalProperties {
    visible: boolean;
    onHide: () => void;
}

function QuoteRequestModal({ visible, onHide }: QuoteRequestModalProperties) {
    return (
        <ModalWrapper
            visible={visible}
            onHide={onHide}
            icon={<Confetti size={32} color="text-primary-text" />}
            title="Quote Request Sent!"
            modalSize="lg"
        >
            <div className="flex flex-col gap-2">
                <StatusBadge statusKey="pending_review" shape="square" className="text-[10px] w-fit p-1.5" />

                <DescriptionText
                    text="Your sponsorship request for Studio Show has been successfully submitted and is currently under review by our team."
                    size="sm"
                    color="text-primary-text"
                    weight="normal"
                />
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-border-gray-light">
                <HeaderTitle text="What happens next?" size="md" color="text-primary-text" weight="medium" />

                <DescriptionText
                    text="We're evaluating your selections and will notify you once your request has been approved. This process typically takes few business days. You will receive a notification in the portal as well as in email."
                    size="sm"
                    color="text-primary-text"
                    weight="normal"
                />

                <DescriptionText
                    text="You can view your Quotes in the Quotes page under transactions."
                    size="xs"
                    color="text-primary-text"
                    weight="semibold"
                />
            </div>

            <div className="flex justify-star font-ubuntu items-center gap-6">
                <LinkButton
                    to="/transactions/quotes?tab=1"
                    textColor="text-primary-text"
                    width="auto"
                    className="p-2! gap-2 flex items-center text-sm! bg-transparent border border-border-gray-600 rounded"
                >
                    Go to Quotes
                </LinkButton>

                <LinkButton
                    to="/sponsorship-type/studio-show"
                    textColor="text-white"
                    width="auto"
                    className="p-2! gap-2 flex items-center text-sm! bg-brand-primary-500 border border-brand-primary-500 rounded"
                >
                    Sponsor Again
                </LinkButton>
            </div>
        </ModalWrapper>
    );
}

export default QuoteRequestModal;
