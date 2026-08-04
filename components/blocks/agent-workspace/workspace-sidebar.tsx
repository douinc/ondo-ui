"use client"

import {
  IconCircle,
  IconCircleCheck,
  IconDots,
  IconLoader2,
  IconPlus,
  IconSparkles,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type {
  WorkspaceSnapshot,
  WorkspaceTaskStatus,
} from "@/components/blocks/agent-workspace/workspace-data"

export type WorkspaceSidebarProps = {
  snapshot: WorkspaceSnapshot
  selectedTaskId: string | undefined
  onNewTask: () => void
  onTaskSelect: (taskId: string) => void
}

const taskStatusLabels: Record<WorkspaceTaskStatus, string> = {
  idle: "대기 중",
  running: "진행 중",
  complete: "완료",
}

function TaskStatusIcon({ status }: { status: WorkspaceTaskStatus }) {
  if (status === "running") {
    return <IconLoader2 aria-hidden="true" className="motion-safe:animate-spin" />
  }

  if (status === "complete") {
    return <IconCircleCheck aria-hidden="true" />
  }

  return <IconCircle aria-hidden="true" />
}

export function WorkspaceSidebar({
  snapshot,
  selectedTaskId,
  onNewTask,
  onTaskSelect,
}: WorkspaceSidebarProps) {
  return (
    <Sidebar collapsible="icon" aria-label="Workspace tasks">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconSparkles aria-hidden="true" className="size-4" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">Ondo Agent</p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              작업 워크스페이스
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="justify-start gap-2 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
          onClick={onNewTask}
        >
          <IconPlus aria-hidden="true" />
          <span className="group-data-[collapsible=icon]:hidden">새 작업</span>
          <span className="sr-only group-data-[collapsible=icon]:not-sr-only">
            새 작업 만들기
          </span>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>프로젝트</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive
                  tooltip={snapshot.project.name}
                  aria-label={snapshot.project.name}
                >
                  <IconSparkles aria-hidden="true" />
                  <span>{snapshot.project.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-0">
          <SidebarGroupLabel>최근 작업</SidebarGroupLabel>
          <SidebarGroupContent>
            {snapshot.tasks.length > 0 ? (
              <SidebarMenu aria-label="Workspace tasks">
                {snapshot.tasks.map((task) => {
                  const isSelected = task.id === selectedTaskId

                  return (
                    <SidebarMenuItem key={task.id}>
                      <SidebarMenuButton
                        isActive={isSelected}
                        aria-current={isSelected ? "page" : undefined}
                        tooltip={task.title}
                        onClick={() => onTaskSelect(task.id)}
                      >
                        <TaskStatusIcon status={task.status} />
                        <span className="min-w-0 truncate">{task.title}</span>
                        <span className="sr-only">
                          상태: {taskStatusLabels[task.status]}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            ) : (
              <div className="px-2 py-8 text-center text-xs text-muted-foreground">
                아직 작업이 없습니다
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="group-data-[collapsible=icon]:justify-center"
                aria-label="Open user menu"
              />
            }
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
              JI
            </div>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">Jin</span>
              <span className="truncate text-xs text-muted-foreground">
                jin@ondo.so
              </span>
            </div>
            <IconDots aria-hidden="true" className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-56">
            <DropdownMenuLabel>Jin의 계정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>프로필</DropdownMenuItem>
            <DropdownMenuItem>설정</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
