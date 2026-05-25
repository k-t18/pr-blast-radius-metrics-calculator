import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { PhoneInput } from 'react-international-phone';
import InputField from '../../../components/form-fields/inputField/InputField';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { useSponsorRegistration } from '../context/sponsorRegistrationContext';
import { Contact } from '../../../components/icons';
import ActionButton from '../../../components/common/ActionButton';
import 'react-international-phone/style.css';

interface PrimaryContactFormData {
    first_name: string;
    last_name: string;
    job_title: string;
    mobile_no: string;
    whatsapp_no: string;
    email_id: string;
    sameAsMobileNumber: boolean;
}

function PrimaryContact() {
    const { formData, updateFormData, markStepAsCompleted, setCurrentStep } = useSponsorRegistration();

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors, isValid },
    } = useForm<PrimaryContactFormData>({
        mode: 'onChange',
        defaultValues: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            job_title: formData.job_title,
            mobile_no: formData.mobile_no,
            whatsapp_no: formData.whatsapp_no,
            email_id: formData.email_id,
            sameAsMobileNumber: formData.sameAsMobileNumber,
        },
    });

    const [sameAsMobileNumber, setSameAsMobileNumber] = useState(formData.sameAsMobileNumber);

    // Watch mobile number
    const mobileNumber = watch('mobile_no');

    // Sync WhatsApp number with mobile when checkbox is checked
    useEffect(() => {
        if (sameAsMobileNumber) {
            setValue('whatsapp_no', mobileNumber, { shouldValidate: true });
            trigger(['whatsapp_no', 'sameAsMobileNumber']);
        }
    }, [sameAsMobileNumber, mobileNumber, setValue, trigger]);

    const handleCheckboxChange = (checked: boolean) => {
        setSameAsMobileNumber(checked);
        setValue('sameAsMobileNumber', checked, { shouldValidate: true });
        trigger(['sameAsMobileNumber', 'whatsapp_no']);
    };

    const onFormSubmit = (data: PrimaryContactFormData) => {
        // Update the central form data
        updateFormData(data);

        // Mark step 3 as completed
        markStepAsCompleted(3);

        // Move to next step
        setCurrentStep(4);
    };

    return (
        <div className="primary-contact-form">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Contact size={20} />
                    <HeaderTitle text="Primary Contact" size="xl" weight="medium" />
                </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* First Name */}
                    <Controller
                        name="first_name"
                        control={control}
                        rules={{ required: 'First name is required' }}
                        render={({ field }) => (
                            <InputField
                                id="first_name"
                                name="first_name"
                                label="First Name"
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="First Name"
                                required
                                error={errors.first_name?.message}
                            />
                        )}
                    />

                    {/* Last Name */}
                    <Controller
                        name="last_name"
                        control={control}
                        rules={{ required: 'Last name is required' }}
                        render={({ field }) => (
                            <InputField
                                id="last_name"
                                name="last_name"
                                label="Last Name"
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Last Name"
                                required
                                error={errors.last_name?.message}
                            />
                        )}
                    />

                    {/* Job Title */}
                    <Controller
                        name="job_title"
                        control={control}
                        rules={{ required: 'Job title is required' }}
                        render={({ field }) => (
                            <InputField
                                id="job_title"
                                name="job_title"
                                label="Job Title"
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Job Title"
                                required
                                error={errors.job_title?.message}
                            />
                        )}
                    />

                    {/* Mobile Number */}
                    <Controller
                        name="mobile_no"
                        control={control}
                        rules={{
                            required: 'Mobile number is required',
                        }}
                        render={({ field }) => (
                            <div className="input-field-container">
                                <span className="input-field-label">
                                    Mobile Number<span className="required-indicator">*</span>
                                </span>
                                <PhoneInput
                                    defaultCountry="ng"
                                    value={field.value}
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    onChange={(phone: any) => field.onChange(phone)}
                                    inputClassName="input-field"
                                    countrySelectorStyleProps={{
                                        buttonClassName: 'phone-country-selector',
                                    }}
                                />
                                {errors.mobile_no?.message && <small className="error-message">{errors.mobile_no.message}</small>}
                            </div>
                        )}
                    />

                    {/* WhatsApp Number */}
                    <div>
                        <Controller
                            name="whatsapp_no"
                            control={control}
                            rules={{
                                required: sameAsMobileNumber ? false : 'WhatsApp number is required',
                            }}
                            render={({ field }) => (
                                <div className="input-field-container">
                                    <span className="input-field-label">
                                        WhatsApp Number{!sameAsMobileNumber && <span className="required-indicator">*</span>}
                                    </span>
                                    <PhoneInput
                                        defaultCountry="ng"
                                        value={field.value}
                                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                        onChange={(phone: any) => field.onChange(phone)}
                                        disabled={sameAsMobileNumber}
                                        inputClassName="input-field"
                                        countrySelectorStyleProps={{
                                            buttonClassName: 'phone-country-selector',
                                        }}
                                    />
                                    {errors.whatsapp_no?.message && <small className="error-message">{errors.whatsapp_no.message}</small>}
                                </div>
                            )}
                        />

                        {/* Same as Mobile Number Checkbox */}
                        <div className="mt-3">
                            <label htmlFor="sameAsMobileNumber" className="flex items-center gap-2 cursor-pointer">
                                <input
                                    id="sameAsMobileNumber"
                                    type="checkbox"
                                    checked={sameAsMobileNumber}
                                    onChange={event => handleCheckboxChange(event.target.checked)}
                                    className="w-4 h-4 text-brand-500 border-gray-600 rounded focus:ring-brand-500"
                                />
                                <span className="text-sm text-gray-700">Same as Mobile Number</span>
                            </label>
                        </div>
                    </div>

                    {/* Email ID */}
                    <Controller
                        name="email_id"
                        control={control}
                        rules={{
                            required: 'Email ID is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Invalid email format',
                            },
                        }}
                        render={({ field }) => (
                            <InputField
                                id="email_id"
                                name="email_id"
                                label="Email ID"
                                type="email"
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Email ID"
                                required
                                error={errors.email_id?.message}
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
                        width="auto"
                        className="text-sm! px-10"
                    >
                        Save & Continue
                    </ActionButton>
                </div>
            </form>
        </div>
    );
}

export default PrimaryContact;
