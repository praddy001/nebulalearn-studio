import React from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DashboardTopbar } from '@/components/DashboardTopbar';
import { ChatWidget } from '@/components/ChatWidget';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
  type?: 'student' | 'staff';
  userName?: string;
  userRole?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  type = 'student',
  userName = 'John Doe',
  userRole = 'Student',
}) => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type={type} />
      <div className="pl-20 lg:pl-[260px] transition-all duration-300">
        <DashboardTopbar userName={userName} userRole={userRole} />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </div>
      <ChatWidget />
    </div>
  );
};

export default DashboardLayout;
