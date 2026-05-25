import { useState } from 'react';
import TabViewCardSkeleton from '../../components/cards/TabViewCardSkeleton';
import HeaderTitle from '../../components/common/HeaderTitle';
import TabPanel from '../../components/common/TabPanel';
import CreativesContainer from './components/CreativesContainer';
import SubmittedCreativesTable from './components/SubmittedCreativesTable';
import useFetchSalesOrderWithCreativesItems from './hooks/useFetchSalesOrderWithCreativesItems';

function CreativesUploadPage() {
    const { mobileGame, studioShow } = useFetchSalesOrderWithCreativesItems();
    const [activePlatformIndex, setActivePlatformIndex] = useState(0);
    const [activeNestedTabIndex, setActiveNestedTabIndex] = useState<{ [key: string]: number }>({
        'mobile-game': 0,
        'studio-show': 0,
    });

    const isInitialLoading = mobileGame.isLoading && studioShow.isLoading;

    if (isInitialLoading)
        return (
            <div className="p-4">
                <TabViewCardSkeleton rows={3} />
                <TabViewCardSkeleton rows={3} />
            </div>
        );

    const handleNavigateToSubmittedTab = (platform: 'mobile-game' | 'studio-show') => {
        // Find the platform tab index
        const platformIndex = platform === 'mobile-game' ? 0 : 1;
        setActivePlatformIndex(platformIndex);

        // Set the nested tab to "Submitted" (index 1)
        setActiveNestedTabIndex(previous => ({
            ...previous,
            [platform]: 1,
        }));
    };

    const renderTodoContent = (dataSet: typeof mobileGame, platform: 'mobile-game' | 'studio-show') => {
        if (dataSet.isLoading && dataSet.salesOrdersWithCreativesItemsList.length === 0) {
            return (
                <div className="p-4">
                    <TabViewCardSkeleton rows={3} />
                </div>
            );
        }

        if (dataSet.error) {
            const errorMessage = dataSet.error instanceof Error ? dataSet.error.message : 'Failed to load sales orders';
            return <div className="p-4 text-red-600">Error: {errorMessage}</div>;
        }

        if (dataSet.salesOrdersWithCreativesItemsList.length === 0) {
            return <div className="p-4">No Sales Orders with Creatives Items</div>;
        }

        return (
            <CreativesContainer
                salesOrders={dataSet.salesOrdersWithCreativesItemsList}
                hasNextPage={dataSet.hasNextPage}
                isFetchingNextPage={dataSet.isFetchingNextPage}
                onLoadMore={() => dataSet.fetchNextPage()}
                platform={platform}
                onNavigateToSubmittedTab={handleNavigateToSubmittedTab}
                onRefetchSalesOrders={dataSet.refetch}
            />
        );
    };

    const createNestedTabs = (dataSet: typeof mobileGame, platform: 'mobile-game' | 'studio-show') => {
        const platformIndex = platform === 'mobile-game' ? 0 : 1;
        const isPlatformActive = activePlatformIndex === platformIndex;
        const isSubmittedTabActive = activeNestedTabIndex[platform] === 1;
        const isActive = isPlatformActive && isSubmittedTabActive;

        return [
            {
                id: 'todo',
                header: 'To Do',
                content: renderTodoContent(dataSet, platform),
            },
            {
                id: 'submitted',
                header: 'Submitted',
                content: <SubmittedCreativesTable platform={platform} isActive={isActive} />,
            },
        ];
    };

    const tabs = [
        {
            id: 'mobile-game',
            header: 'Mobile Game',
            content: (
                <TabPanel
                    tabs={createNestedTabs(mobileGame, 'mobile-game')}
                    activeIndex={activeNestedTabIndex['mobile-game']}
                    onTabChange={event => {
                        setActiveNestedTabIndex(previous => ({
                            ...previous,
                            'mobile-game': event.index,
                        }));
                    }}
                />
            ),
        },
        {
            id: 'studio-show',
            header: 'Studio Show',
            content: (
                <TabPanel
                    tabs={createNestedTabs(studioShow, 'studio-show')}
                    activeIndex={activeNestedTabIndex['studio-show']}
                    onTabChange={event => {
                        setActiveNestedTabIndex(previous => ({
                            ...previous,
                            'studio-show': event.index,
                        }));
                    }}
                />
            ),
        },
    ];

    return (
        <div className="w-full">
            <HeaderTitle text="Creatives Upload" size="2xl" weight="medium" />
            <div className="mt-6">
                <TabPanel
                    tabs={tabs}
                    activeIndex={activePlatformIndex}
                    onTabChange={event => {
                        setActivePlatformIndex(event.index);
                    }}
                />
            </div>
        </div>
    );
}

export default CreativesUploadPage;
