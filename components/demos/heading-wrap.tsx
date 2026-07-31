import { Heading } from "@/components/ui/heading"

export default function HeadingWrap() {
  return (
    <div className="flex w-full max-w-[15rem] flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          wrap=&quot;normal&quot; (default)
        </span>
        <Heading level={2} size={3} wrap="normal">
          Build a design system your whole team enjoys using
        </Heading>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          wrap=&quot;nowrap&quot;
        </span>
        <div className="overflow-x-auto">
          <Heading level={2} size={3} wrap="nowrap">
            Build a design system your whole team enjoys using
          </Heading>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          wrap=&quot;balance&quot;
        </span>
        <Heading level={2} size={3} wrap="balance">
          Build a design system your whole team enjoys using
        </Heading>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          wrap=&quot;pretty&quot;
        </span>
        <Heading level={2} size={3} wrap="pretty">
          Build a design system your whole team enjoys using
        </Heading>
      </div>
    </div>
  )
}
