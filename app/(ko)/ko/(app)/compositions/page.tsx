import {
  CompositionsPage,
  getCompositionsMetadata,
} from "@/app/_shared/pages/compositions-page"

export const metadata = getCompositionsMetadata("ko")

export default function Page() {
  return <CompositionsPage locale="ko" />
}
