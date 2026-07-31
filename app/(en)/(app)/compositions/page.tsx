import {
  CompositionsPage,
  getCompositionsMetadata,
} from "@/app/_shared/pages/compositions-page"

export const metadata = getCompositionsMetadata("en")

export default function Page() {
  return <CompositionsPage locale="en" />
}
