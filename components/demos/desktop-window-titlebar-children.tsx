import { IconFolder, IconLayoutSidebar } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DesktopWindow,
  DesktopWindowContent,
  DesktopWindowControls,
  DesktopWindowTitle,
  DesktopWindowTitlebar,
} from "@/components/ui/desktop-window"

export default function DesktopWindowTitlebarChildren() {
  return (
    <div className="w-full max-w-xl py-12">
      <DesktopWindow os="macos">
        <DesktopWindowTitlebar>
          <DesktopWindowControls />
          <DesktopWindowTitle className="flex items-center justify-center gap-1.5">
            <IconFolder className="size-3.5" />
            Documents
          </DesktopWindowTitle>
          <Button
            variant="ghost"
            size="icon"
            className="z-10 ms-auto size-6 text-black/60 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <IconLayoutSidebar className="size-4" />
          </Button>
        </DesktopWindowTitlebar>
        <DesktopWindowContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Toolbars, app icons, and sidebars are not separate parts. Put them in
            the titlebar as children.
          </p>
        </DesktopWindowContent>
      </DesktopWindow>
    </div>
  )
}
