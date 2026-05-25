import { useForm, Controller } from 'react-hook-form';
import { useSponsorRegistration } from '../context/sponsorRegistrationContext';
import HeaderTitle from '../../../components/common/HeaderTitle';
import MultiSelect, { type MultiSelectOption } from '../../../components/form-fields/multiSelect/MultiSelect';
import { CustomDropdown, type DropdownOption } from '../../../components/common/Dropdown';
import { HandHeart } from '../../../components/icons';
import ActionButton from '../../../components/common/ActionButton';
import useFetchAllDropdownsData from '../hooks/useFetchAllDropdownsData';

interface SponsorshipCSRFormData {
    custom_csr_focus_area: MultiSelectOption[];
    custom_sponsorship_intent: MultiSelectOption[];
    custom_prize_pledge_type: DropdownOption | undefined;
    custom_additional_notes: string;
}

function SponsorshipAndCSR() {
    const { formData, updateFormData, markStepAsCompleted, setCurrentStep } = useSponsorRegistration();

    // Fetch dropdown data from API
    const { sponsorshipFocusAreaList, sponsorshipIntentList, prizePledgeList } = useFetchAllDropdownsData();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SponsorshipCSRFormData>({
        mode: 'onChange',
        defaultValues: {
            // Convert string[] from context to MultiSelectOption[] for UI
            custom_csr_focus_area:
                formData.custom_csr_focus_area && formData.custom_csr_focus_area.length > 0
                    ? formData.custom_csr_focus_area.map(value => {
                          // Find the option from the list that matches this value
                          const option = sponsorshipFocusAreaList.find(opt => opt.value === value);
                          return option || { label: value, value };
                      })
                    : [],
            custom_sponsorship_intent:
                formData.custom_sponsorship_intent && formData.custom_sponsorship_intent.length > 0
                    ? formData.custom_sponsorship_intent.map(value => {
                          // Find the option from the list that matches this value
                          const option = sponsorshipIntentList.find(opt => opt.value === value);
                          return option || { label: value, value };
                      })
                    : [],
            custom_prize_pledge_type: formData.custom_prize_pledge_type,
            custom_additional_notes: formData.custom_additional_notes,
        },
    });

    const onFormSubmit = (data: SponsorshipCSRFormData) => {
        // Convert MultiSelectOption[] to string[] (extract values) before saving to context
        const formDataToUpdate = {
            ...data,
            custom_csr_focus_area: data.custom_csr_focus_area.map(option => String(option.value)),
            custom_sponsorship_intent: data.custom_sponsorship_intent.map(option => String(option.value)),
        };

        // Update the central form data
        updateFormData(formDataToUpdate);

        // Mark step 5 as completed
        markStepAsCompleted(5);

        // Move to step 6 (Target Audience)
        setCurrentStep(6);
    };

    return (
        <div className="sponsorship-csr-form">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <HandHeart size={20} />
                    <HeaderTitle text="Sponsorship & CSR" size="xl" weight="medium" />
                </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* CSR Focus Areas */}
                    <Controller
                        name="custom_csr_focus_area"
                        control={control}
                        rules={{
                            required: 'Please select at least one CSR focus area',
                            validate: value => value.length > 0 || 'Please select at least one CSR focus area',
                        }}
                        render={({ field }) => (
                            <MultiSelect
                                id="custom_csr_focus_area"
                                name="custom_csr_focus_area"
                                label="CSR Focus Areas"
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                options={sponsorshipFocusAreaList}
                                placeholder="Select focus areas..."
                                required
                                error={errors.custom_csr_focus_area?.message}
                                isSearchable
                                closeMenuOnSelect={false}
                            />
                        )}
                    />

                    {/* Sponsorship Intent */}
                    <Controller
                        name="custom_sponsorship_intent"
                        control={control}
                        rules={{
                            required: 'Please select at least one sponsorship intent',
                            validate: value => value.length > 0 || 'Please select at least one sponsorship intent',
                        }}
                        render={({ field }) => (
                            <MultiSelect
                                id="custom_sponsorship_intent"
                                name="custom_sponsorship_intent"
                                label="Sponsorship Intent"
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                options={sponsorshipIntentList}
                                placeholder="Select intent..."
                                required
                                error={errors.custom_sponsorship_intent?.message}
                                isSearchable
                                closeMenuOnSelect={false}
                            />
                        )}
                    />
                </div>

                {/* Prize Pledge Type */}
                <div className="mb-8 max-w-md">
                    <Controller
                        name="custom_prize_pledge_type"
                        control={control}
                        rules={{ required: 'Prize pledge type is required' }}
                        render={({ field }) => (
                            <CustomDropdown
                                label="Prize Pledge Type"
                                options={prizePledgeList}
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Select"
                                width="100%"
                                required
                                error={errors.custom_prize_pledge_type?.message}
                            />
                        )}
                    />
                </div>

                {/* Additional Notes */}
                <div className="mb-8">
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="custom_additional_notes" className="input-field-label block mb-2">
                        Additional Notes
                    </label>
                    <Controller
                        name="custom_additional_notes"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                id="custom_additional_notes"
                                name="custom_additional_notes"
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Any additional notes you want to add"
                                rows={4}
                                className="w-full max-w-2xl px-4 py-3 text-xs border border-gray-600 rounded-sm resize-none focus:border-brand-500 focus:outline-none transition-colors"
                                style={{
                                    color: 'var(--color-text-black)',
                                    backgroundColor: 'var(--color-text-white)',
                                }}
                            />
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-start">
                    <ActionButton
                        type="submit"
                        bgColor={isValid ? 'bg-brand-primary-500' : 'bg-gray-300'}
                        textColor={isValid ? 'text-white' : 'text-gray-700'}
                        className="text-sm! px-10"
                        width="auto"
                    >
                        Save & Continue
                    </ActionButton>
                </div>
            </form>
        </div>
    );
}

export default SponsorshipAndCSR;
