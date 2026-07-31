import { IconFileCode, IconFileText, IconTable, IconX } from "@tabler/icons-react"
import { type FC, type SVGProps } from "react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup as AttachmentGroupComponent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"

type TablerIcon = FC<SVGProps<SVGSVGElement>>

type Item = {
  name: string
  meta: string
  icon?: TablerIcon
  src?: string
}

const items: Item[] = [
  { name: "briefing-notes.pdf", meta: "PDF · 1.4 MB", icon: IconFileText },
  {
    name: "workspace.png",
    meta: "PNG · 820 KB",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",
  },
  { name: "customers.csv", meta: "CSV · 18 KB", icon: IconTable },
  { name: "renderer.tsx", meta: "TSX · 12 KB", icon: IconFileCode },
]

export default function AttachmentGroup() {
  return (
    <div className="mx-auto w-full max-w-sm py-12">
      <AttachmentGroupComponent className="w-full">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <Attachment key={item.name} className="w-64">
              {item.src ? (
                <AttachmentMedia variant="image">
                  <img src={item.src} alt={item.name} />
                </AttachmentMedia>
              ) : Icon ? (
                <AttachmentMedia>
                  <Icon />
                </AttachmentMedia>
              ) : null}
              <AttachmentContent>
                <AttachmentTitle>{item.name}</AttachmentTitle>
                <AttachmentDescription>{item.meta}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label={`Remove ${item.name}`}>
                  <IconX />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          )
        })}
      </AttachmentGroupComponent>
    </div>
  )
}
