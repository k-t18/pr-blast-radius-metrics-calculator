import { create } from 'zustand';

export type CartIconKey = 'square' | 'lightning' | 'crown' | 'handshake' | 'television' | 'truck' | 'microphone' | 'palette' | 'default';

export interface StudioShowCartItem {
    id: string;
    episodeName: string;
    episodeTitle?: string;
    title: string;
    price: number;
    type?: string;
    status?: string;
    usp?: number;
    rv?: number;
    item_code?: string;
    square_id?: string;
    sponsorship_category?: string;
    row?: number | string;
    sequence?: number;
    iconKey: CartIconKey;
    iconBgColor: string;
    showSelectSquareBtn?: boolean;
    square_type?: string;
    custom_minimum_reward_rate?: number;
}

export interface StudioShowCartEpisode {
    episodeName: string;
    items: StudioShowCartItem[];
}

export interface AddCartItemInput {
    episodeName: string;
    episodeTitle?: string;
    title: string;
    price: number;
    type?: string;
    status?: string;
    usp?: number;
    rv?: number;
    item_code?: string;
    square_id?: string;
    sponsorship_category?: string;
    row?: number | string;
    sequence?: number;
    iconKey?: CartIconKey;
    iconBgColor?: string;
    showSelectSquareBtn?: boolean;
    square_type?: string;
    custom_minimum_reward_rate?: number;
}

export type CartState = Record<string, StudioShowCartItem[]>;
export type SelectionState = Set<string>; // Set of item IDs that are selected

interface StudioShowCartStore {
    state: CartState;
    selectedItems: SelectionState;
    vatAmount: number;
    addItem: (item: AddCartItemInput) => void;
    removeItem: (episodeName: string, itemId: string) => void;
    clearEpisode: (episodeName: string) => void;
    isItemInCart: (episodeName: string | undefined, title: string) => boolean;
    toggleItemSelection: (itemId: string) => void;
    toggleEpisodeSelection: (episodeName: string, selectAll: boolean) => void;
    isItemSelected: (itemId: string) => boolean;
    isEpisodeFullySelected: (episodeName: string) => boolean;
    clearSelections: () => void;
    clearCart: () => void;
    removeSelectedItemsFromCart: () => void;
    setVatAmount: (amount: number) => void;
}

const DEFAULT_BG_COLOR = '#FFF9F0';

export interface ResolvedEpisodeItem {
    id: string;
    iconKey: CartIconKey;
    iconBgColor: string;
    name: string;
    price: number;
    formattedPrice: string;
    usp?: number;
    formattedUSP?: string;
    rv?: number;
    formattedRV?: string;
    showSelectSquareBtn?: boolean;
    isChecked: boolean;
}

export interface ResolvedEpisode {
    episodeName: string;
    items: ResolvedEpisodeItem[];
    total: number;
    formattedTotal: string;
    isFullySelected: boolean;
}

const generateId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const useStudioShowCartStore = create<StudioShowCartStore>((set, get) => ({
    state: {},
    selectedItems: new Set<string>(),
    vatAmount: 0,

    addItem: (item: AddCartItemInput) => {
        if (!item.episodeName || !item.title) {
            return;
        }

        set(current => {
            const episodeItems = current.state[item.episodeName] ?? [];
            const existingItemIndex = episodeItems.findIndex(existing =>
                item.square_id ? existing.square_id === item.square_id : existing.title === item.title
            );

            if (existingItemIndex !== -1) {
                const existingItem = episodeItems[existingItemIndex];
                // If item exists and has different rv value, update it
                if ((item.rv ?? 0) !== (existingItem.rv ?? 0)) {
                    episodeItems[existingItemIndex] = { ...existingItem, ...item, id: existingItem.id };
                    return {
                        state: {
                            ...current.state,
                            [item.episodeName]: episodeItems,
                        },
                    };
                }
                return current;
            }

            const newItem: StudioShowCartItem = {
                id: generateId(),
                episodeName: item.episodeName,
                episodeTitle: item.episodeTitle,
                title: item.title,
                price: item.price,
                status: item.status,
                usp: item.usp ?? 0,
                rv: item.rv ?? 0,
                sponsorship_category: item?.sponsorship_category,
                sequence: item?.sequence,
                row: item?.row,
                item_code: item?.item_code,
                square_id: item?.square_id,
                square_type: item?.square_type,
                iconKey: item.iconKey ?? 'default',
                iconBgColor: item.iconBgColor ?? DEFAULT_BG_COLOR,
                showSelectSquareBtn: item.showSelectSquareBtn,
                custom_minimum_reward_rate: item?.custom_minimum_reward_rate,
            };

            return {
                state: {
                    ...current.state,
                    [item.episodeName]: [...episodeItems, newItem],
                },
            };
        });
    },

    removeItem: (episodeName: string, itemId: string) => {
        set(current => {
            const episodeItems = current.state[episodeName];

            if (!episodeItems) {
                return current;
            }

            const filtered = episodeItems.filter(item => item.id !== itemId);

            // Remove from selected items when deleting
            const newSelected = new Set(current.selectedItems);
            newSelected.delete(itemId);

            // If no items left in this episode, remove the episode key
            if (filtered.length === 0) {
                const rest = { ...current.state };
                delete rest[episodeName];

                return {
                    state: rest,
                    selectedItems: newSelected,
                };
            }

            // Otherwise, update the episode with remaining items
            return {
                state: {
                    ...current.state,
                    [episodeName]: filtered,
                },
                selectedItems: newSelected,
            };
        });
    },

    clearEpisode: (episodeName: string) => {
        set(current => {
            if (!current.state[episodeName]) {
                return current;
            }

            const episodeItems = current.state[episodeName];

            // Safely remove episode from state WITHOUT destructuring
            const rest = { ...current.state };
            delete rest[episodeName];

            // Remove all episode item IDs from selectedItems
            const newSelected = new Set(current.selectedItems);

            episodeItems.forEach(episodeItem => {
                newSelected.delete(episodeItem.id);
            });

            return {
                state: rest,
                selectedItems: newSelected,
            };
        });
    },

    isItemInCart: (episodeName: string | undefined, title: string) => {
        if (!episodeName) {
            return false;
        }
        const currentState = get().state;
        return currentState[episodeName]?.some(item => item.title === title) ?? false;
    },

    toggleItemSelection: (itemId: string) => {
        set(current => {
            const newSelected = new Set(current.selectedItems);
            if (newSelected.has(itemId)) {
                newSelected.delete(itemId);
            } else {
                newSelected.add(itemId);
            }
            return {
                selectedItems: newSelected,
            };
        });
    },

    toggleEpisodeSelection: (episodeName: string, selectAll: boolean) => {
        set(current => {
            const episodeItems = current.state[episodeName];
            if (!episodeItems) {
                return current;
            }

            const newSelected = new Set(current.selectedItems);
            if (selectAll) {
                // Select all items in the episode
                episodeItems.forEach(item => {
                    newSelected.add(item.id);
                });
            } else {
                // Deselect all items in the episode
                episodeItems.forEach(item => {
                    newSelected.delete(item.id);
                });
            }

            return {
                selectedItems: newSelected,
            };
        });
    },

    isItemSelected: (itemId: string) => {
        return get().selectedItems.has(itemId);
    },

    isEpisodeFullySelected: (episodeName: string) => {
        const { state, selectedItems } = get();
        const episodeItems = state[episodeName];
        if (!episodeItems || episodeItems.length === 0) {
            return false;
        }
        return episodeItems.every(item => selectedItems.has(item.id));
    },

    clearSelections: () => {
        set({ selectedItems: new Set<string>() });
    },

    clearCart: () => {
        set({
            state: {},
            selectedItems: new Set<string>(),
            vatAmount: 0,
        });
    },

    removeSelectedItemsFromCart: () => {
        set(current => {
            const { state, selectedItems } = current;
            if (selectedItems.size === 0) {
                return current;
            }

            // Create a new state object without selected items
            const newState: CartState = {};
            const newSelectedItems = new Set<string>();

            // Iterate through all episodes
            Object.entries(state).forEach(([episodeName, items]) => {
                // Filter out selected items
                const remainingItems = items.filter(item => !selectedItems.has(item.id));

                // Only keep the episode if there are remaining items
                if (remainingItems.length > 0) {
                    newState[episodeName] = remainingItems;
                }
            });

            return {
                state: newState,
                selectedItems: newSelectedItems,
                vatAmount: 0,
            };
        });
    },

    setVatAmount: (amount: number) => {
        set({ vatAmount: amount });
    },
}));
