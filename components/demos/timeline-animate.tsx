import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

const RUNNING_STEP = 3

const jobSteps = [
  { id: 1, title: "Set up job", detail: "ubuntu-latest · 2s" },
  { id: 2, title: "Run actions/checkout@v4", detail: "Fetched 1 commit · 3s" },
  { id: 3, title: "Run bun test", detail: "142 of 214 suites passed" },
  { id: 4, title: "Post job cleanup", detail: "Queued" },
]

function variantFor(id: number) {
  if (id === RUNNING_STEP) return "warning" as const
  if (id > RUNNING_STEP) return "muted" as const
  // Steps already finished keep the default hue.
  return undefined
}

export default function TimelineAnimate() {
  return (
    <div className="grid w-full gap-10 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground">ping</p>
        <Timeline defaultValue={RUNNING_STEP} size="sm">
          {jobSteps.map((step) => (
            <TimelineItem key={step.id} step={step.id}>
              <TimelineHeader>
                <TimelineSeparator />
                <TimelineTitle className="font-mono text-sm">
                  {step.title}
                </TimelineTitle>
                <TimelineIndicator
                  variant={variantFor(step.id)}
                  fill="solid"
                  animate="ping"
                />
              </TimelineHeader>
              <TimelineContent>{step.detail}</TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground">pulse</p>
        <Timeline defaultValue={RUNNING_STEP} size="sm">
          {jobSteps.map((step) => (
            <TimelineItem key={step.id} step={step.id}>
              <TimelineHeader>
                <TimelineSeparator />
                <TimelineTitle className="font-mono text-sm">
                  {step.title}
                </TimelineTitle>
                <TimelineIndicator
                  variant={variantFor(step.id)}
                  fill="solid"
                  animate="pulse"
                />
              </TimelineHeader>
              <TimelineContent>{step.detail}</TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  )
}
