import { IconSparkles } from "@tabler/icons-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AlertPrimary() {
  return (
    <Alert variant="primary" className="max-w-md">
      <IconSparkles />
      <AlertTitle>Upgrade to Pro</AlertTitle>
      <AlertDescription>
        Unlock advanced features and priority support with a Pro plan.
      </AlertDescription>
    </Alert>
  )
}
