import { Text } from "@/components/ui/text"

export default function TextSizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Text size={1}>Size 1 — a lede paragraph under a hero heading.</Text>
      <Text size={2}>Size 2 — an intro paragraph for a section.</Text>
      <Text size={3}>Size 3 — a slightly larger body paragraph.</Text>
      <Text size={4}>Size 4 — the default body paragraph.</Text>
      <Text size={5}>Size 5 — supporting copy inside dense UI.</Text>
      <Text size={6}>Size 6 — captions, hints, and metadata.</Text>
    </div>
  )
}
