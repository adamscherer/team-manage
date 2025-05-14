import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timeEntryFormSchema, type TimeEntryFormData } from "@shared/schema";
import { format } from "date-fns";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: TimeEntryFormData;
  isEdit?: boolean;
}

export function TimeEntryModal({
  isOpen,
  onClose,
  defaultValues,
  isEdit = false,
}: TimeEntryModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the current user ID (we're hardcoding to 1 for now)
  const userId = 1;

  const form = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntryFormSchema),
    defaultValues: defaultValues || {
      projectId: 0,
      userId: userId,
      task: "",
      date: new Date(),
      duration: 0,
      notes: "",
      isBillable: true,
      hours: 0,
      minutes: 0,
    },
  });

  // Fetch projects for the select dropdown
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    refetchOnWindowFocus: false,
  });

  const createTimeMutation = useMutation({
    mutationFn: async (data: TimeEntryFormData) => {
      // Convert hours and minutes to duration in minutes
      const totalMinutes = (data.hours * 60) + data.minutes;
      
      // Prepare the data for API submission
      const submissionData = {
        projectId: data.projectId,
        userId: userId,
        task: data.task,
        date: data.date,
        duration: totalMinutes,
        notes: data.notes,
        isBillable: data.isBillable,
      };

      const response = await apiRequest(
        isEdit ? "PUT" : "POST",
        isEdit ? `/api/time-entries/${defaultValues?.id}` : "/api/time-entries",
        submissionData
      );
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: isEdit ? "Time entry updated" : "Time entry created",
        description: isEdit 
          ? "Your time entry has been updated successfully." 
          : "Your time has been logged successfully.",
      });
      
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} time entry: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: TimeEntryFormData) => {
    setIsSubmitting(true);
    createTimeMutation.mutate(data);
  };

  // Set today's date as default for new entries
  if (!isEdit && !defaultValues) {
    form.setValue("date", new Date());
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Time Entry" : "Track Time"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={String(project.id)}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task</FormLabel>
                  <FormControl>
                    <Input placeholder="What are you working on?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? new Date(value) : undefined);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Duration</FormLabel>
                <div className="flex">
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="flex rounded-l-md">
                            <Input
                              type="number"
                              placeholder="0"
                              min={0}
                              max={24}
                              className="rounded-r-none"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                            <div className="inline-flex items-center px-3 rounded-none border border-l-0 border-input bg-muted text-muted-foreground">
                              h
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minutes"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="flex">
                            <Input
                              type="number"
                              placeholder="00"
                              min={0}
                              max={59}
                              className="rounded-none"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                            <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground">
                              m
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isBillable"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Billable</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (isEdit ? "Update Entry" : "Save Entry")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
