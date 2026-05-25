import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import InputField from '../../../../../components/form-fields/inputField/InputField';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { CSRFormData, NGOWithAllocation } from '../types/csrContribution.types';

interface NGOReceivesSectionProperties {
    control: Control<CSRFormData>;
    errors: FieldErrors<CSRFormData>;
    selectedNGOs: NGOWithAllocation[];
    splitMethod: string;
    getNGOAmount: (ngo: NGOWithAllocation) => number;
    csrContributionAmount: number;
    totalPercentage?: number;
    totalAmount?: number;
}

function NGOReceivesSection({
    control,
    errors,
    selectedNGOs,
    splitMethod,
    getNGOAmount,
    csrContributionAmount,
    totalPercentage = 0,
    totalAmount = 0,
}: NGOReceivesSectionProperties) {
    const isPercentageExceeded = splitMethod === 'percentage' && totalPercentage > 100;
    const isAmountExceeded = splitMethod === 'amount' && totalAmount > csrContributionAmount;

    const renderNGOField = (ngo: NGOWithAllocation) => {
        const currentAmount = getNGOAmount(ngo);

        if (splitMethod === 'equally') {
            return <div className="text-sm font-semibold text-gray-900">₦ {formatCurrency(currentAmount)}</div>;
        }

        if (splitMethod === 'amount') {
            return (
                <Controller
                    name={`ngoAmounts.${ngo.value}`}
                    control={control}
                    rules={{
                        required: 'Amount is required',
                        min: { value: 0, message: 'Amount must be greater than 0' },
                        max: { value: csrContributionAmount, message: `Amount cannot exceed ₦${formatCurrency(csrContributionAmount)}` },
                    }}
                    render={({ field: amountField }) => (
                        <InputField
                            id={`ngo-amount-${ngo.value}`}
                            name={amountField.name}
                            type="number"
                            value={amountField.value || 0}
                            onChange={value => amountField.onChange(Number(value) || 0)}
                            prefix="₦"
                            required
                            min={0}
                            max={csrContributionAmount}
                            error={errors.ngoAmounts?.[ngo.value]?.message}
                        />
                    )}
                />
            );
        }

        // Percentage method
        return (
            <div className="flex items-center gap-2">
                <Controller
                    name={`ngoPercentages.${ngo.value}`}
                    control={control}
                    rules={{
                        required: 'Percentage is required',
                        min: { value: 0, message: 'Percentage must be greater than 0' },
                        max: { value: 100, message: 'Percentage cannot exceed 100%' },
                    }}
                    render={({ field: percentageField }) => (
                        <InputField
                            id={`ngo-percentage-${ngo.value}`}
                            name={percentageField.name}
                            type="number"
                            value={percentageField.value || 0}
                            onChange={value => percentageField.onChange(Number(value) || 0)}
                            placeholder="50"
                            required
                            min={0}
                            max={100}
                            error={errors.ngoPercentages?.[ngo.value]?.message}
                        />
                    )}
                />
                <span className="text-sm text-gray-600">%</span>
                <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">(₦ {formatCurrency(currentAmount)})</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold">NGO receives</div>
            <div className="flex flex-col gap-3">
                {selectedNGOs.map((ngo, index) => (
                    <div key={ngo.value} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 min-w-[120px]">
                            {index + 1}. {ngo.label}:
                        </span>
                        {renderNGOField(ngo)}
                    </div>
                ))}
            </div>
            {isPercentageExceeded && (
                <span className="text-xs text-red-600">Total percentage ({totalPercentage}%) exceeds 100%. Please adjust the values.</span>
            )}
            {isAmountExceeded && (
                <span className="text-xs text-red-600">
                    Total amount (₦{formatCurrency(totalAmount)}) exceeds ₦{formatCurrency(csrContributionAmount)}. Please adjust the values.
                </span>
            )}
        </div>
    );
}

export default NGOReceivesSection;
