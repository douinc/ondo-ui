import { IconCode, IconWindow } from "@tabler/icons-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsIcons() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <IconWindow />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <IconCode />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
