"use client"

import { toast } from "@/components/ui/toast"

import {
  Bubble,
  BubbleContent,
  BubbleReactions as BubbleReactionsComponent,
} from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"

export default function BubbleReactions() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-12 py-12">
      <Bubble variant="muted" align="end">
        <BubbleContent>
          I don&apos;t need tests, I know my code works.
        </BubbleContent>
        <BubbleReactionsComponent
          align="start"
          role="img"
          aria-label="Reactions: thumbs up, surprised"
        >
          <span>👍</span>
          <span>😮</span>
        </BubbleReactionsComponent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Bold. Fine I&apos;ll add some tests. I&apos;ll let you know when
          they&apos;re done.
        </BubbleContent>
        <BubbleReactionsComponent
          role="img"
          aria-label="Reactions: eyes, rocket, and 2 more"
        >
          <span>👀</span>
          <span>🚀</span>
          <span>+2</span>
        </BubbleReactionsComponent>
      </Bubble>
      <Bubble variant="default" align="end">
        <BubbleContent>
          Tests passed on the first try. All 142 of them. Looking good!
        </BubbleContent>
        <BubbleReactionsComponent
          side="top"
          align="start"
          role="img"
          aria-label="Reactions: party popper, clapping hands"
        >
          <span>🎉</span>
          <span>👏</span>
        </BubbleReactionsComponent>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>Are you sure I can run this command?</BubbleContent>
        <BubbleReactionsComponent>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => toast.add({
                type: "success",
                title: "You clicked yes, running command...",
              })}
          >
            Yes, run it
          </Button>
        </BubbleReactionsComponent>
      </Bubble>
    </div>
  )
}
