import type { CSRFormData, SavedCSRData, NGOWithAllocation } from '../types/csrContribution.types';
import type { NGOItem } from '../../../../../interfaces/ngo/ngo.types';

/**
 * Transform saved CSR data back to form data structure
 */
export const transformSavedDataToFormData = (
    savedData: SavedCSRData[] | undefined,
    ngoList: NGOItem[],
    totalOrderAmount: number
): Partial<CSRFormData> => {
    if (!savedData || savedData.length === 0) {
        return {
            contributeOnTotalOrder: '',
            contributionType: '',
            contributionValue: 0,
            selectedNGOs: [],
            allowChancesToSelect: false,
            splitMethod: 'equally',
            ngoAmounts: {},
            ngoPercentages: {},
        };
    }

    // Calculate total CSR amount
    const totalCsrAmount = savedData.reduce((sum, item) => sum + item.csr_amount, 0);

    // Use saved split_method if available, otherwise fall back to detection logic
    let splitMethod: 'equally' | 'amount' | 'percentage' = savedData[0]?.split_method || 'equally';

    // Only use detection logic if split_method is not saved (backward compatibility)
    if (!savedData[0]?.split_method) {
        // Determine split method based on saved data
        // Check if all NGOs have equal amounts (within floating point tolerance)
        const hasEqualAmounts =
            savedData.length > 0 &&
            savedData.every(item => {
                const expectedEqualAmount = totalCsrAmount / savedData.length;
                return Math.abs(item.csr_amount - expectedEqualAmount) < 0.01;
            });

        // Check if all NGOs have equal percentages (for equally split detection)
        const expectedEqualPercentage = savedData.length > 0 ? 100 / savedData.length : 0;
        const hasEqualPercentages =
            savedData.length > 0 &&
            savedData.every(item => {
                const percentage = item.percentage_allocated ?? 0;
                return Math.abs(percentage - expectedEqualPercentage) < 0.01;
            });

        // Check if percentages are "round" numbers (likely manually entered)
        const hasRoundPercentages =
            savedData.length > 0 &&
            savedData.every(item => {
                const percentage = item.percentage_allocated ?? 0;
                // Check if percentage is a whole number or has at most 1 decimal place
                return Math.abs(percentage - Math.round(percentage)) < 0.01;
            });

        if (hasEqualAmounts && hasEqualPercentages) {
            // Equal amounts AND equal percentages = "equally" split
            splitMethod = 'equally';
        } else if (hasRoundPercentages && !hasEqualPercentages) {
            // Round percentages but not equal = user likely entered percentages manually
            splitMethod = 'percentage';
        } else {
            // Default to "amount" for unequal splits
            splitMethod = 'amount';
        }
    }

    // Determine contribution type and value
    // Try to reverse calculate: if totalCsrAmount matches a percentage of totalOrderAmount, it's percentage
    const percentageMatch = (totalCsrAmount / totalOrderAmount) * 100;
    // Check if percentage is a whole number or has at most 2 decimal places
    const roundedPercentage = Math.round(percentageMatch * 100) / 100;
    const isPercentage = percentageMatch > 0 && percentageMatch <= 100 && Math.abs(percentageMatch - roundedPercentage) < 0.001;

    let contributionType: 'amount' | 'percentage' = 'amount';
    let contributionValue = totalCsrAmount;

    if (isPercentage) {
        contributionType = 'percentage';
        contributionValue = roundedPercentage;
    }

    // Build selected NGOs from saved data
    const selectedNGOs: NGOWithAllocation[] = savedData.map(item => {
        const ngo = ngoList.find(n => n.name === item.ngo_name);
        return {
            value: item.ngo_name,
            label: ngo?.supplier_name || item.ngo_name,
            csr_amount: item.csr_amount,
            percentage_allocated: typeof item.percentage_allocated === 'number' ? item.percentage_allocated : undefined,
        };
    });

    // Build ngoAmounts and ngoPercentages
    const ngoAmounts: Record<string, number> = {};
    const ngoPercentages: Record<string, number> = {};

    savedData.forEach(item => {
        if (splitMethod === 'amount') {
            ngoAmounts[item.ngo_name] = item.csr_amount;
        } else if (splitMethod === 'percentage' && typeof item.percentage_allocated === 'number') {
            ngoPercentages[item.ngo_name] = item.percentage_allocated;
        }
    });

    // Determine allowChancesToSelect from disbursement_ownership
    const allowChancesToSelect = savedData.length > 0 && savedData[0].disbursement_ownership === 'Sponsor';

    return {
        contributeOnTotalOrder: 'yes',
        contributionType,
        contributionValue,
        selectedNGOs,
        allowChancesToSelect,
        splitMethod,
        ngoAmounts,
        ngoPercentages,
    };
};

/**
 * Transform form data to the save format expected by the API
 */
export const transformFormDataToSaveFormat = (data: CSRFormData, totalOrderAmount: number): SavedCSRData[] => {
    // Calculate CSR Contribution Amount from form data
    let calculatedCsrAmount = 0;

    if (data.contributionType === 'percentage' && data.contributionValue > 0) {
        calculatedCsrAmount = (totalOrderAmount * data.contributionValue) / 100;
    } else if (data.contributionType === 'amount') {
        calculatedCsrAmount = data.contributionValue;
    }

    // Determine disbursement ownership
    const disbursementOwnership = data.allowChancesToSelect ? 'Sponsor' : 'Chances Team';

    // Transform selectedNGOs into the required array format
    return data.selectedNGOs.map(ngo => {
        let csrAmount = 0;
        let percentageAllocated = 0;

        switch (data.splitMethod) {
            case 'equally': {
                // Equally split: divide 100% by number of selected NGOs
                csrAmount = data.selectedNGOs.length > 0 ? calculatedCsrAmount / data.selectedNGOs.length : 0;
                percentageAllocated = data.selectedNGOs.length > 0 ? 100 / data.selectedNGOs.length : 0;
                break;
            }
            case 'amount': {
                // Amount split: calculate percentage from entered amount
                csrAmount = data.ngoAmounts[ngo.value] || 0;
                percentageAllocated = calculatedCsrAmount > 0 ? (csrAmount / calculatedCsrAmount) * 100 : 0;
                break;
            }
            case 'percentage': {
                // Percentage split: use entered percentage directly
                const percentage = data.ngoPercentages[ngo.value] || 0;
                percentageAllocated = percentage;
                csrAmount = (calculatedCsrAmount * percentage) / 100;
                break;
            }
            default: {
                csrAmount = 0;
                percentageAllocated = 0;
            }
        }

        return {
            ngo_name: String(ngo.value),
            csr_amount: csrAmount,
            percentage_allocated: percentageAllocated,
            disbursement_ownership: disbursementOwnership,
            split_method: data.splitMethod as 'equally' | 'amount' | 'percentage',
        };
    });
};
