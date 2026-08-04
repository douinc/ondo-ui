import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"

import { workspaceSnapshots } from "@/components/blocks/agent-workspace/workspace-data"
import { WorkspaceSidebar } from "@/components/blocks/agent-workspace/workspace-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

function renderSidebar(tasks = workspaceSnapshots.running.tasks) {
  const snapshot = { ...workspaceSnapshots.running, tasks }
  return renderToStaticMarkup(
    <TooltipProvider>
      <SidebarProvider>
        <WorkspaceSidebar
          snapshot={snapshot}
          selectedTaskId={snapshot.selectedTaskId}
          onNewTask={() => undefined}
          onTaskSelect={() => undefined}
        />
      </SidebarProvider>
    </TooltipProvider>
  )
}

describe("WorkspaceSidebar", () => {
  test("labels navigation and marks the selected task", () => {
    const html = renderSidebar()
    expect(html).toContain('aria-label="Workspace tasks"')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain("온보딩 흐름 개선")
    expect(html).toContain("새 작업")
  })

  test("renders an explicit empty task state", () => {
    expect(renderSidebar([])).toContain("아직 작업이 없습니다")
  })
})
