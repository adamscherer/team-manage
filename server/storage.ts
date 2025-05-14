import { 
  users, 
  projects, 
  timeEntries, 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject, 
  type TimeEntry, 
  type InsertTimeEntry 
} from "@shared/schema";

export interface TimeEntryFilter {
  userId?: number;
  projectId?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface Stats {
  weeklyHours: number;
  billableHours: number;
  billableAmount: number;
  utilizationRate: number;
  projectBreakdown: ProjectStats[];
  dailyActivity: { day: string; hours: number }[];
}

export interface ProjectStats {
  id: number;
  name: string;
  color: string;
  hours: number;
  percentage: number;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: InsertProject): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Time entry methods
  getTimeEntry(id: number): Promise<TimeEntry | undefined>;
  getTimeEntries(filter: TimeEntryFilter): Promise<TimeEntry[]>;
  createTimeEntry(timeEntry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: number, timeEntry: InsertTimeEntry): Promise<TimeEntry | undefined>;
  deleteTimeEntry(id: number): Promise<boolean>;
  
  // Stats methods
  getStats(userId: number, startDate: Date, endDate: Date): Promise<Stats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private timeEntries: Map<number, TimeEntry>;
  private userIdCounter: number;
  private projectIdCounter: number;
  private timeEntryIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.timeEntries = new Map();
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.timeEntryIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, insertProject: InsertProject): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      return undefined;
    }
    
    const updatedProject: Project = { ...insertProject, id };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const exists = this.projects.has(id);
    if (!exists) {
      return false;
    }
    
    // Delete the project
    this.projects.delete(id);
    
    // Delete all time entries associated with this project
    for (const [entryId, entry] of this.timeEntries.entries()) {
      if (entry.projectId === id) {
        this.timeEntries.delete(entryId);
      }
    }
    
    return true;
  }

  // Time entry methods
  async getTimeEntry(id: number): Promise<TimeEntry | undefined> {
    return this.timeEntries.get(id);
  }

  async getTimeEntries(filter: TimeEntryFilter): Promise<TimeEntry[]> {
    let entries = Array.from(this.timeEntries.values());
    
    if (filter.userId !== undefined) {
      entries = entries.filter(entry => entry.userId === filter.userId);
    }
    
    if (filter.projectId !== undefined) {
      entries = entries.filter(entry => entry.projectId === filter.projectId);
    }
    
    if (filter.startDate !== undefined) {
      entries = entries.filter(entry => new Date(entry.date) >= filter.startDate!);
    }
    
    if (filter.endDate !== undefined) {
      entries = entries.filter(entry => new Date(entry.date) <= filter.endDate!);
    }
    
    // Sort by date (newest first)
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTimeEntry(insertTimeEntry: InsertTimeEntry): Promise<TimeEntry> {
    const id = this.timeEntryIdCounter++;
    const timeEntry: TimeEntry = { ...insertTimeEntry, id };
    this.timeEntries.set(id, timeEntry);
    return timeEntry;
  }

  async updateTimeEntry(id: number, insertTimeEntry: InsertTimeEntry): Promise<TimeEntry | undefined> {
    const existingTimeEntry = this.timeEntries.get(id);
    if (!existingTimeEntry) {
      return undefined;
    }
    
    const updatedTimeEntry: TimeEntry = { ...insertTimeEntry, id };
    this.timeEntries.set(id, updatedTimeEntry);
    return updatedTimeEntry;
  }

  async deleteTimeEntry(id: number): Promise<boolean> {
    const exists = this.timeEntries.has(id);
    if (!exists) {
      return false;
    }
    
    this.timeEntries.delete(id);
    return true;
  }

  // Stats methods
  async getStats(userId: number, startDate: Date, endDate: Date): Promise<Stats> {
    // Get all time entries for the user and date range
    const entries = await this.getTimeEntries({
      userId,
      startDate,
      endDate
    });
    
    // Calculate total hours and billable hours
    const totalMinutes = entries.reduce((sum, entry) => sum + entry.duration, 0);
    const billableMinutes = entries.filter(entry => entry.isBillable).reduce((sum, entry) => sum + entry.duration, 0);
    
    const weeklyHours = totalMinutes / 60;
    const billableHours = billableMinutes / 60;
    
    // Calculate billable amount (hourly rate * billable hours)
    const user = await this.getUser(userId);
    const hourlyRate = user?.hourlyRate || 150; // Default to $150/hour if not set
    const billableAmount = billableHours * hourlyRate;
    
    // Calculate utilization rate (billable hours / total hours)
    const utilizationRate = totalMinutes > 0 ? (billableMinutes / totalMinutes) * 100 : 0;
    
    // Calculate project breakdown
    const projectEntries = new Map<number, { minutes: number, project: Project | undefined }>();
    
    for (const entry of entries) {
      const project = await this.getProject(entry.projectId);
      if (!projectEntries.has(entry.projectId)) {
        projectEntries.set(entry.projectId, { minutes: 0, project });
      }
      
      const current = projectEntries.get(entry.projectId)!;
      current.minutes += entry.duration;
      projectEntries.set(entry.projectId, current);
    }
    
    const projectBreakdown: ProjectStats[] = [];
    for (const [projectId, { minutes, project }] of projectEntries.entries()) {
      if (project) {
        projectBreakdown.push({
          id: projectId,
          name: project.name,
          color: project.color,
          hours: minutes / 60,
          percentage: (minutes / totalMinutes) * 100
        });
      }
    }
    
    // Sort by hours (descending)
    projectBreakdown.sort((a, b) => b.hours - a.hours);
    
    // Calculate daily activity
    const dayMap = new Map<string, number>();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Initialize all days with 0 hours
    days.forEach(day => dayMap.set(day, 0));
    
    // Add up hours for each day
    for (const entry of entries) {
      const date = new Date(entry.date);
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const day = days[(dayIndex + 6) % 7]; // Convert to Mon-Sun format
      
      const hours = entry.duration / 60;
      dayMap.set(day, (dayMap.get(day) || 0) + hours);
    }
    
    const dailyActivity = days.map(day => ({
      day,
      hours: dayMap.get(day) || 0
    }));
    
    return {
      weeklyHours: parseFloat(weeklyHours.toFixed(1)),
      billableHours: parseFloat(billableHours.toFixed(1)),
      billableAmount: parseFloat(billableAmount.toFixed(2)),
      utilizationRate: parseFloat(utilizationRate.toFixed(1)),
      projectBreakdown,
      dailyActivity
    };
  }
}

export const storage = new MemStorage();
