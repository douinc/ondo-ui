"use client"

import { IconCheck, IconLoader2 } from "@tabler/icons-react"

import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

const steps = [
  { title: "Step 1", description: "Description" },
  { title: "Step 2", description: "Description" },
  { title: "Step 3", description: "Description" },
]

export default function StepperInlineTitleDescription() {
  return (
    <Stepper
      defaultValue={2}
      indicators={{
        completed: <IconCheck className="size-3.5" />,
        loading: <IconLoader2 className="size-3.5 animate-spin" />,
      }}
      className="w-full max-w-lg space-y-8"
    >
      <StepperNav>
        {steps.map((step, index) => (
          <StepperItem key={step.title} step={index + 1} className="relative">
            <StepperTrigger className="flex justify-start gap-1.5">
              <StepperIndicator>{index + 1}</StepperIndicator>
              <div className="flex flex-col items-start gap-0.5">
                <StepperTitle>{step.title}</StepperTitle>
                <StepperDescription>{step.description}</StepperDescription>
              </div>
            </StepperTrigger>

            {steps.length > index + 1 && (
              <StepperSeparator className="md:mx-2.5" />
            )}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="text-sm">
        {steps.map((step, index) => (
          <StepperContent
            key={step.title}
            value={index + 1}
            className="flex items-center justify-center"
          >
            {step.title} content
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  )
}
