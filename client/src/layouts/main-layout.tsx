import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileSidebar } from "@/components/ui/mobile-sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile navigation */}
      <MobileSidebar />
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:ml-64 lg:ml-72 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
