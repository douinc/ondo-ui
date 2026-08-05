import {
  IconArrowUp,
  IconChevronDown,
  IconFileText,
  IconPaperclip,
  IconSparkles,
} from "@tabler/icons-react"

import {
  type WorkspaceStage,
  workspaceEvents,
} from "@/components/blocks/agent-workspace-01/data"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const prompt =
  "Build an agent workspace Block using Ondo UI and follow the official shadcn Block presentation."

export function PromptComposer({ stage }: { stage: WorkspaceStage }) {
  const selectedContext = workspaceEvents.filter(
    (event) => event.kind === "attachment" && event.availableAt === "start"
  )

  return (
    <div className="shrink-0 border-t bg-background px-3 py-3 sm:px-5">
      <div className="mx-auto max-w-3xl">
        <AttachmentGroup className="mb-2">
          {selectedContext.map((event) =>
            event.kind === "attachment" ? (
              <Attachment key={event.id} state="idle" size="xs">
                <AttachmentTrigger
                  aria-label={`Open context ${event.fileName}`}
                />
                <AttachmentMedia>
                  <IconFileText />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{event.fileName}</AttachmentTitle>
                  <AttachmentDescription>{event.meta}</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            ) : null
          )}
        </AttachmentGroup>

        <InputGroup size="lg" className="rounded-xl">
          <InputGroupTextarea
            aria-label="Agent prompt"
            defaultValue={prompt}
            rows={2}
            className="min-h-16 px-3 py-2.5"
          />
          <InputGroupAddon align="block-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Attach context"
                  />
                }
              >
                <IconPaperclip />
              </TooltipTrigger>
              <TooltipContent>Attach context</TooltipContent>
            </Tooltip>

            <Kbd>⌘ ↵</Kbd>

            <ButtonGroup className="ml-auto">
              <Tooltip>
                <TooltipTrigger
                  render={<InputGroupButton aria-label="Choose agent model" />}
                >
                  <IconSparkles />
                  GPT-5
                  <IconChevronDown />
                </TooltipTrigger>
                <TooltipContent>Choose agent model</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton
                      size="icon-xs"
                      variant="default"
                      aria-label="Send prompt"
                      disabled={stage === "complete"}
                    />
                  }
                >
                  <IconArrowUp />
                </TooltipTrigger>
                <TooltipContent>
                  {stage === "complete" ? "Task completed" : "Send prompt"}
                </TooltipContent>
              </Tooltip>
            </ButtonGroup>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
