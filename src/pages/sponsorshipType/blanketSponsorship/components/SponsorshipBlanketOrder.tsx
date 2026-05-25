import { lazy, Suspense } from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import { useBlanketSponsorshipForm } from '../../../../hooks/useBlanketSponsorshipForm';
import { BlanketOrdersTable } from './BlanketOrdersTable';
import SponsorshipBlanketOrderForm from './SponsorshipBlanketOrderForm';
import { BLANKET_ORDER_TABS } from '../../../../data/blanketSponsorship/blanketOrderTabs';

const BlanketOrderSubmissionModal = lazy(() => import('./BlanketOrderSubmissionModal'));

export default function SponsorshipBlanketOrder() {
    const { activeTab, setActiveTab, showSubmissionModal, setShowSubmissionModal, handleCloseModal, handleSubmitNewOrder, handleViewSubmittedOrder } =
        useBlanketSponsorshipForm();

    const handleTabChange = (index: number) => {
        setActiveTab(BLANKET_ORDER_TABS[index].value);
    };

    return (
        <div className="py-2">
            <HeaderTitle text="Blanket Sponsorship Order" size="2xl" weight="medium" className="mb-6" />
            <TabView
                activeIndex={BLANKET_ORDER_TABS.findIndex(tab => tab.value === activeTab)}
                onTabChange={event => handleTabChange(event.index)}
                className="custom-tabview"
            >
                <TabPanel header="To Do">
                    {/* blanket order Form  */}
                    <SponsorshipBlanketOrderForm setShowSubmissionModal={setShowSubmissionModal} />
                </TabPanel>
                <TabPanel header="Submitted">
                    {/* Blanket orders list table  */}
                    <BlanketOrdersTable />
                </TabPanel>
            </TabView>
            <Suspense fallback={undefined}>
                <BlanketOrderSubmissionModal
                    visible={showSubmissionModal}
                    onHide={handleCloseModal}
                    onViewSubmittedOrder={handleViewSubmittedOrder}
                    onSubmitNewOrder={handleSubmitNewOrder}
                />
            </Suspense>
        </div>
    );
}

export { BLANKET_ORDER_TABS } from '../../../../data/blanketSponsorship/blanketOrderTabs';
