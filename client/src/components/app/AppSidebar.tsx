import {
  BarChart,
  Clock,
  Folder,
  GalleryVerticalEnd,
  Home,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const projects = [
  { name: "Website Redesign", color: "bg-green-400" },
  { name: "Mobile App Development", color: "bg-blue-500" },
  { name: "SEO Optimization", color: "bg-purple-500" },
  { name: "Content Creation", color: "bg-yellow-500" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Electric Mind</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="justify-between h-full">
        <div>
          {/* Navigation */}
          <SidebarGroup className="mb-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Home className="w-6 h-6" /> Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Clock className="w-6 h-6" /> Time Entries
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Folder className="w-6 h-6" /> Projects
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BarChart className="w-6 h-6" /> Reports
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Users className="w-6 h-6" /> Teams
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
          {/* Recent Projects */}
          <SidebarGroup>
            <SidebarGroupLabel>RECENT PROJECTS</SidebarGroupLabel>
            <div className="flex flex-col gap-3 mt-2">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="flex items-center gap-3 text-base px-2"
                >
                  <span className={cn("w-3 h-3 rounded-full", project.color)} />
                  {project.name}
                </div>
              ))}
            </div>
          </SidebarGroup>
        </div>
        {/* User Profile */}
        <SidebarFooter className="mt-8">
          <div className="flex items-center gap-3 p-3 bg-[#181b22] rounded-xl">
            <Avatar className="w-10 h-10">
              <span className="text-lg font-semibold">A</span>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">Alex Johnson</div>
              <div className="text-xs text-[#7c7f8a]">alex@electricmind.co</div>
            </div>
            <button className="text-[#7c7f8a] hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
