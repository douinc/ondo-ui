import { cn } from "cn"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn(
        "size-4 shrink-0 animate-spin transition-opacity delay-700 duration-300 ease-in-out [animation-duration:1.8s] starting:opacity-0",
        className
      )}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeLinecap="round"
        strokeDasharray="60"
        className="origin-center animate-spinner-dash"
      />
    </svg>
  )
}

export { Spinner }
