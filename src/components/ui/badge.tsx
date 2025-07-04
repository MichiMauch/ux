import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        primary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        destructive: "bg-danger-100 text-danger-800 hover:bg-danger-200",
        success: "bg-success-100 text-success-800 hover:bg-success-200",
        warning: "bg-warning-100 text-warning-800 hover:bg-warning-200",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
