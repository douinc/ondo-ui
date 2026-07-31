import { Slider } from "@/components/ui/slider"

export default function SliderMultipleThumbs() {
  return (
    <Slider
      defaultValue={[10, 20, 70]}
      max={100}
      step={10}
      className="mx-auto w-full max-w-xs"
    />
  )
}
