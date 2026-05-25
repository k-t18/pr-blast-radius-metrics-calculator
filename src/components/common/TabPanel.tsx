/**
 * Reusable TabPanel component using PrimeReact.
 *
 * Features:
 * - Flexible tab structure with header and content.
 * - Supports custom styling via className props.
 * - Uses custom CSS for consistent styling with project design.
 * - Fully typed with TypeScript.
 */

import { TabPanel as PrimeTabPanel, TabView as PrimeTabView } from 'primereact/tabview';
import '../../styles/tab-panel.css';

export interface TabItem {
    id?: string;
    header: string;
    content: React.ReactNode;
    disabled?: boolean;
    className?: string;
    headerClassName?: string;
}

interface TabPanelProperties {
    tabs: TabItem[];
    activeIndex?: number;
    onTabChange?: (event: { index: number }) => void;
    className?: string;
    panelClassName?: string;
}

function TabPanel({ tabs, activeIndex = 0, onTabChange, className = '', panelClassName = '' }: TabPanelProperties) {
    return (
        <div className="flex flex-col gap-2">
            <PrimeTabView
                activeIndex={activeIndex}
                onTabChange={onTabChange}
                className={`custom-tabview creatives-tabview ${className}`}
                renderActiveOnly={false} // keep all panels mounted to avoid flicker on tab switch
                pt={{
                    panelContainer: {
                        className: panelClassName,
                    },
                }}
            >
                {tabs.map((tab, index) => (
                    <PrimeTabPanel
                        key={tab.id || `tab-${index}`}
                        header={tab.header}
                        disabled={tab.disabled}
                        pt={{
                            content: {
                                className: tab.className || '',
                            },
                        }}
                    >
                        {tab.content}
                    </PrimeTabPanel>
                ))}
            </PrimeTabView>
        </div>
    );
}

export default TabPanel;
