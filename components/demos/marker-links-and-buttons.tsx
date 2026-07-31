"use client"

import { IconArrowBackUp, IconGitBranch } from "@tabler/icons-react"
import { toast } from "@/components/ui/toast"

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export default function MarkerLinksAndButtons() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker render={<a href="#links-and-buttons" />}>
        <MarkerIcon>
          <IconGitBranch />
        </MarkerIcon>
        <MarkerContent>View the pull request</MarkerContent>
      </Marker>
      <Marker
        render={
          <button
            type="button"
            className="transition-colors hover:text-foreground"
            onClick={() => toast.add({ title: "You clicked the revert button" })}
          />
        }
      >
        <MarkerIcon>
          <IconArrowBackUp />
        </MarkerIcon>
        <MarkerContent>Revert this change</MarkerContent>
      </Marker>
    </div>
  )
}
