import { useState, useCallback, useMemo } from 'react';
import { useCreateCampaignContext } from '../context/createCampaignContext';
import { useSubmitMobileGameCampaignData } from '../../../../../../hooks/mobileSponsorship/useSubmitMobileGameCampaignData';
import { transformCampaignDataToCreateQuotation } from '../utils/transformCampaignDataToCreateQuotation';
import { useTargetAudienceFilterData } from '../../../../../../hooks/mobileSponsorship/useTargetAudienceFilterData';
import type {
    UseCreateCampaignActionsParameters,
    UseCreateCampaignActionsReturn,
    NextButtonStyles,
    NotificationState,
} from '../../../../../../interfaces/mobileSponsorship/createCampaignHooks.types';

/**
 * Custom hook for managing campaign submission logic and button states
 * Handles saving categories, submitting quotations, and button state management
 */
export function useCreateCampaignActions({
    categoryIdsFromUrl,
    allCategoriesData,
    nextId,
    selectedBlanketOrderId,
}: UseCreateCampaignActionsParameters): UseCreateCampaignActionsReturn {
    const { isCategoryFullyFilled, saveCategory, isCategoryCompleted, getAllCategoryData, checkAllCategoriesCompleted } = useCreateCampaignContext();
    const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'success' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const { submitCampaignDataAsync } = useSubmitMobileGameCampaignData();
    const { targetAudienceFilterData } = useTargetAudienceFilterData();
    const isLastStep = !nextId;

    const handleSaveCategory = useCallback(() => {
        saveCategory();
        setNotification({ show: true, message: 'Campaign saved', type: 'success' });
    }, [saveCategory]);

    const handleReviewAndSubmit = useCallback(() => {
        // Check if all categories are completed
        if (!checkAllCategoriesCompleted(categoryIdsFromUrl)) {
            // eslint-disable-next-line no-console
            console.error('Not all categories are completed');
            return;
        }
        setIsReviewModalOpen(true);
    }, [checkAllCategoriesCompleted, categoryIdsFromUrl]);

    const handleCloseReviewModal = useCallback(() => {
        setIsReviewModalOpen(false);
    }, []);

    const handleCloseSuccessModal = useCallback(() => {
        setIsSuccessModalOpen(false);
    }, []);

    const handleConfirmSubmit = useCallback(async () => {
        setIsSubmitting(true);
        try {
            // Create map of category ID to item code
            const categoryIdToItemCode = new Map<string, string>(allCategoriesData.map(category => [category.id, category.title]));

            // Get all category data
            const globalState = getAllCategoryData();

            // Transform data to API format
            const items = transformCampaignDataToCreateQuotation(
                globalState,
                categoryIdsFromUrl,
                categoryIdToItemCode,
                targetAudienceFilterData,
                selectedBlanketOrderId
            );

            // Submit quotation
            const response = await submitCampaignDataAsync({
                docstatus: 1,
                custom_game_format: 'Mobile Game',
                doctype: 'Quotation',
                blanket_order: selectedBlanketOrderId ?? undefined,
                items,
            });

            // Extract success message from API response
            // Response structure: { status: "success", data: { status: "success", message: "...", quotation_name: "..." }, message: "..." }
            let successMessage = 'Quotation created successfully';
            // Handle nested data structure - response.data contains the actual quotation data
            if (response?.data) {
                const responseData = response.data;
                if (responseData.message) {
                    successMessage = responseData.message;
                    if (responseData.quotation_name) {
                        successMessage += ` - ${responseData.quotation_name}`;
                    }
                }
            } else if (response?.message) {
                successMessage = response.message;
            }

            // Show success notification
            setNotification({ show: true, message: successMessage, type: 'success' });

            // Close review modal and open success modal
            setIsReviewModalOpen(false);
            setIsSuccessModalOpen(true);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error submitting quotation:', error);

            // Extract error message
            let errorMessage = 'Failed to submit quotation. Please try again.';
            if (error && typeof error === 'object' && 'message' in error) {
                errorMessage = String(error.message);
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Show error notification
            setNotification({ show: true, message: errorMessage, type: 'error' });
            setIsReviewModalOpen(false); // Close modal on error so user can retry or fix
        } finally {
            setIsSubmitting(false);
        }
    }, [categoryIdsFromUrl, allCategoriesData, getAllCategoryData, targetAudienceFilterData, submitCampaignDataAsync, selectedBlanketOrderId]);

    // Determine button state for Review & Submit / Next button
    const getNextButtonStyles = useMemo(
        () => (): NextButtonStyles => {
            if (isLastStep) {
                // For last step (Review & Submit):
                // Only enable if category is completed (Save Campaign was clicked)
                // AND category is still fully filled (no steps were edited after saving)
                // This ensures Review & Submit is only enabled AFTER Save Campaign is clicked
                const isEnabled = isCategoryCompleted && isCategoryFullyFilled;
                return {
                    bgColor: isEnabled ? 'bg-brand-500' : 'var(--color-gray-600)',
                    className: isEnabled ? '' : 'cursor-not-allowed opacity-50',
                };
            }
            // For Next button (not last step), enable when category is completed
            const isEnabled = isCategoryCompleted && nextId;
            return {
                bgColor: isEnabled ? 'bg-brand-500' : 'var(--color-gray-600)',
                className: isEnabled ? '' : 'cursor-not-allowed opacity-50',
            };
        },
        [isLastStep, isCategoryCompleted, isCategoryFullyFilled, nextId]
    );

    const isNextButtonDisabled = useMemo(
        () => () => {
            if (isLastStep) {
                // For last step (Review & Submit):
                // Disable if category is NOT completed (Save Campaign not clicked yet)
                // OR if category is not fully filled (step was edited after saving)
                // This ensures Review & Submit is ONLY enabled after Save Campaign is clicked
                return !isCategoryCompleted || !isCategoryFullyFilled;
            }
            // For Next button, disable if category is not completed or no next category
            return !isCategoryCompleted || !nextId;
        },
        [isLastStep, isCategoryCompleted, isCategoryFullyFilled, nextId]
    );

    return {
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
    };
}

export default useCreateCampaignActions;
