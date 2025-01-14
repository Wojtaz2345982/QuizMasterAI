import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`mt-16 min-h-[calc(100vh-4rem)] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;