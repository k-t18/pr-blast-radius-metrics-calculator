import { useForm, Controller } from 'react-hook-form';
import InputField from '../../../components/form-fields/inputField/InputField';
import HeaderTitle from '../../../components/common/HeaderTitle';
import DescriptionText from '../../../components/common/DescriptionText';
import { Building } from '../../../components/icons';
import { CustomDropdown, type DropdownOption } from '../../../components/common/Dropdown';
import { useSponsorRegistration } from '../context/sponsorRegistrationContext';
import ActionButton from '../../../components/common/ActionButton';
import useFetchAllDropdownsData from '../hooks/useFetchAllDropdownsData';
import { ApiError } from '../../../services/api/apiClient';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { formatCurrency } from '../../../utils/formatCurrency';

interface CompanyOverviewFormData {
    company_name: string;
    industry: DropdownOption | undefined;
    custom_cac_number: string;
    custom_tin: string;
    no_of_employees: DropdownOption | undefined;
    annual_revenue: string;
    custom_customer_type: DropdownOption | undefined;
    website: string;
    custom_instagram: string;
    custom_x: string;
    custom_facebook: string;
    custom_linkedin: string;
}

// Entity type options
const entityTypeOptions: DropdownOption[] = [
    { label: 'Public Limited Company', value: 'Public Limited Company' },
    { label: 'Sole Proprietorship', value: 'Sole Proprietorship' },
    { label: 'Private Limited Company', value: 'Private Limited Company' },
    { label: 'Company', value: 'Company' },
    { label: 'Individual', value: 'Individual' },
    { label: 'Partnership', value: 'Partnership' },
];

const employeeCountOptions: DropdownOption[] = [
    { label: '1-10', value: '1-10' },
    { label: '11-50', value: '11-50' },
    { label: '51-200', value: '51-200' },
    { label: '201-500', value: '201-500' },
    { label: '501-1000', value: '501-1000' },
    { label: '1000+', value: '1000+' },
];

function CompanyOverviewForm() {
    const { formData, updateFormData, markStepAsCompleted, setCurrentStep } = useSponsorRegistration();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<CompanyOverviewFormData>({
        mode: 'onChange',
        defaultValues: {
            company_name: formData.company_name,
            industry: formData.industry,
            custom_cac_number: formData.custom_cac_number,
            custom_tin: formData.custom_tin,
            no_of_employees: formData.no_of_employees,
            annual_revenue: formData.annual_revenue,
            custom_customer_type: formData.custom_customer_type,
            website: formData.website,
            custom_instagram: formData.custom_instagram,
            custom_x: formData.custom_x,
            custom_facebook: formData.custom_facebook,
            custom_linkedin: formData.custom_linkedin,
        },
    });

    // Watch the TIN and CAC number fields for verification
    const taxIdentificationNumber = watch('custom_tin');
    const cacRcNumber = watch('custom_cac_number');

    // Fetch dropdown data and trigger verification when values change
    const { tinVerificationError, cacVerificationError, industryTypeList } = useFetchAllDropdownsData(taxIdentificationNumber, cacRcNumber);

    const onFormSubmit = (data: CompanyOverviewFormData) => {
        // Update the central form data
        updateFormData(data);

        // Mark step 1 as completed
        markStepAsCompleted(1);

        // Move to next step
        setCurrentStep(2);
    };

    return (
        <div className="company-overview-form">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Building size={20} />
                    <HeaderTitle text="Company Overview" size="xl" weight="medium" />
                </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)}>
                {/* Basic Company Details */}
                <div className="mb-8">
                    <DescriptionText text="Basic Company Details" size="sm" weight="medium" color="text-black" className="mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <Controller
                            name="company_name"
                            control={control}
                            rules={{ required: 'Company name is required' }}
                            render={({ field }) => (
                                <InputField
                                    id="company_name"
                                    name="company_name"
                                    label="Company Name"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Company Name"
                                    required
                                    error={errors.company_name?.message}
                                />
                            )}
                        />

                        {/* Industry Type */}
                        <Controller
                            name="industry"
                            control={control}
                            rules={{ required: 'Industry type is required' }}
                            render={({ field }) => (
                                <CustomDropdown
                                    label="Industry Type"
                                    options={industryTypeList}
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Select Industry"
                                    width="100%"
                                    required
                                    error={errors.industry?.message}
                                />
                            )}
                        />

                        {/* CAC / RC Number */}
                        <Controller
                            name="custom_cac_number"
                            control={control}
                            rules={{ required: 'CAC/RC number is required' }}
                            render={({ field }) => {
                                // Extract error message from ApiError instance
                                let verificationError: string | undefined;
                                if (cacVerificationError) {
                                    verificationError =
                                        cacVerificationError instanceof ApiError
                                            ? cacVerificationError.message
                                            : 'CAC verification failed. Please check your CAC number.';
                                }
                                const errorMessage = errors.custom_cac_number?.message || verificationError;

                                return (
                                    <InputField
                                        id="custom_cac_number"
                                        name="custom_cac_number"
                                        label="CAC / RC Number"
                                        value={field.value}
                                        onChange={value => field.onChange(value)}
                                        placeholder="RC: XXXXXXX"
                                        required
                                        error={errorMessage}
                                    />
                                );
                            }}
                        />

                        {/* Tax Identification Number */}
                        <Controller
                            name="custom_tin"
                            control={control}
                            rules={{ required: 'Tax identification number is required' }}
                            render={({ field }) => {
                                // Extract error message from ApiError instance
                                let verificationError: string | undefined;
                                if (tinVerificationError) {
                                    verificationError =
                                        tinVerificationError instanceof ApiError
                                            ? tinVerificationError.message
                                            : 'TIN verification failed. Please check your tax identification number.';
                                }
                                const errorMessage = errors.custom_tin?.message || verificationError;

                                return (
                                    <InputField
                                        id="custom_tin"
                                        name="custom_tin"
                                        label="Tax Identification Number"
                                        value={field.value}
                                        onChange={value => field.onChange(value)}
                                        placeholder="XXXXXXXXXX"
                                        required
                                        error={errorMessage}
                                    />
                                );
                            }}
                        />

                        {/* Number of Employees */}
                        <Controller
                            name="no_of_employees"
                            control={control}
                            render={({ field }) => (
                                <CustomDropdown
                                    id="no_of_employees"
                                    label="Number of Employees"
                                    options={employeeCountOptions}
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Select number of employees"
                                    width="100%"
                                    error={errors.no_of_employees?.message}
                                />
                            )}
                        />

                        {/* Annual Revenue */}
                        <Controller
                            name="annual_revenue"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    id="annual_revenue"
                                    name="annual_revenue"
                                    label="Annual Revenue"
                                    type="text"
                                    value={field.value ? formatCurrency(Number(field.value.replaceAll(',', ''))) : ''}
                                    onChange={value => {
                                        // Remove commas and non-numeric characters (except decimal point)
                                        const rawValue = value.replaceAll(/[^\d.]/g, '');
                                        field.onChange(rawValue);
                                    }}
                                    placeholder="Enter annual revenue"
                                    error={errors.annual_revenue?.message}
                                    prefixIcon={<CurrencySymbol className="" />}
                                />
                            )}
                        />

                        {/* Entity Type */}
                        <Controller
                            name="custom_customer_type"
                            control={control}
                            rules={{ required: 'Entity type is required' }}
                            render={({ field }) => (
                                <CustomDropdown
                                    label="Entity Type"
                                    options={entityTypeOptions}
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Select Entity"
                                    width="100%"
                                    required
                                    error={errors.custom_customer_type?.message}
                                />
                            )}
                        />

                        {/* Website URL */}
                        <Controller
                            name="website"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    id="website"
                                    name="website"
                                    label="Website URL"
                                    type="url"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Company Name"
                                    error={errors.website?.message}
                                    helperText="Please enter the website URL in the format https://www.example.com"
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Social Media URLs */}
                <div className="mb-8">
                    <DescriptionText text="Social Media URLs" size="sm" weight="medium" color="text-black" className="mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Instagram */}
                        <Controller
                            name="custom_instagram"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    id="custom_instagram"
                                    name="custom_instagram"
                                    label="Instagram"
                                    type="url"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="https://www.instagram.com/"
                                    error={errors.custom_instagram?.message}
                                />
                            )}
                        />

                        {/* X (Twitter) */}
                        <Controller
                            name="custom_x"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    id="custom_x"
                                    name="custom_x"
                                    label="X"
                                    type="url"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="https://x.com/"
                                    error={errors.custom_x?.message}
                                />
                            )}
                        />

                        {/* Facebook */}
                        <Controller
                            name="custom_facebook"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    id="custom_facebook"
                                    name="custom_facebook"
                                    label="Facebook"
                                    type="url"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="https://www.facebook.com/"
                                    error={errors.custom_facebook?.message}
                                />
                            )}
                        />

                        {/* LinkedIn */}
                        <Controller
                            name="custom_linkedin"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    id="custom_linkedin"
                                    name="custom_linkedin"
                                    label="LinkedIn"
                                    type="url"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="https://www.linkedin.com/company/"
                                    error={errors.custom_linkedin?.message}
                                />
                            )}
                        />
                    </div>
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

export default CompanyOverviewForm;
