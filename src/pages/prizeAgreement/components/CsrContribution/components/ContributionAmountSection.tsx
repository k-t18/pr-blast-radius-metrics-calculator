import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import InputField from '../../../../../components/form-fields/inputField/InputField';
import { RadioButtonGroup } from '../../../../../components/common/RadioButton';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { CSRFormData } from '../types/csrContribution.types';

interface ContributionAmountSectionProperties {
    control: Control<CSRFormData>;
    errors: FieldErrors<CSRFormData>;
    contributionType: string;
    csrContributionAmount: number;
}

function ContributionAmountSection({ control, errors, contributionType, csrContributionAmount }: ContributionAmountSectionProperties) {
    return (
        <>
            <fieldset className="flex flex-col gap-3 border-0 p-0">
                <legend className="text-sm font-medium text-black mb-[9px]">How much would you like to contribute for CSR?</legend>
                <Controller
                    name="contributionType"
                    control={control}
                    rules={{ required: 'Please select contribution type' }}
                    render={({ field }) => (
                        <RadioButtonGroup
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                                { value: 'amount', label: 'Amount' },
                                { value: 'percentage', label: 'Percentage' },
                            ]}
                            layout="horizontal"
                        />
                    )}
                />
                {errors.contributionType && <span className="text-xs text-red-600">{errors.contributionType.message}</span>}
            </fieldset>

            <div className="grid grid-cols-6 gap-4">
                <Controller
                    name="contributionValue"
                    control={control}
                    rules={{
                        required: 'Contribution value is required',
                        min: { value: 0, message: 'Value must be greater than 0' },
                        max: contributionType === 'percentage' ? { value: 100, message: 'Percentage cannot exceed 100%' } : undefined,
                    }}
                    render={({ field }) =>
                        contributionType === 'percentage' ? (
                            <InputField
                                id="csr-percentage"
                                name={field.name}
                                type="number"
                                label="Percentage"
                                value={field.value}
                                onChange={value => field.onChange(Number(value) || 0)}
                                placeholder="5"
                                required
                                min={0}
                                max={100}
                                error={errors.contributionValue?.message}
                            />
                        ) : (
                            <InputField
                                id="csr-amount"
                                name={field.name}
                                type="number"
                                label="Amount"
                                value={field.value}
                                onChange={value => field.onChange(Number(value) || 0)}
                                placeholder="800000"
                                prefix="₦"
                                required
                                min={0}
                                error={errors.contributionValue?.message}
                            />
                        )
                    }
                />

                <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium text-gray-700">CSR Contribution Amount</div>
                    <div className="text-lg font-semibold py-2">₦ {formatCurrency(csrContributionAmount)}</div>
                </div>
            </div>
        </>
    );
}

export default ContributionAmountSection;
