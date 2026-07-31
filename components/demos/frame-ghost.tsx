import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame"

export default function FrameGhost() {
  return (
    <Frame className="w-full" variant="ghost">
      <FrameHeader>
        <FrameTitle>No Outer Border</FrameTitle>
        <FrameDescription>
          This frame uses variant=&quot;ghost&quot; to remove the outer border.
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        <p className="text-sm text-muted-foreground">
          The outer container of this frame has no border, only the background
          and panels are visible.
        </p>
      </FramePanel>
    </Frame>
  )
}
