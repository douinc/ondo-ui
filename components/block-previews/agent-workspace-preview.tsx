"use client"

import * as React from "react"

import {
  AgentWorkspace,
  type WorkspaceStatus,
} from "@/components/blocks/agent-workspace/agent-workspace"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function AgentWorkspacePreview({
  labels,
  ariaLabel,
}: {
  labels: Record<WorkspaceStatus, string>
  ariaLabel: string
}) {
  const [status, setStatus] = React.useState<WorkspaceStatus>("start")

  return (
    <Tabs
      value={status}
      onValueChange={(value) => setStatus(value as WorkspaceStatus)}
      className="gap-4"
    >
      <TabsList aria-label={ariaLabel}>
        {(["start", "running", "complete"] as const).map((value) => (
          <TabsTrigger key={value} value={value}>
            {labels[value]}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value={status}
        className="overflow-hidden rounded-xl border"
      >
        <AgentWorkspace status={status} className="h-[720px] min-h-0" />
      </TabsContent>
    </Tabs>
  )
}
