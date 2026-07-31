import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator as ButtonGroupSeparatorComponent,
} from "@/components/ui/button-group"

export default function ButtonGroupSeparator() {
  return (
    <ButtonGroup>
      <Button variant="secondary" size="sm">
        Copy
      </Button>
      <ButtonGroupSeparatorComponent />
      <Button variant="secondary" size="sm">
        Paste
      </Button>
    </ButtonGroup>
  )
}
