"use client"

import * as React from "react"
import {
  IconArrowUp,
  IconChevronDown,
  IconCircleCheck,
  IconLoader2,
  IconSparkles,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Bubble,
  BubbleContent,
} from "@/components/ui/bubble"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import type {
  WorkspaceMessage,
  WorkspacePlanStepStatus,
  WorkspaceSnapshot,
  WorkspaceStatus,
} from "@/components/blocks/agent-workspace/workspace-data"

export type WorkspaceThreadProps = {
  snapshot: WorkspaceSnapshot
  messages: WorkspaceMessage[]
  draft: string
  onDraftChange: (value: string) => void
  onSubmit: () => void
  sidebarTrigger?: React.ReactNode
  artifactsTrigger?: React.ReactNode
}

const statusLabels: Record<WorkspaceStatus, string> = {
  start: "시작",
  running: "진행 중",
  complete: "완료",
}

const statusVariants: Record<
  WorkspaceStatus,
  "secondary" | "warning" | "success"
> = {
  start: "secondary",
  running: "warning",
  complete: "success",
}

const planStatusLabels: Record<WorkspacePlanStepStatus, string> = {
  queued: "대기 중",
  running: "진행 중",
  complete: "완료",
}

function MessageLog({ messages }: { messages: WorkspaceMessage[] }) {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport>
          <MessageScrollerContent
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="gap-5 px-4 py-6 sm:px-8"
          >
            <MessageGroup>
              {messages.map((message) => {
                const isUser = message.role === "user"

                return (
                  <Message key={message.id} align={isUser ? "end" : "start"}>
                    <MessageAvatar className="mt-1 size-7 bg-muted">
                      {isUser ? (
                        <span className="text-[10px] font-semibold">JI</span>
                      ) : (
                        <IconSparkles aria-hidden="true" className="size-3.5" />
                      )}
                    </MessageAvatar>
                    <MessageContent>
                      <MessageHeader>
                        {isUser ? "Jin" : "Ondo Agent"}
                      </MessageHeader>
                      <Bubble
                        align={isUser ? "end" : "start"}
                        variant={isUser ? "default" : "muted"}
                      >
                        <BubbleContent>{message.content}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                )
              })}
            </MessageGroup>
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

function PlanStatusIcon({ status }: { status: WorkspacePlanStepStatus }) {
  if (status === "complete") {
    return <IconCircleCheck aria-hidden="true" className="text-success" />
  }

  if (status === "running") {
    return (
      <IconLoader2
        aria-hidden="true"
        className="motion-safe:animate-spin text-warning"
      />
    )
  }

  return <span aria-hidden="true" className="size-2 rounded-full bg-muted-foreground/40" />
}

function StartThread() {
  return (
    <Empty className="border-0 px-6 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconSparkles aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>무엇을 함께 개선할까요?</EmptyTitle>
        <EmptyDescription>
          목표와 맥락을 알려주면 분석부터 실행 계획까지 함께 정리합니다.
        </EmptyDescription>
      </EmptyHeader>
      <div className="flex flex-wrap justify-center gap-2">
        {["온보딩 분석", "이탈 원인 찾기", "새 흐름 만들기"].map((suggestion) => (
          <span
            key={suggestion}
            className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground"
          >
            {suggestion}
          </span>
        ))}
      </div>
    </Empty>
  )
}

function RunningPlan({ snapshot }: { snapshot: WorkspaceSnapshot }) {
  if (snapshot.plan.length === 0) return null

  return (
    <Collapsible defaultOpen className="mx-4 mb-6 rounded-xl border sm:mx-8">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium hover:bg-muted/50">
        <span className="flex items-center gap-2">
          <span>작업 계획</span>
          <span className="text-xs font-normal text-muted-foreground">
            {snapshot.plan.filter((step) => step.status === "complete").length}/
            {snapshot.plan.length} 완료
          </span>
        </span>
        <IconChevronDown aria-hidden="true" className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t px-4 py-3">
          <ol className="space-y-3">
            {snapshot.plan.map((step) => (
              <li
                key={step.id}
                data-state={step.status}
                className="flex gap-3 text-sm"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                  <PlanStatusIcon status={step.status} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-medium">{step.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {planStatusLabels[step.status]}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {step.detail}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CompleteSummary({ snapshot }: { snapshot: WorkspaceSnapshot }) {
  if (!snapshot.completion) return null

  return (
    <div className="mx-4 mb-6 space-y-4 rounded-xl border bg-muted/30 p-4 sm:mx-8">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
          <IconCircleCheck aria-hidden="true" className="size-4" />
        </div>
        <div>
          <h2 className="font-medium">{snapshot.completion.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {snapshot.completion.body}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {snapshot.completion.metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg bg-background p-3">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
        <span className="text-muted-foreground">검증 완료</span>
        <span className="font-medium text-success">
          {snapshot.completion.verification}
        </span>
      </div>
    </div>
  )
}

export function WorkspaceThread({
  snapshot,
  messages,
  draft,
  onDraftChange,
  onSubmit,
  sidebarTrigger,
  artifactsTrigger,
}: WorkspaceThreadProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="Agent task thread">
      <header className="flex min-h-14 shrink-0 items-center gap-2 border-b px-4 sm:px-6">
        {sidebarTrigger}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {snapshot.tasks.find((task) => task.id === snapshot.selectedTaskId)
              ?.title ?? "새 작업"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {snapshot.project.name}
          </p>
        </div>
        <Badge variant={statusVariants[snapshot.status]}>
          {statusLabels[snapshot.status]}
        </Badge>
        {artifactsTrigger}
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        {snapshot.status === "start" ? (
          <StartThread />
        ) : (
          <>
            <MessageLog messages={messages} />
            {snapshot.status === "running" ? (
              <RunningPlan snapshot={snapshot} />
            ) : (
              <CompleteSummary snapshot={snapshot} />
            )}
          </>
        )}
      </div>

      <div className="shrink-0 border-t bg-background p-4 sm:px-6">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (draft.trim()) onSubmit()
          }}
        >
          <InputGroup>
            <InputGroupTextarea
              aria-label="Message"
              value={draft}
              placeholder={snapshot.composerPlaceholder}
              onChange={(event) => onDraftChange(event.target.value)}
              rows={2}
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                type="submit"
                variant="default"
                size="icon-sm"
                disabled={!draft.trim()}
                aria-label="Send message"
              >
                <IconArrowUp aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </section>
  )
}
