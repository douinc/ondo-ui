import "@/app/globals.css"

import {
  getRootMetadata,
  LocaleRootLayout,
} from "@/app/_shared/locale-root-layout"

export const metadata = getRootMetadata("en")

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <LocaleRootLayout locale="en">{children}</LocaleRootLayout>
}
