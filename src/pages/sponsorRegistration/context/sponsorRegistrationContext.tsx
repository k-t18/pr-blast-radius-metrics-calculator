import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { DropdownOption } from '../../../components/common/Dropdown';
import type { MultiSelectOption } from '../../../components/form-fields/multiSelect';
import type { TargetAudienceGroup } from '../utils/buildTargetAudiencePayload';

// Define the complete form data structure for all 8 steps

export interface SponsorRegistrationFormData {
    // Step 1: Company Overview
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

    // Step 2: Addresses & Locations
    custom_address_line_1: string;
    country: DropdownOption | undefined;
    city: string;
    state: string;
    custom_postal_code: string;
    sameAsHeadOffice: boolean;
    custom_billing_address_line_1: string;
    custom_billing_country: DropdownOption | undefined;
    custom_billing_city: string;
    custom_billing_state: string;
    custom_billing_postal_code: string;

    // Step 3: Primary Contact
    first_name: string;
    last_name: string;
    job_title: string;
    mobile_no: string;
    whatsapp_no: string;
    email_id: string;
    sameAsMobileNumber: boolean;
    custom_contact_person?: string;

    // Step 4: Bank Details
    custom_account_name: string;
    custom_account_number: string;
    custom_ifsc_code: string;
    custom_bank?: string;
    custom_swift_code?: string;

    // Step 5: Sponsorship & CSR
    custom_csr_focus_area: string[];
    custom_sponsorship_intent: string[];
    custom_prize_pledge_type: DropdownOption | undefined;
    custom_additional_notes: string;

    // Step 6: Upload Documents
    companyLogo: File | string | undefined;
    taxCertificate: File | string | undefined;
    cacCertificate: File | string | undefined;
    authorisedSignatoryId: File | string | undefined;

    // Step 7: Target Audience
    targetAudienceSelectedFilters: string[];
    targetAudienceFieldValues: Record<string, DropdownOption | MultiSelectOption[] | string | number | undefined>;
    target_audiences?: TargetAudienceGroup[];

    // Step 8: Review and Consent
    custom_terms_and_conditions: boolean;
    custom_kyc_information: boolean;
    custom_privacy_policy: boolean;

    // Attachments
    attachments?: { filename: string; fieldname: string }[];
}

interface SponsorRegistrationContextType {
    formData: SponsorRegistrationFormData;
    updateFormData: (data: Partial<SponsorRegistrationFormData>) => void;
    resetFormData: () => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    completedSteps: number[];
    markStepAsCompleted: (step: number) => void;
}

const initialFormData: SponsorRegistrationFormData = {
    // Step 1: Company Overview
    company_name: '',
    industry: undefined,
    custom_cac_number: '',
    custom_tin: '',
    no_of_employees: undefined,
    annual_revenue: '',
    custom_customer_type: undefined,
    website: '',
    custom_instagram: '',
    custom_x: '',
    custom_facebook: '',
    custom_linkedin: '',

    // Step 2: Addresses & Locations
    custom_address_line_1: '',
    country: undefined,
    city: '',
    state: '',
    custom_postal_code: '',
    sameAsHeadOffice: false,
    custom_billing_address_line_1: '',
    custom_billing_country: undefined,
    custom_billing_city: '',
    custom_billing_state: '',
    custom_billing_postal_code: '',

    // Step 3: Primary Contact
    first_name: '',
    last_name: '',
    job_title: '',
    mobile_no: '',
    whatsapp_no: '',
    email_id: '',
    sameAsMobileNumber: false,

    // Step 4: Bank Details
    custom_account_name: '',
    custom_account_number: '',
    custom_ifsc_code: '',
    custom_bank: '',
    custom_swift_code: '',

    // Step 5: Sponsorship & CSR
    custom_csr_focus_area: [],
    custom_sponsorship_intent: [],
    custom_prize_pledge_type: undefined,
    custom_additional_notes: '',

    // Step 6: Upload Documents
    companyLogo: undefined,
    taxCertificate: undefined,
    cacCertificate: undefined,
    authorisedSignatoryId: undefined,

    // Step 7: Target Audience
    targetAudienceSelectedFilters: [],
    targetAudienceFieldValues: {},
    target_audiences: undefined,

    // Step 8: Review and Consent
    custom_terms_and_conditions: false,
    custom_kyc_information: false,
    custom_privacy_policy: false,
};

const SponsorRegistrationContext = createContext<SponsorRegistrationContextType | undefined>(undefined);

export function SponsorRegistrationProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData] = useState<SponsorRegistrationFormData>(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const updateFormData = (data: Partial<SponsorRegistrationFormData>) => {
        setFormData(previous => ({
            ...previous,
            ...data,
        }));
    };

    const resetFormData = () => {
        setFormData(initialFormData);
        setCurrentStep(1);
        setCompletedSteps([]);
    };

    const markStepAsCompleted = (step: number) => {
        setCompletedSteps(previous => {
            if (!previous.includes(step)) {
                return [...previous, step];
            }
            return previous;
        });
    };

    const value = useMemo(
        () => ({
            formData,
            updateFormData,
            resetFormData,
            currentStep,
            setCurrentStep,
            completedSteps,
            markStepAsCompleted,
        }),
        [formData, currentStep, completedSteps]
    );

    return <SponsorRegistrationContext.Provider value={value}>{children}</SponsorRegistrationContext.Provider>;
}

export function useSponsorRegistration() {
    const context = useContext(SponsorRegistrationContext);
    if (context === undefined) {
        throw new Error('useSponsorRegistration must be used within a SponsorRegistrationProvider');
    }
    return context;
}
