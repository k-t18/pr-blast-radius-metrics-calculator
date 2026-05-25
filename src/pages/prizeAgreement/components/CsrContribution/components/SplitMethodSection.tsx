import { Controller, type Control } from 'react-hook-form';
import { RadioButtonGroup } from '../../../../../components/common/RadioButton';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import type { CSRFormData } from '../types/csrContribution.types';

interface SplitMethodSectionProperties {
    control: Control<CSRFormData>;
    csrContributionAmount: number;
}

function SplitMethodSection({ control, csrContributionAmount }: SplitMethodSectionProperties) {
    return (
        <fieldset className="flex flex-col gap-3 border-0 p-0">
            <legend className="text-sm font-semibold mb-2">How would you like to split the ₦ {formatCurrency(csrContributionAmount)}?</legend>
            <Controller
                name="splitMethod"
                control={control}
                render={({ field }) => (
                    <RadioButtonGroup
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                            { value: 'equally', label: 'Equally' },
                            { value: 'amount', label: 'Amount' },
                            { value: 'percentage', label: '% Percentage' },
                        ]}
                        layout="horizontal"
                    />
                )}
            />
        </fieldset>
    );
}

export default SplitMethodSection;
