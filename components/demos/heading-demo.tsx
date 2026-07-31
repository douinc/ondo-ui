import { Heading } from "@/components/ui/heading"

export default function HeadingDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Heading level={1}>Build faster with ondo</Heading>
      <p className="text-muted-foreground">
        Components you own, styled with your own theme tokens.
      </p>
    </div>
  )
}
