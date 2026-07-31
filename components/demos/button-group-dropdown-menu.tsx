"use client"

import {
  IconAlertTriangle,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconShare,
  IconTrash,
  IconUserX,
  IconVolumeOff,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ButtonGroupDropdownMenu() {
  return (
    <ButtonGroup>
      <Button variant="outline">Follow</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" className="pl-2!" />}
        >
          <IconChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconVolumeOff />
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconCheck />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconAlertTriangle />
              Report Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconUserX />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconShare />
              Share Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconCopy />
              Copy Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <IconTrash />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
