import { Heading } from "@/components/ui/heading"

export default function HeadingSizes() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Heading level={2} size={1}>
        Size 1
      </Heading>
      <Heading level={2} size={2}>
        Size 2
      </Heading>
      <Heading level={2} size={3}>
        Size 3
      </Heading>
      <Heading level={2} size={4}>
        Size 4
      </Heading>
      <Heading level={2} size={5}>
        Size 5
      </Heading>
      <Heading level={2} size={6}>
        Size 6
      </Heading>
    </div>
  )
}
