import HeaderTitle from '../../../components/common/HeaderTitle';
import AdsCampaignTabs from './AdsCampaignTabs';

function AdsCampaignMaster() {
    return (
        <div>
            <HeaderTitle text="Campaign" size="2xl" weight="medium" disabled={false} className="mb-6" />
            <AdsCampaignTabs />
        </div>
    );
}
export default AdsCampaignMaster;
