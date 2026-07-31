"use client"

import {
  IconBrandJavascript,
  IconCopy,
  IconCornerDownLeft,
  IconRefresh,
} from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton as InputGroupButtonUI,
  InputGroupText as InputGroupTextUI,
  InputGroupTextarea as InputGroupTextareaUI,
} from "@/components/ui/input-group"

export default function InputGroupTextarea() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <InputGroup>
        <InputGroupTextareaUI
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
          className="min-h-[200px]"
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupTextUI>Line 1, Column 1</InputGroupTextUI>
          <InputGroupButtonUI size="sm" className="ml-auto" variant="default">
            Run <IconCornerDownLeft />
          </InputGroupButtonUI>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupTextUI className="font-mono font-medium">
            <IconBrandJavascript />
            script.js
          </InputGroupTextUI>
          <InputGroupButtonUI className="ml-auto" size="icon-xs">
            <IconRefresh />
          </InputGroupButtonUI>
          <InputGroupButtonUI variant="ghost" size="icon-xs">
            <IconCopy />
          </InputGroupButtonUI>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
