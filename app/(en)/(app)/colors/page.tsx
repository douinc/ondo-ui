import {
  ColorsPage,
  getColorsMetadata,
} from "@/app/_shared/pages/colors-page"

export const metadata = getColorsMetadata("en")

export default function Page() {
  return <ColorsPage locale="en" />
}
