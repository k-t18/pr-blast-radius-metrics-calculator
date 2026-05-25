import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import MultiSelect, { type MultiSelectOption } from '../../../../../components/form-fields/multiSelect/MultiSelect';
import Checkbox from '../../../../../components/common/CheckBox';
import type { CSRFormData } from '../types/csrContribution.types';
import type { NGOItem } from '../../../../../interfaces/ngo/ngo.types';

interface NGOSelectionSectionProperties {
    control: Control<CSRFormData>;
    errors: FieldErrors<CSRFormData>;
    ngoList: NGOItem[];
    showContributionFields: boolean;
    csrContributionAmount: number;
}

function NGOSelectionSection({ control, errors, ngoList, showContributionFields, csrContributionAmount }: NGOSelectionSectionProperties) {
    const isRequired = showContributionFields && csrContributionAmount > 0;

    return (
        <div className="flex flex-col gap-3">
            <Controller
                name="selectedNGOs"
                control={control}
                rules={{
                    required: isRequired ? 'Please select at least one NGO' : false,
                }}
                render={({ field }) => (
                    <MultiSelect
                        id="ngo-select"
                        name={field.name}
                        label="Select NGOs you would like to support."
                        value={field.value || []}
                        onChange={selected => field.onChange(selected)}
                        options={ngoList.map((ngo: NGOItem) => ({ value: ngo.name, label: ngo.supplier_name })) as MultiSelectOption[]}
                        placeholder="Select NGOs..."
                        required={isRequired}
                    />
                )}
            />
            {errors.selectedNGOs && <span className="text-xs text-red-600">{errors.selectedNGOs.message}</span>}

            <Controller
                name="allowChancesToSelect"
                control={control}
                render={({ field }) => <Checkbox label="Allow Chances to select on your behalf." checked={field.value} onChange={field.onChange} />}
            />
        </div>
    );
}

export default NGOSelectionSection;
