import type { ComponentProps, ReactNode } from "react"

import { highlightCode } from "@/lib/highlight-code"
import { readFileFromRoot } from "@/lib/read-file"
import { ComponentPreviewTabs } from "@/components/component-preview-tabs"
import { CopyButton } from "@/components/copy-button"
import { demos } from "@/components/demos"

interface ComponentPreviewProps extends ComponentProps<"div"> {
  /** Key of the demo component registered in components/demos. */
  name: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  previewClassName?: string
  /** Fallback source block, used only when the demo file cannot be read. */
  children?: ReactNode
}

export async function ComponentPreview({
  name,
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  children,
  ...props
}: ComponentPreviewProps) {
  const Demo = demos[name]

  let code: string | undefined
  let previewCode: string | undefined
  let highlightedCode: string | undefined
  let highlightedPreviewCode: string | undefined

  try {
    code = (await readFileFromRoot(`components/demos/${name}.tsx`)).trimEnd()
    previewCode = code.split("\n").slice(0, 3).join("\n")
    highlightedCode = await highlightCode(code)
    highlightedPreviewCode = await highlightCode(previewCode)
  } catch {
    code = undefined
  }

  // Fall back to the MDX code fence when the demo file cannot be read.
  let source: ReactNode = children
  let sourcePreview: ReactNode = children ? (
    <div className="max-h-24 overflow-hidden">{children}</div>
  ) : null

  if (code && highlightedCode) {
    source = <ComponentCode code={code} highlightedCode={highlightedCode} />
  }

  if (previewCode && highlightedPreviewCode) {
    sourcePreview = (
      <ComponentCode
        code={previewCode}
        highlightedCode={highlightedPreviewCode}
      />
    )
  }

  return (
    <ComponentPreviewTabs
      className={className}
      previewClassName={previewClassName}
      align={align}
      hideCode={hideCode}
      component={
        Demo ? (
          <Demo />
        ) : (
          <p className="text-muted-foreground text-sm">
            Demo &quot;{name}&quot; not found.
          </p>
        )
      }
      source={source}
      sourcePreview={sourcePreview}
      {...props}
    />
  )
}

function ComponentCode({
  code,
  highlightedCode,
}: {
  code: string
  highlightedCode: string
}) {
  return (
    <figure data-rehype-pretty-code-figure="">
      <CopyButton value={code} />
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  )
}
