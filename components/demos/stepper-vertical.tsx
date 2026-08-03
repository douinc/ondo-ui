"use client"

import { IconCheck, IconLoader2 } from "@tabler/icons-react"

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"

const steps = [1, 2, 3]

export default function StepperVertical() {
  return (
    <div className="flex items-center justify-center">
      <Stepper
        className="flex flex-col items-center justify-center gap-10"
        defaultValue={2}
        orientation="vertical"
        variant="success"
        activeVariant="default"
        indicators={{
          completed: <IconCheck className="size-3.5" />,
          loading: <IconLoader2 className="size-3.5 animate-spin" />,
        }}
      >
        <StepperNav>
          {steps.map((step) => (
            <StepperItem key={step} step={step} loading={step === 2}>
              <StepperTrigger>
                <StepperIndicator>{step}</StepperIndicator>
              </StepperTrigger>
              {steps.length > step && <StepperSeparator />}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel className="w-56 text-center text-sm">
          {steps.map((step) => (
            <StepperContent key={step} value={step}>
              Step {step} content
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  )
}
