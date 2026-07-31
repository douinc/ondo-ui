import { Kbd, KbdGroup as KbdGroupComponent } from "@/components/ui/kbd"

export default function KbdGroup() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">
        Use{" "}
        <KbdGroupComponent>
          <Kbd>Ctrl + B</Kbd>
          <Kbd>Ctrl + K</Kbd>
        </KbdGroupComponent>{" "}
        to open the command palette
      </p>
    </div>
  )
}
