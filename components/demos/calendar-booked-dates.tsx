"use client"

import * as React from "react"
import { addDays } from "date-fns"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

export default function CalendarBookedDates() {
  const [date, setDate] = React.useState<Date | undefined>(addDays(new Date(), 3))
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => addDays(new Date(), 5 + i)
  )

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          disabled={bookedDates}
          modifiers={{
            booked: bookedDates,
          }}
          modifiersClassNames={{
            booked: "[&>button]:line-through opacity-100",
          }}
        />
      </CardContent>
    </Card>
  )
}
