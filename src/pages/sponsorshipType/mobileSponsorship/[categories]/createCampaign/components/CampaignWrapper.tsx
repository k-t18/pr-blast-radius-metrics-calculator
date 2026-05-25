import { type ReactNode, useState } from 'react';
import { useCampaignLeftSidebarCategoryLogic } from '../hooks/useCampaignLeftSidebarCategoryLogic';
import { useCreateCampaignActions } from '../hooks/useCreateCampaignActions';
import { useCreateCampaignContext } from '../context/createCampaignContext';
import { useApprovedBlanketOrders } from '../../../../../../hooks/blanketSponsorship/useBlanketOrders';
import { BlanketOrderAttachment } from '../../../../../../components/common/BlanketOrderAttachment';
import CampaignActions from './CampaignActions';
import ReviewCampaignModal from './modal/ReviewCampaignModal';
import CampaignSuccessModal from './modal/CampaignSuccessModal';
import '../../../../../../styles/mobileSponsorshipStyles/sponsorRewardsCampaign.css';

/**
 * Props for the campaign steps render function
 * Provides access to category navigation data needed by step components
 */
export interface CampaignStepsRenderProperties {
    /** Item code for the current category */
    itemCode: string | undefined;
}

/**
 * Props for the CampaignWrapper component
 */
interface CampaignWrapperProperties {
    /**
     * Render function that receives category data and returns step components
     * This pattern allows each campaign type to define its own steps while
     * sharing common infrastructure (actions, modals)
     */
    renderSteps: (properties: CampaignStepsRenderProperties) => ReactNode;
}

/**
 * Shared Campaign Wrapper Component
 *
 * This component encapsulates the common infrastructure used by all campaign types:
 * - Campaign action buttons (Save, Previous, Next, Review & Submit)
 * - Review modal for campaign submission
 * - Success modal after submission
 * - Navigation logic
 *
 * Each campaign type (Ads, SponsorRewards, WeeklyLeaderboard) only needs to define
 * its unique steps via the renderSteps prop.
 *
 * @example
 * ```tsx
 * <CampaignWrapper
 *     renderSteps={({ itemCode }) => (
 *         <>
 *             <Step1 />
 *             <Step2 />
 *             <Step3 objectives={objectives} itemCode={itemCode} />
 *         </>
 *     )}
 * />
 * ```
 */
function CampaignWrapper({ renderSteps }: CampaignWrapperProperties) {
    const { getAllCategoryData, currentCategoryId, onStepChange } = useCreateCampaignContext();

    const { categoryIdsFromUrl, previousId, nextId, itemCode, handleNext, handlePrevious, allCategoriesData } = useCampaignLeftSidebarCategoryLogic(
        currentCategoryId || '',
        onStepChange || (() => {})
    );

    const isLastStep = !nextId;

    const [selectedBlanketOrderId, setSelectedBlanketOrderId] = useState<string | null>(null);

    // Compute total budget across all categories for eligible blanket order filtering
    const totalBudget = categoryIdsFromUrl.reduce((sum, id) => sum + (getAllCategoryData()[id]?.budget ?? 0), 0);

    // Used to resolve the full order object for ReviewCampaignModal.
    // TanStack Query deduplicates the API call with the same queryKey used inside BlanketOrderAttachment.
    const { orders: blanketOrders } = useApprovedBlanketOrders(totalBudget);
    const selectedBlanketOrder = blanketOrders.find(o => o.id === selectedBlanketOrderId) ?? null;

    const {
        notification,
        isSubmitting,
        isCategoryFullyFilled,
        isCategoryCompleted,
        isReviewModalOpen,
        isSuccessModalOpen,
        handleSaveCategory,
        handleReviewAndSubmit,
        handleConfirmSubmit,
        handleCloseReviewModal,
        handleCloseSuccessModal,
        getNextButtonStyles,
        isNextButtonDisabled,
    } = useCreateCampaignActions({
        categoryIdsFromUrl,
        allCategoriesData,
        nextId,
        handleNext,
        selectedBlanketOrderId,
    });

    return (
        <div className="sponsor-rewards-campaign">
            {/* Render campaign-specific steps */}
            {renderSteps({ itemCode })}

            {/* Blanket order attachment — shown on the last step before Review & Submit */}
            {isLastStep && (
                <div className="mt-4">
                    <BlanketOrderAttachment
                        totalBudget={totalBudget}
                        selectedBlanketOrderId={selectedBlanketOrderId}
                        onChange={setSelectedBlanketOrderId}
                    />
                </div>
            )}

            {/* Shared action buttons */}
            <CampaignActions
                notification={notification}
                isSubmitting={isSubmitting}
                isCategoryFullyFilled={isCategoryFullyFilled}
                isCategoryCompleted={isCategoryCompleted}
                isLastStep={isLastStep}
                categoryIdsFromUrl={categoryIdsFromUrl}
                previousId={previousId}
                handleSaveCategory={handleSaveCategory}
                handleReviewAndSubmit={handleReviewAndSubmit}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                getNextButtonStyles={getNextButtonStyles}
                isNextButtonDisabled={isNextButtonDisabled}
            />

            {/* Shared review modal */}
            <ReviewCampaignModal
                visible={isReviewModalOpen}
                onHide={handleCloseReviewModal}
                onSubmit={handleConfirmSubmit}
                isSubmitting={isSubmitting}
                globalState={getAllCategoryData()}
                categoryIdsFromUrl={categoryIdsFromUrl}
                allCategoriesData={allCategoriesData}
                selectedBlanketOrder={selectedBlanketOrder}
            />

            {/* Shared success modal */}
            <CampaignSuccessModal visible={isSuccessModalOpen} onHide={handleCloseSuccessModal} />
        </div>
    );
}

export default CampaignWrapper;
