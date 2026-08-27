import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"

export default function TextDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Heading level={2} size={2}>
        Build faster with ondo
      </Heading>
      <Text size={2} tone="muted">
        Components you own, styled with your own theme tokens. Copy them in,
        keep the code, change whatever you need.
      </Text>
    </div>
  )
}
