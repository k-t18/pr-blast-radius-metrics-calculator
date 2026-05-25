import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import type { NGOItem } from '../../../../interfaces/ngo/ngo.types';
import type { MultiSelectOption } from '../../../../components/form-fields/multiSelect/MultiSelect';
import type { CSRFormData, SavedCSRData } from './types/csrContribution.types';
import { transformSavedDataToFormData, transformFormDataToSaveFormat } from './utils/TransformSavedData';
import {
    ContributionScopeSection,
    ContributionAmountSection,
    NGOSelectionSection,
    SplitMethodSection,
    NGOReceivesSection,
    CSRSummary,
} from './components';

interface CSRContributionProperties {
    totalOrderAmount: number;
    ngoList: NGOItem[];
    onProgress?: (value: number) => void;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    handleSaveCSRContribution: (data: any) => void;
    initialValues?: SavedCSRData[];
}

function CSRContribution({ totalOrderAmount, ngoList, onProgress, handleSaveCSRContribution, initialValues }: CSRContributionProperties) {
    const defaultFormData = useMemo(
        () => transformSavedDataToFormData(initialValues, ngoList, totalOrderAmount),
        [initialValues, ngoList, totalOrderAmount]
    );

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CSRFormData>({
        mode: 'onChange',
        defaultValues: {
            contributeOnTotalOrder: defaultFormData.contributeOnTotalOrder || '',
            contributionType: defaultFormData.contributionType || '',
            contributionValue: defaultFormData.contributionValue || 0,
            selectedNGOs: defaultFormData.selectedNGOs || [],
            allowChancesToSelect: defaultFormData.allowChancesToSelect || false,
            splitMethod: defaultFormData.splitMethod || 'equally',
            ngoAmounts: defaultFormData.ngoAmounts || {},
            ngoPercentages: defaultFormData.ngoPercentages || {},
        },
    });

    // Reset form when initialValues change
    useEffect(() => {
        if (initialValues && initialValues.length > 0) {
            const formData = transformSavedDataToFormData(initialValues, ngoList, totalOrderAmount);
            reset(formData as CSRFormData);
        }
    }, [initialValues, ngoList, totalOrderAmount, reset]);

    const onSubmit = (data: CSRFormData) => {
        const transformedNGOs = transformFormDataToSaveFormat(data, totalOrderAmount);
        /* eslint-disable no-console */
        console.log('CSR Contribution Form Data:', transformedNGOs);
        handleSaveCSRContribution(transformedNGOs);
        /* eslint-enable no-console */
    };

    // Watch form values for conditional rendering and calculations
    const contributeOnTotalOrder = useWatch({ control, name: 'contributeOnTotalOrder' });
    const contributionType = useWatch({ control, name: 'contributionType' });
    const contributionValue = useWatch({ control, name: 'contributionValue' });
    const selectedNGOs = useWatch({ control, name: 'selectedNGOs' });
    const splitMethod = useWatch({ control, name: 'splitMethod' });
    const ngoAmounts = useWatch({ control, name: 'ngoAmounts' });
    const ngoPercentages = useWatch({ control, name: 'ngoPercentages' });

    // Calculate CSR Contribution Amount
    let csrContributionAmount = 0;
    if (contributionType === 'percentage' && contributionValue > 0) {
        csrContributionAmount = (totalOrderAmount * contributionValue) / 100;
    } else if (contributionType === 'amount') {
        csrContributionAmount = contributionValue;
    }

    // Calculate amount per NGO based on split method
    const getNGOAmount = useCallback(
        (ngo: MultiSelectOption): number => {
            if (splitMethod === 'equally') {
                return selectedNGOs.length > 0 ? csrContributionAmount / selectedNGOs.length : 0;
            }
            if (splitMethod === 'amount') {
                return ngoAmounts[ngo.value] || 0;
            }
            if (splitMethod === 'percentage') {
                const percentage = ngoPercentages[ngo.value] || 0;
                return (csrContributionAmount * percentage) / 100;
            }
            return 0;
        },
        [splitMethod, selectedNGOs.length, csrContributionAmount, ngoAmounts, ngoPercentages]
    );

    const showContributionFields = contributeOnTotalOrder === 'yes';
    const showSplitSection = showContributionFields && selectedNGOs.length > 0 && csrContributionAmount > 0;

    // Calculate progress based on form completion
    const progress = useMemo(() => {
        let completedFields = 0;
        let totalFields = 0;

        // Field 1: contributeOnTotalOrder (always required)
        totalFields += 1;
        if (contributeOnTotalOrder && (contributeOnTotalOrder === 'yes' || contributeOnTotalOrder === 'no')) {
            completedFields += 1;
        }

        // If user selected 'yes', track additional fields
        if (contributeOnTotalOrder === 'yes') {
            // Field 2: contributionType
            totalFields += 1;
            if (contributionType && (contributionType === 'amount' || contributionType === 'percentage')) {
                completedFields += 1;
            }

            // Field 3: contributionValue
            totalFields += 1;
            if (contributionValue > 0) {
                // Additional validation: percentage should be <= 100
                if (contributionType === 'percentage' && contributionValue <= 100) {
                    completedFields += 1;
                } else if (contributionType === 'amount') {
                    completedFields += 1;
                }
            }

            // Field 4: selectedNGOs (required if csrContributionAmount > 0)
            if (csrContributionAmount > 0) {
                totalFields += 1;
                if (selectedNGOs && selectedNGOs.length > 0) {
                    completedFields += 1;
                }
            }

            // Field 5: splitMethod and related fields (if split section is shown)
            if (showSplitSection) {
                // splitMethod always has a default value, so count it as complete
                totalFields += 1;
                completedFields += 1;

                // If split method is 'amount', validate all ngoAmounts
                if (splitMethod === 'amount') {
                    const allAmountsFilled = selectedNGOs.every(ngo => {
                        const amount = ngoAmounts?.[ngo.value];
                        return amount !== undefined && amount > 0;
                    });
                    totalFields += 1;
                    if (allAmountsFilled) {
                        completedFields += 1;
                    }
                }

                // If split method is 'percentage', validate all ngoPercentages and sum
                if (splitMethod === 'percentage') {
                    const allPercentagesFilled = selectedNGOs.every(ngo => {
                        const percentage = ngoPercentages?.[ngo.value];
                        return percentage !== undefined && percentage > 0;
                    });
                    const totalPercentage = selectedNGOs.reduce((sum, ngo) => {
                        return sum + (ngoPercentages?.[ngo.value] || 0);
                    }, 0);

                    totalFields += 1;
                    if (allPercentagesFilled && totalPercentage === 100) {
                        completedFields += 1;
                    }
                }
                // If splitMethod === 'equally', no additional fields needed
            }
        }

        // Calculate percentage progress
        return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
    }, [
        contributeOnTotalOrder,
        contributionType,
        contributionValue,
        csrContributionAmount,
        selectedNGOs,
        showSplitSection,
        splitMethod,
        ngoAmounts,
        ngoPercentages,
    ]);

    // Store callback in ref to avoid stale closures and infinite loops
    const onProgressReference = useRef(onProgress);

    // Update ref when callback changes
    useEffect(() => {
        onProgressReference.current = onProgress;
    }, [onProgress]);

    // Track previous progress to avoid unnecessary updates
    const previousProgressReference = useRef<number | null>(null);

    // Update progress via callback (only when progress actually changes)
    useEffect(() => {
        if (onProgressReference.current && previousProgressReference.current !== progress) {
            previousProgressReference.current = progress;
            onProgressReference.current(progress);
        }
    }, [progress]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white flex flex-col gap-6 prize-agreement-csr-form">
            <ContributionScopeSection control={control} error={errors.contributeOnTotalOrder?.message} />

            {showContributionFields && (
                <>
                    <ContributionAmountSection
                        control={control}
                        errors={errors}
                        contributionType={contributionType}
                        csrContributionAmount={csrContributionAmount}
                    />

                    <NGOSelectionSection
                        control={control}
                        errors={errors}
                        ngoList={ngoList}
                        showContributionFields={showContributionFields}
                        csrContributionAmount={csrContributionAmount}
                    />

                    {showSplitSection && <SplitMethodSection control={control} csrContributionAmount={csrContributionAmount} />}

                    {showSplitSection && (
                        <NGOReceivesSection
                            control={control}
                            errors={errors}
                            selectedNGOs={selectedNGOs}
                            splitMethod={splitMethod}
                            getNGOAmount={getNGOAmount}
                            csrContributionAmount={csrContributionAmount}
                            totalPercentage={selectedNGOs.reduce((sum, ngo) => sum + (ngoPercentages?.[ngo.value] || 0), 0)}
                            totalAmount={selectedNGOs.reduce((sum, ngo) => sum + (ngoAmounts?.[ngo.value] || 0), 0)}
                        />
                    )}

                    {showSplitSection && (
                        <CSRSummary
                            contributionType={contributionType}
                            contributionValue={contributionValue}
                            csrContributionAmount={csrContributionAmount}
                            totalOrderAmount={totalOrderAmount}
                            selectedNGOs={selectedNGOs}
                        />
                    )}
                </>
            )}

            <button
                type="submit"
                className="p-2 w-fit font-ubuntu bg-brand-500 text-sm leading-5 text-white rounded hover:bg-brand-600 transition-colors"
            >
                Save & Continue
            </button>
        </form>
    );
}

export default CSRContribution;
