import { IconCircleCheck } from "@tabler/icons-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AlertSuccess() {
  return (
    <Alert variant="success" className="max-w-md">
      <IconCircleCheck />
      <AlertTitle>Payment successful</AlertTitle>
      <AlertDescription>
        Your payment of $29.99 has been processed. A receipt has been sent to
        your email address.
      </AlertDescription>
    </Alert>
  )
}
