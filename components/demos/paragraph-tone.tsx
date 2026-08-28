import { Paragraph } from "@/components/ui/paragraph"

export default function ParagraphTone() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          tone=&quot;default&quot;
        </span>
        <Paragraph>The paragraph a reader is meant to read first.</Paragraph>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          tone=&quot;muted&quot;
        </span>
        <Paragraph tone="muted">
          Supporting copy that should stay in the background.
        </Paragraph>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          weight=&quot;medium&quot; / &quot;semibold&quot;
        </span>
        <Paragraph weight="medium">
          A paragraph carrying a little more weight.
        </Paragraph>
        <Paragraph weight="semibold">
          A lead-in line that introduces a list.
        </Paragraph>
      </div>
    </div>
  )
}
