import { useMemo, useEffect } from 'react';
import { useSelectedSquaresStore } from '../../stores/selectedSquaresStore';
import useStudioShowEpisodes from './useStudioShowEpisodes';
import { formatCurrency } from '../../utils/formatCurrency';
import { useStudioShowCart } from './useStudioShowCart';

export interface SelectedSquare {
    id: string;
    usp: number;
    rv: number;
    type: string;
    item_code: string;
    square_id: string;
    sponsorship_category?: string;
    row?: string | number;
    sequence?: number;
    square_type?: string;
    minimum_reward_rate?: number;
    square_lable?: string | number;
}

const useDeclaredReward = () => {
    const {
        selectedSquareItems,
        episodeName,
        episodeDetails,
        rewardValues,
        rewardErrors,
        setEpisodeDetails,
        clearSelectedSquares,
        setRewardValues,
        setRewardErrors,
    } = useSelectedSquaresStore();
    const { episodesList } = useStudioShowEpisodes();
    const { addItem } = useStudioShowCart();

    // Redirect if no squares selected
    const hasNoSquares = selectedSquareItems.length === 0;

    // Find episode details from episodes list
    useEffect(() => {
        if (episodeName && episodesList.length > 0 && !episodeDetails) {
            const episode = episodesList.find(ep => ep.name === episodeName);
            if (episode) {
                setEpisodeDetails(episode);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [episodeName, episodesList]);

    // Map API square items to SelectedSquare format
    const squares = useMemo<SelectedSquare[]>(() => {
        return selectedSquareItems.map(item => ({
            id: item.square_id ?? '',
            usp: item.rate,
            rv: item.minimum_reward_rate,
            type: item.square_type,
            item_code: item?.square_item,
            square_id: item?.square_id ?? '',
            sponsorship_category: item?.sponsorship_category ?? '',
            row: item?.row,
            sequence: item.sequence,
            square_lable: item?.square_lable,
            square_type: item.square_type || '',
            minimum_reward_rate: item.minimum_reward_rate,
        }));
    }, [selectedSquareItems]);

    // Handle reward value change
    const handleRewardValueChange = (squareId: string, value: string) => {
        const numericValue = value === '' ? undefined : Number.parseFloat(value);

        const updatedRewardValues = { ...rewardValues };
        const updatedRewardErrors = { ...rewardErrors };

        if (numericValue === undefined) {
            delete updatedRewardValues[squareId];
            delete updatedRewardErrors[squareId];
        } else {
            const square = squares.find(sq => sq.id === squareId);
            if (!square) return;

            const minReward = square.rv;
            const isValid = numericValue >= minReward;

            updatedRewardValues[squareId] = numericValue;

            if (isValid) {
                delete updatedRewardErrors[squareId];
            } else {
                updatedRewardErrors[squareId] = `Must be greater than ${formatCurrency(minReward)}`;
            }
        }

        setRewardValues(updatedRewardValues);
        setRewardErrors(updatedRewardErrors);
    };

    // Calculate totals based on entered reward values
    const totals = useMemo(() => {
        let subtotalUSP = 0;
        selectedSquareItems.forEach(item => {
            subtotalUSP += item.rate;
        });

        // Sum of entered reward values (or 0 if not entered)
        let subtotalRewardValues = 0;
        squares.forEach(square => {
            const enteredValue = rewardValues[square.id] ?? 0;
            subtotalRewardValues += enteredValue;
        });

        const total = subtotalUSP + subtotalRewardValues;

        return {
            subtotalUSP,
            subtotalRewardValues,
            total,
        };
    }, [selectedSquareItems, squares, rewardValues]);

    // Check if all reward values are valid and filled
    const allRewardsValid = useMemo(() => {
        if (squares.length === 0) return false;

        return squares.every(square => {
            const enteredValue = rewardValues[square.id];
            return enteredValue !== undefined && enteredValue >= square.rv && !rewardErrors[square.id];
        });
    }, [squares, rewardValues, rewardErrors]);

    // Handle Add to Cart
    const handleAddToCart = () => {
        if (!episodeName || !allRewardsValid) return;

        // Add each square to cart
        squares.forEach(square => {
            const enteredRewardValue = rewardValues[square.id] || 0;

            // Total price = Unit Sales Price + Reward Value
            const totalPrice = square.usp + enteredRewardValue;

            addItem({
                episodeName,
                episodeTitle: episodeDetails?.episode_title || episodeName,
                title: `Square ${square?.square_lable || ''} - ${square?.type}`,
                price: totalPrice,
                sponsorship_category: square.sponsorship_category ?? '',
                row: square?.row,
                sequence: square?.sequence,
                usp: square.usp,
                rv: enteredRewardValue,
                iconKey: 'square',
                iconBgColor: '#FFF9F0',
                item_code: square?.item_code,
                square_id: square?.square_id ?? '',
                square_type: square?.square_type,
                custom_minimum_reward_rate: square?.minimum_reward_rate,
            });
        });

        // Clear selected squares after adding to cart
        clearSelectedSquares();
    };

    return {
        squares,
        rewardValues,
        rewardErrors,
        totals,
        allRewardsValid,
        handleRewardValueChange,
        handleAddToCart,
        hasNoSquares,
        episodeName,
        episodeDetails,
    };
};

export default useDeclaredReward;
