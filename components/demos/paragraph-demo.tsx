import { Heading } from "@/components/ui/heading"
import { Paragraph } from "@/components/ui/paragraph"

export default function ParagraphDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Heading level={2} size={2}>
        Build faster with ondo
      </Heading>
      <Paragraph size={2} tone="muted">
        Components you own, styled with your own theme tokens. Copy them in,
        keep the code, change whatever you need.
      </Paragraph>
    </div>
  )
}
