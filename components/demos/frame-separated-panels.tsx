import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame"

const frameSpacingOptions = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "default", label: "Default" },
  { value: "lg", label: "LG" },
] as const

export default function FrameSeparatedPanels() {
  return (
    <div className="flex w-full flex-col gap-8">
      {frameSpacingOptions.map(({ value, label }) => (
        <div key={value} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <Frame className="w-full" spacing={value}>
            <FrameHeader>
              <FrameTitle>Section header</FrameTitle>
              <FrameDescription>Description for the section</FrameDescription>
            </FrameHeader>
            <FramePanel>
              <h2 className="text-sm font-semibold">Separated panel</h2>
              <p className="text-sm text-muted-foreground">
                Section description
              </p>
            </FramePanel>
            <FramePanel>
              <h2 className="text-sm font-semibold">Separated panel</h2>
              <p className="text-sm text-muted-foreground">
                Section description
              </p>
            </FramePanel>
          </Frame>
        </div>
      ))}
    </div>
  )
}
