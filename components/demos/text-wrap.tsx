import { Text } from "@/components/ui/text"

export default function TextWrap() {
  return (
    <div className="flex w-full max-w-[20rem] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          wrap=&quot;pretty&quot; (default)
        </span>
        <Text>
          A paragraph wrapped with pretty fills every line normally and only
          tidies the last one, so no single word is left stranded.
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          wrap=&quot;balance&quot;
        </span>
        <Text wrap="balance">
          A paragraph wrapped with balance evens out every line, which suits
          short blocks such as a single callout sentence.
        </Text>
      </div>
    </div>
  )
}
