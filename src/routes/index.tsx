/**
 * Application Routes Configuration
 *
 * Defines all routes for the application using React Router's RouteObject format.
 * Routes are consumed by the useRoutes hook in App.tsx.
 *
 * Routes can include a `handle` property with `noLayout: true` to opt-out of
 * the default Layout wrapper (useful for pages with custom layouts).
 *
 * Public routes: /login, /registration
 * All other routes are protected and require authentication.
 */

import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import OrdersPage from '../pages/transactions/orders/page';
import QuotesPage from '../pages/transactions/quotes/page';
import InvoicesPage from '../pages/transactions/invoices/page';
import PaymentsPage from '../pages/payments/page';
import PrizeAgreement from '../pages/prizeAgreement/page';
import CreativesUploadPage from '../pages/creatives/page';
import SponsorshipStudioShowPage from '../pages/sponsorshipType/studioShow/page';
import SponsorshipStudioShowCategoriesPage from '../pages/sponsorshipType/studioShow/[episodes]/categories/page';
import SponsorRegistration from '../pages/sponsorRegistration/page';
import CartPage from '../pages/cart/page';
import SelectSquaresPage from '../pages/sponsorshipType/studioShow/selectSquares/page';
import DeclareRewardPage from '../pages/sponsorshipType/studioShow/declareRewards/page';
import MobileSponsorshipPage from '../pages/sponsorshipType/mobileSponsorship/page';
import SelectCategoriesPage from '../pages/sponsorshipType/mobileSponsorship/[categories]/page';
import CreateCampaignPage from '../pages/sponsorshipType/mobileSponsorship/[categories]/createCampaign/page';
import SponsorshipBlanketOrderPage from '../pages/sponsorshipType/blanketSponsorship/page';
import SupportPage from '../pages/support/page';
import NotFoundPage from '../pages/notFoundPage/page';
import CSRPage from '../pages/csr/page';
import AdsCampaignPage from '../pages/adsCampaign/page';
import WinnersInfoPage from '../pages/winnersInfo/page';
import DashboardPage from '../pages/dashboard/page';
import LoginPage from '../pages/login/page';
import ShareCsrPage from '../pages/csr/share/page';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

export const routes: RouteObject[] = [
    // Fully public routes (accessible by anyone, no auth checks)
    {
        path: '/csr/share',
        Component: ShareCsrPage,
        handle: { noLayout: true },
    },

    // Public-only routes (redirect to dashboard if already logged in)
    {
        element: <PublicRoute />,
        children: [
            {
                path: '/login',
                Component: LoginPage,
                handle: { noLayout: true },
            },
            {
                path: '/registration',
                Component: SponsorRegistration,
                // Opt-out of default layout - this page has custom layout with stepper
                handle: { noLayout: true },
            },
        ],
    },

    // Protected routes (authentication required)
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: '/dashboard',
                Component: DashboardPage,
            },
            {
                path: '/creatives-upload',
                Component: CreativesUploadPage,
            },
            {
                path: '/transactions/quotes',
                Component: QuotesPage,
            },
            {
                path: '/transactions/orders',
                Component: OrdersPage,
            },
            {
                path: '/transactions/invoices',
                Component: InvoicesPage,
            },
            {
                path: '/payments',
                Component: PaymentsPage,
            },
            {
                path: '/prize-agreement',
                Component: PrizeAgreement,
            },
            {
                path: '/sponsorship-type/studio-show',
                Component: SponsorshipStudioShowPage,
            },
            {
                path: '/sponsorship-type/studio-show/:episode/categories',
                Component: SponsorshipStudioShowCategoriesPage,
            },
            {
                path: '/sponsorship-type/blanket-sponsorship',
                Component: SponsorshipBlanketOrderPage,
            },
            {
                path: '/cart',
                Component: CartPage,
            },
            {
                path: '/sponsorship-type/studio-show/select-squares',
                Component: SelectSquaresPage,
            },
            {
                path: '/sponsorship-type/studio-show/declare-reward',
                Component: DeclareRewardPage,
            },
            {
                path: '/ad-campaigns',
                Component: AdsCampaignPage,
            },
            {
                path: '/sponsorship-type/mobile-sponsorship',
                Component: MobileSponsorshipPage,
            },
            {
                path: '/sponsorship-type/mobile-sponsorship/:categories',
                Component: SelectCategoriesPage,
            },
            {
                path: '/sponsorship-type/mobile-sponsorship/:categories/create-campaign',
                Component: CreateCampaignPage,
            },
            {
                path: '/support',
                Component: SupportPage,
            },
            {
                path: '/csr',
                Component: CSRPage,
            },
            {
                path: '/winners-info',
                Component: WinnersInfoPage,
            },
            // Catch-all route (protected - shows 404 only to authenticated users,
            // otherwise ProtectedRoute redirects to /login)
            {
                path: '*',
                Component: NotFoundPage,
            },
        ],
    },
];
