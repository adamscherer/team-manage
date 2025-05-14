import { createServer, type Server } from "http";
import { insertProjectSchema, insertTimeEntrySchema } from "@shared/schema";
import type { Express, Request, Response } from "express";
import { z } from "zod";

import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize some sample data
  await initializeSampleData();

  // Projects API
  app.get("/api/projects", async (req: Request, res: Response) => {
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const project = await storage.getProject(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const projectData = insertProjectSchema.parse(req.body);
      const updatedProject = await storage.updateProject(id, projectData);

      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);

      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Time Entries API
  app.get("/api/time-entries", async (req: Request, res: Response) => {
    const userId = req.query.userId
      ? parseInt(req.query.userId as string)
      : undefined;
    const projectId = req.query.projectId
      ? parseInt(req.query.projectId as string)
      : undefined;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    const timeEntries = await storage.getTimeEntries({
      userId,
      projectId,
      startDate,
      endDate,
    });

    res.json(timeEntries);
  });

  app.get("/api/time-entries/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const timeEntry = await storage.getTimeEntry(id);

    if (!timeEntry) {
      return res.status(404).json({ message: "Time entry not found" });
    }

    res.json(timeEntry);
  });

  app.post("/api/time-entries", async (req: Request, res: Response) => {
    try {
      const timeEntryData = insertTimeEntrySchema.parse(req.body);
      const timeEntry = await storage.createTimeEntry(timeEntryData);
      res.status(201).json(timeEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid time entry data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create time entry" });
    }
  });

  app.put("/api/time-entries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const timeEntryData = insertTimeEntrySchema.parse(req.body);
      const updatedTimeEntry = await storage.updateTimeEntry(id, timeEntryData);

      if (!updatedTimeEntry) {
        return res.status(404).json({ message: "Time entry not found" });
      }

      res.json(updatedTimeEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid time entry data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update time entry" });
    }
  });

  app.delete("/api/time-entries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTimeEntry(id);

      if (!success) {
        return res.status(404).json({ message: "Time entry not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete time entry" });
    }
  });

  // Stats API
  app.get("/api/stats", async (req: Request, res: Response) => {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : 1; // Default to first user
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : getStartOfWeek();
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    const stats = await storage.getStats(userId, startDate, endDate);
    res.json(stats);
  });

  // Users API (minimal functionality)
  app.get("/api/users/current", async (req: Request, res: Response) => {
    // For now, always return the first user as the "current" user
    const user = await storage.getUser(1);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to get start of current week
function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

// Initialize sample data for demo
async function initializeSampleData() {
  try {
    // Create demo user if none exists
    const existingUser = await storage.getUser(1);
    if (!existingUser) {
      await storage.createUser({
        username: "demo",
        password: "password",
        name: "Alex Johnson",
        email: "alex@electricmind.co",
        hourlyRate: 150,
      });
    }

    // Create sample projects if none exist
    const projects = await storage.getAllProjects();
    if (projects.length === 0) {
      await storage.createProject({
        name: "Website Redesign",
        description: "Complete redesign of corporate website",
        client: "Acme Corp",
        color: "#10b981",
        isActive: true,
      });

      await storage.createProject({
        name: "Mobile App Development",
        description: "iOS and Android app development",
        client: "TechStart",
        color: "#3b82f6",
        isActive: true,
      });

      await storage.createProject({
        name: "SEO Optimization",
        description: "Search engine optimization campaign",
        client: "GrowthX",
        color: "#8b5cf6",
        isActive: true,
      });

      await storage.createProject({
        name: "Content Creation",
        description: "Blog and social media content",
        client: "MediaPulse",
        color: "#f59e0b",
        isActive: true,
      });
    }

    // Create sample time entries if none exist
    const timeEntries = await storage.getTimeEntries({});
    if (timeEntries.length === 0) {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      // Today's entries
      await storage.createTimeEntry({
        projectId: 1,
        userId: 1,
        task: "Frontend Development",
        date: now,
        duration: 135, // 2h 15m
        notes: "Working on responsive design",
        isBillable: true,
      });

      await storage.createTimeEntry({
        projectId: 2,
        userId: 1,
        task: "API Integration",
        date: now,
        duration: 105, // 1h 45m
        notes: "Connecting to payment API",
        isBillable: true,
      });

      // Yesterday's entries
      await storage.createTimeEntry({
        projectId: 3,
        userId: 1,
        task: "Keyword Research",
        date: yesterday,
        duration: 190, // 3h 10m
        notes: "Analyzing competitor keywords",
        isBillable: true,
      });

      // Entries for rest of the week
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);
      await storage.createTimeEntry({
        projectId: 1,
        userId: 1,
        task: "UI Components",
        date: twoDaysAgo,
        duration: 240, // 4h
        notes: "Building reusable UI components",
        isBillable: true,
      });

      const threeDaysAgo = new Date(now);
      threeDaysAgo.setDate(now.getDate() - 3);
      await storage.createTimeEntry({
        projectId: 2,
        userId: 1,
        task: "Bug Fixing",
        date: threeDaysAgo,
        duration: 300, // 5h
        notes: "Resolving critical bugs",
        isBillable: true,
      });
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}
