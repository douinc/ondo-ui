import Link from "next/link"

import { siteConfig } from "@/lib/config"
import type { Dictionary } from "@/lib/dictionaries"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"

export function DocsCta({ dict }: { dict: Dictionary["docs"] }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface p-5 text-sm">
      <div className="font-medium text-foreground">{dict.ctaTitle}</div>
      <p className="text-muted-foreground">{dict.ctaDescription}</p>
      <Link
        href={siteConfig.links.github}
        target="_blank"
        rel="noreferrer"
        className={cn(buttonVariants({ size: "sm" }), "mt-2 w-fit")}
      >
        <Icons.gitHub className="size-4" />
        {dict.ctaButton}
      </Link>
    </div>
  )
}
