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
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

const steps = [{ title: "Account" }, { title: "Profile" }, { title: "Review" }]

export default function StepperInlineTitle() {
  return (
    <Stepper
      defaultValue={2}
      indicators={{
        completed: <IconCheck className="size-3.5" />,
        loading: <IconLoader2 className="size-3.5 animate-spin" />,
      }}
      className="w-full max-w-md space-y-8"
    >
      <StepperNav>
        {steps.map((step, index) => (
          <StepperItem key={step.title} step={index + 1} className="relative">
            <StepperTrigger className="flex justify-start gap-1.5">
              <StepperIndicator>{index + 1}</StepperIndicator>
              <StepperTitle>{step.title}</StepperTitle>
            </StepperTrigger>

            {steps.length > index + 1 && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-primary md:mx-2.5" />
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
