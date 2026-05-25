import FloatingContainer from '../../../../../components/common/FloatingContainer';
import LinkButton from '../../../../../components/common/LinkButton';
import type { EpisodeSquareItem } from '../../../../../services/studioShow/getStudioShowEpisodeSquares.api';

interface SelectedSquaresBarProperties {
    selectedIds: string[];
    squares: EpisodeSquareItem[];
}

function SelectedSquaresBar({ selectedIds, squares }: SelectedSquaresBarProperties) {
    const selectedItems = selectedIds.map(squareId => {
        const sq = squares.find(s => s.square_id === squareId);
        return {
            squareId,
            square_lable: sq?.square_lable,
            square_type: sq?.square_type ?? undefined,
        };
    });

    return (
        <FloatingContainer
            position="sticky"
            bottom="2rem"
            left="-0.5rem"
            width="calc(100% + 1rem)"
            bgColor="white"
            borderRadius="0.5rem"
            padding="1rem 0.5rem 1rem 1rem"
            className="-mx-2 flex items-center justify-between mt-4"
        >
            {/* Left */}
            <div className="flex items-center gap-4 flex-wrap">
                <span className="font-medium text-sm text-primary-text">Squares Selected ({selectedItems.length}):</span>

                <div className="flex justify-content-start gap-5">
                    {selectedItems.map(sq => (
                        <div key={sq.squareId} className="flex justify-content-start gap-1">
                            <span className="text-sm text-primary-text capitalize!">{sq?.square_lable}</span>
                            {sq.square_type && <span className="text-sm text-primary-text capitalize!">&nbsp;-&nbsp;{sq.square_type}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right */}
            <LinkButton
                to="/sponsorship-type/studio-show/declare-reward"
                textColor="text-white"
                width="auto"
                className="p-2! gap-2 flex items-center text-sm! bg-brand-primary-500 border border-brand-primary-500 rounded"
            >
                Quote Reward
            </LinkButton>
        </FloatingContainer>
    );
}

export default SelectedSquaresBar;
