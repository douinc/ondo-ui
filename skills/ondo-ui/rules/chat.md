# Chat and Messaging

Use Ondo's chat components instead of custom bubbles, attachment cards, dividers, and stick-to-bottom code.

## Scroller structure

**Incorrect:** wire a raw scroll container, `ResizeObserver`, `scrollTop`, or a custom stick-to-bottom hook.

```tsx
<div ref={scrollRef} onScroll={handleScroll} className="overflow-y-auto">
  {messages.map((message) => <ChatRow key={message.id} {...message} />)}
</div>
```

**Correct:** keep the fixed nesting and let `MessageScroller` manage streaming, anchoring, visibility, and jump-to-latest.

```tsx
<MessageScrollerProvider autoScroll>
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent aria-busy={isStreaming}>
        {messages.map((message) => (
          <MessageScrollerItem
            key={message.id}
            messageId={message.id}
            scrollAnchor={message.role === "user"}
          >
            <Message align={message.role === "user" ? "end" : "start"}>
              <MessageContent>
                <Bubble align={message.role === "user" ? "end" : "start"}>
                  <BubbleContent>{message.text}</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

Use `MessageAvatar`, `MessageHeader`, and `MessageFooter` for sender metadata. Group consecutive messages with `MessageGroup`; stack surfaces with `BubbleGroup`.

## Attachments and markers

**Incorrect:** use a custom card and centered separator text.

```tsx
<div className="rounded-lg border">report.pdf</div>
<div>Today</div>
```

**Correct:** compose the provided exports.

```tsx
<AttachmentGroup>
  <Attachment state="done">
    <AttachmentMedia variant="icon"><IconFile /></AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>report.pdf</AttachmentTitle>
      <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
</AttachmentGroup>

<Marker variant="separator">
  <MarkerIcon><IconCalendar /></MarkerIcon>
  <MarkerContent>Today</MarkerContent>
</Marker>
```

Use attachment `state` values for upload and processing feedback. Use `MessageScrollerButton` directly rather than duplicating its visibility state. Reach for `useMessageScroller`, `useMessageScrollerVisibility`, or `useMessageScrollerScrollable` only when the provided composition cannot express required behavior. Use `render` for polymorphic chat actions.
