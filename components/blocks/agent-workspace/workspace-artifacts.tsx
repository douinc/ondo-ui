"use client"

import {
  IconBraces,
  IconChartBar,
  IconFileDescription,
  IconFileText,
  IconSearch,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  getVisibleArtifacts,
  selectWorkspaceItem,
} from "@/components/blocks/agent-workspace/workspace-data"
import type {
  WorkspaceArtifact,
  WorkspaceSnapshot,
} from "@/components/blocks/agent-workspace/workspace-data"

export type WorkspaceArtifactsProps = {
  snapshot: WorkspaceSnapshot
  selectedArtifactId: string | undefined
  onArtifactSelect: (artifactId: string) => void
  className?: string
}

function ArtifactIcon({ kind }: { kind: WorkspaceArtifact["kind"] }) {
  if (kind === "design") return <IconSearch aria-hidden="true" />
  if (kind === "data") return <IconChartBar aria-hidden="true" />
  if (kind === "code") return <IconBraces aria-hidden="true" />
  if (kind === "document") return <IconFileDescription aria-hidden="true" />
  return <IconFileText aria-hidden="true" />
}

function ArtifactList({
  artifacts,
  selectedArtifactId,
  onArtifactSelect,
}: Pick<WorkspaceArtifactsProps, "selectedArtifactId" | "onArtifactSelect"> & {
  artifacts: WorkspaceArtifact[]
}) {
  return (
    <div className="space-y-2">
      {artifacts.map((artifact) => {
        const isSelected = artifact.id === selectedArtifactId

        return (
          <Attachment
            key={artifact.id}
            state="done"
            className={cn(
              "w-full transition-colors",
              isSelected && "border-primary bg-primary/5"
            )}
            data-selected={isSelected ? "true" : "false"}
          >
            <AttachmentMedia>
              <ArtifactIcon kind={artifact.kind} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{artifact.name}</AttachmentTitle>
              <AttachmentDescription>
                {artifact.description} · {artifact.meta}
              </AttachmentDescription>
            </AttachmentContent>
            <AttachmentTrigger
              aria-label={`Open ${artifact.name}`}
              onClick={() => onArtifactSelect(artifact.id)}
            />
          </Attachment>
        )
      })}
    </div>
  )
}

export function WorkspaceArtifacts({
  snapshot,
  selectedArtifactId,
  onArtifactSelect,
  className,
}: WorkspaceArtifactsProps) {
  const artifacts = getVisibleArtifacts(snapshot)
  const selectedArtifact = selectWorkspaceItem(artifacts, selectedArtifactId)
  const heading =
    snapshot.status === "start"
      ? "작업 컨텍스트"
      : snapshot.status === "running"
        ? "진행 상황"
        : "산출물"

  return (
    <aside
      aria-label="Task context"
      className={cn("flex min-h-0 flex-col gap-5 border-s ps-5 pe-5 py-5", className)}
    >
      <div>
        <p className="text-xs font-medium text-muted-foreground">{heading}</p>
        <h2 className="mt-1 truncate text-sm font-semibold">
          {snapshot.project.name}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {snapshot.project.description}
        </p>
      </div>

      {snapshot.status === "running" && (
        <Progress value={snapshot.progress ?? 0} className="gap-2">
          <div className="flex items-center gap-2">
            <ProgressLabel>진행률</ProgressLabel>
            <ProgressValue />
          </div>
          <p className="text-xs text-muted-foreground">현재 작업</p>
          <p className="text-sm leading-relaxed">{snapshot.currentAction}</p>
        </Progress>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {artifacts.length > 0 ? (
          <ArtifactList
            artifacts={artifacts}
            selectedArtifactId={selectedArtifact?.id}
            onArtifactSelect={onArtifactSelect}
          />
        ) : (
          <Empty className="min-h-40 border-0 p-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconFileText aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle className="text-sm">
                {snapshot.status === "complete"
                  ? "표시할 산출물이 없습니다"
                  : "표시할 파일이 없습니다"}
              </EmptyTitle>
              <EmptyDescription className="text-xs">
                이 상태에는 아직 연결된 파일이 없습니다.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      {snapshot.status === "complete" && (
        <Button type="button" className="w-full">
          모든 결과 검토
        </Button>
      )}
    </aside>
  )
}
