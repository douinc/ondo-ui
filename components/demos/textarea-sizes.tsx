import { Textarea } from "@/components/ui/textarea"

const sizes = ["xs", "sm", "default", "lg", "xl", "2xl"] as const

export default function TextareaSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {sizes.map((size) => (
        <Textarea key={size} size={size} placeholder={`Size ${size}`} />
      ))}
    </div>
  )
}
