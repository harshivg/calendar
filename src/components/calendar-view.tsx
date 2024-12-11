import { Calendar } from "./ui/calendar"

interface CalendarProps {
    selected: Date | undefined,
    setSelected: (date: Date) => void
}

export const CalendarView = ({
    selected,
    setSelected
}: CalendarProps) => {
    return (
        <div>
            <Calendar 
                showOutsideDays={false}
                mode="single"
                className="bg-white rounded-md"
                selected={selected}
                onSelect={(day) => day && setSelected(day)}
                footer={
                    selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
                }
            />
        </div>

    )
}