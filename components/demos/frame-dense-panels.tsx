import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame"

export default function FrameDensePanels() {
  return (
    <Frame className="w-full" stacked dense>
      <FrameHeader>
        <FrameTitle>Section header</FrameTitle>
        <FrameDescription>Description for the section</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">Stacked panel</h2>
        <p className="text-sm text-muted-foreground">Section description</p>
      </FramePanel>
      <FramePanel>
        <h2 className="text-sm font-semibold">Stacked panel</h2>
        <p className="text-sm text-muted-foreground">Section description</p>
      </FramePanel>
    </Frame>
  )
}
