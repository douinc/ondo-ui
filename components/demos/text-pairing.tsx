import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"

const sizes = [1, 2, 3, 4, 5, 6] as const

export default function TextPairing() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-8">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            size={size}
          </span>
          <Heading level={2} size={size}>
            Ship a design system
          </Heading>
          <Text size={size} tone="muted">
            Every heading size has a paragraph size with the same number, so a
            heading and the copy beneath it stay in proportion.
          </Text>
        </div>
      ))}
    </div>
  )
}
