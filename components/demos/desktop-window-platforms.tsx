import {
  DesktopWindow,
  DesktopWindowContent,
  DesktopWindowControls,
  DesktopWindowTitle,
  DesktopWindowTitlebar,
  type DesktopWindowOs,
} from "@/components/ui/desktop-window"

const PLATFORMS: DesktopWindowOs[] = ["macos", "windows", "ubuntu"]

export default function DesktopWindowPlatforms() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6 py-12">
      {PLATFORMS.map((os) => (
        <DesktopWindow key={os} os={os}>
          <DesktopWindowTitlebar>
            <DesktopWindowControls />
            <DesktopWindowTitle>Release Notes</DesktopWindowTitle>
          </DesktopWindowTitlebar>
          <DesktopWindowContent className="p-6">
            <p className="font-mono text-sm text-muted-foreground">
              os=&quot;{os}&quot;
            </p>
          </DesktopWindowContent>
        </DesktopWindow>
      ))}
    </div>
  )
}
