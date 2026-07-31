import { IconInfoCircle } from "@tabler/icons-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AlertInfo() {
  return (
    <Alert variant="info" className="max-w-md">
      <IconInfoCircle />
      <AlertTitle>A new software update is available.</AlertTitle>
      <AlertDescription>
        Version 2.4.0 includes performance improvements and bug fixes. Update at
        your convenience.
      </AlertDescription>
    </Alert>
  )
}
