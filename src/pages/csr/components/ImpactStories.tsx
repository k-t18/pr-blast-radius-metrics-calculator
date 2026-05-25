import { useState, useMemo } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import SliderCard from './SliderCard';
import HeaderTitle from '../../../components/common/HeaderTitle';
import ShareModal from './ShareModal';
import { createImpactStoryShareConfig } from '../config/shareModalConfigs';

interface ImpactStoryData {
    id: string;
    storyTitle: string;
    description: string;
    source: string;
    imageUrl: string;
    fullMessageUrl?: string;
}

const impactStoriesData: ImpactStoryData[] = [
    {
        id: '1',
        storyTitle: 'Story title.',
        description: 'Education is the most powerful weapon. These new schools have given children a chance at a brighter future.',
        source: '-NGO/ New channel Name.',
        imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
        fullMessageUrl: 'https://example.com/story/1',
    },
    {
        id: '2',
        storyTitle: 'Story title.',
        description: 'Education is the most powerful weapon. These new schools have given children a chance at a brighter future.',
        source: '-NGO/ New channel Name.',
        imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
        fullMessageUrl: 'https://example.com/story/2',
    },
    {
        id: '3',
        storyTitle: 'Story title.',
        description: 'Education is the most powerful weapon. These new schools have given children a chance at a brighter future.',
        source: '-NGO/ New channel Name.',
        imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
        fullMessageUrl: 'https://example.com/story/3',
    },
    {
        id: '4',
        storyTitle: 'Story title.',
        description: 'Education is the most powerful weapon. These new schools have given children a chance at a brighter future.',
        source: '-NGO/ New channel Name.',
        imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
        fullMessageUrl: 'https://example.com/story/4',
    },
];

function ImpactStories() {
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [selectedStory, setSelectedStory] = useState<ImpactStoryData | undefined>();

    const handleShare = (story: ImpactStoryData) => {
        setSelectedStory(story);
        setIsShareModalVisible(true);
    };

    // Create modal configuration when a story is selected
    const shareModalConfig = useMemo(() => {
        if (!selectedStory) {
            // Return a default config to ensure modal can always render
            return createImpactStoryShareConfig({
                storyTitle: '',
                description: '',
                source: '',
                imageUrl: '',
                ngoName: 'NGO Name',
                companyName: 'Your Company',
            });
        }
        return createImpactStoryShareConfig({
            storyTitle: selectedStory.storyTitle,
            description: selectedStory.description,
            source: selectedStory.source,
            imageUrl: selectedStory.imageUrl,
            ngoName: 'NGO Name', // This would typically come from props or API
            companyName: 'Your Company', // This would typically come from props or API
        });
    }, [selectedStory]);
    const [sliderReference] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: 'free-snap',
        slides: {
            perView: 4,
            spacing: 24,
        },
        breakpoints: {
            '(max-width: 1024px)': {
                slides: {
                    perView: 3,
                    spacing: 20,
                },
            },
            '(max-width: 768px)': {
                slides: {
                    perView: 2,
                    spacing: 16,
                },
            },
            '(max-width: 640px)': {
                slides: {
                    perView: 1,
                    spacing: 12,
                },
            },
        },
    });

    return (
        <div>
            <div className="mb-6">
                <HeaderTitle text="Impact stories" size="xl" weight="bold" className="mb-2" />
                <p className="text-sm font-normal text-black">Newsletters and articles where your company was mentioned.</p>
            </div>
            <div ref={sliderReference} className="keen-slider">
                {impactStoriesData.map(story => (
                    <div key={story.id} className="keen-slider__slide">
                        <SliderCard
                            variant="impact-story"
                            storyTitle={story.storyTitle}
                            description={story.description}
                            source={story.source}
                            imageUrl={story.imageUrl}
                            fullMessageUrl={story.fullMessageUrl}
                            onShare={() => handleShare(story)}
                        />
                    </div>
                ))}
            </div>
            <ShareModal
                visible={isShareModalVisible && !!selectedStory}
                onHide={() => {
                    setIsShareModalVisible(false);
                    // eslint-disable-next-line unicorn/no-useless-undefined
                    setSelectedStory(undefined);
                }}
                config={shareModalConfig}
            />
        </div>
    );
}

export default ImpactStories;
