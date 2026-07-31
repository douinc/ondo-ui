import {
  ChangelogPage,
  getChangelogMetadata,
} from "@/app/_shared/docs/changelog-page"

export const metadata = getChangelogMetadata("ko")

export default function Page() {
  return <ChangelogPage locale="ko" />
}
