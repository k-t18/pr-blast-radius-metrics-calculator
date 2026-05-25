import { Controller, type Control } from 'react-hook-form';
import { RadioButtonGroup } from '../../../../../components/common/RadioButton';
import type { CSRFormData } from '../types/csrContribution.types';

interface ContributionScopeSectionProperties {
    control: Control<CSRFormData>;
    error?: string;
}

function ContributionScopeSection({ control, error }: ContributionScopeSectionProperties) {
    return (
        <fieldset className="flex flex-col gap-3 border-0 p-0">
            <legend className="text-base font-medium text-black mb-[9px]">
                Do you want to contribute CSR on your total sponsorship order instead?
            </legend>
            <Controller
                name="contributeOnTotalOrder"
                control={control}
                rules={{ required: 'Please select an option' }}
                render={({ field }) => (
                    <RadioButtonGroup
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                            { value: 'yes', label: 'Yes, apply CSR on total order value' },
                            { value: 'no', label: 'No, not this time' },
                        ]}
                        layout="vertical"
                    />
                )}
            />
            {error && <span className="text-xs text-red-600">{error}</span>}
        </fieldset>
    );
}

export default ContributionScopeSection;
