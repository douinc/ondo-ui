"use client"

import * as React from "react"
import { IconBell } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NumberBadge } from "@/components/compositions/number-badge"
import { Button } from "@/components/ui/button"

export default function NumberBadgeOverflow() {
  const [value, setValue] = React.useState(3)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-8">
        <NumberBadge value={value}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </NumberBadge>
        <NumberBadge value={value}>
          <Button variant="outline" size="icon">
            <IconBell />
          </Button>
        </NumberBadge>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue((v) => Math.max(0, v - 25))}
        >
          −25
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue((v) => v + 25)}
        >
          +25
        </Button>
      </div>
    </div>
  )
}
