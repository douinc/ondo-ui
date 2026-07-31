"use client"

import { toast } from "@/components/ui/toast"

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@/components/ui/bubble"

export default function BubbleLinksAndButtons() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble variant="muted">
        <BubbleContent>How can I help you today?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble variant="tinted" align="end">
          <BubbleContent
            render={
              <button onClick={() => toast.add({ title: "You clicked forgot password" })} />
            }
          >
            I forgot my password
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent
            render={
              <button
                onClick={() => toast.add({ title: "You clicked help with subscription" })}
              />
            }
          >
            I need help with my subscription
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent
            render={
              <button
                onClick={() =>
                  toast.add({ title: "You clicked something else. Talk to a human." })
                }
              />
            }
          >
            Something else. Talk to a human.
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
