import DescriptionText from '../../../components/common/DescriptionText';
import HeaderTitle from '../../../components/common/HeaderTitle';
import LinkButton from '../../../components/common/LinkButton';
import ModalWrapper from '../../../components/common/ModalWrapper';
import StatusBadge from '../../../components/common/StatusBadge';
import { Confetti } from '../../../components/icons';

interface SupportModalProperties {
    visible: boolean;
    onHide: () => void;
}

function SupportModal({ visible, onHide }: SupportModalProperties) {
    return (
        <ModalWrapper
            visible={visible}
            onHide={onHide}
            showCloseButton
            // keep the small confetti icon in the header (matches the screenshot)
            icon={<Confetti size={32} color="text-primary-text" />}
            title="Support Ticket Submitted!"
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
                    text="We’ve received your ticket and our support team is reviewing it."
                    size="sm"
                    color="text-primary-text"
                    weight="normal"
                />
            </div>

            {/* Divider + "What happens next?" section */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border-gray-light">
                <HeaderTitle text="What happens next?" size="md" color="text-primary-text" weight="medium" />

                {/* Bullet list — styled using DescriptionText for consistent typography */}
                <ul className="list-disc ml-5 space-y-2">
                    <li>
                        <DescriptionText
                            text="A support agent will contact you within 24 hours."
                            size="sm"
                            color="text-primary-text"
                            weight="normal"
                        />
                    </li>
                    <li>
                        <DescriptionText
                            text="You’ll get email + in-portal updates on the ticket status."
                            size="sm"
                            color="text-primary-text"
                            weight="normal"
                        />
                    </li>
                    <li>
                        <DescriptionText
                            text="You can track progress of the ticket in the Support module under ticket history."
                            size="sm"
                            color="text-primary-text"
                            weight="normal"
                        />
                    </li>
                </ul>
            </div>

            {/* Actions: view submitted tickets, submit new ticket */}
            <div className="flex items-center gap-4 mt-4">
                <LinkButton
                    to="/support"
                    textColor="text-primary-text"
                    width="auto"
                    className="p-2 gap-2 flex items-center text-sm bg-transparent border border-border-gray-600 rounded"
                    onClick={onHide}
                >
                    View Submitted Tickets
                </LinkButton>

                <LinkButton
                    to="/support"
                    textColor="text-white"
                    width="auto"
                    className="p-2 gap-2 flex items-center text-sm bg-brand-primary-500 border border-brand-primary-500 rounded"
                    onClick={onHide}
                >
                    Submit New Ticket
                </LinkButton>
            </div>
        </ModalWrapper>
    );
}

export default SupportModal;
