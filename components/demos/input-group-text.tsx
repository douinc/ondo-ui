"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText as InputGroupTextUI,
  InputGroupTextarea,
} from "@/components/ui/input-group"

export default function InputGroupText() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupTextUI>$</InputGroupTextUI>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupTextUI>USD</InputGroupTextUI>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupTextUI>https://</InputGroupTextUI>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" className="pl-0.5!" />
        <InputGroupAddon align="inline-end">
          <InputGroupTextUI>.com</InputGroupTextUI>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Enter your username" />
        <InputGroupAddon align="inline-end">
          <InputGroupTextUI>@company.com</InputGroupTextUI>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Enter your message" />
        <InputGroupAddon align="block-end">
          <InputGroupTextUI className="text-xs text-muted-foreground">
            120 characters left
          </InputGroupTextUI>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
