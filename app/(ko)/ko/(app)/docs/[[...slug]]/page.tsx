import { DocsPage } from "@/app/_shared/docs/docs-page"
import {
  getDocsMetadata,
  getDocsStaticParams,
} from "@/app/_shared/docs/route-helpers"

export function generateStaticParams() {
  return getDocsStaticParams("ko")
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return getDocsMetadata("ko", (await params).slug)
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return <DocsPage locale="ko" slug={(await params).slug} />
}
