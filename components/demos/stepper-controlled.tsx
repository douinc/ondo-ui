"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
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

const steps = [1, 2, 3, 4]

export default function StepperControlled() {
  const [currentStep, setCurrentStep] = useState(2)

  return (
    <Stepper
      value={currentStep}
      onValueChange={setCurrentStep}
      variant="success"
      activeVariant="default"
      className="w-full max-w-md space-y-8"
    >
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator>{step}</StepperIndicator>
            </StepperTrigger>
            {steps.length > step && <StepperSeparator />}
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

      <div className="flex items-center justify-between gap-2.5">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((previous) => previous - 1)}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep((previous) => previous + 1)}
          disabled={currentStep === steps.length}
        >
          Next
        </Button>
      </div>
    </Stepper>
  )
}
