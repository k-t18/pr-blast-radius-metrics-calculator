/**
 * TanStack Query Wrapper for GET requests
 *
 * Provides a wrapper around useQuery with automatic success/error handling,
 * toast notifications, and type safety.
 *
 * @module useApiQuery
 */

import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { ApiError } from '../services/api/apiClient';

/**
 * Extended options for API queries with success/error callbacks
 */
export interface UseApiQueryOptions<TData, TError = ApiError> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
    /**
     * Callback fired when query succeeds
     */
    onSuccess?: (data: TData) => void;

    /**
     * Callback fired when query fails
     */
    onError?: (error: TError) => void;

    /**
     * Whether to show a success toast notification
     * @default false
     */
    showSuccessToast?: boolean;

    /**
     * Whether to show an error toast notification
     * @default true
     */
    showErrorToast?: boolean;

    /**
     * Custom success message for toast
     */
    successMessage?: string;
}

/**
 * Custom hook that wraps TanStack Query's useQuery with automatic success/error handling
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useApiQuery({
 *   queryKey: ['invoices'],
 *   queryFn: () => api.get<Invoice[]>('/api/method/get_invoices_list'),
 *   onSuccess: (data) => {
 *     console.log(`Loaded ${data.length} invoices`);
 *   },
 *   onError: (error) => {
 *     console.error('Failed to load invoices:', error);
 *   },
 * });
 * ```
 *
 * @param options - Query configuration options
 * @returns TanStack Query result with data, loading states, and error
 */
export function useApiQuery<TData = unknown, TError = ApiError>(
    options: {
        queryKey: unknown[];
        queryFn: () => Promise<TData>;
    } & UseApiQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
    const { queryKey, queryFn, onSuccess, onError, showSuccessToast = false, showErrorToast = true, successMessage, ...restOptions } = options;

    const query = useQuery<TData, TError>({
        queryKey,
        queryFn,
        ...restOptions,
    });

    // Handle success - only call once when data becomes available
    if (query.isSuccess && query.data && onSuccess) {
        // Simple check to prevent multiple calls
        // Note: In production, you might want to use useEffect for this

        /* eslint-disable no-underscore-dangle */
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const hasSuccessCallback = (query.data as any).__successHandled;
        if (!hasSuccessCallback) {
            onSuccess(query.data);

            if (showSuccessToast) {
                // TODO: Replace with your toast notification system (e.g., PrimeReact Toast)
                /* eslint-disable no-console */
                console.log('✅', successMessage || 'Data loaded successfully');
            }

            // Mark as handled
            try {
                Object.defineProperty(query.data, '__successHandled', {
                    value: true,
                    enumerable: false,
                    configurable: true,
                });
            } catch {
                // Ignore if object is not extensible
            }
        }
    }

    // Handle error
    if (query.isError && query.error && onError) {
        onError(query.error);

        if (showErrorToast) {
            // TODO: Replace with your toast notification system (e.g., PrimeReact Toast)
            const errorMessage = query.error instanceof ApiError ? query.error.message : 'An error occurred while fetching data';
            /* eslint-disable no-console */
            console.error('❌', errorMessage);
        }
    }

    return query;
}
