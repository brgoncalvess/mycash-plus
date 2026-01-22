import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { cn } from '../../utils/cn';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Navigation Components */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <MobileHeader />

            {/* Main Content Area */}
            <main
                className={cn(
                    "flex-1 w-full transition-[padding] duration-300 ease-in-out pt-20 lg:pt-8 px-4 md:px-6 lg:px-8 pb-8",
                    // Sidebar width is w-64 (256px) or w-20 (80px). 
                    // We add extra padding for the content itself.
                    // Let's assume standard 'pl' matches sidebar width + some spacing if absolute, 
                    // or if sidebar is fixed, we use padding-left equal to sidebar width.
                    isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
                )}
            >
                <div className="max-w-[1400px] xl:max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
