import { create } from 'zustand';
import type { EpisodeSquareItem } from '../services/studioShow/getStudioShowEpisodeSquares.api';
import type { StudioShowEpisode } from '../services/studioShow/getStudioShowEpisodes.api';

interface SelectedSquaresStore {
    episodeName: string | undefined;
    episodeDetails: StudioShowEpisode | undefined;
    selectedSquareItems: EpisodeSquareItem[];
    rewardValues: Record<string, number | undefined>;
    rewardErrors: Record<string, string>;
    setSelectedSquares: (episodeName: string | undefined, squares: EpisodeSquareItem[]) => void;
    setEpisodeDetails: (episode: StudioShowEpisode | undefined) => void;
    setEpisodeName: (episodeName: string) => void;
    clearSelectedSquares: () => void;
    addSquare: (square: EpisodeSquareItem) => void;
    removeSquare: (squareId: string) => void;
    setRewardValues: (values: Record<number, number | undefined>) => void;
    setRewardErrors: (errors: Record<number, string>) => void;
}

export const useSelectedSquaresStore = create<SelectedSquaresStore>(set => ({
    episodeName: undefined,
    episodeDetails: undefined,
    selectedSquareItems: [],
    rewardValues: {},
    rewardErrors: {},

    setSelectedSquares: (episodeName, squares) => {
        set({
            episodeName,
            selectedSquareItems: squares,
        });
    },

    setEpisodeDetails: episode => {
        set({
            episodeDetails: episode,
        });
    },

    setEpisodeName: episodeName => {
        set({
            episodeName,
        });
    },

    clearSelectedSquares: () => {
        set({
            episodeName: undefined,
            episodeDetails: undefined,
            selectedSquareItems: [],
            rewardValues: {},
            rewardErrors: {},
        });
    },

    addSquare: square => {
        set(current => {
            // Only add if square has a square_id and it doesn't already exist
            if (!square.square_id) return current;
            const exists = current.selectedSquareItems.some(item => item.square_id === square.square_id);
            if (exists) {
                return current;
            }
            return {
                selectedSquareItems: [...current.selectedSquareItems, square],
            };
        });
    },

    removeSquare: squareId => {
        set(current => ({
            selectedSquareItems: current.selectedSquareItems.filter(item => item.square_id !== squareId),
        }));
    },

    setRewardValues: values => {
        set({ rewardValues: values });
    },

    setRewardErrors: errors => {
        set({ rewardErrors: errors });
    },
}));
