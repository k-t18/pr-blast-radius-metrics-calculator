import { WinnersInfoSection } from './components/WinnersInfoSection';
import WinnersInfoTabs from './components/WinnersInfoTabs';

function WinnersInfoPage() {
    return (
        <>
            <div>
                <WinnersInfoSection />
            </div>
            <div>
                <WinnersInfoTabs />
            </div>
        </>
    );
}

export default WinnersInfoPage;
