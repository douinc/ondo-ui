import {
  IconGitCompare,
  IconGitFork,
  IconGitMerge,
  IconGitPullRequest,
} from "@tabler/icons-react"

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

const gitActivity = [
  {
    id: 1,
    date: "15 minutes ago",
    title: "Forked Repository",
    description:
      "Forked the repository to create a new branch for development.",
    icon: <IconGitFork />,
  },
  {
    id: 2,
    date: "10 minutes ago",
    title: "Pull Request Submitted",
    description:
      "Submitted PR #342 with new feature implementation. Waiting for code review.",
    icon: <IconGitPullRequest />,
  },
  {
    id: 3,
    date: "5 minutes ago",
    title: "Comparing Branches",
    description:
      "Received comments on PR. Minor adjustments needed in error handling.",
    icon: <IconGitCompare />,
  },
  {
    id: 4,
    date: "Just now",
    title: "Merged Branch",
    description:
      "Merged the feature branch into the main branch. Ready for deployment.",
    icon: <IconGitMerge />,
  },
]

export default function TimelineIcons() {
  return (
    <Timeline defaultValue={3} size="lg" className="w-full max-w-md">
      {gitActivity.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineTitle className="mt-0.5">{item.title}</TimelineTitle>
            <TimelineIndicator fill="solid">{item.icon}</TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>
            {item.description}
            <TimelineDate className="mt-2 mb-0">{item.date}</TimelineDate>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
