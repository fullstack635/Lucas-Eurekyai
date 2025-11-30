import { cn } from "@/lib/utils";

export const CheckCircleFilled = ({ className, size = 16, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={cn(className)}
      {...props}
    >
      <circle cx="8" cy="8" r="8" fill="#ABFFA8" />
    </svg>
  );
};

