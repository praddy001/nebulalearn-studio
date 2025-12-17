  import React, { useState } from 'react';
  import { Link, useLocation } from 'react-router-dom';
  import { motion, AnimatePresence } from 'framer-motion';
  import { Button } from '@/components/ui/button';
  import { 
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    FileText,
    Calendar,
    Clock,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    GraduationCap,
  } from 'lucide-react';
  import { cn } from '@/lib/utils';

  interface SidebarItem {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: string;
  }

  const studentItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Notes', href: '/notes' },
    { icon: Calendar, label: 'Timetable', href: '/timetable' },
    { icon: Clock, label: 'Attendance', href: '/dashboard/attendance' },
    { icon: Users, label: 'Events', href: '/events' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages', badge: '3' },
  ];

  const staffItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/staff' },
    { icon: FileText, label: 'Upload Notes', href: '/staff/upload' },
    { icon: Calendar, label: 'Timetable', href: '/staff/timetable' },
    { icon: Clock, label: 'Attendance', href: '/staff/attendance' },
    { icon: Users, label: 'Students', href: '/staff/students' },
    { icon: MessageSquare, label: 'Messages', href: '/staff/messages', badge: '5' },
  ];

  interface DashboardSidebarProps {
    type?: 'student' | 'staff';
  }

  export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ type = 'student' }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const items = type === 'student' ? studentItems : staffItems;

    return (
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-3 p-6 border-b border-sidebar-border",
          isCollapsed && "justify-center"
        )}>
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-heading font-bold text-xl gradient-text whitespace-nowrap"
              >
                NebulaLearn
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft-sm" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                    isCollapsed && "justify-center px-3"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1 font-medium text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.badge && !isCollapsed && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 text-xs font-semibold rounded-full bg-highlight text-highlight-foreground"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link to="/settings">
            <motion.div
              whileHover={{ x: 4 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent",
                isCollapsed && "justify-center px-3"
              )}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
          <Link to="/">
            <motion.div
              whileHover={{ x: 4 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-destructive hover:bg-destructive/10",
                isCollapsed && "justify-center px-3"
              )}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="outline"
          size="icon-sm"
          className="absolute -right-3 top-20 rounded-full shadow-soft-sm bg-card border-border"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </motion.aside>
    );
  };

  export default DashboardSidebar;
