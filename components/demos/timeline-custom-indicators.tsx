import { IconCheck } from "@tabler/icons-react"

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

const orderStatus = [
  {
    id: 1,
    date: "Mar 15, 2024",
    title: "Order Placed",
    description: "Your order has been received and is being processed.",
  },
  {
    id: 2,
    date: "Mar 16, 2024",
    title: "Payment Confirmed",
    description: "Transaction successful. Preparing for shipment.",
  },
  {
    id: 3,
    date: "Mar 18, 2024",
    title: "Shipped",
    description: "Your package is on its way. Track your delivery.",
  },
  {
    id: 4,
    date: "Mar 20, 2024",
    title: "Delivered",
    description: "Package successfully delivered to the recipient.",
  },
]

export default function TimelineCustomIndicators() {
  return (
    <Timeline defaultValue={3} size="lg" className="w-full max-w-md">
      {orderStatus.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator fill="solid">
              <IconCheck className="group-not-data-completed/timeline-item:hidden" />
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
