"use client"

import {
  IconCheck,
  IconCreditCard,
  IconInfoCircle,
  IconMail,
  IconSearch,
  IconStar,
} from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupIcon() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="email" placeholder="Enter your email" />
        <InputGroupAddon>
          <IconMail />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon>
          <IconCreditCard />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <IconCheck />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon align="inline-end">
          <IconStar />
          <IconInfoCircle />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
