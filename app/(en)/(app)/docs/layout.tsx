import { DocsLayout } from "@/app/_shared/docs/docs-layout"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DocsLayout locale="en">{children}</DocsLayout>
}
