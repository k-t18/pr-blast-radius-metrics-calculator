import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useCreateCampaignContext } from '../context/createCampaignContext';

/**
 * Custom hook for managing step collapse/expand state and completion
 * Handles the common pattern of collapsing steps after saving and marking them as completed
 *
 * @param stepNumber - The step number to mark as completed (1-5)
 * @returns Object containing collapse state and handlers
 */
const useStepCollapseLogic = (stepNumber: number) => {
    // Step collapse/expand state - tracks if the step is collapsed
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Get context functions for marking/unmarking steps as completed
    const { markSubStepAsCompleted, unmarkSubStepAsCompleted, currentCategoryId, completedSubSteps } = useCreateCampaignContext();

    // Reset collapse state when category changes (new category should start with expanded steps)
    useEffect(() => {
        setIsCollapsed(false);
    }, [currentCategoryId]);

    // Track previous completion state to detect when step is unmarked
    const previousIsCompletedReference = useRef<boolean>(false);

    // Check if this step is already completed
    const isStepCompleted = useMemo(() => {
        if (!currentCategoryId) {
            previousIsCompletedReference.current = false;
            return false;
        }
        return completedSubSteps.has(stepNumber);
    }, [currentCategoryId, completedSubSteps, stepNumber]);

    // Expand step when it's unmarked (changes from completed to not completed)
    // This handles cases where filters are cleared or applied from useRightSidebarSectionLogic
    // Use requestAnimationFrame to schedule expansion after render to avoid calling setState during render
    const wasCompleted = previousIsCompletedReference.current;
    if (wasCompleted && !isStepCompleted) {
        // Schedule expansion for after render
        requestAnimationFrame(() => {
            setIsCollapsed(false);
        });
    }
    previousIsCompletedReference.current = isStepCompleted;

    /**
     * Handles saving the current step and marking it as completed
     * Collapses the step UI and marks the step as completed for the current category
     * This is called when the user clicks "Save & Continue"
     */
    const handleSaveAndContinue = useCallback(() => {
        setIsCollapsed(true);
        // Mark the step as completed for the current category
        if (currentCategoryId) {
            markSubStepAsCompleted(currentCategoryId, stepNumber);
        }
    }, [markSubStepAsCompleted, currentCategoryId, stepNumber]);

    /**
     * Handles editing the step (expanding it after it was collapsed)
     * This is called when the user clicks the edit button
     * Unmarks the step as completed when editing, so progress decreases
     */
    const handleEdit = useCallback(() => {
        setIsCollapsed(false);
        // Unmark the step as completed when editing, so progress decreases
        if (currentCategoryId && isStepCompleted) {
            unmarkSubStepAsCompleted(currentCategoryId, stepNumber);
        }
    }, [currentCategoryId, isStepCompleted, unmarkSubStepAsCompleted, stepNumber]);

    // Expose setIsCollapsed so parent components can expand the step programmatically
    const expandStep = useCallback(() => {
        setIsCollapsed(false);
    }, []);

    return {
        isCollapsed,
        handleSaveAndContinue,
        handleEdit,
        isStepCompleted,
        expandStep,
    };
};

export default useStepCollapseLogic;
