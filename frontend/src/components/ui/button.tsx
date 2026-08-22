import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant="default", size="md", ...props}, ref) => {
  const variants: Record<string,string> = {
    default: "bg-[#714B67] text-white hover:bg-[#5f4057] shadow dark:bg-[#714B67] dark:hover:bg-[#5f4057]",
    outline: "border border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-transparent dark:hover:bg-zinc-900 text-foreground",
    ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground"
  }
  const sizes: Record<string,string> = { sm: "h-8 px-3 text-sm", md: "h-10 px-4", lg: "h-11 px-8" }
  return <button ref={ref} className={cn("inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50", variants[variant], sizes[size], className)} {...props} />
})
Button.displayName="Button"
