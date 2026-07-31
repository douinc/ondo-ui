import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame"

export default function FrameDemo() {
  return (
    <Frame className="w-full">
      <FrameHeader>
        <FrameTitle>Section header</FrameTitle>
        <FrameDescription>Description for the section</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Section title 2</h2>
        <p className="text-sm text-muted-foreground">Section description</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-sm text-muted-foreground">Section footer</p>
      </FrameFooter>
    </Frame>
  )
}
