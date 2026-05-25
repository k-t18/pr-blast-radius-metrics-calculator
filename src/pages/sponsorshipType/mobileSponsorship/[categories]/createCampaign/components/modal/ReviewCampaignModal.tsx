import ModalWrapper from '../../../../../../../components/common/ModalWrapper';
import ActionButton from '../../../../../../../components/common/ActionButton';
import HeaderTitle from '../../../../../../../components/common/HeaderTitle';
import { CurrencySymbol } from '../../../../../../../components/common/CurrencySymbol';
import { formatCurrency } from '../../../../../../../utils/formatCurrency';
import type { GlobalState } from '../../context/createCampaignContext';
import type { BlanketOrderListItem } from '../../../../../../../services/blanketSponsorship/getBlanketOrderList.api';
import ReviewCampaignCategoryItem from './ReviewCampaignCategoryItem';

interface ReviewCampaignModalProperties {
    visible: boolean;
    onHide: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    globalState: GlobalState;
    categoryIdsFromUrl: string[];
    allCategoriesData: Array<{ id: string; title: string }>;
    selectedBlanketOrder: BlanketOrderListItem | null;
}

export default function ReviewCampaignModal({
    visible,
    onHide,
    onSubmit,
    isSubmitting,
    globalState,
    categoryIdsFromUrl,
    allCategoriesData,
    selectedBlanketOrder,
}: ReviewCampaignModalProperties) {
    return (
        <ModalWrapper
            visible={visible}
            onHide={onHide}
            title="Mobile Sponsorship - Review & Confirm"
            titleSize="md"
            titleWeight="medium"
            modalSize="md"
            showCloseButton
        >
            <div className="overflow-y-auto px-2" style={{ maxHeight: '60vh' }}>
                {selectedBlanketOrder && (
                    <div className="flex flex-col gap-1 mb-4 pb-4 border-b border-border-gray">
                        <HeaderTitle text="Blanket Order" size="sm" weight="medium" />
                        <div className="flex items-center gap-1 rounded border border-border-gray-600 bg-gray-50 px-3 py-2 text-sm text-primary-text">
                            {selectedBlanketOrder.id}&nbsp;—&nbsp;
                            <CurrencySymbol className="text-sm" />
                            {formatCurrency(selectedBlanketOrder.rate)}
                        </div>
                    </div>
                )}
                {categoryIdsFromUrl
                    .filter(categoryId => globalState[categoryId])
                    .map((categoryId, index) => {
                        const categoryData = globalState[categoryId];
                        const categoryTitle = allCategoriesData.find(c => c.id === categoryId)?.title || categoryId;

                        return (
                            <ReviewCampaignCategoryItem key={categoryId} categoryTitle={categoryTitle} categoryData={categoryData} index={index} />
                        );
                    })}
            </div>

            <div className="flex justify-start border-gray-200">
                <ActionButton
                    bgColor="bg-brand-500"
                    textColor="text-white"
                    width="auto"
                    className="px-3 py-2 rounded-sm font-medium text-[14px] font-ubuntu"
                    onClick={onSubmit}
                    isDisabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Campaigns'}
                </ActionButton>
            </div>
        </ModalWrapper>
    );
}
