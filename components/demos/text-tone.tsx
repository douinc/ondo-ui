import { Text } from "@/components/ui/text"

export default function TextTone() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          tone=&quot;default&quot;
        </span>
        <Text>The paragraph a reader is meant to read first.</Text>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          tone=&quot;muted&quot;
        </span>
        <Text tone="muted">
          Supporting copy that should stay in the background.
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          weight=&quot;medium&quot; / &quot;semibold&quot;
        </span>
        <Text weight="medium">A paragraph carrying a little more weight.</Text>
        <Text weight="semibold">A lead-in line that introduces a list.</Text>
      </div>
    </div>
  )
}
