import {
  ChangelogPage,
  getChangelogMetadata,
} from "@/app/_shared/docs/changelog-page"

export const metadata = getChangelogMetadata("en")

export default function Page() {
  return <ChangelogPage locale="en" />
}
