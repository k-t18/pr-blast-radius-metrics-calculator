import { useCallback, useMemo, useState } from 'react';
import {
    useStudioShowCartStore,
    type CartState,
    type SelectionState,
    type StudioShowCartEpisode,
    type StudioShowCartItem,
} from '../../stores/studioShowCartStore';
import { createStudioShowQuotation, type CreateStudioShowQuotationPayload } from '../../services/studioShow/createStudioShowQuotation.api';
import { getVatCalculation, type VatCalculationPayload } from '../../services/studioShow/getVatCalculation.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { useApiMutation } from '../useApiMutation';
import { ApiError } from '../../services/api/apiClient';

const getStateSignature = (state: CartState, selectedItems: SelectionState): string => {
    const entries = Object.entries(state);
    const sortedEntries = entries.sort(([a], [b]) => a.localeCompare(b));
    const selectedIds = [...selectedItems].sort().join(',');
    return JSON.stringify({
        state: sortedEntries.map(([episodeName, items]) => [episodeName, items.map(item => ({ id: item.id, title: item.title, price: item.price }))]),
        selected: selectedIds,
    });
};

export const useStudioShowCart = () => {
    const [open, setOpen] = useState(false);
    const [requestQuoteError, setRequestQuoteError] = useState<string>('');
    const [selectedBlanketOrderId, setSelectedBlanketOrderId] = useState<string | null>(null);

    // Select store state and actions (these are stable references)
    const vatAmount = useStudioShowCartStore(store => store.vatAmount);
    const setVatAmount = useStudioShowCartStore(store => store.setVatAmount);
    const addItem = useStudioShowCartStore(store => store.addItem);
    const removeItem = useStudioShowCartStore(store => store.removeItem);
    const clearEpisode = useStudioShowCartStore(store => store.clearEpisode);
    const isItemInCart = useStudioShowCartStore(store => store.isItemInCart);
    const toggleItemSelection = useStudioShowCartStore(store => store.toggleItemSelection);
    const toggleEpisodeSelection = useStudioShowCartStore(store => store.toggleEpisodeSelection);
    const isItemSelected = useStudioShowCartStore(store => store.isItemSelected);
    const isEpisodeFullySelected = useStudioShowCartStore(store => store.isEpisodeFullySelected);
    const clearSelections = useStudioShowCartStore(store => store.clearSelections);
    const removeSelectedItemsFromCart = useStudioShowCartStore(store => store.removeSelectedItemsFromCart);

    // Select a stable state signature - this string only changes when state content or selections change
    const stateSignature = useStudioShowCartStore(store => getStateSignature(store.state, store.selectedItems));

    // Compute episodes from state using useMemo - only recompute when stateSignature changes
    const episodes = useMemo<StudioShowCartEpisode[]>(() => {
        const currentState = useStudioShowCartStore.getState().state;
        return Object.entries(currentState).map(([episodeName, items]) => ({
            episodeName,
            items,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateSignature]);

    // Compute totals from selected items only using useMemo
    const totals = useMemo(() => {
        const store = useStudioShowCartStore.getState();
        const { selectedItems } = store;
        const accumulator = { price: 0, usp: 0, rv: 0, itemCount: 0 };

        episodes.forEach(episode => {
            episode.items.forEach(item => {
                if (selectedItems.has(item.id) && !item?.showSelectSquareBtn) {
                    accumulator.price += item.price;
                    accumulator.usp += item.usp ?? 0;
                    accumulator.rv += item.rv ?? 0;
                    accumulator.itemCount += 1;
                }
            });
        });

        return accumulator;
    }, [episodes, stateSignature]);

    // Get selected items count for UI
    const selectedItemsCount = useMemo(() => {
        return useStudioShowCartStore.getState().selectedItems.size;
    }, [stateSignature]);

    // Get selected cart items
    const selectedCartItems = useMemo<StudioShowCartItem[]>(() => {
        const store = useStudioShowCartStore.getState();
        return episodes.flatMap(episode =>
            episode.items
                .filter(item => store.selectedItems.has(item.id))
                .map(item => ({
                    ...item,
                    episodeName: episode.episodeName,
                }))
        );
    }, [episodes, stateSignature]);

    const vatMutation = useApiMutation({
        mutationFn: (payload: VatCalculationPayload) => getVatCalculation(payload),
        onSuccess: data => {
            const responseData = (data as { data?: unknown }).data;
            if (responseData && typeof responseData === 'object') {
                const record = responseData as Record<string, unknown>;
                const totalVatAmount = record.total_vat_amount || 0;

                setVatAmount(Number(totalVatAmount));
                return;
            }
            setVatAmount(0);
        },
        successMessage: 'VAT calculated for selected items!',
        onError: () => {
            setVatAmount(0);
        },
    });

    // Calculate VAT based on current selected items (recalculates payload from current store state)
    const calculateVat = useCallback(() => {
        // Get current store state to build fresh payload
        const store = useStudioShowCartStore.getState();
        const currentEpisodes = Object.entries(store.state).map(([episodeName, items]) => ({
            episodeName,
            items,
        }));

        const currentSelectedCartItems = currentEpisodes.flatMap(episode =>
            episode.items
                .filter(item => store.selectedItems.has(item.id))
                .map(item => ({
                    ...item,
                    episodeName: episode.episodeName,
                }))
        );

        // Build VAT payload from current selections
        const items = currentSelectedCartItems
            .filter(item => !item.showSelectSquareBtn)
            .map(item => item.item_code)
            .filter((itemCode): itemCode is string => Boolean(itemCode && itemCode.trim().length > 0))
            .map(item_code => ({ item_code, qty: 1 }));

        if (items.length === 0) {
            setVatAmount(0);
            return;
        }

        // Avoid re-firing while a request is already in-flight
        if (vatMutation.isPending) {
            return;
        }

        vatMutation.mutate({ items });
    }, [vatMutation]);

    // Wrapper for toggleItemSelection that also triggers VAT calculation
    const handleToggleItemSelection = useCallback(
        (itemId: string) => {
            toggleItemSelection(itemId);
            // Trigger VAT calculation after selection changes
            // Use setTimeout to ensure store state is updated first
            setTimeout(() => {
                calculateVat();
            }, 0);
        },
        [toggleItemSelection, calculateVat]
    );

    // Wrapper for toggleEpisodeSelection that also triggers VAT calculation
    const handleToggleEpisodeSelection = useCallback(
        (episodeName: string, selectAll: boolean) => {
            toggleEpisodeSelection(episodeName, selectAll);
            // Trigger VAT calculation after selection changes
            // Use setTimeout to ensure store state is updated first
            setTimeout(() => {
                calculateVat();
            }, 0);
        },
        [toggleEpisodeSelection, calculateVat]
    );

    // Build quotation payload from selected items
    const buildQuotationPayload = (): CreateStudioShowQuotationPayload => {
        return {
            game_format: 'Studio Show',
            blanket_order: selectedBlanketOrderId ?? '',
            items: selectedCartItems.map(item => ({
                item_code: item?.item_code ?? '',
                item_name: item?.item_code ?? '',
                item_group: 'Studio Show Sponsorship',
                qty: 1,
                rate: item?.usp,
                custom_episode: item?.episodeName,
                custom_sponsorship_category: item?.sponsorship_category,
                custom_square: item.square_id ?? '',
                custom_sequence: item?.sequence || 0,
                custom_row: Number(item.row),
                custom_declared_reward_amount: item.rv ?? 0,
                custom_square_type: item.square_type || '',
                custom_minimum_reward_rate: item.custom_minimum_reward_rate ?? 0,
                blanket_order: selectedBlanketOrderId ?? '',
                against_blanket_order: selectedBlanketOrderId ? 1 : 0,
            })),
        };
    };

    // Computed formatted totals
    const formattedTotals = useMemo(() => {
        const subtotalRV = formatCurrency(totals.rv);
        const subtotalUSP = formatCurrency(totals.usp);
        const formattedVat = formatCurrency(vatAmount);
        const totalWithVat = formatCurrency(totals.price + vatAmount);
        const cartTotalLabel = `Cart Total (${totals.itemCount} ${totals.itemCount === 1 ? 'Item' : 'Items'})`;

        return {
            subtotalRV,
            subtotalUSP,
            vatAmount,
            formattedVat,
            totalWithVat,
            cartTotalLabel,
        };
    }, [totals, vatAmount]);
    const hasSelectedItems = selectedItemsCount > 0;

    // API mutation for creating quotation
    const mutation = useApiMutation({
        mutationFn: (payload: CreateStudioShowQuotationPayload) => createStudioShowQuotation(payload),
        onSuccess: () => {
            setOpen(true);
            removeSelectedItemsFromCart();
            setRequestQuoteError('');
            setSelectedBlanketOrderId(null);
        },
        onError: error => {
            const message = error instanceof ApiError ? error.message : 'Failed to request quote. Please try again.';
            setRequestQuoteError(message);
        },
        successMessage: 'Quote requested successfully!',
    });

    const handleRequestQuote = () => {
        if (!hasSelectedItems || mutation.isPending) {
            return;
        }

        const payload = buildQuotationPayload();
        mutation.mutate(payload);
    };

    const isRequestingQuote = mutation.isPending;
    const rawTotalWithVat = totals.price + vatAmount;

    return {
        open,
        setOpen,
        isRequestingQuote,
        requestQuoteError,
        setRequestQuoteError,
        hasSelectedItems,
        episodes,
        totals,
        selectedItemsCount,
        selectedCartItems,
        formattedTotals,
        rawTotalWithVat,
        selectedBlanketOrderId,
        setSelectedBlanketOrderId,
        buildQuotationPayload,
        addItem,
        removeItem,
        clearEpisode,
        isItemInCart,
        toggleItemSelection: handleToggleItemSelection,
        toggleEpisodeSelection: handleToggleEpisodeSelection,
        isItemSelected,
        isEpisodeFullySelected,
        clearSelections,
        handleRequestQuote,
        vatMutation,
    };
};
