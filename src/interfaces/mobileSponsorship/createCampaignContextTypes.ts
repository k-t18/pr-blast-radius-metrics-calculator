/**
 * This file contains all type definitions used by the Create Campaign Context.
 * Types are extracted to a separate file to improve readability and maintainability.
 */

import type { DropdownOption } from '../../components/common/Dropdown';
import type { MultiSelectOption } from '../../components/form-fields/multiSelect';

// ============================================================================
// Type Definitions
// ============================================================================

/** Set of selected filter IDs */
export type SelectedFilters = Set<string>;

/** Union type for all possible field values in forms */
export type FieldValue = DropdownOption | undefined | MultiSelectOption[] | string | number;

/** State object mapping field names to their values */
export type FieldValuesState = Record<string, FieldValue>;

// ============================================================================
// Data Interfaces
// ============================================================================

/**
 * Represents a selected square in the campaign grid
 * Used for tracking which squares have been selected by the user
 */
export interface SquareData {
    id: string;
    squareType: string;
    row: number;
    unitSalesPrice: number;
    rewardValue: number;
    minReward: number;
}

/**
 * Data structure for square availability and pricing by type and row
 * Used to display available squares and their pricing information
 */
export interface SquareTypeRowData {
    available: number;
    unitPrice: string;
    minReward: string;
}

/**
 * Nested record structure: squareType -> row -> SquareTypeRowData
 * Organizes square data by type and row for efficient lookup
 */
export type SquareDataByTypeAndRow = Record<string, Record<number, SquareTypeRowData>>;

/**
 * Represents a leaderboard ranking position with pricing and reward information
 * Positions are typically 1-5 (top 5 rankings)
 */
export interface LeaderboardRanking {
    id: string;
    itemCode: string;
    itemName: string;
    position: number;
    unitSalesPrice: number;
    rewardValue: number;
    minReward: number;
    isSelected: boolean;
    status: 'Available' | 'Booked';
}

/**
 * Represents a specific week in the weekly leaderboard campaign
 */
export interface LeaderboardWeek {
    id: string;
    startDate: string;
    endDate: string;
    rankings: LeaderboardRanking[];
    isSaved: boolean;
}

/**
 * Weekly leaderboard campaign configuration
 * Contains the leaderboard-specific settings for a campaign
 */
export interface WeeklyLeaderboardData {
    weeks: LeaderboardWeek[];
    durationDays?: number;
}

/**
 * Derived metrics calculated/fetched in the Right Sidebar
 * Stored in context to avoid re-fetching in Review Modal
 */
export interface DerivedMetrics {
    audienceReach?: number;
    baseCPMRate?: number;
    baseCPCRate?: number;
    newCPMRate?: number;
    newCPCRate?: number;
    targetImpressions: number;
    targetClicks: number;
}

// ============================================================================
// Category Data Structure
// ============================================================================

/**
 * Complete data structure for a single campaign category
 * Each category maintains its own isolated state including filters, field values,
 * selected squares, completion status, and all campaign-specific fields
 */
export interface CategoryData {
    /** Set of filter IDs that have been selected for this category */
    selectedFilters: SelectedFilters;

    /** All form field values for this category */
    fieldValues: FieldValuesState;

    /** Array of squares that have been selected in the grid */
    selectedSquares: SquareData[];

    /** Set of completed sub-step numbers (used for progress tracking) */
    completedSubSteps: Set<number>;

    /** Whether this category has been marked as completed */
    isCompleted: boolean;

    /** Total number of steps for this category (for dynamic progress calculation) */
    totalSteps: number;

    // Step 1 (Ads)
    /** Campaign name entered by the user */
    campaignName: string;

    // Step 3
    /** Campaign objective selected by the user */
    objective: string;

    // Step 4
    /** Budget amount for the campaign */
    budget: number;

    // Step 5
    /** Campaign start date */
    startDate: string;

    /** Campaign duration option */
    duration: DropdownOption | undefined;

    // Weekly Leaderboard
    /** Weekly leaderboard specific configuration */
    weeklyLeaderboardData: WeeklyLeaderboardData;

    /** Derived metrics (reach, rates, engagement) */
    derivedMetrics: DerivedMetrics;
}

/**
 * Global state structure mapping category IDs to their respective data
 * This allows managing multiple categories independently within a single context
 */
export type GlobalState = Record<string, CategoryData>;

// ============================================================================
// Context Interface
// ============================================================================

/**
 * Complete interface for the Create Campaign Context value
 * Provides access to all state and methods needed for managing campaign creation
 *
 * Note: All state values are for the CURRENT category (derived from currentCategoryId)
 */
export interface CreateCampaignContextValue {
    // ========================================================================
    // Filter and Field Management
    // ========================================================================

    /** Selected filter IDs for the current category */
    selectedFilters: SelectedFilters;

    /** Setter for selected filters (supports functional updates) */
    setSelectedFilters: (value: SelectedFilters | ((previous: SelectedFilters) => SelectedFilters)) => void;

    /** All form field values for the current category */
    fieldValues: FieldValuesState;

    /** Setter for field values (supports functional updates) */
    setFieldValues: (value: FieldValuesState | ((previous: FieldValuesState) => FieldValuesState)) => void;

    // ========================================================================
    // Square Selection
    // ========================================================================

    /** Selected squares for the current category */
    selectedSquares: SquareData[];

    /** Square data organized by type and row for display purposes */
    squareDataByTypeAndRow: SquareDataByTypeAndRow;

    /** Setter for square data by type and row */
    setSquareDataByTypeAndRow: React.Dispatch<React.SetStateAction<SquareDataByTypeAndRow>>;

    // ========================================================================
    // Campaign Fields
    // ========================================================================

    /** Campaign name */
    campaignName: string;

    /** Generic updater function for category data */
    updateCategoryData: (updater: (previous: CategoryData) => CategoryData) => void;

    /** Campaign objective */
    objective: string;

    /** Campaign budget */
    budget: number;

    /** Campaign start date */
    startDate: string;

    /** Campaign duration */
    duration: DropdownOption | undefined;

    // ========================================================================
    // Weekly Leaderboard
    // ========================================================================

    /** Weekly leaderboard configuration for the current category */
    weeklyLeaderboardData: WeeklyLeaderboardData;

    // ========================================================================
    // Derived Metrics
    // ========================================================================

    /** Derived metrics for the current category */
    derivedMetrics: DerivedMetrics;

    // ========================================================================
    // Category Management
    // ========================================================================

    /** ID of the currently active category */
    currentCategoryId: string;

    /** Set of completed sub-step numbers for the current category */
    completedSubSteps: Set<number>;

    /** Marks a specific sub-step as completed for a category */
    markSubStepAsCompleted: (categoryId: string, subStepNumber: number) => void;

    /** Unmarks a specific sub-step as completed for a category (also resets isCompleted to false) */
    unmarkSubStepAsCompleted: (categoryId: string, subStepNumber: number) => void;

    /** Calculates and returns the progress percentage for a category (0-100) */
    getCategoryProgress: (categoryId: string) => number;

    /** Sets the total number of steps for a category (used for progress calculation) */
    setTotalSteps: (categoryId: string, totalSteps: number) => void;

    /** Marks the current category as completed */
    saveCategory: () => void;

    /** Whether the current category has been marked as completed */
    isCategoryCompleted: boolean;

    /** Whether all sub-steps for the current category are filled (enables Save Campaign button) */
    isCategoryFullyFilled: boolean;

    /** Checks if all specified categories are completed */
    checkAllCategoriesCompleted: (categoryIds: string[]) => boolean;

    // ========================================================================
    // Data Access
    // ========================================================================

    /** Returns all category data (useful for API submission) */
    getAllCategoryData: () => GlobalState;

    // ========================================================================
    // Navigation
    // ========================================================================

    /** Optional callback fired when the step changes */
    onStepChange?: (stepId: string) => void;

    // ========================================================================
    // Category Unlocking
    // ========================================================================

    /** Set of category IDs that are unlocked and can be accessed */
    enabledCategories: Set<string>;

    /** Unlocks a category, allowing it to be accessed */
    enableCategory: (categoryId: string) => void;

    /** Checks if a category is enabled (current category is always considered enabled) */
    isCategoryEnabled: (categoryId: string) => boolean;
}
