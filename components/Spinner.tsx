import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: number; // diameter in pixels
  className?: string;
};

export const Spinner = ({ size = 24, className }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted-foreground border-t-transparent",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
};
