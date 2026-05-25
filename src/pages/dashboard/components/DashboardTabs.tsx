import { TabPanel, TabView } from 'primereact/tabview';
import { useDashboardTab } from '../hooks/useDashboardTab';
import { TABS } from '../dataset/dashboardDataSets';
import MobileGameTabContent from './MobileGameTabContent';
import SudioShowTabContent from './SudioShowTabContent';
import { usePeriodSelectionLogic } from '../../../hooks/period/usePeriodSelectionLogic';

function DashboardTabs() {
    const { activeTab, handleTabChange } = useDashboardTab();
    const { handlePeriodChange, selectedDateFormat, periodData, isPeriodReady } = usePeriodSelectionLogic();

    return (
        <div className="">
            <TabView
                activeIndex={TABS.findIndex(tab => tab.value === activeTab)}
                onTabChange={event => handleTabChange(event.index)}
                className="custom-tabview"
            >
                {TABS.map(tab => (
                    <TabPanel key={tab.value} header={tab.label} className="mt-5">
                        {tab.value === 'mobile_game' ? (
                            <MobileGameTabContent
                                periodData={periodData}
                                selectedDateFormat={selectedDateFormat}
                                onPeriodChange={handlePeriodChange}
                                sponsorshipType={activeTab}
                                isPeriodReady={isPeriodReady}
                            />
                        ) : (
                            <SudioShowTabContent
                                sponsorshipType={activeTab}
                                periodData={periodData}
                                selectedDateFormat={selectedDateFormat}
                                onPeriodChange={handlePeriodChange}
                                isPeriodReady={isPeriodReady}
                            />
                        )}
                    </TabPanel>
                ))}
            </TabView>
        </div>
    );
}

export default DashboardTabs;
