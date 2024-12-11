import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import type { Event } from "./event-list";
import { FilterIcon } from "lucide-react";

export const FilterEvent = () => {
  const [filter, setFilter] = useState<string>(""); // Search query
  const [events, setEvents] = useState<Event[]>([]); // Original event data
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]); // Filtered event data

  // Load events from localStorage on component mount
  useEffect(() => {
    const allEvents: Event[] = JSON.parse(localStorage.getItem("events") || "[]");
    setEvents(allEvents);
  }, []);

  // Update filtered events whenever the filter changes
  useEffect(() => {
    if(filter === "") {
        setFilteredEvents([]);
        return;
    }

    const filtered = events.filter((event) =>
      [event.name, event.description, event.type]
        .some((field) => field?.toLowerCase().includes(filter.toLowerCase()))
    );
    setFilteredEvents(filtered);
  }, [filter, events]);

  return (
    <div>
        <label htmlFor="filter" className="flex justify-between">
            Filter Events
            <FilterIcon size={16}/>
        </label>

        <Input 
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter events by name, description, or type"
        />
        <ul className="space-y-2 mt-2 rounded-md bg-white">
            {filteredEvents.map((event) => (
            <li key={event.id} className="border-black border-b-2">
                <strong>{event.name}</strong> - {event.date}
            </li>
            ))}
        </ul>
    </div>
  );
};
