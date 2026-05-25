import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { NGOWithAllocation } from '../types/csrContribution.types';

interface CSRSummaryProperties {
    contributionType: string;
    contributionValue: number;
    csrContributionAmount: number;
    totalOrderAmount: number;
    selectedNGOs: NGOWithAllocation[];
}

function CSRSummary({ contributionType, contributionValue, csrContributionAmount, totalOrderAmount, selectedNGOs }: CSRSummaryProperties) {
    const percentageDisplay =
        contributionType === 'percentage' ? `${contributionValue}%` : `${((csrContributionAmount / totalOrderAmount) * 100).toFixed(1)}%`;

    const ngoNames = selectedNGOs.map(ngo => ngo.label).join(' and ');

    return (
        <div className="border-2 border-dashed border-purple-300 rounded-md p-4 bg-purple-50">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">CSR Summary</h4>
            <div className="flex items-start gap-2">
                <span className="text-green-600 text-lg">✓</span>
                <p className="text-sm text-gray-700">
                    {percentageDisplay} CSR contribution (₦{formatCurrency(csrContributionAmount)}) goes to {ngoNames}.
                </p>
            </div>
        </div>
    );
}

export default CSRSummary;
