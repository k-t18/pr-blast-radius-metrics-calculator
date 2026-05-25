import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BLANKET_ORDER_TABS } from '../data/blanketSponsorship/blanketOrderTabs';

type BlanketOrderTab = 'todo' | 'submitted';

export function useBlanketSponsorshipForm() {
    const [searchParameters] = useSearchParams();
    const tabIndexFromUrl = Number(searchParameters.get('tab'));
    const initialTab = BLANKET_ORDER_TABS[tabIndexFromUrl]?.value ?? 'todo';
    const [activeTab, setActiveTab] = useState<BlanketOrderTab>(initialTab);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);

    const handleCloseModal = () => {
        setShowSubmissionModal(false);
    };

    const handleViewSubmittedOrder = () => {
        setShowSubmissionModal(false);
        setActiveTab('submitted');
    };

    const handleSubmitNewOrder = () => {
        setShowSubmissionModal(false);
    };

    return {
        activeTab,
        setActiveTab,
        showSubmissionModal,
        setShowSubmissionModal,
        handleCloseModal,
        handleViewSubmittedOrder,
        handleSubmitNewOrder,
    };
}
