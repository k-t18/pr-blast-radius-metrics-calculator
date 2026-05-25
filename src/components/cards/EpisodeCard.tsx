import HeaderTitle from '../common/HeaderTitle';
import IconBadge from '../common/IconBadge';
import { dateDashFormat, time12hFormat } from '../../utils/dateUtils';
import StatusBadge from '../common/StatusBadge';
import DescriptionText from '../common/DescriptionText';
import LinkButton from '../common/LinkButton';
import { Square, Calendar, Lightning, Crown } from '../icons';

// export type EpisodeStatus = 'Available' | 'filling-fast' | 'sold-out'| 'Unavailable';

interface EpisodeCardProperties {
    date: Date;
    title: string;
    status: string;
    categories: number;
    className?: string;
    linkLabel: string;
    linkRoute: string;
}

function EpisodeCard({ title, date, status, categories, className = '', linkLabel, linkRoute }: EpisodeCardProperties) {
    const isSoldOut = status === 'sold-out';
    const formattedDate = dateDashFormat(date);
    const formattedTime = time12hFormat(date);
    const categoriesAvailable = Number(categories) + 1;
    const isLinkDisabled = ['Unavailable', 'Completed'].includes(status);

    return (
        <div className="relative">
            {/* Grey overlay if sold out */}
            {isSoldOut && <div className="absolute inset-0 bg-[#EBEBEB] opacity-50 rounded-lg z-10 pointer-events-none" />}

            <div className={`border border-border-gray-600 rounded-lg p-4 flex flex-col gap-4 transition-colors relative ${className}`}>
                {/* Header with Status Badge */}
                <div className="flex justify-between items-center">
                    <HeaderTitle text={title} size="xl" weight="medium" />

                    {status && <StatusBadge statusKey={status} variant="filled" shape="pill" />}
                </div>

                {/* Date + Time */}
                <div className="flex items-center gap-4 text-primary-text text-base">
                    <Calendar size={24} />
                    <div className="flex items-center">
                        <DescriptionText text={formattedDate} className="pr-2 leading-4 font-ubuntu" color="text-primary-text" size="md" />
                        <DescriptionText text={formattedTime} className="border-l-2 pl-2 leading-4 font-ubuntu" color="text-primary-text" size="md" />
                    </div>
                </div>

                {/* Categories Section */}
                <div className="flex items-center gap-4 text-primary-text">
                    <div className="flex -space-x-3">
                        <IconBadge icon={<Square />} size="sm" shape="square" bgColor="#FFD6FE" />
                        <IconBadge icon={<Lightning />} size="sm" shape="square" bgColor="#FFF3B0" />
                        <IconBadge icon={<Crown />} size="sm" shape="square" bgColor="#FFD2CE" />
                    </div>
                    <DescriptionText text={`${categoriesAvailable} Categories Available`} size="sm" color="text-primary-text" />
                </div>

                {/* View Categories Link */}

                <div className="">
                    <LinkButton
                        to={linkRoute}
                        width="full"
                        align="left"
                        className="min-h-11 flex items-center"
                        disabled={isLinkDisabled || isSoldOut}
                    >
                        {linkLabel}
                    </LinkButton>
                </div>
            </div>
        </div>
    );
}

export default EpisodeCard;
