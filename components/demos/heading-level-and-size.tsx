import { Heading } from "@/components/ui/heading"

export default function HeadingLevelAndSize() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          &lt;h2&gt; rendered large, for a hero
        </span>
        <Heading level={2} size={1}>
          Ship faster
        </Heading>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          &lt;h1&gt; rendered small, for a sidebar
        </span>
        <Heading level={1} size={5}>
          Recent activity
        </Heading>
      </div>
    </div>
  )
}
