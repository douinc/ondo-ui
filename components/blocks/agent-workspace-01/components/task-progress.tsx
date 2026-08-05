import {
  IconCheck,
  IconCircle,
  IconCode,
  IconSearch,
  IconTestPipe,
} from "@tabler/icons-react"

import { type WorkspaceStage } from "@/components/blocks/agent-workspace-01/data"
import { Frame, FramePanel } from "@/components/ui/frame"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { ProgressRing, ProgressRingLabel } from "@/components/ui/progress-ring"
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

const stageProgress = {
  start: { percent: 8, step: 0, label: "Ready" },
  running: { percent: 72, step: 3, label: "Verifying" },
  complete: { percent: 100, step: 4, label: "Complete" },
} as const

const progressSteps = [
  {
    title: "Analyze request",
    detail: "Map the Block and component boundaries.",
    icon: IconSearch,
  },
  {
    title: "Edit files",
    detail: "Compose the workspace with Ondo UI.",
    icon: IconCode,
  },
  {
    title: "Run verification",
    detail: "Test the registry and isolated preview.",
    icon: IconTestPipe,
  },
  {
    title: "Task complete",
    detail: "Prepare the installable Block output.",
    icon: IconCheck,
  },
] as const

export function TaskProgress({ stage }: { stage: WorkspaceStage }) {
  const progress = stageProgress[stage]

  return (
    <Frame spacing="sm">
      <FramePanel className="flex items-center gap-4">
        <ProgressRing
          value={progress.percent}
          size="sm"
          variant={stage === "complete" ? "success" : "info"}
          formatValue={(_, value) => `${value}%`}
        >
          <ProgressRingLabel>{progress.label}</ProgressRingLabel>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <Progress
            value={progress.percent}
            variant={stage === "complete" ? "success" : "info"}
          >
            <ProgressLabel>Task progress</ProgressLabel>
            <ProgressValue />
          </Progress>
          <p className="mt-2 text-xs text-muted-foreground">
            {progress.step} of 4 milestones reached
          </p>
        </div>
      </FramePanel>

      <FramePanel>
        <Timeline value={progress.step} size="sm" className="w-full">
          {progressSteps.map((item, index) => {
            const Icon = item.icon
            const step = index + 1
            const isPending = step > progress.step

            return (
              <TimelineItem key={item.title} step={step}>
                <TimelineHeader>
                  <TimelineSeparator />
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineIndicator
                    fill="solid"
                    variant={stage === "complete" ? "success" : "info"}
                    animate={step === progress.step ? "pulse" : undefined}
                  >
                    {isPending ? <IconCircle /> : <Icon />}
                  </TimelineIndicator>
                </TimelineHeader>
                <TimelineContent>{item.detail}</TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      </FramePanel>
    </Frame>
  )
}
