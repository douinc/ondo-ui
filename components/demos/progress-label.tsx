import {
  Progress,
  ProgressLabel as ProgressLabelComponent,
  ProgressValue,
} from "@/components/ui/progress"

export default function ProgressLabel() {
  return (
    <Progress value={56} className="w-full max-w-sm">
      <ProgressLabelComponent>Upload progress</ProgressLabelComponent>
      <ProgressValue />
    </Progress>
  )
}
