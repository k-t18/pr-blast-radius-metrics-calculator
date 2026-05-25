/**
 * Sidebar Component provides the main navigation for the application with links to different pages.
 * Each navigation item can include an icon and label.
 */
import { useLocation } from 'react-router-dom';
import { ChartBar, Gift, HandHeart, Headset, Images, Invoice, Megaphone, MoneyWavy, SketchLogo, Trophy } from '../icons';
import SidebarItem from './SidebarItem';

export type NavItem = {
    label: string;
    path: string;
    icon?: React.ReactNode;
    children?: NavItem[];
};

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <ChartBar />,
    },
    {
        label: 'Sponsorship Type',
        path: '/sponsorship-type',
        icon: <SketchLogo />,
        children: [
            { label: 'Blanket Sponsorship', path: '/sponsorship-type/blanket-sponsorship' },
            { label: 'Studio Show', path: '/sponsorship-type/studio-show' },
            { label: 'Mobile Sponsorship', path: '/sponsorship-type/mobile-sponsorship' },
        ],
    },

    {
        label: 'Transactions',
        path: '/transactions',
        icon: <Invoice />,
        children: [
            { label: 'Quotes', path: '/transactions/quotes' },
            { label: 'Orders', path: '/transactions/orders' },
            { label: 'Invoices', path: '/transactions/invoices' },
        ],
    },
    {
        label: 'Prize Agreement',
        path: '/prize-agreement',
        icon: <Gift />,
    },
    {
        label: 'Payments',
        path: '/payments',
        icon: <MoneyWavy />,
    },
    {
        label: 'Creatives Upload',
        path: '/creatives-upload',
        icon: <Images />,
    },
    {
        label: 'CSR',
        path: '/csr',
        icon: <HandHeart />,
    },
    {
        label: 'Ad Campaigns',
        path: '/ad-campaigns',
        icon: <Megaphone />,
    },
    {
        label: 'Winners Info',
        path: '/winners-info',
        icon: <Trophy />,
    },
    {
        label: 'Support',
        path: '/support',
        icon: <Headset />,
    },
];

function Sidebar() {
    const location = useLocation();

    return (
        <div className="shadow-[2px_4px_4px_0px_#8F8F8F40] w-[230px] flex-shrink-0 z-3 p-4 bg-white h-full flex flex-col justify-between overflow-y-auto">
            <nav className="">
                {navItems.map(item => (
                    <SidebarItem key={item.path} item={item} depth={0} currentPath={location.pathname} />
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;
