import { Paragraph } from "@/components/ui/paragraph"

export default function ParagraphWrap() {
  return (
    <div className="flex w-full max-w-[20rem] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          wrap=&quot;pretty&quot; (default)
        </span>
        <Paragraph>
          A paragraph wrapped with pretty fills every line normally and only
          tidies the last one, so no single word is left stranded.
        </Paragraph>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          wrap=&quot;balance&quot;
        </span>
        <Paragraph wrap="balance">
          A paragraph wrapped with balance evens out every line, which suits
          short blocks such as a single callout sentence.
        </Paragraph>
      </div>
    </div>
  )
}
