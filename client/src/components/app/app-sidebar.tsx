import * as React from "react";
import { useAuth } from "@/auth/useAuth";
import {
  BarChart,
  ChevronsUpDown,
  Clock,
  Folder,
  GalleryVerticalEnd,
  Home,
  LogOut,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useSidebar,
} from "@/components/ui/sidebar";

const projects = [
  { name: "Website Redesign", color: "bg-green-400" },
  { name: "Mobile App Development", color: "bg-blue-500" },
  { name: "SEO Optimization", color: "bg-purple-500" },
  { name: "Content Creation", color: "bg-yellow-500" },
];

const items = [
  { name: "Dashboard", icon: Home, url: "/", isActive: true },
  { name: "Time Entries", icon: Clock, url: "/time-entries", isActive: false },
  { name: "Projects", icon: Folder, url: "/projects", isActive: false },
  { name: "Reports", icon: BarChart, url: "/reports", isActive: false },
  { name: "Teams", icon: Users, url: "/teams", isActive: false },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();

  return (
    <Sidebar {...props}>
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
        <SidebarGroup className="mb-4">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={item.isActive}>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
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

        {/* User Profile */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar data-[state=open]:text-sidebar-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg bg-gray-700 text-sidebar-primary-foreground">
                      <AvatarFallback className="rounded-lg bg-gray-700">
                        AS
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          AS
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
