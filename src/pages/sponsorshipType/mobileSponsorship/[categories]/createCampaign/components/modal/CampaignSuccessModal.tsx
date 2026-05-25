import DescriptionText from '../../../../../../../components/common/DescriptionText';
import HeaderTitle from '../../../../../../../components/common/HeaderTitle';
import LinkButton from '../../../../../../../components/common/LinkButton';
import ModalWrapper from '../../../../../../../components/common/ModalWrapper';
import StatusBadge from '../../../../../../../components/common/StatusBadge';
import { Confetti } from '../../../../../../../components/icons';

interface CampaignSuccessModalProperties {
    visible: boolean;
    onHide: () => void;
}

export default function CampaignSuccessModal({ visible, onHide }: CampaignSuccessModalProperties) {
    return (
        <ModalWrapper
            visible={visible}
            onHide={onHide}
            showCloseButton
            icon={<Confetti size={32} color="text-primary-text" />}
            title="Campaigns Submitted Successfully"
            titleSize="lg"
            titleWeight="medium"
            modalSize="md"
        >
            {/* Top: status + short message */}
            <div className="flex flex-col gap-3">
                {/* Status badge (yellow / Pending Review) */}
                <StatusBadge statusKey="pending_review" shape="square" className="text-[10px] w-fit p-1.5" />

                {/* Short confirmation sentence */}
                <DescriptionText
                    text="Your sponsorship request for Mobile Game has been successfully submitted and is currently under review by our team."
                    size="sm"
                    color="text-primary-text"
                    weight="normal"
                />
            </div>

            {/* Divider + "What happens next?" section */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border-gray-light">
                <HeaderTitle text="What happens next?" size="md" color="text-primary-text" weight="medium" />

                <DescriptionText
                    text="We're evaluating your selections and will notify you once your request has been approved. This process typically takes few business days. You will receive a notification in the portal as well as in email."
                    size="sm"
                    color="text-primary-text"
                    weight="normal"
                />

                <DescriptionText
                    text="You can view your Quotes in the Quotes page under transactions."
                    size="sm"
                    color="text-primary-text"
                    weight="medium"
                />
            </div>

            {/* Actions: Go to Quotes, Sponsor Again */}
            <div className="flex items-center gap-4 mt-4">
                <LinkButton
                    to="/transactions/quotes?tab=0"
                    textColor="text-primary-text"
                    width="auto"
                    className="p-2 gap-2 flex items-center text-sm bg-transparent border border-border-gray-600 rounded"
                >
                    Go to Quotes
                </LinkButton>

                <LinkButton
                    to="/sponsorship-type/mobile-sponsorship"
                    textColor="text-white"
                    width="auto"
                    className="p-2 gap-2 flex items-center text-sm bg-brand-primary-500 border border-brand-primary-500 rounded"
                    onClick={onHide}
                >
                    Sponsor Again
                </LinkButton>
            </div>
        </ModalWrapper>
    );
}
