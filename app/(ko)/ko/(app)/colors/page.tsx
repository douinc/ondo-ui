import {
  ColorsPage,
  getColorsMetadata,
} from "@/app/_shared/pages/colors-page"

export const metadata = getColorsMetadata("ko")

export default function Page() {
  return <ColorsPage locale="ko" />
}
