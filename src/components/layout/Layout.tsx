import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProperties {
    children: ReactNode;
}

function Layout({ children }: LayoutProperties) {
    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col bg-white min-w-0">
                <Navbar />
                <main className="flex-1 overflow-auto px-8 py-2 bg-white min-w-0">{children}</main>
            </div>
        </div>
    );
}

export default Layout;
