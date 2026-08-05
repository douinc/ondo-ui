import registry from "@/registry.json"

import { loadBlockDisplayData } from "@/lib/block-source"
import { getBlockItem } from "@/lib/blocks"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
import { BlockViewer } from "@/components/block-viewer"

export async function BlockDisplay({
  name,
  locale,
}: {
  name: string
  locale: Locale
}) {
  const item = getBlockItem(registry.items, name)

  if (!item) return null

  const data = await loadBlockDisplayData(item)
  const labels = getDictionary(locale).blocks.viewer

  return (
    <BlockViewer
      item={item}
      labels={labels}
      tree={data.tree}
      files={data.files}
    />
  )
}
