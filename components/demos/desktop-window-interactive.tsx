"use client"

import * as React from "react"

import {
  DesktopWindow,
  DesktopWindowContent,
  DesktopWindowControls,
  DesktopWindowTitle,
  DesktopWindowTitlebar,
} from "@/components/ui/desktop-window"

export default function DesktopWindowInteractive() {
  const [action, setAction] = React.useState<string | null>(null)

  return (
    <div className="w-full max-w-xl py-12">
      <DesktopWindow os="macos">
        <DesktopWindowTitlebar>
          <DesktopWindowControls
            onClose={() => setAction("close")}
            onMinimize={() => setAction("minimize")}
            onMaximize={() => setAction("zoom")}
          />
          <DesktopWindowTitle>Inspector</DesktopWindowTitle>
        </DesktopWindowTitlebar>
        <DesktopWindowContent className="p-6">
          <p className="text-sm text-muted-foreground">
            {action
              ? `You pressed ${action}.`
              : "Press a control, or tab into the window."}
          </p>
        </DesktopWindowContent>
      </DesktopWindow>
    </div>
  )
}
