/**
 * TanStack Query Wrapper for POST/PUT/DELETE requests
 *
 * Provides a wrapper around useMutation with automatic success/error handling,
 * toast notifications, and type safety.
 *
 * @module useApiMutation
 */

import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';
import { ApiError } from '../services/api/apiClient';
import { showErrorToast } from '../services/toast/toastService';

/**
 * Extended options for API mutations with success/error callbacks
 */
export interface UseApiMutationOptions<TData, TVariables, TError = ApiError> extends Omit<
    UseMutationOptions<TData, TError, TVariables>,
    'mutationFn' | 'onSuccess' | 'onError'
> {
    /**
     * Callback fired when mutation succeeds
     */
    onSuccess?: (data: TData, variables: TVariables) => void;

    /**
     * Callback fired when mutation fails
     */
    onError?: (error: TError, variables: TVariables) => void;

    /**
     * Whether to show a success toast notification
     * @default true
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
 * Custom hook that wraps TanStack Query's useMutation with automatic success/error handling
 *
 * @example
 * ```typescript
 * const createInvoice = useApiMutation({
 *   mutationFn: (data) => api.post('/api/method/create_invoice', data),
 *   onSuccess: (data) => {
 *     console.log('Invoice created:', data);
 *     queryClient.invalidateQueries({ queryKey: ['invoices'] });
 *   },
 *   onError: (error) => {
 *     console.error('Failed to create invoice:', error);
 *   },
 *   successMessage: 'Invoice created successfully!',
 * });
 *
 * // Use it
 * createInvoice.mutate({ amount: 1000, status: 'Draft' });
 * ```
 *
 * @param options - Mutation configuration options
 * @returns TanStack Query mutation result
 */
export function useApiMutation<TData = unknown, TVariables = void, TError = ApiError>(
    options: {
        mutationFn: (variables: TVariables) => Promise<TData>;
    } & UseApiMutationOptions<TData, TVariables, TError>
): UseMutationResult<TData, TError, TVariables> {
    const {
        mutationFn,
        onSuccess,
        onError,
        showSuccessToast: shouldShowSuccessToast = true,
        showErrorToast: shouldShowErrorToast = true,
        successMessage,
        ...restOptions
    } = options;

    return useMutation<TData, TError, TVariables>({
        mutationFn,
        onSuccess: (data, variables) => {
            // Show success toast
            if (shouldShowSuccessToast) {
                // showSuccessToast(successMessage || 'Document Created Successfully');
                // eslint-disable-next-line no-console
                console.log('successMessage', successMessage);
            }

            // Call custom success handler
            if (onSuccess) {
                onSuccess(data, variables);
            }
        },
        onError: (error, variables) => {
            // Show error toast
            if (shouldShowErrorToast) {
                const errorMessage = error instanceof ApiError ? error.message : 'An error occurred during the operation';
                showErrorToast(errorMessage);
            }

            // Call custom error handler
            if (onError) {
                onError(error, variables);
            }
        },
        ...restOptions,
    });
}
