import type { DataTableValue } from 'primereact/datatable';
import { TabPanel, TabView } from 'primereact/tabview';
import type { DataTableWrapperColumn } from '../../../interfaces/common/table.types';
import { useWinnersInfoTab } from '../hooks/useWinnersInfoTab';
import { mobileGameColumns, studioShowColumns, TABS, type WinnersTabValue } from '../dataset/winnersInfoTableColumns';
import WinnersTabContent from './WinnersTabContent';

const TAB_COLUMNS: Record<WinnersTabValue, DataTableWrapperColumn<DataTableValue>[]> = {
    'mobile-game': mobileGameColumns as DataTableWrapperColumn<DataTableValue>[],
    'studio-show': studioShowColumns as DataTableWrapperColumn<DataTableValue>[],
};

function WinnersInfoTabs() {
    const {
        activeTab,
        handleTabChange,
        winners,
        isLoading,
        error,
        totalRecords,
        page,
        rowsPerPage,
        handlePageChange,
        refetch,
        valueOptions,
        handleApplyFilters,
        handleClearFilters,
        handleValueTextChange,
    } = useWinnersInfoTab();

    const commonProperties = {
        data: winners as DataTableValue[],
        isLoading,
        error,
        totalCount: totalRecords,
        page,
        rowsPerPage,
        onPageChange: handlePageChange,
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
                        <WinnersTabContent tab={tab.value} columns={TAB_COLUMNS[tab.value]} onRetry={() => refetch()} {...commonProperties} />
                    </TabPanel>
                ))}
            </TabView>
        </div>
    );
}

export default WinnersInfoTabs;
