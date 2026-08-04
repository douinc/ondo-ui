"use client"

import * as React from "react"
import { IconFileText } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  selectWorkspaceItem,
  workspaceSnapshots,
} from "@/components/blocks/agent-workspace/workspace-data"
import type {
  WorkspaceMessage,
  WorkspaceStatus,
} from "@/components/blocks/agent-workspace/workspace-data"
import { WorkspaceArtifacts } from "@/components/blocks/agent-workspace/workspace-artifacts"
import { WorkspaceSidebar } from "@/components/blocks/agent-workspace/workspace-sidebar"
import { WorkspaceThread } from "@/components/blocks/agent-workspace/workspace-thread"

export type AgentWorkspaceProps = React.ComponentProps<"div"> & {
  status?: WorkspaceStatus
  defaultStatus?: WorkspaceStatus
  onStatusChange?: (status: WorkspaceStatus) => void
}

const initialDrafts: Record<WorkspaceStatus, string> = {
  start: "온보딩 흐름을 분석하고 개선안을 구현해줘",
  running: "",
  complete: "",
}

export function AgentWorkspace({
  className,
  style,
  status,
  defaultStatus = "start",
  onStatusChange,
  ...props
}: AgentWorkspaceProps) {
  const [internalStatus, setInternalStatus] =
    React.useState<WorkspaceStatus>(defaultStatus)
  const resolvedStatus = status ?? internalStatus

  const requestStatusChange = React.useCallback(
    (nextStatus: WorkspaceStatus) => {
      if (status === undefined) setInternalStatus(nextStatus)
      onStatusChange?.(nextStatus)
    },
    [onStatusChange, status]
  )

  const snapshot = workspaceSnapshots[resolvedStatus]
  const [selectedTaskId, setSelectedTaskId] = React.useState(
    snapshot.selectedTaskId
  )
  const [selectedArtifactId, setSelectedArtifactId] = React.useState<
    string | undefined
  >(undefined)
  const [drafts, setDrafts] = React.useState(initialDrafts)
  const [localMessages, setLocalMessages] = React.useState<
    Record<WorkspaceStatus, WorkspaceMessage[]>
  >({
    start: [...workspaceSnapshots.start.messages],
    running: [...workspaceSnapshots.running.messages],
    complete: [...workspaceSnapshots.complete.messages],
  })

  const selectedTask = selectWorkspaceItem(snapshot.tasks, selectedTaskId)
  const activeSnapshot = {
    ...snapshot,
    selectedTaskId: selectedTask?.id ?? snapshot.selectedTaskId,
  }
  const draft = drafts[resolvedStatus]

  const setDraft = React.useCallback(
    (value: string) => {
      setDrafts((current) => ({ ...current, [resolvedStatus]: value }))
    },
    [resolvedStatus]
  )

  const submitDraft = React.useCallback(() => {
    const content = drafts[resolvedStatus].trim()
    if (!content) return

    setLocalMessages((current) => ({
      ...current,
      [resolvedStatus]: [
        ...current[resolvedStatus],
        {
          id: `${resolvedStatus}-local-${current[resolvedStatus].length + 1}`,
          role: "user",
          content,
        },
      ],
    }))
    setDrafts((current) => ({ ...current, [resolvedStatus]: "" }))
  }, [drafts, resolvedStatus])

  const startNewTask = React.useCallback(() => {
    setSelectedTaskId(workspaceSnapshots.start.selectedTaskId)
    setSelectedArtifactId(undefined)
    setLocalMessages((current) => ({ ...current, start: [] }))
    setDrafts((current) => ({ ...current, start: initialDrafts.start }))
    requestStatusChange("start")
  }, [requestStatusChange])

  return (
    <TooltipProvider>
      <SidebarProvider
        className={cn("min-h-svh overflow-hidden", className)}
        style={
          {
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "3rem",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <WorkspaceSidebar
          snapshot={activeSnapshot}
          selectedTaskId={selectedTask?.id}
          onNewTask={startNewTask}
          onTaskSelect={setSelectedTaskId}
        />
        <SidebarInset aria-label="Agent task thread">
          <WorkspaceThread
            snapshot={activeSnapshot}
            messages={localMessages[resolvedStatus]}
            draft={draft}
            onDraftChange={setDraft}
            onSubmit={submitDraft}
            sidebarTrigger={<SidebarTrigger aria-label="Toggle workspace tasks" />}
            artifactsTrigger={
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="xl:hidden"
                      aria-label="Open task context"
                    />
                  }
                >
                  <IconFileText aria-hidden="true" />
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>작업 컨텍스트</SheetTitle>
                    <SheetDescription>
                      현재 작업에 연결된 파일과 산출물입니다.
                    </SheetDescription>
                  </SheetHeader>
                  <WorkspaceArtifacts
                    snapshot={activeSnapshot}
                    selectedArtifactId={selectedArtifactId}
                    onArtifactSelect={setSelectedArtifactId}
                    className="min-h-0 flex-1 border-0 px-4 pt-0"
                  />
                </SheetContent>
              </Sheet>
            }
          />
        </SidebarInset>
        <WorkspaceArtifacts
          snapshot={activeSnapshot}
          selectedArtifactId={selectedArtifactId}
          onArtifactSelect={setSelectedArtifactId}
          className="hidden w-80 shrink-0 xl:flex"
        />
      </SidebarProvider>
    </TooltipProvider>
  )
}

export type { WorkspaceStatus }
