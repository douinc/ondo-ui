import { Heading } from "@/components/ui/heading"

export default function HeadingRender() {
  return (
    <fieldset className="w-full max-w-md rounded-xl border p-4">
      <Heading level={2} size={4} render={<legend />} className="px-1">
        Billing details
      </Heading>
      <p className="mt-2 text-sm text-muted-foreground">
        The render prop keeps the heading styles while swapping the element for
        the one the markup actually needs.
      </p>
    </fieldset>
  )
}
