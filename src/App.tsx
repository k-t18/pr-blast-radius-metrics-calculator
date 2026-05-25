/**
 * Application Root Component
 *
 * This is the main application component that sets up:
 * - PrimeReactProvider: Enables PrimeReact UI components globally
 * - RouterProvider: Enables client-side routing with React Router (data router)
 * - Layout: Provides consistent sidebar and navbar (conditionally applied)
 * - Route configuration: Renders the appropriate page based on current URL
 * - QueryClientProvider: Enables React Query for data fetching and caching
 * - AppInitializer: Initializes global app data on startup
 *
 * Routes can opt-out of the default layout by setting `handle: { noLayout: true }`
 * in their route configuration. This is useful for pages with custom layouts.
 */

import { createBrowserRouter, RouterProvider, useMatches, Outlet, useNavigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import Layout from './components/layout/Layout';
import { routes } from './routes';
import { setNavigate } from './services/api/apiClient';
import { setToastReference } from './services/toast/toastService';
import { useSponsorPortalSettingsData } from './stores/useSponsorPortalSettingsData';
import { usePdfDocumentsData } from './stores/storeOfAllPdfDocumentsData';
import { useDocumentSizeData } from './stores/useDocumentSizeData';
import useSockets from './hooks/useSockets';
import { useNotifications } from './hooks/useNotifications';

/**
 * NavigationSetup Component
 *
 * Sets up the navigation callback for the API client to enable redirects
 * (e.g., 401 errors -> login page)
 */
function NavigationSetup({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Provide navigate function to API client for 401 redirects
        setNavigate(navigate);
    }, [navigate]);

    /* eslint-disable react/jsx-no-useless-fragment */
    return <>{children}</>;
}

/**
 * AppInitializer Component
 *
 * Initializes global app data on startup:
 * - Fetches sponsor portal settings (if not already cached)
 * - Fetches period filter data (if not already cached)
 */
function AppInitializer({ children }: { children: React.ReactNode }) {
    const { fetchSponsorPortalSettings } = useSponsorPortalSettingsData();
    const { fetchTermsAndConditionData } = usePdfDocumentsData();
    const { fetchDocumentSizes } = useDocumentSizeData();
    useNotifications();

    useEffect(() => {
        // Fetch sponsor portal settings on app initialization
        // The store will only fetch if data is not already cached
        fetchSponsorPortalSettings();
        // Fetch terms and condition data on app initialization
        fetchTermsAndConditionData();
        // Fetch document sizes on app initialization
        fetchDocumentSizes();
    }, [fetchSponsorPortalSettings, fetchTermsAndConditionData, fetchDocumentSizes]);

    /* eslint-disable react/jsx-no-useless-fragment */
    return <>{children}</>;
}

/**
 * LayoutWrapper Component
 *
 * This component uses the useMatches hook to check if the current route
 * has opted out of the default layout. If so, it renders the page directly;
 * otherwise, it wraps the page with the Layout component.
 */
function LayoutWrapper() {
    const matches = useMatches();

    // Check if current route has noLayout flag in its handle property
    const noLayout = matches.some(match => {
        const handle = match.handle as { noLayout?: boolean } | undefined;
        return handle?.noLayout === true;
    });

    // If route opts out of layout, render directly; otherwise wrap with Layout
    return (
        <NavigationSetup>
            <AppInitializer>
                {noLayout ? (
                    <Outlet />
                ) : (
                    <Layout>
                        <Outlet />
                    </Layout>
                )}
            </AppInitializer>
        </NavigationSetup>
    );
}

// Create browser router with layout wrapper
const router = createBrowserRouter([
    {
        element: <LayoutWrapper />,
        children: routes,
    },
]);

/**
 * TanStack Query Client Configuration
 *
 * Configures default behavior for all queries and mutations:
 * - Automatic retries with exponential backoff
 * - Stale time management for caching
 * - Refetch behavior optimization
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Retry failed requests up to 2 times
            retry: 1,
            // Exponential backoff: 1s, 2s, 4s
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000),
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Don't refetch when window regains focus (can be enabled per query)
            refetchOnWindowFocus: false,
            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
        },
    },
});
function App() {
    const toast = useRef<Toast>(null);
    useSockets();

    useEffect(() => {
        // Initialize toast service with the ref
        if (toast.current) {
            setToastReference({ current: toast.current });
        }
    }, []);

    return (
        <PrimeReactProvider>
            <QueryClientProvider client={queryClient}>
                <AppInitializer>
                    <Toast ref={toast} position="bottom-center" style={{ padding: '1rem' }} />
                    <RouterProvider router={router} />
                </AppInitializer>
            </QueryClientProvider>
        </PrimeReactProvider>
    );
}

export default App;
