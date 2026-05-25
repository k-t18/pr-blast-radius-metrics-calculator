interface ImpactStoryCardProperties {
    imageUrl: string;
    storyTitle: string;
    description: string;
    source: string;
}

function ImpactStoryCard({ imageUrl, storyTitle, description, source }: ImpactStoryCardProperties) {
    return (
        <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm" style={{ maxWidth: '675px' }}>
            {/* Left Side - Image */}
            <div className="flex-shrink-0" style={{ width: '50%' }}>
                <img src={imageUrl} alt={storyTitle} className="w-full h-full object-cover" style={{ minHeight: '200px' }} />
            </div>
            {/* Right Side - Text Content */}
            <div className="flex flex-col justify-between p-4" style={{ width: '50%' }}>
                <div>
                    <h3 className="text-base font-bold text-black mb-2">{storyTitle}</h3>
                    <p className="text-sm font-normal text-black mb-2">{description}</p>
                </div>
                {source && <p className="text-[12px] font-medium text-black mt-auto">{source}</p>}
            </div>
        </div>
    );
}

export default ImpactStoryCard;
