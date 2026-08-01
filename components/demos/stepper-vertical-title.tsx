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

export default function StepperVerticalTitle() {
  return (
    <div className="flex items-center justify-center">
      <Stepper
        className="flex flex-col items-center justify-center gap-10"
        defaultValue={2}
        orientation="vertical"
        indicators={{
          completed: <IconCheck className="size-3.5" />,
          loading: <IconLoader2 className="size-3.5 animate-spin" />,
        }}
      >
        <StepperNav>
          {steps.map((step, index) => (
            <StepperItem
              key={step.title}
              step={index + 1}
              className="relative items-start not-last:flex-1"
            >
              <StepperTrigger className="items-start gap-2.5 pb-12 last:pb-0">
                <StepperIndicator className="data-[state=completed]:bg-success data-[state=completed]:text-white">
                  {index + 1}
                </StepperIndicator>
                <div className="mt-0.5 text-left">
                  <StepperTitle>{step.title}</StepperTitle>
                </div>
              </StepperTrigger>
              {index < steps.length - 1 && (
                <StepperSeparator className="absolute inset-y-0 top-7 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)] group-data-[state=completed]/step:bg-success" />
              )}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel className="w-56 text-center text-sm">
          {steps.map((step, index) => (
            <StepperContent key={step.title} value={index + 1}>
              {step.title} content
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  )
}
