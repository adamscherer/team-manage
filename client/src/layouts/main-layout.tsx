import { ReactNode } from "react";

import { MobileSidebar } from "@/components/ui/mobile-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Mobile navigation */}
      <MobileSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:ml-64 lg:ml-72 pt-16 md:pt-0">
        {children}
      </main>
    </SidebarProvider>
  );
}
