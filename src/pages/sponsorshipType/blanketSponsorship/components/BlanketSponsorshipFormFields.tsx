import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import { RadioButton } from '../../../../components/common/RadioButton';
import { InputField } from '../../../../components/form-fields/inputField';
import ActionButton from '../../../../components/common/ActionButton';
import { StudioShowFields } from './formFields/StudioShowFields';
import { MobileShowFields } from './formFields/MobileShowFields';
import type { BlanketSponsorshipFormData, AllocationPreference } from '../../../../interfaces/blanketSponsorship/blanketSponsorship.types';

interface BlanketSponsorshipFormFieldsProperties {
    control: Control<BlanketSponsorshipFormData>;
    showStudioFields: boolean;
    showMobileFields: boolean;
    selectedType: string;
    errors: FieldErrors<BlanketSponsorshipFormData>;
    isValid: boolean;
    isSubmitting?: boolean;
}

export default function BlanketSponsorshipFormFields({
    control,
    showStudioFields,
    showMobileFields,
    selectedType,
    errors,
    isValid,
    isSubmitting = false,
}: BlanketSponsorshipFormFieldsProperties) {
    return (
        <div>
            {showStudioFields && (
                <StudioShowFields control={control} showStudioFields={showStudioFields} selectedType={selectedType} errors={errors} />
            )}
            {selectedType === 'Both' && <hr className="text-gray-600 mt-6" />}
            {showMobileFields && (
                <MobileShowFields control={control} showMobileFields={showMobileFields} selectedType={selectedType} errors={errors} />
            )}

            <div className="space-y-2 mt-6">
                <HeaderTitle
                    text="How would you like your sponsorship to be allocated?"
                    size="sm"
                    weight="medium"
                    disabled={false}
                    className="leading-[22px]"
                />
                <Controller
                    name="allocation_type"
                    control={control}
                    rules={{ required: 'Allocation preference is required' }}
                    render={({ field }) => (
                        <div className="flex flex-wrap gap-6">
                            {[
                                { id: 'allocation-chances-option', value: 'By Chances Team', label: 'Chances' },
                                { id: 'allocation-sponsor-option', value: 'By Sponsor', label: 'Sponsor' },
                            ].map(option => (
                                <div key={option.id} className="flex items-center gap-2">
                                    <RadioButton
                                        inputId={option.id}
                                        name="allocation"
                                        value={option.value}
                                        onChange={event => field.onChange(event.value as AllocationPreference)}
                                        checked={field.value === option.value}
                                        label={<span className="text-xs font-normal leading-5">{option.label}</span>}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                />
                {errors.allocation_type && <span className="text-red-500 text-xs">{errors.allocation_type.message}</span>}
            </div>

            <Controller
                name="allocation_type"
                control={control}
                render={({ field: allocationField }) => (
                    <div>
                        {allocationField.value === 'By Chances Team' && (
                            <div className="mt-6 max-w-full">
                                <p className="text-xs font-normal leading-5 text-primary-text mb-4">
                                    In case of allocation to Chances, the sponsor login will be used to create the sponsorship booking on behalf of
                                    the sponsor.
                                </p>
                                <HeaderTitle
                                    text="Any special preferences or exclusions? (optional)"
                                    size="sm"
                                    weight="medium"
                                    disabled={false}
                                    className="leading-[22px] mb-2"
                                />
                                <Controller
                                    name="remarks"
                                    control={control}
                                    render={({ field: noteField }) => (
                                        <InputField
                                            id="preferences-note"
                                            name="remarks"
                                            value={noteField.value || ''}
                                            onChange={value => noteField.onChange(value)}
                                            placeholder="Ex."
                                            className="max-w-[349px]"
                                            inputClassName="h-[36px] custom-budget-input px-3 text-xs font-normal leading-5"
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </div>
                )}
            />

            <ActionButton
                type="submit"
                borderRadius="rounded"
                width="auto"
                className="min-h-9 w-fit text-sm mt-6 font-medium leading-5 focus-visible:outline focus-visible:outline-offset-2"
                isDisabled={!isValid || isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Blanket Order'}
            </ActionButton>
        </div>
    );
}
