import { IconCheck, IconX } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

import { cn } from "@/lib/utils"

const deployments = [
  {
    id: 1,
    title: "Production Deploy",
    date: "2 minutes ago",
    commit: "a1b2c3d",
    branch: "main",
    status: "success",
    duration: "42s",
  },
  {
    id: 2,
    title: "Staging Deploy",
    date: "15 minutes ago",
    commit: "e4f5g6h",
    branch: "staging",
    status: "success",
    duration: "38s",
  },
  {
    id: 3,
    title: "Preview Deploy",
    date: "1 hour ago",
    commit: "i7j8k9l",
    branch: "feat/auth",
    status: "failed",
    duration: "1m 12s",
  },
  {
    id: 4,
    title: "Production Deploy",
    date: "3 hours ago",
    commit: "m0n1o2p",
    branch: "main",
    status: "success",
    duration: "45s",
  },
]

export default function TimelineActivityFeed() {
  return (
    <div className="w-full max-w-xs">
      <Timeline defaultValue={4} size="lg">
        {deployments.map((deploy) => (
          <TimelineItem key={deploy.id} step={deploy.id}>
            <TimelineHeader>
              <TimelineSeparator className="bg-input!" />
              <div className="flex items-center gap-2">
                <TimelineTitle className="text-sm">
                  {deploy.title}
                </TimelineTitle>
                <Badge
                  variant={
                    deploy.status === "success" ? "success" : "destructive"
                  }
                  className="h-4.5 min-w-4.5 gap-1 px-1 py-0.25 text-[0.625rem] leading-none"
                >
                  {deploy.status}
                </Badge>
              </div>
              <TimelineIndicator
                variant={
                  deploy.status === "success" ? "success" : "destructive"
                }
                fill="solid"
              >
                {deploy.status === "success" ? <IconCheck /> : <IconX />}
              </TimelineIndicator>
            </TimelineHeader>
            <TimelineContent>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-mono">{deploy.commit}</span>
                <span>&middot;</span>
                <span>{deploy.branch}</span>
                <span>&middot;</span>
                <span>{deploy.duration}</span>
              </div>
              <TimelineDate className="mt-1 mb-0">{deploy.date}</TimelineDate>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
