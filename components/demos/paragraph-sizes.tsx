import { Paragraph } from "@/components/ui/paragraph"

export default function ParagraphSizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Paragraph size={1}>
        Size 1 — a lede paragraph under a hero heading.
      </Paragraph>
      <Paragraph size={2}>Size 2 — an intro paragraph for a section.</Paragraph>
      <Paragraph size={3}>Size 3 — a slightly larger body paragraph.</Paragraph>
      <Paragraph size={4}>Size 4 — the default body paragraph.</Paragraph>
      <Paragraph size={5}>Size 5 — supporting copy inside dense UI.</Paragraph>
      <Paragraph size={6}>Size 6 — captions, hints, and metadata.</Paragraph>
    </div>
  )
}
