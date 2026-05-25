import '../../../../../../../styles/mobileSponsorshipStyles/step3SelectCampaignObjective.css';

interface CampaignObjectiveCardProperties {
    icon: React.ReactNode;
    name: string;
    radioId: string;
    description: string;
    cpmRate?: number;
    cpcRate?: number;
    isSelected: boolean;
    onClick: () => void;
    isDefault?: boolean;
    badge?: string;
    rateLabel?: string;
    customRateDisplay?: string;
}

export default function CampaignObjectiveCard({
    icon,
    name,
    radioId: _radioId,
    description,
    cpmRate,
    cpcRate,
    isSelected,
    onClick,
    isDefault = false,
    badge,
    rateLabel = 'Base CPM Rate:',
    customRateDisplay,
}: CampaignObjectiveCardProperties) {
    const renderRate = () => {
        if (customRateDisplay) {
            return <span className="rate-value">{customRateDisplay}</span>;
        }

        if (cpmRate !== undefined && cpcRate !== undefined) {
            return (
                <span className="rate-value">
                    Base CPM Rate: ₦{cpmRate} | Base CPC Rate: ₦{cpcRate}
                </span>
            );
        }

        if (cpcRate !== undefined) {
            return <span className="rate-value">₦{cpcRate}</span>;
        }

        if (cpmRate !== undefined) {
            return <span className="rate-value">₦{cpmRate}</span>;
        }
    };

    return (
        <button type="button" className={`objective-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <div className="objective-card-content">
                <div className="objective-header">
                    <div className="objective-title-group">
                        {icon}
                        <span className="objective-name">{name}</span>
                        {isDefault && <span className="objective-badge">Default</span>}
                        {badge && <span className="objective-badge">{badge}</span>}
                    </div>
                    <div className="objective-radio">
                        <div className={`radio-button ${isSelected ? 'checked' : ''}`} />
                    </div>
                </div>
                <p className="objective-description text-left">{description}</p>
                <div className="objective-rate">
                    {customRateDisplay ? (
                        renderRate()
                    ) : (
                        <>
                            <span className="rate-label">{rateLabel}</span>
                            {renderRate()}
                        </>
                    )}
                </div>
            </div>
        </button>
    );
}
