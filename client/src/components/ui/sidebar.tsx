import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";

interface SidebarProps {
  recentProjects?: Project[];
}

export function Sidebar({ recentProjects = [] }: SidebarProps) {
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

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 z-50 bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            EM
          </div>
          <h1 className="text-xl font-bold">Electric Mind</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <Link href="/">
          <a className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
            location === "/" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
          )}>
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
          <a className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
            location === "/time-entries" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Time Entries
          </a>
        </Link>
        
        <Link href="/projects">
          <a className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
            location === "/projects" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
            Projects
          </a>
        </Link>
        
        <Link href="/reports">
          <a className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
            location === "/reports" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
            Reports
          </a>
        </Link>
        
        <div className="pt-4 mt-4 border-t border-sidebar-border">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Projects</h3>
          <div className="mt-2 space-y-1">
            {displayProjects.length > 0 ? (
              displayProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <a className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent/50">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    ></span>
                    {project.name}
                  </a>
                </Link>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-gray-400">No recent projects</p>
            )}
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
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
    </aside>
  );
}
