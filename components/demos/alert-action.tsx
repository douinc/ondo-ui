import {
  Alert,
  AlertAction as AlertActionElement,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AlertAction() {
  return (
    <Alert className="max-w-md">
      <AlertTitle>Dark mode is now available</AlertTitle>
      <AlertDescription>
        Enable it under your profile settings to get started.
      </AlertDescription>
      <AlertActionElement>
        <Button size="xs" variant="default">
          Enable
        </Button>
      </AlertActionElement>
    </Alert>
  )
}
