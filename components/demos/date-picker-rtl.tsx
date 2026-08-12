"use client"

import * as React from "react"
import { format } from "date-fns"
import { arSA } from "date-fns/locale"
import { IconChevronDown } from "@tabler/icons-react"
import { arSA as arSADayPicker } from "react-day-picker/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function DatePickerRtl() {
  const [date, setDate] = React.useState<Date>()

  return (
    <div dir="rtl">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              data-empty={!date}
              className="w-[212px] justify-between text-right font-normal data-[empty=true]:text-muted-foreground"
            />
          }
        >
          {date ? (
            format(date, "PPP", { locale: arSA })
          ) : (
            <span>اختر تاريخًا</span>
          )}
          <IconChevronDown data-icon="inline-end" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" dir="rtl">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            dir="rtl"
            locale={arSADayPicker}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
