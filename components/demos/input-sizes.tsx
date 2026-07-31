import { Input } from "@/components/ui/input"

export default function InputSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input size="xs" placeholder="Extra small" className="w-40" />
      <Input size="sm" placeholder="Small" className="w-40" />
      <Input size="default" placeholder="Default" className="w-40" />
      <Input size="lg" placeholder="Large" className="w-40" />
      <Input size="xl" placeholder="Extra large" className="w-40" />
      <Input size="2xl" placeholder="2X large" className="w-40" />
    </div>
  )
}
