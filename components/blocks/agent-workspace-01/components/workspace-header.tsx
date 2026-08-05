"use client"

import type * as React from "react"
import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react"

import {
  type WorkspaceStage,
  workspaceTask,
} from "@/components/blocks/agent-workspace-01/data"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function WorkspaceHeader({
  stage,
  inspector,
}: {
  stage: WorkspaceStage
  inspector: React.ReactNode
}) {
  return (
    <header className="flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b px-3 py-2 sm:px-4">
      <SidebarTrigger aria-label="Toggle workspace navigation" />
      <Separator orientation="vertical" className="h-5" />

      <div className="min-w-0 flex-1">
        <Heading level={1} size={6} className="sr-only">
          {workspaceTask.title}
        </Heading>
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem className="hidden sm:flex">
              <span className="truncate">{workspaceTask.repository}</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:flex" />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate">
                {workspaceTask.id} · {workspaceTask.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Badge variant={stage === "complete" ? "success" : "outline"}>
        {workspaceTask.branch}
      </Badge>

      <TabsList
        aria-label="Workspace lifecycle"
        className="order-last w-full sm:order-none sm:w-auto"
      >
        <TabsTrigger value="start">Start</TabsTrigger>
        <TabsTrigger value="running">In progress</TabsTrigger>
        <TabsTrigger value="complete">Complete</TabsTrigger>
      </TabsList>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Search workspace"
              className="hidden sm:inline-flex"
            />
          }
        >
          <IconSearch />
        </TooltipTrigger>
        <TooltipContent>Search workspace</TooltipContent>
      </Tooltip>

      <Sheet>
        <Tooltip>
          <TooltipTrigger
            render={
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="Open inspector"
                    className="lg:hidden"
                  />
                }
              />
            }
          >
            <IconAdjustmentsHorizontal />
          </TooltipTrigger>
          <TooltipContent>Open inspector</TooltipContent>
        </Tooltip>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Task inspector</SheetTitle>
            <SheetDescription>
              Review progress, context, changes, and artifacts.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-hidden">{inspector}</div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
