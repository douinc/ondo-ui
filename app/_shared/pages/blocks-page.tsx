import type { Metadata } from "next"

import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
import { blocksList } from "@/lib/blocks-list"
import { CodeBlockCommand } from "@/components/code-block-command"
import { AgentWorkspacePreview } from "@/components/block-previews/agent-workspace-preview"

export function getBlocksMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale)

  return {
    title: dict.blocks.title,
    description: dict.blocks.description,
  }
}

export function BlocksPage({ locale }: { locale: Locale }): React.ReactNode {
  const dict = getDictionary(locale)
  const block = blocksList[0]

  return (
    <main className="container mx-auto flex-1 px-6 py-12">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {dict.blocks.title}
        </h1>
        <p className="max-w-2xl text-balance text-muted-foreground">
          {dict.blocks.description}
        </p>
      </div>
      <section className="mx-auto w-full max-w-[1600px] space-y-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {dict.blocks.item.title}
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {block.description[locale]}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-xl border bg-card">
          <div className="border-b px-4 py-3 text-xs font-medium text-muted-foreground">
            {dict.blocks.item.install}
          </div>
          <CodeBlockCommand
            __npm__="npx shadcn@latest add @ondo-ui/agent-workspace"
            __pnpm__="pnpm dlx shadcn@latest add @ondo-ui/agent-workspace"
            __yarn__="yarn dlx shadcn@latest add @ondo-ui/agent-workspace"
            __bun__="bunx --bun shadcn@latest add @ondo-ui/agent-workspace"
          />
        </div>
        <AgentWorkspacePreview
          labels={dict.blocks.item.states}
          ariaLabel={dict.blocks.item.previewLabel}
        />
      </section>
    </main>
  )
}
