import ActionButton from './ActionButton';
import DescriptionText from './DescriptionText';
import ModalWrapper from './ModalWrapper';

export interface RemarkModalProperties {
    visible: boolean;
    onHide: () => void;
    message: string;
    title?: string;
}

export default function RemarkModal({ visible, onHide, message, title }: RemarkModalProperties) {
    const displayMessage = message?.trim() || 'No remarks available';

    return (
        <ModalWrapper visible={visible} onHide={onHide} title={title} titleSize="xl" titleWeight="medium" modalSize="sm">
            <div className="w-full rounded-md p-4">
                <DescriptionText text={displayMessage} size="sm" color="text-primary-text" weight="normal" className="leading-[22px]" />
            </div>
            <div className="flex justify-end mt-4">
                <ActionButton
                    bgColor="bg-brand-primary-500"
                    textColor="text-white"
                    borderRadius="rounded"
                    width="auto"
                    onClick={onHide}
                    className="min-h-9 text-sm font-normal leading-[22px] px-4 focus-visible:outline focus-visible:outline-offset-2"
                >
                    Close
                </ActionButton>
            </div>
        </ModalWrapper>
    );
}
