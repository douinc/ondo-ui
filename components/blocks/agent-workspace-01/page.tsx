"use client"

import * as React from "react"

import { AgentSidebar } from "@/components/blocks/agent-workspace-01/components/agent-sidebar"
import { ArtifactPanel } from "@/components/blocks/agent-workspace-01/components/artifact-panel"
import { ConversationPanel } from "@/components/blocks/agent-workspace-01/components/conversation-panel"
import { PromptComposer } from "@/components/blocks/agent-workspace-01/components/prompt-composer"
import { TaskProgress } from "@/components/blocks/agent-workspace-01/components/task-progress"
import { WorkspaceHeader } from "@/components/blocks/agent-workspace-01/components/workspace-header"
import { type WorkspaceStage } from "@/components/blocks/agent-workspace-01/data"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"

export function AgentWorkspaceBlock({
  initialStage = "running",
}: {
  initialStage?: WorkspaceStage
}) {
  const [stage, setStage] = React.useState<WorkspaceStage>(initialStage)

  return (
    <TooltipProvider>
      <Tabs
        value={stage}
        onValueChange={(value) => setStage(value as WorkspaceStage)}
        className="h-svh min-h-160 gap-0 bg-background"
      >
        <AgentWorkspaceStage stage={stage} />
      </Tabs>
    </TooltipProvider>
  )
}

export function AgentWorkspaceStage({ stage }: { stage: WorkspaceStage }) {
  const inspector = (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <TaskProgress stage={stage} />
      <div className="min-h-0 flex-1 overflow-hidden">
        <ArtifactPanel stage={stage} />
      </div>
    </div>
  )

  return (
    <div data-stage={stage} className="h-full min-h-0">
      <SidebarProvider
        className="h-full min-h-0"
        style={{ "--sidebar-width": "15rem" } as React.CSSProperties}
      >
        <AgentSidebar />
        <SidebarInset className="h-full min-h-0 overflow-hidden">
          <WorkspaceHeader stage={stage} inspector={inspector} />
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-0 flex-1"
          >
            <ResizablePanel defaultSize="70%" minSize="50%">
              <div className="flex size-full min-h-0 flex-col">
                <ConversationPanel stage={stage} />
                <PromptComposer stage={stage} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="hidden lg:flex" />
            <ResizablePanel
              defaultSize="30%"
              minSize="22%"
              maxSize="42%"
              className="hidden lg:block"
            >
              {inspector}
            </ResizablePanel>
          </ResizablePanelGroup>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default function AgentWorkspacePage() {
  return <AgentWorkspaceBlock />
}
