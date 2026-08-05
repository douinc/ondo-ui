import { BlocksPage } from "@/app/_shared/pages/blocks-page"
import { getBlockCategoryStaticParams } from "@/lib/blocks"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getBlockCategoryStaticParams()
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  return <BlocksPage locale="en" category={category} />
}
