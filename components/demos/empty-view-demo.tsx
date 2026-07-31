import { IconArrowUpRight, IconFolderCode } from "@tabler/icons-react"

import { EmptyView } from "@/components/compositions/empty-view"
import { Button } from "@/components/ui/button"

export default function EmptyViewDemo() {
  return (
    <EmptyView
      icon={<IconFolderCode />}
      title="No Projects Yet"
      description="You haven't created any projects yet. Get started by creating your first project."
      actions={
        <>
          <div className="flex flex-row justify-center gap-2">
            <Button>Create Project</Button>
            <Button variant="outline">Import Project</Button>
          </div>
          <Button
            variant="link"
            render={<a href="#" />}
            className="text-muted-foreground"
            size="sm"
            nativeButton={false}
          >
            Learn More <IconArrowUpRight />
          </Button>
        </>
      }
    />
  )
}
