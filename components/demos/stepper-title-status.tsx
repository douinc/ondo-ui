"use client"

import { useState } from "react"
import {
  IconCheck,
  IconCreditCard,
  IconLoader2,
  IconLock,
  IconUserSquareRounded,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

const steps = [
  {
    title: "User Details",
    icon: <IconUserSquareRounded className="size-4" />,
  },
  {
    title: "Payment Info",
    icon: <IconCreditCard className="size-4" />,
  },
  {
    title: "Auth OTP",
    icon: <IconLock className="size-4" />,
  },
]

export default function StepperTitleStatus() {
  const [currentStep, setCurrentStep] = useState(2)

  return (
    <Stepper
      value={currentStep}
      onValueChange={setCurrentStep}
      indicators={{
        completed: <IconCheck className="size-3.5" />,
        loading: <IconLoader2 className="size-3.5 animate-spin" />,
      }}
      className="w-full max-w-xl space-y-8"
    >
      <StepperNav className="gap-3">
        {steps.map((step, index) => (
          <StepperItem
            key={step.title}
            step={index + 1}
            className="relative flex-1 items-start"
          >
            <StepperTrigger className="flex grow flex-col items-start justify-center gap-2.5">
              <StepperIndicator className="data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=completed]:bg-success size-8 border-2 data-[state=completed]:text-white data-[state=inactive]:bg-transparent">
                {step.icon}
              </StepperIndicator>
              <div className="flex flex-col items-start gap-1">
                <div className="text-muted-foreground text-[10px] font-semibold uppercase">
                  Step {index + 1}
                </div>
                <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-start text-base font-semibold">
                  {step.title}
                </StepperTitle>
                <div>
                  <Badge
                    variant="default"
                    className="hidden group-data-[state=active]/step:inline-flex"
                  >
                    In Progress
                  </Badge>
                  <Badge
                    variant="success"
                    className="hidden group-data-[state=completed]/step:inline-flex"
                  >
                    Completed
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-muted-foreground hidden group-data-[state=inactive]/step:inline-flex"
                  >
                    Pending
                  </Badge>
                </div>
              </div>
            </StepperTrigger>

            {steps.length > index + 1 && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-x-0 start-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
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
