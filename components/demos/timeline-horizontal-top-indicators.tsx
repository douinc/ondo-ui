import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from "@/components/ui/timeline"

const roadmapItems = [
  {
    date: "Dec 15, 2025",
    content: (
      <>
        <span className="text-muted-foreground">Completed</span> Beta Program
      </>
    ),
    color: "bg-emerald-500",
  },
  {
    date: "Nov 01, 2025",
    content: (
      <>
        <span className="text-muted-foreground">Completed</span> Usability
        Testing
      </>
    ),
    color: "bg-violet-500",
  },
  {
    date: "Oct 15, 2025",
    content: (
      <>
        <span className="text-muted-foreground">Initiated</span> Design Phase
      </>
    ),
    color: "bg-fuchsia-500",
  },
  {
    date: "Aug 01, 2024",
    content: (
      <>
        <span className="text-muted-foreground">Completed</span> Requirements
        Gathering
      </>
    ),
    color: "bg-blue-500",
  },
  {
    date: "Jul 15, 2024",
    content: (
      <>
        <span className="text-muted-foreground">Started</span> Project Kickoff
      </>
    ),
    color: "bg-red-500",
  },
]

export default function TimelineHorizontalTopIndicators() {
  return (
    <div className="w-full max-w-xs">
      <Timeline defaultValue={0} size="sm" className="gap-2.5">
        {roadmapItems.map((item, index) => (
          <TimelineItem
            key={index}
            step={index + 1}
            className="group-data-[orientation=vertical]/timeline:not-last:pb-0 has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-foreground/20"
          >
            <TimelineHeader className="flex items-center gap-2.5">
              {/* A short dash centred between dots, rather than a line that
                  runs up to them. Pushes the separator a full gap clear of the
                  indicator so the space above and below it reads the same. */}
              <TimelineSeparator className="group-data-[orientation=vertical]/timeline:h-[calc(100%-var(--timeline-indicator)-0.75rem)] group-data-[orientation=vertical]/timeline:translate-y-[calc(var(--timeline-indicator)+0.625rem)]" />
              <TimelineIndicator fill="solid" className={item.color} />
              <TimelineDate className="mb-0 text-[10px] font-semibold text-muted-foreground/60 uppercase">
                {item.date}
              </TimelineDate>
            </TimelineHeader>
            <TimelineContent className="text-sm font-medium text-foreground">
              {item.content}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
