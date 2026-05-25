import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCreateCampaignContext, type LeaderboardWeek } from '../context/createCampaignContext';
import useStepCollapseLogic from './useStepCollapseLogic';
import { useSponsorPortalSettings } from '../../../../../../hooks/mobileSponsorship/useSponsorPortalSettings';
import { useWeeklyLeaderboardItemPrices } from '../../../../../../hooks/mobileSponsorship/useWeeklyLeaderboardItemPrices';
import {
    generateId,
    parseNumber,
    calculateEndDate,
    getWeekTotals,
    isWeekValid,
    transformItemPricesToRankings,
} from '../utils/weeklyLeaderboardHelpers';

// Custom hook for managing Weekly Leaderboard campaign step with multiple weeks support
function useWeeklyLeaderboard() {
    // prettier-ignore
    const { weeklyLeaderboardData, updateCategoryData, currentCategoryId, setTotalSteps, markSubStepAsCompleted, unmarkSubStepAsCompleted } = useCreateCampaignContext();
    const { isCollapsed, expandStep, isStepCompleted } = useStepCollapseLogic(1);

    // State for driving the query
    const [currentFetch, setCurrentFetch] = useState<{ date: string; weekId: string } | undefined>();
    const [weekErrors, setWeekErrors] = useState<Record<string, string>>({});

    // API Hooks
    const { sponsorPortalSettingsData, isLoading: isLoadingSettings } = useSponsorPortalSettings();

    // Derived Data
    const allowedDay = sponsorPortalSettingsData?.data?.weekly_leaderboard_days || '';
    const weeklyLeaderboardDurationRaw = sponsorPortalSettingsData?.data?.weekly_leaderboard_duration;
    const weeklyLeaderboardDuration = Number.parseInt(String(weeklyLeaderboardDurationRaw ?? ''), 10);

    useEffect(() => {
        if (!Number.isFinite(weeklyLeaderboardDuration)) return;
        updateCategoryData(previous => {
            if (previous.weeklyLeaderboardData.durationDays === weeklyLeaderboardDuration) return previous;
            return {
                ...previous,
                weeklyLeaderboardData: { ...previous.weeklyLeaderboardData, durationDays: weeklyLeaderboardDuration },
            };
        });
    }, [weeklyLeaderboardDuration, updateCategoryData]);

    const grandTotal = useMemo(() => {
        return weeklyLeaderboardData.weeks.map(week => getWeekTotals(week).total).reduce((sum, total) => sum + total, 0);
    }, [weeklyLeaderboardData.weeks]);

    // Helpers
    // Updates a specific week with partial updates
    const updateWeek = useCallback(
        (weekId: string, updates: Partial<LeaderboardWeek>) => {
            updateCategoryData(previous => ({
                ...previous,
                weeklyLeaderboardData: {
                    ...previous.weeklyLeaderboardData,
                    weeks: previous.weeklyLeaderboardData.weeks.map(w => (w.id === weekId ? { ...w, ...updates } : w)),
                },
            }));
        },
        [updateCategoryData]
    );

    // Helper to update a week's rankings using a transformation function
    const updateWeekRankings = useCallback(
        (weekId: string, updater: (week: LeaderboardWeek) => LeaderboardWeek) => {
            updateCategoryData(previous => ({
                ...previous,
                weeklyLeaderboardData: {
                    ...previous.weeklyLeaderboardData,
                    weeks: previous.weeklyLeaderboardData.weeks.map(w => (w.id === weekId ? updater(w) : w)),
                },
            }));
        },
        [updateCategoryData]
    );

    // Use custom hook - just get the data
    const {
        weeklyLeaderboardItemPricesData,
        isLoading: isLoadingPrices,
        error: pricesError,
    } = useWeeklyLeaderboardItemPrices(currentFetch?.date, !!currentFetch?.date);

    // Process fetched data when it arrives
    useEffect(() => {
        if (!currentFetch || isLoadingPrices) return;

        if (pricesError) {
            /* eslint-disable-next-line no-console */
            console.error('Failed to fetch rankings:', pricesError);
            setWeekErrors(previous => ({ ...previous, [currentFetch.weekId]: 'Failed to load rankings.' }));
            // eslint-disable-next-line unicorn/no-useless-undefined
            setCurrentFetch(undefined);
            return;
        }

        if (weeklyLeaderboardItemPricesData?.data) {
            const { weekId } = currentFetch;
            const responseData = weeklyLeaderboardItemPricesData.data;

            if (Array.isArray(responseData.item_prices)) {
                const newRankings = transformItemPricesToRankings(responseData.item_prices, weekId);
                updateWeek(weekId, { rankings: newRankings });
            }
            // eslint-disable-next-line unicorn/no-useless-undefined
            setCurrentFetch(undefined);
        }
    }, [weeklyLeaderboardItemPricesData, pricesError, currentFetch, isLoadingPrices, updateWeek]);

    const weekLoadingIds = useMemo(() => {
        const set = new Set<string>();
        if (currentFetch && isLoadingPrices) {
            set.add(currentFetch.weekId);
        }
        return set;
    }, [currentFetch, isLoadingPrices]);

    // Derived: Check if campaign is savable
    const canSaveCampaign = useMemo(() => {
        return weeklyLeaderboardData.weeks.some(w => w.isSaved && isWeekValid(w));
    }, [weeklyLeaderboardData.weeks]);

    // Initialize weeks if empty
    useEffect(() => {
        if (weeklyLeaderboardData.weeks.length === 0) {
            updateCategoryData(previous => ({
                ...previous,
                weeklyLeaderboardData: {
                    ...previous.weeklyLeaderboardData,
                    weeks: [{ id: generateId(), startDate: '', endDate: '', rankings: [], isSaved: false }],
                },
            }));
        }
    }, [weeklyLeaderboardData.weeks.length, updateCategoryData]);

    // Sync step completion status
    useEffect(() => {
        if (canSaveCampaign) {
            markSubStepAsCompleted(currentCategoryId, 1);
        } else {
            unmarkSubStepAsCompleted(currentCategoryId, 1);
        }
    }, [canSaveCampaign, currentCategoryId, markSubStepAsCompleted, unmarkSubStepAsCompleted]);

    // Set total steps (idempotent - runs once per category)
    useEffect(() => {
        setTotalSteps(currentCategoryId, 1);
    }, [currentCategoryId, setTotalSteps]);

    // Handlers
    // Adds a new week to the leaderboard campaign and expands the step
    const handleAddWeek = useCallback(() => {
        updateCategoryData(previous => ({
            ...previous,
            weeklyLeaderboardData: {
                ...previous.weeklyLeaderboardData,
                weeks: [
                    ...previous.weeklyLeaderboardData.weeks,
                    {
                        id: generateId(),
                        startDate: '',
                        endDate: '',
                        rankings: [],
                        isSaved: false,
                    },
                ],
            },
        }));
        expandStep();
    }, [updateCategoryData, expandStep]);

    // Deletes a week from the leaderboard campaign
    const handleDeleteWeek = useCallback(
        (weekId: string) => {
            updateCategoryData(previous => ({
                ...previous,
                weeklyLeaderboardData: {
                    ...previous.weeklyLeaderboardData,
                    weeks: previous.weeklyLeaderboardData.weeks.filter(w => w.id !== weekId),
                },
            }));
        },
        [updateCategoryData]
    );

    // Handles start date change: validates day, calculates end date, and triggers rankings fetch
    const handleStartDateChange = useCallback(
        (weekId: string, date: string) => {
            if (!date) {
                updateWeek(weekId, { startDate: '', endDate: '', rankings: [] });
                setWeekErrors(previous => {
                    const newErrors = { ...previous };
                    delete newErrors[weekId];
                    return newErrors;
                });
                // eslint-disable-next-line unicorn/no-useless-undefined
                setCurrentFetch(undefined); // Abort/Reset fetch intention
                return;
            }

            const endDate = calculateEndDate(date);
            const dateObject = new Date(date);
            const dayName = dateObject.toLocaleDateString('en-US', { weekday: 'long' });

            if (allowedDay && dayName !== allowedDay) {
                setWeekErrors(previous => ({ ...previous, [weekId]: `Please select a ${allowedDay}` }));
                updateWeek(weekId, { startDate: date, endDate, rankings: [] });
                // eslint-disable-next-line unicorn/no-useless-undefined
                setCurrentFetch(undefined); // Invalid day, do not fetch
                return;
            }

            // Valid
            setWeekErrors(previous => {
                const newErrors = { ...previous };
                delete newErrors[weekId];
                return newErrors;
            });
            updateWeek(weekId, { startDate: date, endDate });

            // Trigger Query
            setCurrentFetch({ weekId, date });
        },
        [allowedDay, updateWeek]
    );

    // Toggles the selection state of a specific ranking by position
    const handleRankingToggle = useCallback(
        (weekId: string, position: number) => {
            updateWeekRankings(weekId, week => ({
                ...week,
                rankings: week.rankings.map(r => (r.position === position ? { ...r, isSelected: !r.isSelected } : r)),
            }));
        },
        [updateWeekRankings]
    );

    // Selects or deselects all rankings for a week (excluding booked ones)
    const handleSelectAllRankings = useCallback(
        (weekId: string, select: boolean) => {
            updateWeekRankings(weekId, week => ({
                ...week,
                rankings: week.rankings.map(r => {
                    if (r.status === 'Booked') return r;
                    return { ...r, isSelected: select };
                }),
            }));
        },
        [updateWeekRankings]
    );

    // Updates the reward value for a specific ranking position
    const handleRewardValueChange = useCallback(
        (weekId: string, position: number, value: string) => {
            const parsed = parseNumber(value);
            updateWeekRankings(weekId, week => ({
                ...week,
                rankings: week.rankings.map(r => (r.position === position ? { ...r, rewardValue: parsed } : r)),
            }));
        },
        [updateWeekRankings]
    );

    // Marks a week as saved
    const handleSaveWeek = useCallback(
        (weekId: string) => {
            updateWeek(weekId, { isSaved: true });
        },
        [updateWeek]
    );

    // Marks a week as unsaved and expands the step for editing
    const handleEditWeek = useCallback(
        (weekId: string) => {
            updateWeek(weekId, { isSaved: false });
            expandStep();
        },
        [updateWeek, expandStep]
    );

    return {
        weeks: weeklyLeaderboardData.weeks,
        allowedDay,
        weekErrors,
        weekLoadingIds,
        isLoadingPrices,
        pricesError,
        handleAddWeek,
        handleStartDateChange,
        handleRankingToggle,
        handleRewardValueChange,
        getWeekTotals, // Exported static helper if component needs it
        isWeekValid, // Exported static helper if component needs it
        handleSaveWeek,
        handleEditWeek,
        grandTotal,
        isStepCompleted,
        isCollapsed,
        expandStep,
        isLoadingSettings,
        handleDeleteWeek,
        handleSelectAllRankings,
    };
}

export default useWeeklyLeaderboard;
