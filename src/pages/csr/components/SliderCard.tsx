import { ArrowSquareOut, ShareNetwork } from '../../../components/icons';

interface SliderCardProperties {
    // Testimonial props
    quote?: string;
    name?: string;
    role?: string;
    // Impact story props
    storyTitle?: string;
    description?: string;
    source?: string;
    // Common props
    imageUrl: string;
    fullMessageUrl?: string;
    onShare?: () => void;
    variant?: 'testimonial' | 'impact-story';
}

function SliderCard({ quote, name, role, storyTitle, description, source, imageUrl, fullMessageUrl, onShare, variant }: SliderCardProperties) {
    const isImpactStory = variant === 'impact-story' || (storyTitle && description);

    return (
        <div className="flex h-full flex-col rounded-sm bg-white overflow-hidden">
            {isImpactStory ? (
                <>
                    <div className="mb-4">
                        <img src={imageUrl} alt={storyTitle || 'Story image'} className="w-full h-48 object-cover" />
                    </div>
                    <div className="flex flex-col flex-1">
                        <h3 className="mb-2 text-base font-medium text-black">{storyTitle}</h3>
                        <p className="mb-2 text-sm font-normal text-black flex-1 text-black">{description}</p>
                        {source && <p className="mb-2 text-[12px] font-medium text-black">{source}</p>}
                        <div className="mt-auto flex gap-6">
                            {fullMessageUrl && (
                                <a
                                    href={fullMessageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-normal text-black hover:underline text-[12px] font-ubuntu cursor-pointer"
                                >
                                    Full Message
                                    <ArrowSquareOut size={16} />
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={onShare}
                                className="flex items-center gap-2 text-sm font-normal text-black hover:underline text-[12px] font-ubuntu cursor-pointer"
                            >
                                Share
                                <ShareNetwork size={16} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col p-3 h-full">
                    <div className="mb-4">
                        {quote && (
                            <h3>
                                <q className="text-xl font-bold text-black font-ubuntu">{quote}</q>
                            </h3>
                        )}
                    </div>
                    <div className="mb-4 flex items-center gap-3">
                        <img src={imageUrl} alt={name || 'Profile'} className="h-11 w-11 rounded-full object-cover" />
                        <div>
                            {name && <p className="text-base font-medium text-black mb-2">{name}</p>}
                            {role && <p className="text-[12px] font-normal text-black">{role}</p>}
                        </div>
                    </div>
                    <div className="mt-auto flex gap-6">
                        {fullMessageUrl && (
                            <a
                                href={fullMessageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-normal text-black hover:underline text-[12px] font-ubuntu cursor-pointer"
                            >
                                Full Message
                                <ArrowSquareOut size={16} />
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={onShare}
                            className="flex items-center gap-2 text-sm font-normal text-black hover:underline text-[12px] font-ubuntu cursor-pointer"
                        >
                            Share
                            <ShareNetwork size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SliderCard;
