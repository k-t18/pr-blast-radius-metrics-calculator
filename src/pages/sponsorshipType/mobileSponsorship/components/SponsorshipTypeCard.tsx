import HeaderTitle from '../../../../components/common/HeaderTitle';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import StatusBadge from '../../../../components/common/StatusBadge';
import { Colors } from '../../../../styles/tokens';
import '../../../../styles/mobileSponsorshipStyles/sponsorshipTypeCard.css';
import type { SponsorshipType } from '../dataset/mobileSponsorshipData';

interface SponsorshipTypeCardProperties {
    type: SponsorshipType;
    onClick?: (type: SponsorshipType) => void;
    isSelected?: boolean;
}

function SponsorshipTypeCard({ type, onClick, isSelected = false }: SponsorshipTypeCardProperties) {
    const handleClick = () => {
        if (onClick) {
            onClick(type);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            className={`sponsorship-type-card ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {type.isRecommended && (
                <StatusBadge
                    label="Recommended"
                    bgColor={Colors.brand[500]}
                    textColor={Colors.text.white}
                    borderColor={Colors.brand[500]}
                    variant="filled"
                    shape="square"
                    className="recommended-badge"
                />
            )}
            <div className="card-header">
                <div className="card-icon">{type.icon}</div>
                <HeaderTitle text={type.title} className="card-title" />
            </div>
            {type.rewardAmount && (
                <div className="card-reward-amount">
                    <CurrencySymbol />
                    <span className="font-medium">{type.rewardAmount}</span>
                </div>
            )}
            <p className="card-description">{type.description}</p>
        </div>
    );
}
export default SponsorshipTypeCard;
