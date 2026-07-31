"use client"

import * as React from "react"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

export default function CalendarRangeCalendar() {
  const startDate = addDays(new Date(), 0)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startDate,
    to: addDays(startDate, 30),
  })

  return (
    <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      className="rounded-lg border"
    />
  )
}
