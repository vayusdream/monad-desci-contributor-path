import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-paper hover:bg-navy-deep disabled:bg-ink-soft disabled:cursor-not-allowed",
  secondary:
    "border border-navy text-navy hover:bg-navy hover:text-paper disabled:opacity-40 disabled:cursor-not-allowed",
  ghost: "text-ink-soft hover:text-ink",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
