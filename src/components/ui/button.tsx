import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-400 text-white hover:bg-primary-500 active:bg-primary-600 shadow-sm",
        destructive: "bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-sm focus-visible:ring-danger-400",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 shadow-sm",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        link: "text-primary-600 underline-offset-4 hover:underline",
        success: "bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-sm focus-visible:ring-success-400",
        warning: "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 shadow-sm focus-visible:ring-warning-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-12 rounded-lg px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
