import { lazy, Suspense, useMemo, useState } from 'react';
import TabViewCard from '../../../components/cards/TabViewCard';
import type { AccordionItem } from '../../../components/common/Accordion';
import { useCreativesOrder } from '../../../hooks/creatives/useCreativesOrder';
import { useLeadUserLogo } from '../../../hooks/creatives/useLeadUserLogo';
import type { CreativeEpisode, CreativesSelectOption } from '../../../interfaces/creatives/creatives.types';
import type { SalesOrderWithItems } from '../../../interfaces/prizeAgreement/prizeAgreement.types';
import CreativeEpisodeContent from './CreativeEpisodeContent';

const CreativesSubmissionModal = lazy(() => import('./CreativesSubmissionModal'));

interface CreativesOrderCardProperties {
    order: SalesOrderWithItems;
    platform: 'mobile-game' | 'studio-show';
    onNavigateToSubmittedTab?: (platform: 'mobile-game' | 'studio-show') => void;
    onRefetchSalesOrders?: () => void;
}

const DEFAULT_ASSET_TYPE_OPTIONS: CreativesSelectOption[] = [
    // { label: 'JPG', value: 'jpg' },
    // { label: 'Banner', value: 'banner' },
    // { label: 'Video', value: 'video' },
    // { label: 'Logo Animation', value: 'logo-animation' },
    // { label: 'Storyboard', value: 'storyboard' },
    // { label: 'TV Commercial', value: 'tvc' },
    { label: 'Gif', value: 'Gif' },
    { label: 'Image', value: 'Image' },
    { label: 'Video', value: 'Video' },
];

const DEFAULT_LOGO_REQUIREMENT = {
    id: 'default-logo',
    imageUrl: '',
    alt: 'Sponsor Logo',
    dimensions: '500 x 500 px',
    format: 'PNG (transparent)',
    sizeLimit: '< 2MB',
};

const DEFAULT_ASSET_REQUIREMENT = {
    id: 'default-asset',
    assetTypeOptions: DEFAULT_ASSET_TYPE_OPTIONS,
    maxFileSizeMB: 10,
    helperText: 'Upload creative assets for this item.',
};

const mapItemsToEpisodes = (items: SalesOrderWithItems['items_with_status'], logoData: { url: string; file_name: string }): CreativeEpisode[] =>
    items.map(item => ({
        id: item.name,
        title: item.item_name || item.sponsor_item_name || `-`,
        episodeLabel: item.custom_episode ? `Episode ${item.custom_episode.split('-')[0]}` : `-`,
        progress: 0,
        logoRequirement: { ...DEFAULT_LOGO_REQUIREMENT, id: `logo-${item.name}`, imageUrl: logoData?.url, fileName: logoData?.file_name },
        assetRequirement: { ...DEFAULT_ASSET_REQUIREMENT, id: `asset-${item.name}` },
    }));

function CreativesOrderCard({ order, platform, onNavigateToSubmittedTab, onRefetchSalesOrders }: CreativesOrderCardProperties) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [resetKey, setResetKey] = useState(0);
    const logoData = useLeadUserLogo();

    const episodes = useMemo(() => mapItemsToEpisodes(order.items_with_status, logoData), [order.items_with_status, logoData]);

    const {
        handleEpisodeDataChange,
        handleSaveEpisode,
        episodeProgress,
        canSubmitCreatives,
        handleSubmitCreatives,
        isSubmittingCreatives,
        showSubmissionModal,
        setShowSubmissionModal,
        savingEpisodes,
        saveErrors,
        resetAllEpisodes,
    } = useCreativesOrder(episodes);

    const accordionItems: AccordionItem[] = useMemo(
        () =>
            episodes.map(episode => ({
                id: episode.id,
                title: episode.title,
                subtitle: episode.episodeLabel,
                showProgressIndicator: true,
                progress: episodeProgress[episode.id] || 0,
                content: (
                    <CreativeEpisodeContent
                        key={`${episode.id}-${resetKey}`}
                        episode={episode}
                        platform={platform}
                        progress={episodeProgress[episode.id] || 0}
                        onDataChange={data => handleEpisodeDataChange(episode.id, data)}
                        onSave={() => handleSaveEpisode(episode.id)}
                        isSaveDisabled={savingEpisodes[episode.id]}
                        saveErrorMessage={saveErrors[episode.id]}
                    />
                ),
            })),
        [episodes, episodeProgress, platform, handleEpisodeDataChange, handleSaveEpisode, savingEpisodes, saveErrors, resetKey]
    );

    const timelineEventName = platform === 'mobile-game' ? 'mobileGameCreativesUpload' : 'studioShowCreativesUpload';

    return (
        <>
            <TabViewCard
                title={`Order ID: ${order.name}`}
                amount={order.grand_total}
                creationDate={order.creation}
                timelineEventName={timelineEventName}
                accordionItems={accordionItems}
                activeIndex={activeIndex}
                onTabChange={event => {
                    const clickedIndex = Number(event?.index);
                    setActiveIndex(activeIndex === clickedIndex ? null : clickedIndex);
                }}
                accordionClassName="card-accordion"
                areAllItemsSaved={canSubmitCreatives}
                isSubmitting={isSubmittingCreatives}
                buttonLabel="Submit Creatives"
                cardSubmitHandler={() => handleSubmitCreatives(order, platform === 'mobile-game' ? 'Mobile Game' : 'Studio Show')}
            />

            {showSubmissionModal && (
                <Suspense fallback={undefined}>
                    <CreativesSubmissionModal
                        visible={showSubmissionModal}
                        onHide={() => setShowSubmissionModal(false)}
                        onViewSubmittedCreatives={() => {
                            setShowSubmissionModal(false);
                            onNavigateToSubmittedTab?.(platform);
                            onRefetchSalesOrders?.();
                        }}
                        onSubmitNewCreatives={() => {
                            setShowSubmissionModal(false);
                            resetAllEpisodes();
                            setResetKey(previous => previous + 1);
                            onRefetchSalesOrders?.();
                        }}
                    />
                </Suspense>
            )}
        </>
    );
}

export default CreativesOrderCard;
