import { AppLayout } from "@/app/_shared/app-layout"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppLayout locale="ko">{children}</AppLayout>
}
