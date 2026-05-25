import React, { Suspense, useEffect } from 'react';
import { SponsorRegistrationProvider, useSponsorRegistration } from './context/sponsorRegistrationContext';
import RegistrationStepper from '../../components/layout/RegistrationStepperSidebar';
import { usePdfDocumentsData } from '../../stores/storeOfAllPdfDocumentsData';

const CompanyOverviewForm = React.lazy(() => import('./forms/companyOverview'));
const AddressesAndLocations = React.lazy(() => import('./forms/addressesAndLocations'));
const PrimaryContact = React.lazy(() => import('./forms/primaryContact'));
const BankDetails = React.lazy(() => import('./forms/bankDetails'));
const SponsorshipAndCSR = React.lazy(() => import('./forms/sponsorshipAndCsr'));
// TODO: Temporarily hidden - uncomment when Target Audience feature is ready
// const TargetAudience = React.lazy(() => import('./forms/targetAudience'));
const FileUploadStep = React.lazy(() => import('./forms/fileUploadStep'));
const ReviewAndConsent = React.lazy(() => import('./forms/reviewAndConsent'));

function SponsorRegistrationContent() {
    const { currentStep, setCurrentStep, completedSteps } = useSponsorRegistration();
    const { fetchTermsAndConditionData } = usePdfDocumentsData();

    useEffect(() => {
        fetchTermsAndConditionData();
    }, [fetchTermsAndConditionData]);
    const handleStepClick = (step: number) => {
        setCurrentStep(step);
        // // Only allow navigation to completed steps or the next step
        // const maxAllowedStep = Math.max(...completedSteps, 0) + 1;
        // if (step <= maxAllowedStep) {
        //     setCurrentStep(step);
        // }
    };

    // Render the appropriate form based on current step
    // Step 1: Company Overview
    // Step 2: Addresses & Locations
    // Step 3: Primary Contact
    // Step 4: Bank Details
    // Step 5: Sponsorship & CSR
    // Step 6: Upload Documents
    // Step 7: Target Audience (TODO: Temporarily hidden)
    // Step 8: Review and Consent
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: {
                return <CompanyOverviewForm />;
            }
            case 2: {
                return <AddressesAndLocations />;
            }
            case 3: {
                return <PrimaryContact />;
            }
            case 4: {
                return <BankDetails />;
            }
            case 5: {
                return <SponsorshipAndCSR />;
            }
            case 6: {
                return <FileUploadStep />;
            }
            // TODO: Temporarily hidden - uncomment when Target Audience feature is ready
            // case 7: {
            //     return <TargetAudience />;
            // }
            case 8: {
                return <ReviewAndConsent />;
            }
            default: {
                return <CompanyOverviewForm />;
            }
        }
    };
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Sidebar - Stepper */}
            <div className="bg-white">
                <RegistrationStepper currentStep={currentStep} completedSteps={completedSteps} onStepClick={handleStepClick} />
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-8">
                <div className="max-w-6xl">
                    <Suspense fallback={<div className="flex justify-center items-center w-full h-full">Loading...</div>}>
                        <div className="p-8">{renderStepContent()}</div>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

function SponsorRegistration() {
    return (
        <SponsorRegistrationProvider>
            <SponsorRegistrationContent />
        </SponsorRegistrationProvider>
    );
}

export default SponsorRegistration;
