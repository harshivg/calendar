"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EventForm } from "./event-form";
import { formatDate } from "@/utils/format-date";
import { Delete, Edit, Eye } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export type Event = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  date: string; // Stored as "YYYY-MM-DD" in localStorage
  type?: string;
};

type EventListProps = {
  selectedDate: Date | undefined; // Passed as a Date object
};

export const EventList: React.FC<EventListProps> = ({ selectedDate }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!selectedDate) return;

    const formattedDate = formatDate(selectedDate); // Format the date to "YYYY-MM-DD"
    const savedEvents = localStorage.getItem("events");
    const allEvents: Event[] = savedEvents ? JSON.parse(savedEvents) : [];
    const filteredEvents = allEvents.filter((event) => event.date === formattedDate);
    setEvents(filteredEvents);
  }, [selectedDate]);

  const saveEvents = (updatedEvents: Event[]) => {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleDelete = (id: string) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);

    const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
    const remainingEvents = allEvents.filter((event: Event) => event.id !== id);
    saveEvents(remainingEvents);
  };

  const handleFormSubmit = (data: Omit<Event, "id" | "date">) => {
    const formattedDate = selectedDate ? formatDate(selectedDate) : "";

    if (editingEvent) {
        //check overlap
        const editingEventStart = new Date(`2022-01-01T${editingEvent.startTime}`);
        const editingEventEnd = new Date(`2022-01-01T${editingEvent.endTime}`);

        if(editingEventEnd <= editingEventStart) {
            alert("End time should be greater than start time.");
            return;
        }

        const isOverlapping = events.some((event) => {
            if (event.id === editingEvent.id) return false;

            const eventStart = new Date(`2022-01-01T${event.startTime}`);
            const eventEnd = new Date(`2022-01-01T${event.endTime}`);

            return editingEventStart < eventEnd && editingEventEnd > eventStart;
        });

        if (isOverlapping) {
            alert("Event overlaps with existing event. Please choose a different time.");
            return;
        }


        const updatedEvents = events.map((event) =>
            event.id === editingEvent.id ? { ...event, ...data } : event
        );
        setEvents(updatedEvents);

        const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
        const updatedGlobalEvents = allEvents.map((event: Event) =>
            event.id === editingEvent.id ? { ...event, ...data } : event
        );
        saveEvents(updatedGlobalEvents);
    } else {
        const newEvent: Event = {
            ...data,
            id: Date.now().toString(),
            date: formattedDate,
        };

        //check overlappping events
        const newEventStart = new Date(`2022-01-01T${newEvent.startTime}`);
        const newEventEnd = new Date(`2022-01-01T${newEvent.endTime}`);

        if(newEventEnd <= newEventStart) {
            alert("End time should be greater than start time.");
            return;
        }
        
        const isOverlapping = events.some((event) => {
            const eventStart = new Date(`2022-01-01T${event.startTime}`);
            const eventEnd = new Date(`2022-01-01T${event.endTime}`);

            return newEventStart < eventEnd && newEventEnd > eventStart;
        });

        if (isOverlapping) {
            alert("Event overlaps with existing event. Please choose a different time.");
            return;
        }

        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);

        const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
        saveEvents([...allEvents, newEvent]);
    }

    setEditingEvent(null);
  };

  return (
    <div>
        <EventForm event={editingEvent} onSubmit={handleFormSubmit} />

        <h2 className="mt-4 mb-4 text-xl">Events for {selectedDate ? formatDate(selectedDate) : "No date selected"}</h2>
        {events.length > 0 ? (
            <ul className="overflow-y-scroll scrollbar-invisible h-[400px] bg-white rounded-lg">
            {events.map((event) => ( 
                <li key={event.id} className="p-4 border-b-2 border-black/20 flex items-center justify-between w-full">
                    <Collapsible className="w-full">
                        <CollapsibleTrigger asChild
                        >
                            <div className="flex justify-between cursor-pointer">
                                <div>
                                    <strong>{event.name}</strong> 
                                    ({event.startTime} - {event.endTime})
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline">
                                        <Eye size={16} />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handleEdit(event)}
                                    >
                                        <Edit size={16} />
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        <Delete size={16} />
                                    </Button>
                                </div>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4">
                            {event.description ? <p>{event.description}</p> : <p>No description available.</p>}
                        </CollapsibleContent>
                    </Collapsible>
                </li>
            ))}
            </ul>
        ) : (
            <p>No events scheduled for this day.</p>
        )}

    </div>
  );
};
