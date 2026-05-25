import { useState, useMemo } from 'react';
import EpisodeCard from '../../../components/cards/EpisodeCard';
import DescriptionText from '../../../components/common/DescriptionText';
import { CustomDropdown, type DropdownOption } from '../../../components/common/Dropdown';
import HeaderTitle from '../../../components/common/HeaderTitle';
import useStudioShowEpisodes from '../../../hooks/studioShow/useStudioShowEpisodes';
import useGameSeasons from '../../../hooks/studioShow/useGameSeasons';

function SponsorshipStudioShowPage() {
    const [selectedSeason, setSelectedSeason] = useState<string | undefined>();
    const { seasonsList, isLoading: isLoadingSeasons } = useGameSeasons();
    const { episodesList, isLoading: isLoadingEpisodes, error } = useStudioShowEpisodes(selectedSeason);

    // Map seasons to dropdown options
    const seasonOptions: DropdownOption[] = useMemo(() => {
        return seasonsList
            .map(season => ({
                label: `Season ${season.name}`,
                value: season.name,
            }))
            .sort((a, b) => Number.parseInt(b.value as string, 10) - Number.parseInt(a.value as string, 10));
    }, [seasonsList]);

    // Render episodes content based on state
    const renderEpisodesContent = () => {
        if (isLoadingEpisodes) {
            return (
                <div className="flex items-center justify-center py-12">
                    <DescriptionText text="Loading..." color="text-secondary-text" size="md" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center py-12">
                    <DescriptionText
                        text={error instanceof Error ? error.message : 'Failed to load data. Please try again.'}
                        color="text-red-600"
                        size="md"
                    />
                </div>
            );
        }

        if (episodesList.length === 0) {
            return (
                <div className="flex items-center justify-center py-12">
                    <DescriptionText text="No episodes available" color="text-secondary-text" size="md" />
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {episodesList.map(episode => (
                    <EpisodeCard
                        key={episode.name}
                        title={episode?.episode_title}
                        date={new Date(`${episode.episode_date}T${episode.episode_time}`)}
                        status={episode?.status}
                        categories={episode.categories_available}
                        linkLabel="View Categories"
                        linkRoute={`/sponsorship-type/studio-show/${episode.name}/categories?episode_title=${encodeURIComponent(
                            episode?.episode_title
                        )}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 mt-2">
                <HeaderTitle text="Select an Episode" size="2xl" weight="medium" disabled={false} />
                <DescriptionText text="Select an episodes to continue" color="text-secondary-text" size="sm" weight="medium" />
            </div>
            <div className="">
                <div className="">
                    <CustomDropdown
                        options={seasonOptions}
                        width="140px"
                        placeholder="Select Season"
                        value={selectedSeason as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                        onChange={option => {
                            setSelectedSeason(option as any); // eslint-disable-line @typescript-eslint/no-explicit-any
                        }}
                        disabled={isLoadingSeasons}
                    />
                </div>
            </div>
            {renderEpisodesContent()}
        </div>
    );
}

export default SponsorshipStudioShowPage;
