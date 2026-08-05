import { notFound } from "next/navigation"

import { blockPreviews } from "@/components/blocks"
import { getBlockNameStaticParams } from "@/lib/blocks"
import registry from "@/registry.json"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getBlockNameStaticParams(registry.items)
}

export default async function BlockPreviewPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const Preview = blockPreviews[name as keyof typeof blockPreviews]

  if (!Preview) notFound()

  return <Preview />
}
