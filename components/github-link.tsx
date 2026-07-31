import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function GitHubLink() {
  return (
    <Link
      href={siteConfig.links.github}
      target="_blank"
      rel="noreferrer"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "h-8 shadow-none"
      )}
    >
      <Icons.gitHub />
      <React.Suspense fallback={<Skeleton className="h-4 w-8" />}>
        <StarsCount />
      </React.Suspense>
    </Link>
  )
}

async function StarsCount() {
  let count: number | undefined

  try {
    const data = await fetch(
      `https://api.github.com/repos/${siteConfig.githubRepo}`,
      { next: { revalidate: 86400 } }
    )
    const json = await data.json()
    count = json.stargazers_count
  } catch {
    count = undefined
  }

  if (!Number.isFinite(count)) {
    return null
  }

  return (
    <span className="w-fit text-xs text-muted-foreground tabular-nums">
      {count! >= 1000 ? `${Math.round(count! / 1000)}k` : count!.toLocaleString()}
    </span>
  )
}
