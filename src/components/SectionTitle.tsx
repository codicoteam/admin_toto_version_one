
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const SectionTitle = ({ title, description, children, className }: SectionTitleProps) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between mb-6", className)}>
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {children && <div className="mt-4 sm:mt-0">{children}</div>}
    </div>
  );
};

export default SectionTitle;
