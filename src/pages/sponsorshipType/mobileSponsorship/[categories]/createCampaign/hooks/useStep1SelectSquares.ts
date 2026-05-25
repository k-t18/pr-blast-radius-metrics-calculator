import { useState, useCallback, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useCreateCampaignContext, type SquareData } from '../context/createCampaignContext';
import useStepCollapse from './useStepCollapseLogic';

interface SquaresFormData {
    squares: SquareData[];
}

// Helper: Capitalize first letter of string
const capitalizeFirst = (string_: string | undefined): string => {
    if (!string_ || typeof string_ !== 'string') return '';
    return string_.charAt(0).toUpperCase() + string_.slice(1);
};

// Helper: Parse comma-separated number string to integer
const parseNumber = (value?: string): number => {
    if (!value) return 0;
    return Number.parseInt(value.replaceAll(',', ''), 10) || 0;
};

const DEFAULT_SQUARES: SquareData[] = [];

export default function useStep1SelectSquares() {
    const { squareDataByTypeAndRow, updateCategoryData, selectedSquares, currentCategoryId, unmarkSubStepAsCompleted } = useCreateCampaignContext();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { isCollapsed, handleSaveAndContinue, handleEdit, isStepCompleted } = useStepCollapse(1);

    const { control, setValue } = useForm<SquaresFormData>({
        defaultValues: {
            squares: selectedSquares.length > 0 ? selectedSquares : [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'squares',
    });

    const squares = useWatch({ control, name: 'squares', defaultValue: DEFAULT_SQUARES });

    // Wrapper for remove that checks if squares are cleared and unmarks step
    const handleRemove = useCallback(
        (index: number) => {
            // Check if this is the last square (after removal, array will be empty)
            if (squares.length === 1 && isStepCompleted && currentCategoryId) {
                unmarkSubStepAsCompleted(currentCategoryId, 1);
            }
            remove(index);
        },
        [remove, squares.length, isStepCompleted, currentCategoryId, unmarkSubStepAsCompleted]
    );

    const handleOpenModal = useCallback(() => {
        setIsModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleAddFromModal = useCallback(
        (data: { squareType: string; row: number; quantity: number; unitPrice?: string; minReward?: string }) => {
            const squareType = capitalizeFirst(data.squareType);
            const unitSalesPrice = parseNumber(data.unitPrice);
            let minRewardValue = parseNumber(data.minReward);
            // Fallback for testing if minReward is 0
            if (minRewardValue === 0) {
                minRewardValue = 10_000;
            }

            const timestamp = Date.now();

            // Add multiple squares based on quantity
            for (let index = 0; index < data.quantity; index++) {
                append({
                    id: `${timestamp}-${index}`,
                    squareType,
                    row: data.row,
                    unitSalesPrice,
                    rewardValue: minRewardValue, // Initialize with minimum
                    minReward: minRewardValue,
                });
            }
        },
        [append]
    );

    const handleSquareChange = useCallback(
        (index: number, field: keyof SquareData, value: string | number) => {
            setValue(`squares.${index}.${field}`, value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        },
        [setValue]
    );

    // Calculate totals using useMemo for performance
    const { subtotalUnitSales, subtotalRewardValue, total, isValid } = useMemo(() => {
        const currentSquares = squares || [];
        const unitSales = currentSquares.reduce((sum, square) => sum + (Number(square.unitSalesPrice) || 0), 0);
        const rewards = currentSquares.reduce((sum, square) => sum + (Number(square.rewardValue) || 0), 0);
        const allValid = currentSquares.every(square => {
            const reward = Number(square.rewardValue);
            const min = Number(square.minReward);
            return reward >= min;
        });

        return {
            subtotalUnitSales: unitSales,
            subtotalRewardValue: rewards,
            total: unitSales + rewards,
            isValid: allValid && currentSquares.length > 0,
        };
    }, [squares]);

    const handleOnSave = useCallback(() => {
        if (isValid) {
            updateCategoryData(previous => ({ ...previous, selectedSquares: squares }));
            handleSaveAndContinue();
        }
    }, [isValid, squares, updateCategoryData, handleSaveAndContinue]);

    return {
        // Form state
        fields,
        squares,
        control,
        // Modal state
        isModalVisible,
        handleOpenModal,
        handleCloseModal,
        // Handlers
        handleAddFromModal,
        handleSquareChange,
        handleOnSave,
        remove: handleRemove,
        // Computed values
        subtotalUnitSales,
        subtotalRewardValue,
        total,
        isValid,
        // Step collapse state
        isCollapsed,
        handleEdit,
        isStepCompleted,
        // Context data
        squareDataByTypeAndRow,
    };
}
