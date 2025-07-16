import React from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'glass' | 'outline' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', interactive = false, children, ...props }, ref) => {
    const baseStyles = "rounded-2xl transition-all duration-300";
    
    const variantStyles = {
      default: "bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/30",
      glass: "bg-glass shadow-glass",
      outline: "border border-slate-200 dark:border-slate-700 bg-transparent",
      flat: "bg-slate-50 dark:bg-slate-800/50",
    };
    
    const paddingStyles = {
      none: "",
      sm: "p-3",
      md: "p-5",
      lg: "p-8",
    };

    const interactiveStyles = interactive 
      ? "transform hover:-translate-y-1 hover:shadow-2xl" 
      : "";
    
    return (
      <div
        ref={ref}
        className={twMerge(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          interactiveStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("flex flex-col space-y-1.5", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={twMerge("font-bold text-xl text-slate-900 dark:text-slate-50", className)}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={twMerge("text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={twMerge("", className)} {...props} />
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("flex items-center justify-between mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50", className)}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }; 