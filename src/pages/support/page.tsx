import HeaderTitle from '../../components/common/HeaderTitle';
import SupportForm from './components/SupportForm';
import TicketHistory from './components/TicketHistory';

function SupportPage() {
    return (
        <div className="support-page p-6">
            <div className="mb-6">
                <HeaderTitle text="Support" size="2xl" weight="medium" className="font-ubuntu" />
            </div>

            <SupportForm />

            {/* Ticket History */}
            <TicketHistory />
        </div>
    );
}

export default SupportPage;
