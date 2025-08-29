import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-solid border-t-transparent",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border-[1.5px]",
        sm: "h-4 w-4 border-[1.5px]",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-2",
        xl: "h-12 w-12 border-3",
        "2xl": "h-16 w-16 border-4",
      },
      variant: {
        default: "border-primary",
        secondary: "border-secondary",
        destructive: "border-destructive",
        white: "border-white",
        muted: "border-muted-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  text?: string;
  showText?: boolean;
  center?: boolean;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size,
  variant,
  text = "Loading...",
  showText = false,
  center = false,
  fullScreen = false,
  className,
  ...props
}: LoadingSpinnerProps) {
  const spinnerElement = (
    <div
      className={cn(
        spinnerVariants({ size, variant }),
        className
      )}
      role="status"
      aria-label={text}
      {...props}
    />
  );

  const content = (
    <div
      className={cn(
        "flex items-center gap-2",
        center && "justify-center",
        fullScreen && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      )}
    >
      {spinnerElement}
      {showText && (
        <span className="text-sm text-muted-foreground animate-pulse">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2">
          {spinnerElement}
          {showText && (
            <span className="text-sm text-muted-foreground animate-pulse">
              {text}
            </span>
          )}
        </div>
      </div>
    );
  }

  return content;
}

// Additional loading components for common use cases
export function ButtonSpinner({ size = "sm", variant = "white", className, ...props }: LoadingSpinnerProps) {
  return (
    <LoadingSpinner
      size={size}
      variant={variant}
      className={cn("mr-2", className)}
      {...props}
    />
  );
}

export function PageLoader({ text = "Loading page...", ...props }: Omit<LoadingSpinnerProps, "fullScreen">) {
  return (
    <LoadingSpinner
      size="xl"
      showText
      text={text}
      fullScreen
      {...props}
    />
  );
}

export function CardLoader({ text = "Loading...", className, ...props }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <LoadingSpinner
        size="lg"
        showText
        text={text}
        center
        {...props}
      />
    </div>
  );
}

export function InlineLoader({ text = "Loading...", className, ...props }: LoadingSpinnerProps) {
  return (
    <LoadingSpinner
      size="sm"
      showText
      text={text}
      className={cn("inline-flex", className)}
      {...props}
    />
  );
}

// Table row loading placeholder
export function TableLoader({ columns = 4, rows = 3 }: { columns?: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-4 bg-muted rounded animate-pulse flex-1"></div>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
