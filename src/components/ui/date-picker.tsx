"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"


import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    selected?: { from?: Date; to?: Date }
    onSelect: (range: { from?: Date; to?: Date } | undefined) => void
    placeholder?: string
    isRange?: boolean
    className?: string
  }
export function DatePicker({
  className,
  selected,
  onSelect,
  placeholder = "Select date range"
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(undefined)
  }

  // Ensure we always pass a proper DateRange object to Calendar
  const calendarSelected = React.useMemo(() => {
    return selected ? { from: selected.from, to: selected.to } : undefined
  }, [selected])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected?.from ? (
              selected.to ? (
                <>
                  {format(selected.from, "LLL dd, y")} -{" "}
                  {format(selected.to, "LLL dd, y")}
                  <X
                    className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                    onClick={handleClear}
                  />
                </>
              ) : (
                format(selected.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selected?.from}
            selected={calendarSelected}
            onSelect={(range) => onSelect(range || undefined)}
            numberOfMonths={2}
            onDayClick={() => setIsOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}