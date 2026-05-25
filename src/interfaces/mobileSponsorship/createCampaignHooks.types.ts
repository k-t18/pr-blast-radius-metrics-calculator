import type React from 'react';
import type { DropdownOption } from '../../components/common/Dropdown';
import type { MultiSelectOption } from '../../components/form-fields/multiSelect';
import type { SquareDataByTypeAndRow } from './createCampaignContextTypes';
import type { BaseRateResponse } from '../../services/sponsor_api/getBaseRate.api';

// ============================================================================
// useSponsorshipSquaresModal Hook Types
// ============================================================================

/**
 * Square type option with icon for dropdown display
 */
export interface SquareTypeOption extends DropdownOption {
    icon: React.ReactNode;
}

/**
 * Parameters for the useSponsorshipSquaresModal hook
 */
export interface UseSponsorshipSquaresModalParameters {
    visible: boolean;
    squareDataByTypeAndRow: SquareDataByTypeAndRow;
    onAdd?: (data: { squareType: string; row: number; quantity: number; unitPrice?: string; minReward?: string }) => void;
    onHide: () => void;
}

/**
 * Return type for the useSponsorshipSquaresModal hook
 */
export interface UseSponsorshipSquaresModalReturn {
    // Form state
    selectedSquareType: SquareTypeOption | undefined;
    setSelectedSquareType: React.Dispatch<React.SetStateAction<SquareTypeOption | undefined>>;
    selectedRow: DropdownOption | undefined;
    setSelectedRow: React.Dispatch<React.SetStateAction<DropdownOption | undefined>>;
    quantity: string;
    setQuantity: React.Dispatch<React.SetStateAction<string>>;

    // Options
    squareTypeOptions: SquareTypeOption[];
    rowOptions: DropdownOption[];

    // Computed values
    availableSquares: number | '-';
    minReward: number | string | '-';
    isLoadingSquareTypeModalData: boolean;

    // Handlers
    handleIncrement: () => void;
    handleDecrement: () => void;
    handleAdd: (event?: React.MouseEvent<HTMLButtonElement>) => void;

    // Templates
    squareTypeOptionTemplate: (option: SquareTypeOption) => React.ReactNode;
    squareTypeValueTemplate: (option: SquareTypeOption | null | undefined) => React.ReactNode;
}

// ============================================================================
// useCreateCampaignActions Hook Types
// ============================================================================

/**
 * Parameters for the useCreateCampaignActions hook
 */
export interface UseCreateCampaignActionsParameters {
    categoryIdsFromUrl: string[];
    allCategoriesData: Array<{ id: string; title: string }>;
    nextId?: string;
    handleNext?: () => void;
    selectedBlanketOrderId: string | null;
}

/**
 * Styles for the Next button
 */
export interface NextButtonStyles {
    bgColor: string;
    className: string;
}

/**
 * State for notification display
 */
export interface NotificationState {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

/**
 * Return type for the useCreateCampaignActions hook
 */
export interface UseCreateCampaignActionsReturn {
    notification: NotificationState;
    isSubmitting: boolean;
    isCategoryFullyFilled: boolean;
    isCategoryCompleted: boolean;
    isReviewModalOpen: boolean;
    isSuccessModalOpen: boolean;
    handleSaveCategory: () => void;
    handleReviewAndSubmit: () => void;
    handleConfirmSubmit: () => Promise<void>;
    handleCloseReviewModal: () => void;
    handleCloseSuccessModal: () => void;
    getNextButtonStyles: () => NextButtonStyles;
    isNextButtonDisabled: () => boolean;
}

// ============================================================================
// useBaseRateLogic Hook Types
// ============================================================================

/**
 * Parameters for the useBaseRateLogic hook
 */
export interface UseBaseRateLogicParameters {
    targetAudience: string | undefined;
    budget: number;
    objective: string | undefined;
    objectivesToFetch: string[];
}

/**
 * Return type for the useBaseRateLogic hook
 */
export interface UseBaseRateLogicReturn {
    // Consolidated rates (automatically selects best available: updated > budget > initial)
    visibilityRate: BaseRateResponse | undefined;
    engagementRate: BaseRateResponse | undefined;

    // Base rates (from initial API call)
    baseCPMRate: number | undefined;
    baseCPCRate: number | undefined;

    // New rates from API (from any rate source)
    newCPMRateFromApi: number | undefined;
    newCPCRateFromApi: number | undefined;

    // Target metrics (impressions/clicks when budget is provided)
    targetImpressions: number;
    targetClicks: number;

    // Helper flags
    canFetchInitialRates: boolean;
    hasTargetAudience: boolean;
    hasBudget: boolean;
    hasBudgetAndTargetAudience: boolean;
}

/**
 * Objective type for sponsorship campaigns
 */
export type ObjectiveType = 'Visibility' | 'Engagement';

/**
 * Rate parameters for fetching initial and updated rates
 */
export interface RateParameters {
    initial:
        | {
              item_code: string;
              sponsorship_objective: ObjectiveType;
          }
        | undefined;
    updated:
        | {
              item_code: string;
              sponsorship_objective: ObjectiveType;
              target_audience?: string;
              budget?: number;
          }
        | undefined;
    shouldFetchInitial: boolean;
}

// ============================================================================
// useApplySavedFilters Hook Types
// ============================================================================

/**
 * Type for storing state before saved filters are applied
 */
export type StateBeforeSavedFilters = {
    selectedFilters: Set<string>;
    fieldValues: Record<string, DropdownOption | undefined | MultiSelectOption[] | string | number>;
};

/**
 * Return type for useApplySavedFiltersLogic hook
 */
export interface UseApplySavedFiltersReturn {
    /** Whether the "Apply saved filters" checkbox is checked */
    saveFilters: boolean;
    /** Function to toggle the saved filters checkbox */
    setSaveFilters: (checked: boolean) => void;
    /** Function to clear all filters and reset saved filters state */
    clearFilters: () => void;
    /** Loading state for fetching saved filters */
    isLoadingSavedFilters: boolean;
    /** Error from fetching saved filters, if any */
    savedFiltersError: Error | null;
}

// ============================================================================
// CampaignActions Component Types
// ============================================================================

/**
 * Properties for the CampaignActions component
 */
export interface CampaignActionsProperties {
    notification: NotificationState;
    isSubmitting: boolean;
    isCategoryFullyFilled: boolean;
    isCategoryCompleted: boolean;
    isLastStep: boolean;
    categoryIdsFromUrl: string[];
    previousId?: string;
    handleSaveCategory: () => void;
    handleReviewAndSubmit: () => void;
    handleNext: () => void;
    handlePrevious: () => void;
    getNextButtonStyles: () => { bgColor: string; className: string };
    isNextButtonDisabled: () => boolean;
}
