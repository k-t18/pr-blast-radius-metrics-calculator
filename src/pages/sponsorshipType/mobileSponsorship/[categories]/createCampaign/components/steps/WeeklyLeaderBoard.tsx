import ActionButton from '../../../../../../../components/common/ActionButton';
import DateInput from '../../../../../../../components/common/DateInput';
import useWeeklyLeaderboard from '../../hooks/useWeeklyLeaderboard';
import StepHeader from './StepHeader';
import RankingsTable from './RankingsTable';
import { Plus, Trash } from '../../../../../../../components/icons';
import '../../../../../../../styles/mobileSponsorshipStyles/weeklyLeaderboard.css';
import '../../../../../../../styles/mobileSponsorshipStyles/stepHeader.css';
import { CurrencySymbol } from '../../../../../../../components/common/CurrencySymbol';
import { SkeletonRankingsTable, SkeletonSummary, SkeletonDateInputs } from '../../../../skeleton/weeklyLeaderboardSkeleton';

export default function WeeklyLeaderBoard() {
    const {
        weeks,
        allowedDay,
        weekErrors,
        weekLoadingIds,
        pricesError,
        handleAddWeek,
        handleStartDateChange,
        handleRankingToggle,
        handleRewardValueChange,
        getWeekTotals,
        isWeekValid,
        handleSaveWeek,
        handleEditWeek,
        grandTotal,
        isCollapsed,
        isLoadingSettings,
        handleDeleteWeek,
        handleSelectAllRankings,
    } = useWeeklyLeaderboard();

    // Determine if we should show the "Add New Week" button
    // Show if there are weeks and the last one is saved
    const showAddWeekButton = weeks.length > 0 && weeks.at(-1)?.isSaved;

    const stepStatusClass = isCollapsed ? 'step-inactive' : 'step-active';

    return (
        <div className={`step-container ${stepStatusClass}`}>
            {/* Main Step Title - Not using StepHeader as requested */}
            <div className="step-header">
                <div className="step-header-content">
                    <h2 className="step-title">Step 1. Select week and positions to sponsor</h2>
                </div>
            </div>

            <div className={`step-content ${isCollapsed ? 'step-content-collapsed' : 'step-content-expanded'}`}>
                {/* Global error message for prices error */}
                {pricesError && (
                    <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        Failed to load rankings. Please try again.
                    </div>
                )}

                {/* Weeks List */}
                <div className="flex flex-col gap-6 w-full">
                    {weeks.map(week => {
                        const { subtotalUnitSales, subtotalRewardValue, total } = getWeekTotals(week);
                        const isValid = isWeekValid(week);
                        const errorMessage = weekErrors[week.id];
                        const isLoading = weekLoadingIds.has(week.id);

                        // Render Saved View (Using StepHeader as requested)
                        if (week.isSaved) {
                            return (
                                <StepHeader
                                    key={week.id}
                                    title={`Week of ${week.startDate ? new Date(week.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Unknown'}`}
                                    isCollapsed
                                    onEdit={() => handleEditWeek(week.id)}
                                    onDelete={() => handleDeleteWeek(week.id)}
                                    titleClassName="!text-black"
                                />
                            );
                        }

                        // Determine Select All State
                        const availableRankings = week.rankings.filter(r => r.status === 'Available');
                        const allSelected = availableRankings.length > 0 && availableRankings.every(r => r.isSelected);
                        const someSelected = availableRankings.some(r => r.isSelected);

                        // Determine delete button visibility
                        // Hide only for the initial empty state (single week, no data)
                        // Show in all other cases (editing, multiple weeks, etc.)
                        const isInitialEmptyState = weeks.length === 1 && !week.startDate;
                        const showDelete = !isInitialEmptyState;

                        return (
                            <div key={week.id} className=" p-4 mb-4 bg-white">
                                {isLoadingSettings ? (
                                    <SkeletonDateInputs />
                                ) : (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-sm font-medium text-color-black">
                                                Choose a {allowedDay || 'day'} to set the start of the leaderboard week.
                                            </h4>
                                            {showDelete && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteWeek(week.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Date Selection */}
                                        <div className="leaderboard-period-inputs-section">
                                            <div className="leaderboard-period-input-group">
                                                <DateInput
                                                    id={`start-date-${week.id}`}
                                                    name={`start-date-${week.id}`}
                                                    label="Select start date"
                                                    value={week.startDate}
                                                    onChange={value => handleStartDateChange(week.id, value)}
                                                    dateFormat="dd-mm-yy"
                                                    className="leaderboard-period-date-input"
                                                    labelClassName="leaderboard-period-label"
                                                    placeholder="dd-mm-yyyy"
                                                />
                                                {errorMessage && <span className="text-xs text-red-500 mt-1 block">{errorMessage}</span>}
                                            </div>
                                            <div className="leaderboard-period-input-group">
                                                <div className="flex flex-col">
                                                    <span className="leaderboard-period-label mb-2">End date</span>
                                                    <div className="h-10 py-2 text-gray-900 text-sm flex items-center font-medium">
                                                        {week.endDate || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Show skeleton when loading rankings */}
                                {isLoading && (
                                    <>
                                        <SkeletonRankingsTable />
                                        <SkeletonSummary />
                                        <div className="flex justify-start mt-4">
                                            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    </>
                                )}

                                {/* Rankings Table */}
                                {!isLoading && week.rankings.length > 0 && (
                                    <>
                                        <RankingsTable
                                            rankings={week.rankings}
                                            allSelected={allSelected}
                                            someSelected={someSelected}
                                            onSelectAll={checked => handleSelectAllRankings(week.id, checked)}
                                            onToggle={pos => handleRankingToggle(week.id, pos)}
                                            onRewardChange={(pos, value) => handleRewardValueChange(week.id, pos, value)}
                                        />

                                        {/* Week Totals */}
                                        <div className="leaderboard-summary mt-4">
                                            <div className="leaderboard-summary-row">
                                                <span className="leaderboard-summary-label">Sub Total</span>
                                                <span className="leaderboard-summary-value">
                                                    {subtotalUnitSales > 0 ? `₦ ${subtotalUnitSales.toLocaleString()}` : '-'}
                                                </span>
                                                <span className="leaderboard-summary-value">
                                                    {subtotalRewardValue > 0 ? `₦ ${subtotalRewardValue.toLocaleString()}` : '-'}
                                                </span>
                                            </div>
                                            <div className="leaderboard-summary-row leaderboard-summary-total-row">
                                                <span className="leaderboard-summary-label">Your Total</span>
                                                <span className="leaderboard-summary-spacer" />
                                                <span className="leaderboard-summary-total text-brand-500">
                                                    {total > 0 ? `₦ ${total.toLocaleString()}` : '-'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Save Week Button */}
                                        <div className="flex justify-start mt-4">
                                            <ActionButton
                                                bgColor="bg-brand-500"
                                                textColor="text-white"
                                                width="auto"
                                                className={`text-sm rounded-sm font-normal font-ubuntu ${isValid ? 'bg-[#7E22CE] hover:bg-[#6B21A8]' : 'bg-gray-300 cursor-not-allowed opacity-70'}`}
                                                onClick={() => handleSaveWeek(week.id)}
                                                isDisabled={!isValid}
                                            >
                                                Save Week
                                            </ActionButton>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Add New Week Button */}
                {showAddWeekButton && (
                    <div className="mt-6 w-full">
                        <ActionButton
                            onClick={handleAddWeek}
                            bgColor="bg-white"
                            textColor="text-dark"
                            borderColor="border-[#D6D6D6]"
                            width="auto"
                            className="p-2 text-[12px] rounded-sm font-normal font-ubuntu"
                        >
                            <Plus size={16} />
                            Add New Week
                        </ActionButton>
                    </div>
                )}

                {/* Grand Total */}
                {grandTotal > 0 && (
                    <div className="mt-8 border-t pt-4 flex justify-between items-center w-full">
                        <span className="text-md font-bold text-color-black">Total Campaign Value</span>
                        <span className="text-md font-bold text-brand-500">
                            <CurrencySymbol />
                            {grandTotal.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
