"use client"

import NumberFlow from "@number-flow/react"

import { cn } from "@/lib/utils"

type NumberCountProps = React.ComponentProps<typeof NumberFlow>

function NumberCount({ className, ...props }: NumberCountProps) {
  return (
    <NumberFlow
      className={cn("tabular-nums", className)}
      data-slot="number-count"
      {...props}
    />
  )
}

export { NumberCount, type NumberCountProps }
