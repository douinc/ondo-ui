import {
  IconAlertTriangle,
  IconCheck,
  IconFileCode,
  IconFileText,
} from "@tabler/icons-react"

import {
  type WorkspaceStage,
  workspaceEvents,
  workspaceFiles,
  workspaceTask,
} from "@/components/blocks/agent-workspace-01/data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Badge } from "@/components/ui/badge"
import { Frame, FramePanel } from "@/components/ui/frame"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ArtifactPanel({ stage }: { stage: WorkspaceStage }) {
  const visibleAttachments = workspaceEvents.filter(
    (event) =>
      event.kind === "attachment" &&
      (event.availableAt === "start" ||
        event.availableAt === stage ||
        stage === "complete")
  )

  return (
    <Tabs defaultValue="context" className="h-full min-h-0 gap-0">
      <TabsList variant="line" className="mx-3 shrink-0">
        <TabsTrigger value="context">Context</TabsTrigger>
        <TabsTrigger value="changes">Changes</TabsTrigger>
        <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
      </TabsList>
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-3">
          <TabsContent value="context">
            <Frame spacing="sm">
              <FramePanel>
                <p className="text-sm font-medium">{workspaceTask.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {workspaceTask.summary}
                </p>
              </FramePanel>
              <FramePanel className="flex flex-col gap-2">
                {visibleAttachments
                  .slice(0, 2)
                  .map((event) =>
                    event.kind === "attachment" ? (
                      <WorkspaceAttachment key={event.id} event={event} />
                    ) : null
                  )}
              </FramePanel>
            </Frame>
          </TabsContent>

          <TabsContent value="changes">
            <Frame spacing="sm">
              <FramePanel>
                <ItemGroup>
                  {workspaceFiles.map((file) => (
                    <Item key={file.path} size="xs" variant="muted">
                      <ItemMedia variant="icon">
                        <IconFileCode />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{file.path.split("/").at(-1)}</ItemTitle>
                        <ItemDescription>{file.path}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant="success">+{file.additions}</Badge>
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </FramePanel>
            </Frame>
          </TabsContent>

          <TabsContent value="artifacts">
            <Frame spacing="sm">
              {stage === "complete" && (
                <Alert variant="success">
                  <IconCheck />
                  <AlertTitle>Workspace Block ready</AlertTitle>
                  <AlertDescription>
                    Tests, typecheck, registry output, and the isolated preview
                    are ready.
                  </AlertDescription>
                </Alert>
              )}
              <FramePanel className="flex flex-col gap-2">
                {visibleAttachments
                  .slice(2)
                  .map((event) =>
                    event.kind === "attachment" ? (
                      <WorkspaceAttachment key={event.id} event={event} />
                    ) : null
                  )}
              </FramePanel>
            </Frame>
          </TabsContent>
        </div>
      </ScrollArea>
    </Tabs>
  )
}

function WorkspaceAttachment({
  event,
}: {
  event: Extract<(typeof workspaceEvents)[number], { kind: "attachment" }>
}) {
  return (
    <Attachment state={event.state} size="sm" className="w-full">
      <AttachmentMedia>
        {event.state === "processing" ? (
          <Spinner />
        ) : event.state === "done" ? (
          <IconCheck />
        ) : event.state === "error" ? (
          <IconAlertTriangle />
        ) : (
          <IconFileText />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{event.fileName}</AttachmentTitle>
        <AttachmentDescription>{event.meta}</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  )
}
