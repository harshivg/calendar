"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Event } from "./event-list";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronsDown } from "lucide-react";

// Define the schema
const eventSchema = z.object({
  name: z.string().min(1, { message: "Event name is required." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  description: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

type EventFormProps = {
  event?: Event | null;
  onSubmit: (data: Omit<Event, "id" | "date">) => void;
};

export function EventForm({ event, onSubmit }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
      description: "",
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        name: event.name,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description || "",
      });
    } else {
      form.reset({
        name: "",
        startTime: "",
        endTime: "",
        description: "",
      });
    }
  }, [event]);

  const handleFormSubmit = (data: EventFormValues) => {
    onSubmit(data);
    form.reset(); 
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-2">
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            
            <div className="flex gap-2">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter event name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                        <Input 
                            type="time" 
                            {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="Optional description" {...field} />
                </FormControl>
                <FormDescription>
                    Add a brief description of the event.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            </CollapsibleContent>

        </Collapsible>

        <Button type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
        >
            {event ? "Update Event" : "Add Event"}
        </Button>
      </form>
    </Form>
  );
}