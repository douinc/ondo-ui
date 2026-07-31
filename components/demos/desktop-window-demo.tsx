import {
  DesktopWindow,
  DesktopWindowContent,
  DesktopWindowControls,
  DesktopWindowTitle,
  DesktopWindowTitlebar,
} from "@/components/ui/desktop-window"

export default function DesktopWindowDemo() {
  return (
    <div className="w-full max-w-xl py-12">
      <DesktopWindow os="macos">
        <DesktopWindowTitlebar>
          <DesktopWindowControls />
          <DesktopWindowTitle>Release Notes</DesktopWindowTitle>
        </DesktopWindowTitlebar>
        <DesktopWindowContent className="space-y-2 p-6">
          <p className="text-sm font-medium">Version 0.5.0</p>
          <p className="text-sm text-muted-foreground">
            Wrap a screenshot, a code sample, or a live component in window
            chrome. The frame is decoration — it does not drag or resize.
          </p>
        </DesktopWindowContent>
      </DesktopWindow>
    </div>
  )
}
