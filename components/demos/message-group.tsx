import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar as MessageAvatarComponent,
  MessageContent,
  MessageGroup as MessageGroupComponent,
} from "@/components/ui/message"

export default function MessageGroup() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 py-12">
      <MessageGroupComponent>
        <Message>
          <MessageAvatarComponent />
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>I checked the registry addresses.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message>
          <MessageAvatarComponent>
            <Avatar>
              <AvatarImage src="/avatars/02.png" alt="@avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </MessageAvatarComponent>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                The component and example JSON now live under the UI registry.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroupComponent>
    </div>
  )
}
