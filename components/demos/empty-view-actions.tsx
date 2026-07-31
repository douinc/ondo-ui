import { IconCloud } from "@tabler/icons-react"

import { EmptyView } from "@/components/compositions/empty-view"
import { Button } from "@/components/ui/button"

export default function EmptyViewActions() {
  return (
    <EmptyView
      icon={<IconCloud />}
      title="Cloud Storage Empty"
      description="Upload files to your cloud storage to access them anywhere."
      actions={
        <Button variant="outline" size="sm">
          Upload Files
        </Button>
      }
    />
  )
}
