import {
  IconCopy,
  IconRefresh,
  IconThumbDown,
  IconThumbUp,
} from "@tabler/icons-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message"

export default function MessageActions() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              The install failure is coming from the workspace package.
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <Button variant="ghost" size="icon" aria-label="Copy" title="Copy">
              <IconCopy />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Like" title="Like">
              <IconThumbUp />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Dislike"
              title="Dislike"
            >
              <IconThumbDown />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Okay drop me a link. Taking a look...</BubbleContent>
          </Bubble>
          <MessageFooter className="gap-2">
            <span className="font-normal text-destructive">Failed to send</span>
            <Button
              variant="ghost"
              size="icon-xs"
              title="Retry"
              aria-label="Retry"
            >
              <IconRefresh />
            </Button>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}
