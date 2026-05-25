import { useInfiniteQuery } from '@tanstack/react-query';
import { type ApiResponse } from '../../../services/api/apiClient';
import { type SalesOrderWithItems } from '../../../interfaces/prizeAgreement/prizeAgreement.types';
import { getSalesOrderWithCreativesItems } from '../../../services/creatives/getSalesOrderWithCreativesItems.api';

const PAGE_LIMIT = 10;

const getNextPageParameter = (lastPage: ApiResponse<SalesOrderWithItems[]>, allPages: ApiResponse<SalesOrderWithItems[]>[]) => {
    const dataLength = lastPage?.data?.length ?? 0;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const totalCount = (lastPage as any)?.count ?? 0;
    const currentOffset = allPages.length * PAGE_LIMIT;

    if (totalCount > 0 && currentOffset + dataLength >= totalCount) return;
    if (dataLength < PAGE_LIMIT) return;
    return currentOffset;
};

const flattenPagesData = (pages: ApiResponse<SalesOrderWithItems[]>[] | undefined) => pages?.flatMap(page => page?.data ?? []) ?? [];

const getTotalCount = (pages: ApiResponse<SalesOrderWithItems[]>[] | undefined) => {
    const latestPage = pages?.at(-1);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (latestPage as any)?.count;
};

const useSalesOrderQuery = (type: 'mobile-game' | 'studio-show') =>
    useInfiniteQuery({
        queryKey: ['salesOrdersWithCreativesItemsList', type],
        /* eslint-disable-next-line unicorn/prevent-abbreviations */
        queryFn: ({ pageParam = 0 }: { pageParam: number }) => getSalesOrderWithCreativesItems(PAGE_LIMIT, pageParam, type),
        getNextPageParam: getNextPageParameter,
        initialPageParam: 0,
    });

const useFetchSalesOrderWithCreativesItems = () => {
    const mobileGameQuery = useSalesOrderQuery('mobile-game');
    const studioShowQuery = useSalesOrderQuery('studio-show');

    return {
        mobileGame: {
            salesOrdersWithCreativesItemsList: flattenPagesData(mobileGameQuery.data?.pages),
            totalCount: getTotalCount(mobileGameQuery.data?.pages),
            isLoading: mobileGameQuery.isLoading,
            error: mobileGameQuery.error,
            fetchNextPage: mobileGameQuery.fetchNextPage,
            hasNextPage: mobileGameQuery.hasNextPage,
            isFetchingNextPage: mobileGameQuery.isFetchingNextPage,
            refetch: mobileGameQuery.refetch,
        },
        studioShow: {
            salesOrdersWithCreativesItemsList: flattenPagesData(studioShowQuery.data?.pages),
            totalCount: getTotalCount(studioShowQuery.data?.pages),
            isLoading: studioShowQuery.isLoading,
            error: studioShowQuery.error,
            fetchNextPage: studioShowQuery.fetchNextPage,
            hasNextPage: studioShowQuery.hasNextPage,
            isFetchingNextPage: studioShowQuery.isFetchingNextPage,
            refetch: studioShowQuery.refetch,
        },
    };
};

export default useFetchSalesOrderWithCreativesItems;
