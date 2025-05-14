import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Teams() {
  const [activeTab, setActiveTab] = useState("teams");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<any[]>({
    queryKey: ["/api/users/current"],
    refetchOnWindowFocus: false,
  });

  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<any[]>({
    queryKey: ["/api/projects"],
    refetchOnWindowFocus: false,
  });

  // Group projects by client
  const clientsWithProjects = projects.reduce((clients: any, project: any) => {
    const clientName = project.client || 'Unassigned';
    
    if (!clients[clientName]) {
      clients[clientName] = {
        name: clientName,
        projects: []
      };
    }
    
    clients[clientName].projects.push(project);
    return clients;
  }, {});

  // Convert to array for rendering
  const clientsList = Object.values(clientsWithProjects);

  // Sample team members (in a real app, we would fetch this from the API)
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@electricmind.co",
      role: "Lead Developer",
      avatar: null,
      clients: ["Acme Corp", "TechStart"],
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah@electricmind.co",
      role: "UX Designer",
      avatar: null,
      clients: ["Acme Corp", "MediaPulse"],
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@electricmind.co",
      role: "Project Manager",
      avatar: null,
      clients: ["GrowthX", "TechStart"],
    },
    {
      id: 4,
      name: "Jessica Lee",
      email: "jessica@electricmind.co",
      role: "Backend Developer",
      avatar: null,
      clients: ["MediaPulse", "TechStart"],
    },
  ];

  // Filter teams and clients based on search query
  const filteredTeamMembers = teamMembers.filter((member) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.clients.some(client => client.toLowerCase().includes(query))
    );
  });

  const filteredClients = Object.values(clientsWithProjects).filter((client: any) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.projects.some((project: any) => 
        project.name.toLowerCase().includes(query) ||
        (project.description && project.description.toLowerCase().includes(query))
      )
    );
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Teams & Clients</h1>
          <div>
            <Button className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
              Add Team Member
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">Manage team members and client relationships.</p>
      </header>

      {/* Search and tabs */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
          <Input
            placeholder="Search teams or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="teams" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="teams">Team Members</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Team Members Tab */}
      <TabsContent value="teams" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingUsers ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-muted rounded"></div>
                      <div className="h-3 w-32 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredTeamMembers.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No team members found with your search criteria.</p>
            </div>
          ) : (
            filteredTeamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar || ""} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{member.email}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Clients:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.clients.map((client, index) => (
                        <Badge key={index} variant="outline">{client}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      {/* Clients Tab */}
      <TabsContent value="clients" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoadingProjects ? (
            Array(2).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-16 bg-muted rounded w-full"></div>
                    <div className="h-16 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredClients.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No clients found with your search criteria.</p>
            </div>
          ) : (
            filteredClients.map((client: any, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{client.name}</span>
                    <Button variant="outline" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-2">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Add Project
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {client.projects.map((project: any) => (
                      <div 
                        key={project.id} 
                        className="p-4 rounded-lg border border-border flex justify-between items-start hover:bg-muted/50"
                      >
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full mt-1.5" 
                            style={{ backgroundColor: project.color }}
                          ></div>
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {project.description || "No description"}
                            </p>
                          </div>
                        </div>
                        <Link href={`/projects/${project.id}`}>
                          <a className="text-primary text-sm hover:underline">View</a>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>
    </div>
  );
}