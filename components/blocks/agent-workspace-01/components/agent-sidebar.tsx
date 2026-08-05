"use client"

import {
  IconBolt,
  IconChevronDown,
  IconCircleCheck,
  IconFileCode,
  IconFolder,
  IconRobot,
  IconSettings,
} from "@tabler/icons-react"

import {
  workspaceFiles,
  workspaceNavigation,
  workspaceTask,
} from "@/components/blocks/agent-workspace-01/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AgentSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<SidebarMenuButton size="lg" tooltip="Workspace" />}
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconBolt />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    Ondo Agent
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {workspaceTask.repository}
                  </span>
                </span>
                <IconChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                {workspaceNavigation.workspaces.map((workspace) => (
                  <DropdownMenuItem key={workspace}>
                    <IconFolder />
                    {workspace}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent tasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceNavigation.recentTasks.map((task, index) => (
                <SidebarMenuItem key={task.id}>
                  <SidebarMenuButton
                    isActive={index === 0}
                    tooltip={task.label}
                  >
                    {task.status === "complete" ? (
                      <IconCircleCheck />
                    ) : (
                      <IconRobot />
                    )}
                    <span>{task.label}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{task.id}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Changed files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceFiles.map((file) => (
                <SidebarMenuItem key={file.path}>
                  <SidebarMenuButton tooltip={file.path}>
                    <IconFileCode />
                    <span>{file.path.split("/").at(-1)}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>+{file.additions}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" tooltip="Agent settings" />
                }
              >
                <Avatar size="sm">
                  <AvatarFallback>CO</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">Codex</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    Active agent
                  </span>
                </span>
                <Badge variant="success">Ready</Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right">
                <DropdownMenuLabel>Agent</DropdownMenuLabel>
                <DropdownMenuItem>
                  <IconRobot /> Model settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconSettings /> Workspace settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
