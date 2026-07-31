"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavItem } from "@/lib/config"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function MainNav({
  home,
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  home: NavItem
  items: NavItem[]
}) {
  const pathname = usePathname()

  return (
    <nav className={cn("items-center gap-0", className)} {...props}>
      <Link href={home.href} className="mr-3 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary">
          <Image
            src="/svg/ondo-logo-light.svg"
            alt="Ondo UI logo"
            width={24}
            height={24}
            className="size-6 dark:hidden"
          />
          <Image
            src="/svg/ondo-logo-dark.svg"
            alt="Ondo UI logo"
            width={24}
            height={24}
            className="hidden size-6 dark:block"
          />
        </div>
        <span className="font-heading text-base font-black">Ondo UI</span>
      </Link>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          data-active={pathname === item.href}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "px-2.5 text-foreground/80 data-[active=true]:text-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
