import { useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelectedSquaresStore } from '../../stores/selectedSquaresStore';
import type { EpisodeSquareItem } from '../../services/studioShow/getStudioShowEpisodeSquares.api';
import type { SquareStatus } from '../../components/cards/SquareCard';

interface UseSquareSelectionProperties {
    episodeName: string | undefined;
    squaresList: EpisodeSquareItem[];
}

const useSquareSelection = ({ episodeName, squaresList }: UseSquareSelectionProperties) => {
    const [searchParameters] = useSearchParams();
    const squareId = searchParameters.get('square_id') || undefined;
    const {
        selectedSquareItems,
        addSquare,
        removeSquare,
        clearSelectedSquares,
        setEpisodeName,
        episodeName: storedEpisodeName,
    } = useSelectedSquaresStore();

    // Clear selections and update episode name only when episode changes to a different episode
    useEffect(() => {
        // Only clear if episode name has actually changed to a different episode
        if (episodeName && episodeName !== storedEpisodeName) {
            clearSelectedSquares();
            setEpisodeName(episodeName);
        } else if (episodeName && !storedEpisodeName) {
            // Set episode name if it's not set yet
            setEpisodeName(episodeName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [episodeName]);

    // Auto-select square based on square_id from URL
    useEffect(() => {
        if (squareId && squaresList.length > 0) {
            const square = squaresList.find(sq => sq.square_id === squareId);
            if (square && square.square_id && !selectedSquareItems.some(item => item.square_id === square.square_id)) {
                addSquare(square);
            }
        }
    }, [squareId, squaresList, addSquare, selectedSquareItems]);

    // Filter selected squares to only include those from the current episode's squares list
    // This ensures we only show selections that are valid for the current episode
    const currentEpisodeSelectedSquares = useMemo(() => {
        return selectedSquareItems.filter(item => item.square_id && squaresList.some(sq => sq.square_id === item.square_id));
    }, [selectedSquareItems, squaresList]);

    const selectedSquareIds = useMemo(() => {
        return currentEpisodeSelectedSquares.map(item => item.square_id);
    }, [currentEpisodeSelectedSquares]);

    const getStatus = useCallback(
        (id: string): SquareStatus => {
            const square = squaresList.find(sq => sq.square_id === id);

            if (square?.square_status?.toLowerCase() === 'pit') return 'special';
            if (currentEpisodeSelectedSquares.some(item => item.square_id === id)) return 'selected';
            return (square?.square_status?.toLowerCase() as SquareStatus) || 'available';
        },
        [squaresList, currentEpisodeSelectedSquares]
    );

    const handleSelect = useCallback(
        (id: string) => {
            const square = squaresList.find(sq => sq.square_id === id);
            if (!square || !square.square_id) return;

            const isSelected = selectedSquareItems.some(item => item.square_id === id);
            if (isSelected) {
                removeSquare(id);
            } else {
                addSquare(square);
            }
        },
        [squaresList, selectedSquareItems, addSquare, removeSquare]
    );

    return {
        selectedSquareIds,
        currentEpisodeSelectedSquares,
        getStatus,
        handleSelect,
    };
};

export default useSquareSelection;
