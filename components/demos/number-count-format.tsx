"use client"

import * as React from "react"

import { NumberCount } from "@/components/ui/number-count"
import { Button } from "@/components/ui/button"

const values = [1234, 56789, 1200000, 42]

export default function NumberCountFormat() {
  const [index, setIndex] = React.useState(0)
  const value = values[index]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-2xl font-semibold">
        <NumberCount value={value} format={{ notation: "compact" }} />
        <NumberCount
          value={value}
          format={{
            style: "currency",
            currency: "USD",
            trailingZeroDisplay: "stripIfInteger",
          }}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIndex((i) => (i + 1) % values.length)}
      >
        Change value
      </Button>
    </div>
  )
}
