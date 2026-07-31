import { DocsPage } from "@/app/_shared/docs/docs-page"
import {
  getDocsMetadata,
  getDocsStaticParams,
} from "@/app/_shared/docs/route-helpers"

export function generateStaticParams() {
  return getDocsStaticParams("en")
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return getDocsMetadata("en", (await params).slug)
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return <DocsPage locale="en" slug={(await params).slug} />
}
