import {
  BlocksPage,
  getBlocksMetadata,
} from "@/app/_shared/pages/blocks-page"

export const metadata = getBlocksMetadata("en")

export default function Page() {
  return <BlocksPage locale="en" />
}
