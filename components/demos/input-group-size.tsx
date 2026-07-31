import { IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

const sizes = ["xs", "sm", "default", "lg", "xl", "2xl"] as const

export default function InputGroupSize() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {sizes.map((size) => (
        <InputGroup key={size} size={size}>
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupInput placeholder={`Size ${size}`} />
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
      ))}
      {sizes.map((size) => (
        <InputGroup key={`${size}-addons`} size={size}>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Copy</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  )
}
