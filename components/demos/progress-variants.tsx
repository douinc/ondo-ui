import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export default function ProgressVariants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Progress value={24} variant="info">
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={62} variant="warning">
        <ProgressLabel>Retrying</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={100} variant="success">
        <ProgressLabel>Complete</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
