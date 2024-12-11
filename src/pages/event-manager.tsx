import { CalendarView } from "@/components/calendar-view"
import { EventList } from "@/components/event-list"
import { FilterEvent } from "@/components/filter-event"
import { useState } from "react"

export const EventManager = () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <div className="flex w-full h-full justify-around items-center p-4">
            <div className="flex flex-col gap-8">
                <FilterEvent />
                <CalendarView 
                    selected={date}
                    setSelected={setDate}
                />
            </div>
            <EventList 
                selectedDate={date}
            />
        </div>
    )
}