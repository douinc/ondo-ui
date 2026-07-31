"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

const timezones = [
  {
    value: "Americas",
    items: [
      "(GMT-5) New York",
      "(GMT-8) Los Angeles",
      "(GMT-6) Chicago",
      "(GMT-3) São Paulo",
    ],
  },
  {
    value: "Europe",
    items: ["(GMT+0) London", "(GMT+1) Paris", "(GMT+1) Berlin"],
  },
  {
    value: "Asia/Pacific",
    items: [
      "(GMT+9) Tokyo",
      "(GMT+8) Singapore",
      "(GMT+11) Sydney",
      "(GMT+9) Seoul",
    ],
  },
] as const

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix"] as const

const sizes = ["xs", "sm", "default", "lg", "xl", "2xl"] as const

function ComboboxSizeMultiple({ size }: { size: (typeof sizes)[number] }) {
  const anchor = useComboboxAnchor()

  return (
    <Combobox
      multiple
      autoHighlight
      size={size}
      items={frameworks}
      defaultValue={[frameworks[0], frameworks[1]]}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={`Size ${size}`} />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function ComboboxSize() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-6">
      <div className="flex flex-col gap-3">
        {sizes.map((size) => (
          <Combobox key={size} items={timezones} size={size}>
            <ComboboxInput placeholder={`Size ${size}`} showClear />
            <ComboboxContent>
              <ComboboxEmpty>No timezones found.</ComboboxEmpty>
              <ComboboxList>
                {(group: (typeof timezones)[number], index: number) => (
                  <ComboboxGroup key={group.value} items={group.items}>
                    <ComboboxLabel>{group.value}</ComboboxLabel>
                    <ComboboxCollection>
                      {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                    {index < timezones.length - 1 && <ComboboxSeparator />}
                  </ComboboxGroup>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {sizes.map((size) => (
          <ComboboxSizeMultiple key={size} size={size} />
        ))}
      </div>
    </div>
  )
}
