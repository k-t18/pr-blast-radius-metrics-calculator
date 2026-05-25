import { TabPanel, TabView } from 'primereact/tabview';
import { TABS } from '../dataset/adsCampaignTableColumns';
import SubmittedTabContent from './SubmittedTabContent';
import LiveTabContent from './LiveTabContent';
import { useAdCampaignTab } from '../hooks/useAdCampaignTab';

function AdsCampaignTabs() {
    const {
        activeTab,
        handleTabChange,
        campaigns,
        isLoading,
        error,
        totalRecords,
        page,
        rowsPerPage,
        handlePageChange,
        ROWS_PER_PAGE_OPTIONS,
        valueOptions,
        handleApplyFilters,
        handleClearFilters,
        handleValueTextChange,
    } = useAdCampaignTab();

    const commonProperties = {
        data: campaigns,
        isLoading,
        error,
        totalRecords,
        page,
        rowsPerPage,
        handlePageChange,
        ROWS_PER_PAGE_OPTIONS,
        valueOptions,
        onApplyFilters: handleApplyFilters,
        onClearFilters: handleClearFilters,
        onValueTextChange: handleValueTextChange,
    };

    return (
        <div className="">
            <TabView
                activeIndex={TABS.findIndex(tab => tab.value === activeTab)}
                onTabChange={event => handleTabChange(event.index)}
                className="custom-tabview"
            >
                {TABS.map(tab => (
                    <TabPanel key={tab.value} header={tab.label} className="mt-5">
                        {tab.value === 'submitted' ? <SubmittedTabContent {...commonProperties} /> : <LiveTabContent {...commonProperties} />}
                    </TabPanel>
                ))}
            </TabView>
        </div>
    );
}

export default AdsCampaignTabs;
