import { TabPanel, TabView } from 'primereact/tabview';
import type { CreativeTab } from '../../../interfaces/creatives/creatives.types';

interface CreativesUploadTabsProperties {
    platformTabs: CreativeTab[];
    statusTabs: CreativeTab[];
    activePlatform: string;
    activeStatus: string;
    onPlatformChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

function CreativesUploadTabs({
    platformTabs,
    statusTabs,
    activePlatform,
    activeStatus,
    onPlatformChange,
    onStatusChange,
}: CreativesUploadTabsProperties) {
    const platformTabIndex = platformTabs.findIndex(tab => tab.value === activePlatform);
    const statusTabIndex = statusTabs.findIndex(tab => tab.value === activeStatus);

    return (
        <div className="flex flex-col gap-2">
            <TabView
                activeIndex={platformTabIndex}
                onTabChange={event => onPlatformChange(platformTabs[event.index].value)}
                className="custom-tabview creaties-tabview"
            >
                {platformTabs.map(tab => (
                    <TabPanel key={tab.value} header={tab.label} />
                ))}
            </TabView>
            <TabView
                activeIndex={statusTabIndex}
                onTabChange={event => onStatusChange(statusTabs[event.index].value)}
                className="custom-tabview creaties-tabview"
            >
                {statusTabs.map(tab => (
                    <TabPanel key={tab.value} header={tab.label} />
                ))}
            </TabView>
        </div>
    );
}

export default CreativesUploadTabs;
