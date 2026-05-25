import { Suspense, lazy, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TabViewCardSkeleton from '../../components/cards/TabViewCardSkeleton';
import HeaderTitle from '../../components/common/HeaderTitle';
import TabPanel from '../../components/common/TabPanel';
import PrizeAgreementContainer from './components/Containers/PrizeAgreementContainer';
import useFetchNGOsList from './hooks/api/useFetchNgosList';
import usePrizeAgreementApis from './hooks/api/usePrizeAgreementApis';

// Lazy load the PrizeAgreementListContainer for the "Submitted" tab
const PrizeAgreementListContainer = lazy(() => import('./components/Containers/PrizeAgreementListContainer'));

function PrizeAgreement() {
    const { mobileGame, studioShow, hasOrderIdFilter, clearOrderIdFilter, getActiveTabIndex } = usePrizeAgreementApis();
    const { ngoList } = useFetchNGOsList();
    const [searchParameters] = useSearchParams();
    const subtabFromUrl = Number(searchParameters.get('subtab')) || 0;
    const [innerActiveIndex, setInnerActiveIndex] = useState(subtabFromUrl);

    const isInitialLoading = mobileGame.isLoading && studioShow.isLoading;

    if (isInitialLoading)
        return (
            <div className="p-4">
                <TabViewCardSkeleton rows={3} />
                <TabViewCardSkeleton rows={3} />
            </div>
        );

    const renderTodoContent = (dataSet: typeof mobileGame, sponsorshipType: string) => {
        if (dataSet.isLoading && dataSet.salesOrdersWithPrizeAgreementItemsList.length === 0) {
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

        if (dataSet.salesOrdersWithPrizeAgreementItemsList.length === 0) {
            return <div className="p-4">No Sales Orders with Prize Agreement Items</div>;
        }

        return (
            <PrizeAgreementContainer
                salesOrders={dataSet.salesOrdersWithPrizeAgreementItemsList}
                hasNextPage={dataSet.hasNextPage}
                isFetchingNextPage={dataSet.isFetchingNextPage}
                onLoadMore={() => dataSet.fetchNextPage()}
                ngoList={ngoList}
                sponsorshipType={sponsorshipType}
            />
        );
    };

    const createNestedTabs = (dataSet: typeof mobileGame, sponsorshipType: string) => [
        {
            id: 'todo',
            header: 'To Do',
            content: renderTodoContent(dataSet, sponsorshipType),
        },
        {
            id: 'submitted',
            header: 'Submitted',
            content: (
                <Suspense fallback={<TabViewCardSkeleton rows={3} />}>
                    <PrizeAgreementListContainer />
                </Suspense>
            ),
        },
    ];

    const tabs = [
        {
            id: 'mobile-game',
            header: 'Mobile Game',
            content: (
                <TabPanel
                    tabs={createNestedTabs(mobileGame, 'Mobile Game')}
                    activeIndex={innerActiveIndex}
                    onTabChange={event => setInnerActiveIndex(event.index)}
                />
            ),
            disabled: mobileGame.isDisabled,
        },
        {
            id: 'studio-show',
            header: 'Studio Show',
            content: (
                <TabPanel
                    tabs={createNestedTabs(studioShow, 'Studio Show')}
                    activeIndex={innerActiveIndex}
                    onTabChange={event => setInnerActiveIndex(event.index)}
                />
            ),
            disabled: studioShow.isDisabled,
        },
    ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <HeaderTitle text="Prize Agreement" size="2xl" weight="medium" />
                {hasOrderIdFilter && (
                    <button
                        type="button"
                        onClick={clearOrderIdFilter}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                        View All Prize Agreements
                    </button>
                )}
            </div>
            <div className="mt-6">
                <TabPanel tabs={tabs} activeIndex={getActiveTabIndex()} />
            </div>
        </div>
    );
}

export default PrizeAgreement;
