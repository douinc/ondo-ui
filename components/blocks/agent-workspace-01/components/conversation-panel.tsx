"use client"

import {
  getReaderRailItems,
  getWorkspaceEvents,
  isReaderAnchor,
  type WorkspaceStage,
} from "@/components/blocks/agent-workspace-01/data"
import { ConversationRow } from "@/components/blocks/agent-workspace-01/components/conversation-row"
import { ReaderRail } from "@/components/blocks/agent-workspace-01/components/reader-rail"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

export function ConversationPanel({ stage }: { stage: WorkspaceStage }) {
  const events = getWorkspaceEvents(stage)

  return (
    <MessageScrollerProvider
      defaultScrollPosition="last-anchor"
      scrollMargin={12}
    >
      <div className="relative flex min-h-0 flex-1">
        <MessageScroller aria-label="Agent workspace conversation">
          <MessageScrollerViewport>
            <MessageScrollerContent
              aria-busy={stage === "running"}
              className="px-4 py-6 pr-12 sm:px-6 sm:pr-14"
            >
              {events.map((event) => (
                <MessageScrollerItem
                  key={event.id}
                  messageId={event.id}
                  scrollAnchor={isReaderAnchor(event)}
                >
                  <ConversationRow event={event} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
        <ReaderRail items={getReaderRailItems(events)} />
      </div>
    </MessageScrollerProvider>
  )
}
