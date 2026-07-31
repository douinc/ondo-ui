import {
  ComponentsPage,
  getComponentsMetadata,
} from "@/app/_shared/pages/components-page"

export const metadata = getComponentsMetadata("en")

export default function Page() {
  return <ComponentsPage locale="en" />
}
