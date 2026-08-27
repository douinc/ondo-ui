import { Text } from "@/components/ui/text"

export default function TextRender() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Text size={5} tone="muted" render={<span />}>
        Rendered as a span, for copy that sits inside another paragraph.
      </Text>
      <Text size={6} tone="muted" render={<figcaption />}>
        Rendered as a figcaption, for an image credit.
      </Text>
    </div>
  )
}
