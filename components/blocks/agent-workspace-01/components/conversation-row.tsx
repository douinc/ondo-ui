import {
  IconAlertTriangle,
  IconCheck,
  IconChevronRight,
  IconCircleCheck,
  IconFileAlert,
  IconFileText,
  IconGitBranch,
  IconRefresh,
  IconRobot,
  IconTerminal2,
  IconX,
} from "@tabler/icons-react"

import {
  getAttachmentStateLabel,
  type WorkspaceEvent,
} from "@/components/blocks/agent-workspace-01/data"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Kbd } from "@/components/ui/kbd"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { Spinner } from "@/components/ui/spinner"

type ConversationRowProps = {
  event: WorkspaceEvent
}

export function ConversationRow({ event }: ConversationRowProps) {
  if (event.kind === "message") {
    const isUser = event.role === "user"

    return (
      <Message align={isUser ? "end" : "start"}>
        {!isUser && (
          <MessageAvatar>
            <Avatar size="sm" aria-label="Codex agent">
              <AvatarFallback>
                <IconRobot aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
          </MessageAvatar>
        )}
        <MessageContent>
          <Bubble variant={isUser ? "muted" : "ghost"}>
            <BubbleContent className="space-y-2">
              {event.text
                .split(/\n\s*\n/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    )
  }

  if (event.kind === "marker") {
    const isComplete = event.id === "milestone-complete"

    return (
      <Marker
        variant={isComplete ? "separator" : "default"}
        role={event.status === "running" ? "status" : undefined}
        className={event.status === "error" ? "text-destructive" : undefined}
      >
        <MarkerIcon>{getMarkerIcon(event.status)}</MarkerIcon>
        <MarkerContent>
          <span className="font-medium text-foreground">{event.label}</span>
          {!isComplete && (
            <span className="ml-1.5 text-xs">{event.detail}</span>
          )}
        </MarkerContent>
      </Marker>
    )
  }

  if (event.kind === "attachment") {
    return (
      <Attachment state={event.state} className="w-full max-w-md">
        <AttachmentMedia>{getAttachmentIcon(event.state)}</AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{event.fileName}</AttachmentTitle>
          <AttachmentDescription>
            {getAttachmentStateLabel(event.state)} · {event.meta}
          </AttachmentDescription>
        </AttachmentContent>
        {event.state === "error" && (
          <AttachmentActions>
            <AttachmentAction aria-label={`Retry ${event.fileName}`}>
              <IconRefresh />
            </AttachmentAction>
            <AttachmentAction aria-label={`Remove ${event.fileName}`}>
              <IconX />
            </AttachmentAction>
          </AttachmentActions>
        )}
      </Attachment>
    )
  }

  return (
    <Collapsible
      defaultOpen={event.status === "error"}
      className="group/tool rounded-lg border bg-muted/20"
    >
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="h-auto min-h-9 w-full justify-start px-3 py-2"
          />
        }
      >
        <IconTerminal2 aria-hidden="true" />
        <span className="min-w-0 truncate">{event.title}</span>
        <Kbd className="ml-auto hidden max-w-64 truncate sm:inline-flex">
          {event.command}
        </Kbd>
        <Badge variant={getToolBadgeVariant(event.status)}>
          {event.status}
        </Badge>
        <IconChevronRight className="transition-transform group-data-open/tool:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t px-3 py-2">
        <pre className="overflow-x-auto font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {event.output}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  )
}

function getMarkerIcon(
  status: Extract<WorkspaceEvent, { kind: "marker" }>["status"]
) {
  if (status === "running") return <Spinner />
  if (status === "success") return <IconCircleCheck />
  if (status === "error") return <IconAlertTriangle />
  return <IconGitBranch />
}

function getAttachmentIcon(
  state: Extract<WorkspaceEvent, { kind: "attachment" }>["state"]
) {
  if (state === "processing") return <Spinner />
  if (state === "done") return <IconCheck />
  if (state === "error") return <IconFileAlert />
  return <IconFileText />
}

function getToolBadgeVariant(
  status: Extract<WorkspaceEvent, { kind: "tool" }>["status"]
) {
  if (status === "success") return "success" as const
  if (status === "error") return "destructive" as const
  if (status === "running") return "info" as const
  return "secondary" as const
}
