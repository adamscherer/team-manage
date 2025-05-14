import MainLayout from "@/layouts/main-layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Route, Switch } from "wouter";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import Projects from "@/pages/projects";
import Reports from "@/pages/reports";
import Teams from "@/pages/teams";
import TimeEntries from "@/pages/time-entries";

import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/time-entries" component={TimeEntries} />
        <Route path="/projects" component={Projects} />
        <Route path="/reports" component={Reports} />
        <Route path="/teams" component={Teams} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
