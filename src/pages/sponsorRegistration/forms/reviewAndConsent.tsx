import { lazy, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSponsorRegistration } from '../context/sponsorRegistrationContext';
import ActionButton from '../../../components/common/ActionButton';
import { BookOpenText, Clock, Bell, ChartBar } from '../../../components/icons';
import useSubmitRegistrationForm from '../hooks/useSubmitRegistrationForm';
import useModal from '../../../hooks/useModal';
import '../../../styles/reviewAndConsent.css';
import { fileUpload } from '../../../services/general/fileUpload.api';
import { usePdfDocumentsData } from '../../../stores/storeOfAllPdfDocumentsData';

const REDIRECT_COUNTDOWN_SECONDS = 30;

const ModalWrapper = lazy(() => import('../../../components/common/ModalWrapper'));
const SafeHtmlRenderer = lazy(() => import('../../../components/common/SafeHtmlRenderer'));
const SuccessModal = lazy(() => import('../../../components/common/SuccessModal'));

interface ReviewAndConsentFormData {
    custom_terms_and_conditions: boolean;
    custom_kyc_information: boolean;
    custom_privacy_policy: boolean;
}

function ReviewAndConsent() {
    const { formData, updateFormData, setCurrentStep, markStepAsCompleted } = useSponsorRegistration();
    const navigate = useNavigate();
    const successModal = useModal();
    const [countdown, setCountdown] = useState(REDIRECT_COUNTDOWN_SECONDS);

    const { mutation } = useSubmitRegistrationForm({
        onSuccess: () => {
            setCountdown(REDIRECT_COUNTDOWN_SECONDS); // Reset countdown when modal opens
            successModal.show();
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { termsAndConditionData } = usePdfDocumentsData();

    // Modal state
    const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
    const [selectedDocumentTitle, setSelectedDocumentTitle] = useState('');
    const [selectedDocumentContent, setSelectedDocumentContent] = useState('');

    // Redirect to login page
    const redirectToLogin = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    // Countdown timer for auto-redirect
    useEffect(() => {
        if (!successModal.visible) return;

        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(previous => previous - 1);
            }, 1000);
            // eslint-disable-next-line consistent-return
            return () => clearTimeout(timer);
        }

        // Auto-redirect when countdown reaches 0
        redirectToLogin();
    }, [successModal.visible, countdown, redirectToLogin]);

    // Handle modal close - redirect to login
    const handleSuccessModalClose = () => {
        successModal.hide();
        redirectToLogin();
    };

    /**
     * Opens the document modal with filtered content from the store
     * @param documentNameKeyword - Partial keyword to match document name (e.g., "Terms", "Privacy")
     */
    const openDocumentModal = (documentNameKeyword: string) => {
        if (!termsAndConditionData) return;

        const document = termsAndConditionData.find(item => item.name.toLowerCase().includes(documentNameKeyword.toLowerCase()));

        if (document) {
            setSelectedDocumentTitle(document.name);
            setSelectedDocumentContent(document.terms);
            setIsDocumentModalVisible(true);
        }
    };

    const closeDocumentModal = () => {
        setIsDocumentModalVisible(false);
        setSelectedDocumentTitle('');
        setSelectedDocumentContent('');
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ReviewAndConsentFormData>({
        defaultValues: {
            custom_terms_and_conditions: formData.custom_terms_and_conditions || false,
            custom_kyc_information: formData.custom_kyc_information || false,
            custom_privacy_policy: formData.custom_privacy_policy || false,
        },
    });

    const handleEditStep = (step: number) => {
        setCurrentStep(step);
    };

    const onFormSubmit = async (data: ReviewAndConsentFormData) => {
        setIsSubmitting(true);

        try {
            // Upload files first and capture returned file names
            const uploadIfFile = async (file?: File | string) => {
                if (file && file instanceof File) {
                    const response = await fileUpload(file);
                    const uploadedFile = response.data?.[0];
                    // Extract file_name string from response object if it's an object
                    if (uploadedFile && typeof uploadedFile === 'object' && 'file_name' in uploadedFile) {
                        return (uploadedFile as { file_name: string }).file_name;
                    }
                    return uploadedFile || file.name;
                }
                return typeof file === 'string' ? file : undefined;
            };

            const [companyLogoName, taxCertificateName, cacCertificateName, authorisedSignatoryIdName] = await Promise.all([
                uploadIfFile(formData.companyLogo),
                uploadIfFile(formData.taxCertificate),
                uploadIfFile(formData.cacCertificate),
                uploadIfFile(formData.authorisedSignatoryId),
            ]);

            // Build attachments array in required format
            const attachments: { filename: string; fieldname: string }[] = [];
            if (companyLogoName) attachments.push({ filename: companyLogoName, fieldname: 'custom_company_logo' });
            if (taxCertificateName) attachments.push({ filename: taxCertificateName, fieldname: 'custom_tax_certificate' });
            if (cacCertificateName) attachments.push({ filename: cacCertificateName, fieldname: 'custom_cac_certificate' });
            if (authorisedSignatoryIdName) attachments.push({ filename: authorisedSignatoryIdName, fieldname: 'custom_authorized_signatory_id' });

            // Update context with consent data and attachments
            const updatedData = {
                ...formData,
                ...data,
                custom_contact_person: `${formData.first_name} ${formData.last_name}`,
                attachments,
            };

            updateFormData(updatedData);

            // Mark step 8 as completed
            markStepAsCompleted(8);

            // Submit the final payload
            mutation.mutate(updatedData);
        } catch (error) {
            /* eslint-disable no-console */
            console.error('❌ Failed to upload files or submit registration:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const reviewSections = [
        { id: 1, title: 'Company Overview', step: 1 },
        { id: 2, title: 'Addresses & Locations', step: 2 },
        { id: 3, title: 'Primary Contact', step: 3 },
        { id: 4, title: 'Bank Details', step: 4 },
        { id: 5, title: 'Sponsorship & CSR', step: 5 },
        { id: 6, title: 'Target Audience', step: 6 },
        { id: 7, title: 'Upload Documents', step: 7 },
        { id: 8, title: 'Review and Consent', step: 8 },
    ];

    return (
        <div className="form-container">
            {/* Header */}
            <div className="form-header">
                <div className="flex items-center gap-3">
                    <BookOpenText size={20} />
                    <h2 className="form-title">Review and Consent</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="form-content">
                {/* Review Sections */}
                <div className="review-sections">
                    {reviewSections.map(section => (
                        <div key={section.id} className="review-section-item">
                            <h3 className="review-section-title">{section.title}</h3>
                            <button
                                type="button"
                                onClick={() => handleEditStep(section.step)}
                                className="edit-button"
                                aria-label={`Edit ${section.title}`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Terms and Consent */}
                <div className="consent-section">
                    <p className="consent-intro">Review and accept the following terms to complete your application.</p>

                    {/* Terms and Conditions */}
                    <div className="consent-item">
                        <div className="consent-header">
                            <span className="consent-number">1.</span>
                            <h4 className="consent-title">
                                Terms and Conditions<span className="required-indicator">*</span>
                            </h4>
                        </div>
                        <p className="consent-description">&quot;I have read and agree to the Terms of Sponsorship and Booking Policies.&quot;</p>
                        <button type="button" className="consent-link" onClick={() => openDocumentModal('Terms and Conditions - Portal')}>
                            View Terms and Conditions
                        </button>
                        <div className="consent-checkbox">
                            <input
                                type="checkbox"
                                id="custom_terms_and_conditions"
                                {...register('custom_terms_and_conditions', {
                                    required: 'You must accept the Terms and Conditions',
                                })}
                                className="checkbox-input"
                            />
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label htmlFor="custom_terms_and_conditions" className="checkbox-label">
                                Accept Terms and Conditions
                            </label>
                        </div>
                        {errors.custom_terms_and_conditions && <span className="error-message">{errors.custom_terms_and_conditions.message}</span>}
                    </div>

                    {/* KYC Certification */}
                    <div className="consent-item">
                        <div className="consent-header">
                            <span className="consent-number">2.</span>
                            <h4 className="consent-title">
                                KYC Certification<span className="required-indicator">*</span>
                            </h4>
                        </div>
                        <p className="consent-description">
                            &quot;I certify that the information and documents provided are true, accurate, and valid to the best of my
                            knowledge.&quot;
                        </p>
                        <div className="consent-checkbox">
                            <input
                                type="checkbox"
                                id="custom_kyc_information"
                                /* eslint-disable-next-line jsx-a11y/label-has-associated-control */
                                {...register('custom_kyc_information', {
                                    required: 'You must certify the KYC information',
                                })}
                                className="checkbox-input"
                            />
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label htmlFor="custom_kyc_information" className="checkbox-label">
                                Certify KYC Information
                            </label>
                        </div>
                        {errors.custom_kyc_information && <span className="error-message">{errors.custom_kyc_information.message}</span>}
                    </div>

                    {/* Privacy Policy */}
                    <div className="consent-item">
                        <div className="consent-header">
                            <span className="consent-number">3.</span>
                            <h4 className="consent-title">
                                Privacy Policy<span className="required-indicator">*</span>
                            </h4>
                        </div>
                        <p className="consent-description">
                            &quot;I consent to the collection and processing of my data in accordance with the Privacy Policy and agree to receive
                            relevant communications.&quot;
                        </p>
                        <button type="button" className="consent-link" onClick={() => openDocumentModal('Privacy Policy - Sponsor Portal')}>
                            View Policy
                        </button>
                        <div className="consent-checkbox">
                            <input
                                type="checkbox"
                                id="custom_privacy_policy"
                                {...register('custom_privacy_policy', {
                                    required: 'You must agree to the Privacy Policy',
                                })}
                                className="checkbox-input"
                            />
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label htmlFor="custom_privacy_policy" className="checkbox-label">
                                Agree to Privacy Policy
                            </label>
                        </div>
                        {errors.custom_privacy_policy && <span className="error-message">{errors.custom_privacy_policy.message}</span>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                    <ActionButton type="submit" bgColor="bg-brand-primary-500" textColor="text-white" width="auto" isDisabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                    </ActionButton>
                </div>
            </form>

            {/* Document Modal */}
            <ModalWrapper visible={isDocumentModalVisible} onHide={closeDocumentModal} title={selectedDocumentTitle} showCloseButton modalSize="md">
                <SafeHtmlRenderer html={selectedDocumentContent} className="document-content" />
            </ModalWrapper>

            {/* Success Modal */}
            <SuccessModal
                visible={successModal.visible}
                onHide={handleSuccessModalClose}
                title="Registration Submitted Successfully"
                statusKey="pending_review"
                statusLabel="Status: Under Review"
                description="Thank you for completing your sponsor registration. Your information has been securely submitted for verification and profile creation in our system."
                nextStepsTitle="What happens next?"
                nextStepsStyle="icons"
                nextSteps={[
                    {
                        id: 'step-review',
                        icon: <Clock size={16} color="#6B7280" />,
                        text: 'Your company profile is under review by our compliance team. Verification usually takes 2-3 business days.',
                    },
                    {
                        id: 'step-notify',
                        icon: <Bell size={16} color="#6B7280" />,
                        text: "We'll notify you by email once your account is approved.",
                    },
                    {
                        id: 'step-dashboard',
                        icon: <ChartBar size={16} color="#6B7280" />,
                        text: "After approval, you'll gain access to your Sponsor Dashboard to explore audience insights and sponsorship opportunities.",
                    },
                ]}
                additionalInfo={`Redirecting to login in ${countdown} seconds...`}
                actions={[
                    {
                        id: 'go-to-login',
                        label: 'Go to Login Now',
                        onClick: handleSuccessModalClose,
                        variant: 'primary',
                    },
                ]}
            />
        </div>
    );
}

export default ReviewAndConsent;
