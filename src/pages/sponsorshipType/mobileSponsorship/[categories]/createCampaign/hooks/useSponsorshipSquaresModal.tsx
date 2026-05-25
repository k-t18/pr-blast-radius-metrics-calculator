import React, { useState, useEffect, useMemo } from 'react';
import type { DropdownOption } from '../../../../../../components/common/Dropdown';
import { Crown, Lightning, Gift, Gear, Square, Rectangle } from '../../../../../../components/icons';
import { useSquareTypeAndRowList } from '../../../../../../hooks/mobileSponsorship/useSquareTypeAndRowList';
import { useSquareTypeModalData } from '../../../../../../hooks/mobileSponsorship/useSquareTypeModalData';
import type {
    SquareTypeOption,
    UseSponsorshipSquaresModalParameters,
    UseSponsorshipSquaresModalReturn,
} from '../../../../../../interfaces/mobileSponsorship/createCampaignHooks.types';

// Re-export SquareTypeOption for backward compatibility
export type { SquareTypeOption } from '../../../../../../interfaces/mobileSponsorship/createCampaignHooks.types';

/**
 * Get icon for a square type based on its name (case-insensitive)
 * Icons and colors are hardcoded as per requirements
 */
const getSquareTypeIcon = (name: string): React.ReactNode => {
    const normalizedName = name.toLowerCase();
    switch (normalizedName) {
        case 'vantage': {
            return <Crown size={16} color="#707070" />;
        }
        case 'chance': {
            return <Lightning size={16} color="#707070" />;
        }
        case 'gift': {
            return <Gift size={16} color="#707070" />;
        }
        case 'brainiac':
        case 'braniac': {
            return <Gear size={16} color="#707070" />;
        }
        case 'standard': {
            return <Square size={16} color="#707070" />;
        }
        case 'pit': {
            return <Rectangle size={16} color="#000000" weight="fill" />;
        }
        default: {
            // Default icon for unknown types
            return <Square size={16} color="#707070" />;
        }
    }
};

/**
 * Custom hook for managing sponsorship squares modal logic
 * Handles form state, API data fetching, validation, and submission
 */
export function useSponsorshipSquaresModal({
    visible,
    squareDataByTypeAndRow,
    onAdd,
    onHide,
}: UseSponsorshipSquaresModalParameters): UseSponsorshipSquaresModalReturn {
    // Form state: Track user selections for square type, row, and quantity
    const [selectedSquareType, setSelectedSquareType] = useState<SquareTypeOption | undefined>();
    const [selectedRow, setSelectedRow] = useState<DropdownOption | undefined>();
    const [quantity, setQuantity] = useState<string>('1');

    // Fetch square types and rows from API only when modal is visible
    const { squareTypeAndRowListData } = useSquareTypeAndRowList(visible);

    // Map API data to square type options with icons
    const squareTypeOptions: SquareTypeOption[] = useMemo(() => {
        if (!squareTypeAndRowListData?.square_types) {
            return [];
        }
        return squareTypeAndRowListData.square_types.map(squareType => ({
            label: squareType.name,
            value: squareType.name,
            icon: getSquareTypeIcon(squareType.name),
        }));
    }, [squareTypeAndRowListData]);

    // Map API data to row options
    const rowOptions: DropdownOption[] = useMemo(() => {
        if (!squareTypeAndRowListData?.rows) {
            return [];
        }
        return squareTypeAndRowListData.rows.map(row => ({
            label: row.name,
            value: Number.parseInt(row.name, 10),
        }));
    }, [squareTypeAndRowListData]);

    /**
     * Extract actual values from selections
     * PrimeReact Dropdown can return either raw values (string/number) or option objects,
     * so we normalize them to get the actual values for API calls
     */
    const squareTypeKey = typeof selectedSquareType === 'string' ? selectedSquareType : (selectedSquareType as SquareTypeOption)?.value;
    const rowKey = typeof selectedRow === 'number' ? selectedRow : (selectedRow as DropdownOption)?.value;

    // Fetch game board cell data when modal is visible, square type and row are selected
    const { squareTypeModalData, isLoading: isLoadingSquareTypeModalData } = useSquareTypeModalData(
        squareTypeKey && typeof rowKey === 'number'
            ? {
                  square_type: String(squareTypeKey),
                  row_position: rowKey,
              }
            : undefined,
        visible && Boolean(squareTypeKey && typeof rowKey === 'number')
    );

    /**
     * Get existing data for selected square type and row from context
     * This is used as a fallback when API data is not yet loaded
     */
    const currentData = squareTypeKey && typeof rowKey === 'number' ? squareDataByTypeAndRow[squareTypeKey]?.[rowKey] : undefined;

    /**
     * Display values: Prefer API data, fallback to context data, or show '-' if unavailable
     * - availableSquares: Total number of squares available for the selected type/row
     * - minReward: Minimum reward value for each square
     */
    const availableSquares = squareTypeModalData?.total_position ?? currentData?.available ?? '-';
    const minReward = squareTypeModalData?.minimum_reward_rate ?? currentData?.minReward ?? '-';

    /**
     * Effect 1: Reset form state when modal closes or square type changes
     * - When modal closes: Reset all form fields (square type, row, quantity)
     * - When square type changes: Reset dependent fields (row, quantity) since row options may differ
     */
    useEffect(() => {
        if (!visible) {
            // Modal closed: Reset all form state
            // eslint-disable-next-line unicorn/no-useless-undefined
            setSelectedSquareType(undefined);
            // eslint-disable-next-line unicorn/no-useless-undefined
            setSelectedRow(undefined);
            setQuantity('1');
        } else if (selectedSquareType) {
            // Square type changed: Reset dependent fields (row becomes invalid, quantity resets)
            // eslint-disable-next-line unicorn/no-useless-undefined
            setSelectedRow(undefined);
            setQuantity('1');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, selectedSquareType]);

    /**
     * Effect 2: Validate and adjust quantity when row or available squares change
     * - Ensures quantity doesn't exceed available squares for the selected row
     * - Ensures quantity is at least 1
     */
    useEffect(() => {
        if (selectedRow && squareTypeModalData) {
            const currentQuantity = Number.parseInt(quantity, 10) || 0;
            const maxAvailable = squareTypeModalData.total_position;
            if (currentQuantity > maxAvailable) {
                setQuantity(String(maxAvailable));
            } else if (currentQuantity < 1) {
                setQuantity('1');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRow, squareTypeModalData]);

    /**
     * Quantity input handlers
     * - handleIncrement: Increase quantity by 1, respecting max available squares
     * - handleDecrement: Decrease quantity by 1, minimum value is 1
     */
    const handleIncrement = () => {
        const current = Number.parseInt(quantity, 10) || 0;
        const max = typeof availableSquares === 'number' ? availableSquares : Number.POSITIVE_INFINITY;
        if (current < max) {
            setQuantity(String(current + 1));
        }
    };

    const handleDecrement = () => {
        const current = Number.parseInt(quantity, 10) || 0;
        if (current > 1) {
            setQuantity(String(current - 1));
        }
    };

    /**
     * Handle "Add" button click: Validate form and submit square selection
     * - Validates all required fields are selected
     * - Parses and validates quantity is a positive number
     * - Extracts values from selections (handles both raw values and option objects)
     * - Calls onAdd callback with formatted data
     * - Closes modal after successful submission
     */
    const handleAdd = (event?: React.MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault();
        event?.stopPropagation();

        // Validate required fields
        if (!selectedSquareType || !selectedRow || !quantity) {
            return;
        }

        // Parse and validate quantity
        const parsedQuantity = Number.parseInt(quantity, 10);
        if (Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
            return;
        }

        // Extract values - PrimeReact returns raw values (string/number) or option objects
        const squareTypeValue = typeof selectedSquareType === 'string' ? selectedSquareType : (selectedSquareType as SquareTypeOption)?.value;
        const rowValue = typeof selectedRow === 'number' ? selectedRow : (selectedRow as DropdownOption)?.value;

        if (!squareTypeValue || rowValue === undefined || rowValue === null) {
            return;
        }

        // Prepare data and add squares
        // Use API data if available, otherwise fallback to currentData
        const finalMinReward = squareTypeModalData?.minimum_reward_rate ?? currentData?.minReward;
        onAdd?.({
            squareType: String(squareTypeValue),
            row: Number(rowValue),
            quantity: parsedQuantity,
            unitPrice: currentData?.unitPrice,
            minReward: finalMinReward ? String(finalMinReward) : undefined,
        });

        onHide();
    };

    /**
     * Custom dropdown templates for square type selection
     * - squareTypeOptionTemplate: Renders each option in the dropdown list with icon and label
     * - squareTypeValueTemplate: Renders the selected value in the dropdown input with icon and label
     */
    const squareTypeOptionTemplate = (option: SquareTypeOption) => {
        return (
            <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
            </div>
        );
    };

    const squareTypeValueTemplate = (option: SquareTypeOption | null | undefined) => {
        if (!option) return <span>Square Type</span>;
        return (
            <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
            </div>
        );
    };

    return {
        // Form state
        selectedSquareType,
        setSelectedSquareType,
        selectedRow,
        setSelectedRow,
        quantity,
        setQuantity,

        // Options
        squareTypeOptions,
        rowOptions,

        // Computed values
        availableSquares,
        minReward,
        isLoadingSquareTypeModalData,

        // Handlers
        handleIncrement,
        handleDecrement,
        handleAdd,

        // Templates
        squareTypeOptionTemplate,
        squareTypeValueTemplate,
    };
}
