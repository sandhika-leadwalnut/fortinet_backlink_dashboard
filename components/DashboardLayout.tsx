import { ReactNode } from "react";
interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#575757] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
