import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Project } from "@shared/schema";

interface MobileSidebarProps {
  recentProjects?: Project[];
}

export function MobileSidebar({ recentProjects = [] }: MobileSidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const { data: userData } = useQuery({
    queryKey: ["/api/users/current"],
    refetchOnWindowFocus: false,
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    refetchOnWindowFocus: false,
  });

  // Use retrieved projects or fallback to passed props
  const displayProjects = projects && projects.length > 0 
    ? projects.slice(0, 4) 
    : recentProjects;

  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar text-sidebar-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            EM
          </div>
          <h1 className="text-xl font-bold">Electric Mind</h1>
        </div>
        <button onClick={handleMenuToggle} className="text-white" aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-sidebar p-4 flex flex-col text-sidebar-foreground animate-in",
          !isMenuOpen && "hidden"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              EM
            </div>
            <h1 className="text-xl font-bold">Electric Mind</h1>
          </div>
          <button onClick={handleMenuToggle} className="text-white" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/">
            <a 
              onClick={handleNavigation}
              className={cn(
                "flex items-center gap-3 px-3 py-4 text-base font-medium rounded-md",
                location === "/" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Dashboard
            </a>
          </Link>
          
          <Link href="/time-entries">
            <a 
              onClick={handleNavigation}
              className={cn(
                "flex items-center gap-3 px-3 py-4 text-base font-medium rounded-md",
                location === "/time-entries" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Time Entries
            </a>
          </Link>
          
          <Link href="/projects">
            <a 
              onClick={handleNavigation}
              className={cn(
                "flex items-center gap-3 px-3 py-4 text-base font-medium rounded-md",
                location === "/projects" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder">
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
              Projects
            </a>
          </Link>
          
          <Link href="/reports">
            <a 
              onClick={handleNavigation}
              className={cn(
                "flex items-center gap-3 px-3 py-4 text-base font-medium rounded-md",
                location === "/reports" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3">
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
              Reports
            </a>
          </Link>
        </nav>
        
        <div className="pt-4 mt-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
              {userData?.name ? userData.name.charAt(0) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userData?.name || 'Alex Johnson'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {userData?.email || 'alex@electricmind.co'}
              </p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
