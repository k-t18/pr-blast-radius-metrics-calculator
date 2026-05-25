import ActionButton from '../../../../../../components/common/ActionButton';
import SuccessNotification from '../../../../../../components/common/SuccessNotification';
import type { CampaignActionsProperties } from '../../../../../../interfaces/mobileSponsorship/createCampaignHooks.types';

/**
 * Shared component for campaign action buttons (Save Campaign, Previous, Next, Review & Submit)
 * Used by both AdsCampaign and SponsorRewardsCampaign components
 */
export default function CampaignActions({
    notification,
    isSubmitting,
    isCategoryFullyFilled,
    isCategoryCompleted,
    isLastStep,
    categoryIdsFromUrl,
    previousId,
    handleSaveCategory,
    handleReviewAndSubmit,
    handleNext,
    handlePrevious,
    getNextButtonStyles,
    isNextButtonDisabled,
}: CampaignActionsProperties) {
    const nextButtonStyles = getNextButtonStyles();

    // Show "Save Campaign" button only when category is NOT completed
    // (i.e., before saving or after editing)
    const showSaveCampaignButton = !isCategoryCompleted;

    // "Review & Submit" button always shows on last step, but is disabled until:
    // 1. Category is completed (Save Campaign was clicked)
    // 2. Category is still fully filled (no steps were edited after saving)
    const showReviewAndSubmitButton = isLastStep;

    return (
        <>
            <div className="campaign-actions">
                <div>
                    {showSaveCampaignButton && (
                        <ActionButton
                            bgColor={isCategoryFullyFilled ? 'bg-brand-500' : 'var(--color-gray-600)'}
                            textColor="text-white"
                            className={`save-campaign-button font-ubuntu ${isCategoryFullyFilled ? '' : 'cursor-not-allowed opacity-50'}`}
                            isDisabled={!isCategoryFullyFilled}
                            onClick={handleSaveCategory}
                        >
                            Save Campaign
                        </ActionButton>
                    )}
                </div>
                <div>
                    {(categoryIdsFromUrl.length > 1 || isLastStep) && (
                        <div className="flex gap-4 justify-end">
                            {categoryIdsFromUrl.length > 1 && (
                                <div>
                                    <ActionButton
                                        bgColor="bg-transparent"
                                        textColor={previousId ? '#000000' : '#D6D6D6'}
                                        borderColor="border-transparent"
                                        width="auto"
                                        className={`btn_previous font-ubuntu ${previousId ? '' : 'cursor-not-allowed'}`}
                                        isDisabled={!previousId}
                                        onClick={handlePrevious}
                                    >
                                        Previous
                                    </ActionButton>
                                </div>
                            )}
                            {isLastStep
                                ? showReviewAndSubmitButton && (
                                      <div>
                                          <ActionButton
                                              bgColor={nextButtonStyles.bgColor}
                                              textColor="text-white"
                                              width="auto"
                                              className={`btn_review_submit font-ubuntu ${nextButtonStyles.className}`}
                                              isDisabled={isNextButtonDisabled() || isSubmitting}
                                              onClick={handleReviewAndSubmit}
                                          >
                                              {isSubmitting ? 'Submitting...' : 'Review & Submit'}
                                          </ActionButton>
                                      </div>
                                  )
                                : categoryIdsFromUrl.length > 1 && (
                                      <div>
                                          <ActionButton
                                              bgColor={nextButtonStyles.bgColor}
                                              textColor="text-white"
                                              width="auto"
                                              className={`btn_next_previous font-ubuntu ${nextButtonStyles.className}`}
                                              isDisabled={isNextButtonDisabled()}
                                              onClick={handleNext}
                                          >
                                              Next
                                          </ActionButton>
                                      </div>
                                  )}
                        </div>
                    )}
                </div>
            </div>
            {notification.show && <SuccessNotification message={notification.message} type={notification.type} className="mt-4" />}
        </>
    );
}
