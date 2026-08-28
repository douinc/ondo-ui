import { Paragraph } from "@/components/ui/paragraph"

export default function ParagraphRender() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Paragraph size={5} variant="muted" render={<span />}>
        Rendered as a span, for copy that sits inside another paragraph.
      </Paragraph>
      <Paragraph size={6} variant="muted" render={<figcaption />}>
        Rendered as a figcaption, for an image credit.
      </Paragraph>
    </div>
  )
}
