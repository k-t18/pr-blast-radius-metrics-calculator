import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type { ApiResponse } from '../../../../services/api/apiClient';
import { getSalesOrderWithPrizeAgreementItemsList } from '../../../../services/transactions/prize-agreement/getSalesOrdersWithPrizeAgreementItems.api';
import type { SalesOrderWithItems } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';

const PAGE_LIMIT = 10;

const getNextPageParameter = (lastPage: ApiResponse<SalesOrderWithItems[]>, allPages: ApiResponse<SalesOrderWithItems[]>[]) => {
    // Check if there are more items based on count or data length
    const dataLength = lastPage?.data?.length ?? 0;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const totalCount = (lastPage as any)?.count ?? 0;
    const currentOffset = allPages.length * PAGE_LIMIT;

    // If we've loaded all items (current offset + data length >= total count), no more pages
    if (totalCount > 0 && currentOffset + dataLength >= totalCount) return;
    // If the last page has fewer than PAGE_LIMIT items, there are no more pages
    if (dataLength < PAGE_LIMIT) return;
    // Calculate the next offset
    return currentOffset;
};

const flattenPagesData = (pages: ApiResponse<SalesOrderWithItems[]>[] | undefined) => pages?.flatMap(page => page?.data ?? []) ?? [];

const getTotalCount = (pages: ApiResponse<SalesOrderWithItems[]>[] | undefined) => {
    const latestPage = pages?.at(-1);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (latestPage as any)?.count;
};

const getGameFormat = (pages: ApiResponse<SalesOrderWithItems[]>[] | undefined): 0 | 1 | undefined => {
    // Check at response level first (alongside count)
    const latestPage = pages?.at(-1);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const responseGameFormat = (latestPage as any)?.game_format;
    if (responseGameFormat !== undefined) return responseGameFormat;

    // Fallback: check in the first data item
    const firstItem = pages?.at(0)?.data?.at(0);
    return firstItem?.game_format;
};

const useSalesOrderQuery = (type: 'mobile-game' | 'studio-show', orderId?: string) =>
    useInfiniteQuery({
        queryKey: ['salesOrdersWithPrizeAgreementItemsList', type, orderId],
        /* eslint-disable-next-line unicorn/prevent-abbreviations */
        queryFn: ({ pageParam = 0 }: { pageParam: number }) => getSalesOrderWithPrizeAgreementItemsList(PAGE_LIMIT, pageParam, type, orderId),
        getNextPageParam: getNextPageParameter,
        initialPageParam: 0,
    });

const usePrizeAgreementAPIs = () => {
    const [searchParameters, setSearchParameters] = useSearchParams();
    const orderId = searchParameters.get('order_id') ?? undefined;
    const urlTab = searchParameters.get('tab');

    const mobileGameQuery = useSalesOrderQuery('mobile-game', orderId);
    const studioShowQuery = useSalesOrderQuery('studio-show', orderId);

    // Get game_format from API response (check both queries since only one will have data when orderId is present)
    const mobileGameFormat = getGameFormat(mobileGameQuery.data?.pages);
    const studioShowFormat = getGameFormat(studioShowQuery.data?.pages);
    const gameFormat = mobileGameFormat ?? studioShowFormat;

    // Check which query has data (useful when game_format is not in API response)
    const mobileGameData = flattenPagesData(mobileGameQuery.data?.pages);
    const studioShowData = flattenPagesData(studioShowQuery.data?.pages);
    const mobileGameHasData = mobileGameData.length > 0;
    const studioShowHasData = studioShowData.length > 0;

    // Determine tab states based on orderId and game_format
    // game_format: 0 = studio-show, 1 = mobile-game
    const hasOrderIdFilter = !!orderId;

    // When orderId is present and queries are loaded:
    // - If game_format is available, use it to determine which tab to disable
    // - Otherwise, check which query has data (only one should have data for the orderId)
    const isQueriesLoaded = !mobileGameQuery.isLoading && !studioShowQuery.isLoading;

    const isMobileGameDisabled =
        hasOrderIdFilter && isQueriesLoaded && (gameFormat === 0 || (gameFormat === undefined && !mobileGameHasData && studioShowHasData));
    const isStudioShowDisabled =
        hasOrderIdFilter && isQueriesLoaded && (gameFormat === 1 || (gameFormat === undefined && !studioShowHasData && mobileGameHasData));

    // Determine which tab should be active when orderId is present
    // If game_format is 0 or only studio-show has data, studio-show should be active (index 1)
    // If game_format is 1 or only mobile-game has data, mobile-game should be active (index 0)
    const getActiveTabIndex = () => {
        // If URL has tab parameter, use it (tab=0 for mobile-game, tab=1 for studio-show)
        if (urlTab !== null) {
            const tabIndex = Number(urlTab);
            if (tabIndex === 0 || tabIndex === 1) {
                return tabIndex;
            }
        }

        if (!hasOrderIdFilter) return 1; // Default to studio-show when no filter

        // Use game_format if available
        if (gameFormat !== undefined) {
            return gameFormat === 0 ? 1 : 0; // 0 = studio-show (index 1), 1 = mobile-game (index 0)
        }

        // Fallback: check which query has data
        if (isQueriesLoaded) {
            if (mobileGameHasData && !studioShowHasData) return 0; // mobile-game tab
            if (studioShowHasData && !mobileGameHasData) return 1; // studio-show tab
        }

        return 1; // Default to studio-show
    };

    // Function to clear the order_id filter and view all prize agreements
    const clearOrderIdFilter = () => {
        const newParameters = new URLSearchParams(searchParameters);
        newParameters.delete('order_id');
        setSearchParameters(newParameters);
    };

    return {
        mobileGame: {
            salesOrdersWithPrizeAgreementItemsList: flattenPagesData(mobileGameQuery.data?.pages),
            totalCount: getTotalCount(mobileGameQuery.data?.pages),
            isLoading: mobileGameQuery.isLoading,
            error: mobileGameQuery.error,
            fetchNextPage: mobileGameQuery.fetchNextPage,
            hasNextPage: mobileGameQuery.hasNextPage,
            isFetchingNextPage: mobileGameQuery.isFetchingNextPage,
            isDisabled: isMobileGameDisabled,
        },
        studioShow: {
            salesOrdersWithPrizeAgreementItemsList: flattenPagesData(studioShowQuery.data?.pages),
            totalCount: getTotalCount(studioShowQuery.data?.pages),
            isLoading: studioShowQuery.isLoading,
            error: studioShowQuery.error,
            fetchNextPage: studioShowQuery.fetchNextPage,
            hasNextPage: studioShowQuery.hasNextPage,
            isFetchingNextPage: studioShowQuery.isFetchingNextPage,
            isDisabled: isStudioShowDisabled,
        },
        // Tab control helpers
        hasOrderIdFilter,
        orderId,
        gameFormat,
        getActiveTabIndex,
        clearOrderIdFilter,
    };
};

export default usePrizeAgreementAPIs;
