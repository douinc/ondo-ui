"use client"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  useMessageScroller,
  useMessageScrollerVisibility,
} from "@/components/ui/message-scroller"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type ReaderRailItem = {
  id: string
  label: string
}

type ScrollToMessage = (
  messageId: string,
  options?: {
    align?: "start" | "center" | "end" | "nearest"
    behavior?: ScrollBehavior
    scrollMargin?: number
  }
) => boolean

type ReaderRailListProps = {
  items: readonly ReaderRailItem[]
  currentAnchorId: string | null
  onSelect: (messageId: string) => void
}

export function selectReaderAnchor(
  scrollToMessage: ScrollToMessage,
  messageId: string
) {
  return scrollToMessage(messageId, {
    align: "start",
    behavior: "smooth",
  })
}

export function ReaderRailList({
  items,
  currentAnchorId,
  onSelect,
}: ReaderRailListProps) {
  return (
    <nav aria-label="Conversation outline" className="flex flex-col gap-1">
      {items.map((item) => (
        <Button
          key={item.id}
          type="button"
          variant="ghost"
          size="sm"
          aria-current={currentAnchorId === item.id ? "location" : undefined}
          className="h-auto min-h-8 justify-start rounded-xl px-2 py-1.5 text-left aria-current:bg-accent aria-current:text-accent-foreground"
          onClick={() => onSelect(item.id)}
        >
          <span className="line-clamp-1 min-w-0">{item.label}</span>
        </Button>
      ))}
    </nav>
  )
}

export function ReaderRail({ items }: { items: readonly ReaderRailItem[] }) {
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()

  if (items.length === 0) return null

  function selectAnchor(messageId: string) {
    selectReaderAnchor(scrollToMessage, messageId)
  }

  return (
    <div className="absolute top-1/2 right-2 z-20 -translate-y-1/2">
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Open conversation outline"
              className="hidden flex-col gap-1 md:flex"
            />
          }
        >
          <ReaderRailDots items={items} currentAnchorId={currentAnchorId} />
        </HoverCardTrigger>
        <HoverCardContent
          align="center"
          side="left"
          sideOffset={8}
          className="w-56 rounded-2xl p-1"
        >
          <ReaderRailList
            items={items}
            currentAnchorId={currentAnchorId}
            onSelect={selectAnchor}
          />
        </HoverCardContent>
      </HoverCard>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Open conversation outline"
              className="flex flex-col gap-1 bg-background md:hidden"
            />
          }
        >
          <ReaderRailDots items={items} currentAnchorId={currentAnchorId} />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="left"
          sideOffset={8}
          className="w-56 gap-1 rounded-2xl p-1"
        >
          <ReaderRailList
            items={items}
            currentAnchorId={currentAnchorId}
            onSelect={selectAnchor}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ReaderRailDots({
  items,
  currentAnchorId,
}: {
  items: readonly ReaderRailItem[]
  currentAnchorId: string | null
}) {
  return items.map((item) => (
    <span
      key={item.id}
      data-current={item.id === currentAnchorId}
      className="h-0.5 w-4 rounded-full bg-muted-foreground/40 transition-colors data-[current=true]:bg-foreground motion-reduce:transition-none"
    />
  ))
}
