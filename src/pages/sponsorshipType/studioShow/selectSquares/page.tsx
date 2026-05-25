import { useMemo, type ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import SquareCard from '../../../../components/cards/SquareCard';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import DescriptionText from '../../../../components/common/DescriptionText';
import BackButton from '../../../../components/common/BackButton';
import { Gift, Lightning, Crown, SealQuestion, MagicWand } from '../../../../components/icons';
import LegendItem from '../../../../components/common/LegendItem';
import SelectedSquaresBar from './components/SelectedSquaresBar';
import useStudioShowEpisodeSquares from '../../../../hooks/studioShow/useStudioShowEpisodeSquares';
import useSquareSelection from '../../../../hooks/studioShow/useSquareSelection';
import type { EpisodeSquareItem } from '../../../../services/studioShow/getStudioShowEpisodeSquares.api';

const iconMap: Record<string, ReactElement> = {
    gift: <Gift size={14} color="#707070" />,
    vantage: <Crown size={14} color="#707070" />,
    chance: <MagicWand size={14} color="#707070" />,
    brainiac: <SealQuestion size={14} color="#707070" />,
    standard: <Lightning size={14} color="#707070" />,
    neutral: <Lightning size={14} color="#707070" />,
    jackpot: <Gift size={14} color="#707070" />,
    pit: <MagicWand size={14} color="#707070" />,
};

function SelectSquaresPage() {
    const [searchParameters] = useSearchParams();
    const episodeName = searchParameters.get('episode_name') || undefined;
    const { squaresList, isLoading, error } = useStudioShowEpisodeSquares(episodeName);
    const { selectedSquareIds, getStatus, handleSelect } = useSquareSelection({
        episodeName,
        squaresList,
    });

    // Snake-ladder arrangement: 10 positions per row
    // Sequence number determines position (1-10) within the row
    // Odd rows: left to right (position = sequence % 10, with 0 becoming 10)
    // Even rows: right to left (position reversed)
    const squaresByRow = useMemo(() => {
        // Group squares by row property from data
        const groupedByRow: Record<string, EpisodeSquareItem[]> = {};
        squaresList.forEach(square => {
            const row = square.row || '0';
            if (!groupedByRow[row]) {
                groupedByRow[row] = [];
            }
            groupedByRow[row].push(square);
        });

        // Get all row numbers and sort them numerically
        const rowNumbers = Object.keys(groupedByRow)
            .map(row => Number.parseInt(row, 10))
            .filter(rowNumber => !Number.isNaN(rowNumber))
            .sort((a, b) => a - b);

        const result: Array<{ row: number; squares: Array<EpisodeSquareItem | null> }> = [];

        // Build each row with 10 positions
        rowNumbers.forEach(rowNumber => {
            const squaresInRow = groupedByRow[rowNumber.toString()];
            const isEvenRow = rowNumber % 2 === 0;

            // Create array of 10 positions, all initially null
            const positions: Array<EpisodeSquareItem | null> = Array.from({ length: 10 }, () => null as EpisodeSquareItem | null);

            // Place each square in its correct position based on sequence
            squaresInRow.forEach(square => {
                // Calculate position (1-10) based on sequence
                // For sequences 1-10: position = sequence
                // For sequences 11-20: position = sequence - 10, etc.
                let position = ((square.sequence - 1) % 10) + 1;

                // For even rows, reverse the position (snake pattern)
                if (isEvenRow) {
                    position = 11 - position;
                }

                // Place square at position (0-indexed)
                positions[position - 1] = square;
            });

            result.push({ row: rowNumber, squares: positions });
        });

        // Reverse result so row 1 appears at bottom (display order: highest row number first)
        return result.reverse();
    }, [squaresList]);

    if (isLoading) {
        return (
            <div className="overflow-visible flex flex-col gap-6">
                <BackButton />
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Select Squares" size="2xl" color="text-primary-text" weight="medium" />
                    <DescriptionText
                        size="sm"
                        weight="medium"
                        text="Each square has a Unit Sales Price that is the price for the square itself and a set Minimum Reward Value that goes to the player. You must at least match the value or exceed that value to stand out!"
                    />
                </div>
                <div className="flex items-center justify-center py-12">
                    <DescriptionText text="Loading squares..." color="text-secondary-text" size="md" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="overflow-visible flex flex-col gap-6">
                <BackButton />
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Select Squares" size="2xl" color="text-primary-text" weight="medium" />
                    <DescriptionText
                        size="sm"
                        weight="medium"
                        text="Each square has a Unit Sales Price that is the price for the square itself and a set Minimum Reward Value that goes to the player. You must at least match the value or exceed that value to stand out!"
                    />
                </div>
                <div className="flex items-center justify-center py-12">
                    <DescriptionText
                        text={error instanceof Error ? error.message : 'Failed to load squares. Please try again.'}
                        color="text-red-600"
                        size="md"
                    />
                </div>
            </div>
        );
    }

    if (squaresList.length === 0) {
        return (
            <div className="overflow-visible flex flex-col gap-6">
                <BackButton />
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Select Squares" size="2xl" color="text-primary-text" weight="medium" />
                    <DescriptionText
                        size="sm"
                        weight="medium"
                        text="Each square has a Unit Sales Price that is the price for the square itself and a set Minimum Reward Value that goes to the player. You must at least match the value or exceed that value to stand out!"
                    />
                </div>
                <div className="flex items-center justify-center py-12">
                    <DescriptionText text="No squares available" color="text-secondary-text" size="md" />
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-visible flex flex-col gap-6">
            <BackButton />

            <div className="flex flex-col gap-2">
                <HeaderTitle text="Select Squares - Episode Name/ no" size="2xl" color="text-primary-text" weight="medium" />

                <DescriptionText
                    size="sm"
                    weight="medium"
                    text="Each square has a Unit Sales Price that is the price for the square itself and a set Minimum Reward Value that goes to the player. You must at least match the value or exceed that value to stand out!"
                />
            </div>

            <div className="flex flex-col gap-4">
                {/* Legend */}
                <div className="flex gap-6.5">
                    <LegendItem boxClass="bg-border-gray-600 border-border-gray-600" textClass="text-xs" label="Unavailable" />
                    <LegendItem boxClass="bg-white border border-border-gray-600" textClass="text-xs" label="Available" />
                    <LegendItem boxClass="border border-brand-primary-800 bg-brand-primary-500/10" textClass="text-xs" label="Your selection" />
                </div>

                {/* Squares Grid - Snake-ladder arrangement */}
                <div className="flex flex-col gap-3">
                    {squaresByRow.map(({ row, squares }) => (
                        <div key={row} className="grid grid-cols-10 gap-3">
                            {squares.map((sq, index) => {
                                const position = index + 1;
                                if (sq === null) {
                                    // Empty space for missing sequence
                                    return <div key={`empty-row-${row}-pos-${position}`} className="w-full" />;
                                }
                                const squareType = sq.square_type?.toLowerCase();
                                return (
                                    <SquareCard
                                        key={sq.square_id || sq.sequence}
                                        number={sq?.square_lable}
                                        usp={sq.rate}
                                        rv={sq.minimum_reward_rate}
                                        status={getStatus(sq.square_id || '')}
                                        type={sq.square_type}
                                        icon={squareType ? iconMap[squareType] : undefined}
                                        onClick={() => sq.square_id && handleSelect(sq.square_id)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Bar */}
            {selectedSquareIds.length > 0 && (
                <SelectedSquaresBar selectedIds={selectedSquareIds.filter((id): id is string => id !== null)} squares={squaresList} />
            )}
        </div>
    );
}

export default SelectSquaresPage;
