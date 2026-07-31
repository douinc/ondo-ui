import {
  BlocksPage,
  getBlocksMetadata,
} from "@/app/_shared/pages/blocks-page"

export const metadata = getBlocksMetadata("ko")

export default function Page() {
  return <BlocksPage locale="ko" />
}
