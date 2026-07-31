import { IconCheck, IconChevronRight, IconCircle } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Frame, FrameHeader, FramePanel } from "@/components/ui/frame"
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Spinner } from "@/components/ui/spinner"

const pipelineSteps = [
  {
    id: 1,
    title: "Source Code Checkout",
    duration: "12s",
    status: "completed",
    description: "Successfully fetched latest changes from the main branch.",
    user: {
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    },
  },
  {
    id: 2,
    title: "Dependency Installation",
    duration: "1m 45s",
    status: "completed",
    description: "All npm packages installed and cached for future builds.",
    user: {
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    },
  },
  {
    id: 3,
    title: "Unit & Integration Tests",
    duration: "Running",
    status: "active",
    description: "Running 142 test suites across the entire codebase...",
    user: {
      name: "Michael Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    },
  },
  {
    id: 4,
    title: "Production Build",
    duration: "Pending",
    status: "pending",
    description: "Optimizing assets and generating static site pages.",
    user: {
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    },
  },
]

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <IconCheck />
  if (status === "active") return <Spinner />
  return <IconCircle />
}

function StatusBadge({
  status,
  duration,
}: {
  status: string
  duration: string
}) {
  const variant =
    status === "completed"
      ? "success"
      : status === "active"
        ? "info"
        : "warning"

  return (
    <Badge
      variant={variant}
      className="h-4.5 min-w-4.5 gap-1 px-1 py-0.25 text-[0.625rem] leading-none"
    >
      {duration}
    </Badge>
  )
}

export default function TimelineHorizontal() {
  return (
    <div className="w-full max-w-lg">
      <Timeline defaultValue={3} size="lg">
        {pipelineSteps.map((step) => (
          <TimelineItem key={step.id} step={step.id} className="pb-10">
            <TimelineHeader>
              <TimelineSeparator />
              <div className="flex items-center gap-2">
                <TimelineTitle className="text-sm font-semibold">
                  {step.title}
                </TimelineTitle>
                <StatusBadge status={step.status} duration={step.duration} />
              </div>
              <TimelineIndicator variant="muted" fill="solid">
                <StatusIcon status={step.status} />
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent className="mt-2">
              <Frame stacked dense spacing="sm">
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger className="flex w-full">
                    <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarImage
                            src={step.user.avatar}
                            alt={step.user.name}
                          />
                          <AvatarFallback>
                            {step.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-muted-foreground">
                          {step.user.name}
                        </span>
                      </div>
                      <IconChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                    </FrameHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <FramePanel>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </FramePanel>
                  </CollapsibleContent>
                </Collapsible>
              </Frame>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
