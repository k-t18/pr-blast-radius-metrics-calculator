import { useForm, Controller } from 'react-hook-form';
import InputField from '../../../components/form-fields/inputField/InputField';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { useSponsorRegistration } from '../context/sponsorRegistrationContext';
import { Building } from '../../../components/icons';
import ActionButton from '../../../components/common/ActionButton';

interface BankDetailsFormData {
    custom_account_name: string;
    custom_account_number: string;
    custom_ifsc_code: string;
    custom_bank?: string;
    custom_swift_code?: string;
}

function BankDetails() {
    const { formData, updateFormData, markStepAsCompleted, setCurrentStep } = useSponsorRegistration();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<BankDetailsFormData>({
        mode: 'onChange',
        defaultValues: {
            custom_account_name: formData.custom_account_name,
            custom_account_number: formData.custom_account_number,
            custom_ifsc_code: formData.custom_ifsc_code,
            custom_bank: formData.custom_bank || '',
            custom_swift_code: formData.custom_swift_code || '',
        },
    });

    const onFormSubmit = (data: BankDetailsFormData) => {
        // Update the central form data
        updateFormData(data);

        // Mark step 4 as completed
        markStepAsCompleted(4);

        // Move to next step
        setCurrentStep(5);
    };

    return (
        <div className="bank-details-form">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Building size={20} />
                    <HeaderTitle text="Bank Details" size="xl" weight="medium" />
                </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Account Name */}
                    <Controller
                        name="custom_account_name"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                id="custom_account_name"
                                name="custom_account_name"
                                label="Account Name"
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Account Name"
                                error={errors.custom_account_name?.message}
                            />
                        )}
                    />

                    {/* Account Number */}
                    <Controller
                        name="custom_account_number"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                id="custom_account_number"
                                name="custom_account_number"
                                label="Account Number"
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Account Number"
                                error={errors.custom_account_number?.message}
                            />
                        )}
                    />

                    {/* IFSC Code */}
                    <Controller
                        name="custom_ifsc_code"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                id="custom_ifsc_code"
                                name="custom_ifsc_code"
                                label="Bank Code"
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Bank Code"
                                error={errors.custom_ifsc_code?.message}
                            />
                        )}
                    />

                    {/* Bank Name */}
                    <Controller
                        name="custom_bank"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                id="custom_bank"
                                name="custom_bank"
                                label="Bank Name"
                                value={field.value || ''}
                                onChange={value => field.onChange(value)}
                                placeholder="Bank Name"
                                error={errors.custom_bank?.message}
                            />
                        )}
                    />

                    {/* Swift Code */}
                    <Controller
                        name="custom_swift_code"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                id="custom_swift_code"
                                name="custom_swift_code"
                                label="Swift Code"
                                value={field.value || ''}
                                onChange={value => field.onChange(value)}
                                placeholder="Swift Code"
                                error={errors.custom_swift_code?.message}
                            />
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-start">
                    <ActionButton type="submit" bgColor="bg-brand-primary-500" textColor="text-white" width="auto" className="text-sm! px-10">
                        Save & Continue
                    </ActionButton>
                </div>
            </form>
        </div>
    );
}

export default BankDetails;
