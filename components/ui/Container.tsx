import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: "default" | "narrow" | "wide";
} & ComponentPropsWithoutRef<T>;

const sizes = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
};

export function Container<T extends ElementType = "div">({
  as,
  size = "default",
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";
  return <Component className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", sizes[size], className)} {...props} />;
}
