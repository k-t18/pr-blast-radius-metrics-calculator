import HeaderTitle from '../../../components/common/HeaderTitle';
import DescriptionText from '../../../components/common/DescriptionText';
import WinnersInfoCard from './WinnersInfoCard';

export function WinnersInfoSection() {
    return (
        <div>
            <HeaderTitle text="Winners Information" size="2xl" weight="medium" disabled={false} className="mb-6" />
            <DescriptionText
                text="See how your sponsorship has reached real winners across Chances Studio Shows and Mobile Games."
                weight="normal"
                className="mb-6"
            />
            <WinnersInfoCard />
        </div>
    );
}
