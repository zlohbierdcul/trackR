import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-start overflow-hidden whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/50",
        destructive:
          "bg-card text-destructive-foreground hover:bg-destructive-hover",
        outline:
          "bg-transparent hover:bg-primary hover:text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground transition-all",
        ghostSelected: "bg-accent text-accent-foreground hover:bg-accent-hover transition-all",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-2 py-2",
        iconText: "h-10 px-2 py-2 pr-20 gap-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 px-2 py-2 w-10 gap-2",
        smallIcon: "h-8 px-1 py-1 w-8 gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface IconProps {
  Icon: React.ElementType;
  iconPlacement: "left" | "right";
  iconSize?: number;
}

interface IconRefProps {
  Icon?: never;
  iconPlacement?: undefined;
  iconSize?: never;
}

export type ButtonIconProps = IconProps | IconRefProps;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonIconProps
>(
  (
    {
      className,
      variant,
      size,
      Icon,
      iconPlacement,
      iconSize = 24,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {Icon && iconPlacement === "left" && (
          <div
            className={cn(
              props.children ? "m-0" : "m-auto",
              "group-hover:translate-x-100 pr-0 transition-all duration-200 group-hover:w-5 group-hover:pr-2 group-hover:opacity-100",
            )}
          >
            <Icon className="m-0" size={iconSize} />
          </div>
        )}
        {props.children}
        {Icon && iconPlacement === "right" && (
          <div
            className={cn(
              props.children ? "m-0" : "m-auto",
              "pl-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100",
            )}
          >
            <Icon className="m-0" size={iconSize} />
          </div>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
