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

export default function StepperIndicators() {
  return (
    <Stepper
      className="w-full max-w-md"
      defaultValue={2}
      indicators={{
        completed: <IconCheck className="size-3.5" />,
        loading: <IconLoader2 className="size-3.5 animate-spin" />,
      }}
    >
      <StepperNav className="mb-5">
        {steps.map((step) => (
          <StepperItem key={step} step={step} loading={step === 2}>
            <StepperTrigger>
              <StepperIndicator className="size-5 border-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:border-green-500 data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=inactive]:border-muted">
                <span className="hidden size-1.5 rounded-full bg-primary-foreground group-data-[state=active]/step:block" />
              </StepperIndicator>
            </StepperTrigger>
            {steps.length > step && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />
            )}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="text-sm">
        {steps.map((step) => (
          <StepperContent
            key={step}
            value={step}
            className="flex w-full items-center justify-center"
          >
            Step {step} content
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  )
}
