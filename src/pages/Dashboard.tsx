import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp,
  Download,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const dashboardCards = [
  { icon: FileText, title: 'Notes', value: '24', subtitle: 'Available', href: '/notes', color: 'primary' },
  { icon: Calendar, title: 'Classes Today', value: '5', subtitle: 'Next: Physics', href: '/timetable', color: 'accent' },
  { icon: Clock, title: 'Attendance', value: '92%', subtitle: 'This month', href: '/dashboard/attendance', color: 'highlight' },
  { icon: Users, title: 'Events', value: '3', subtitle: 'This week', href: '/events', color: 'primary' },
];

const recentNotes = [
  { title: 'Quantum Mechanics Ch. 5', subject: 'Physics', date: 'Today' },
  { title: 'Data Structures Notes', subject: 'Computer Science', date: 'Yesterday' },
  { title: 'Organic Chemistry', subject: 'Chemistry', date: '2 days ago' },
];

const Dashboard = () => {
  return (
    <DashboardLayout userName="Alex Johnson" userRole="Computer Science">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your studies today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={card.href}>
                <Card variant="feature" className="cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-${card.color}/10 flex items-center justify-center mb-4`}>
                      <card.icon className={`w-6 h-6 text-${card.color}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold font-heading">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Notes */}
        <Card variant="default">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Notes</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/notes">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotes.map((note) => (
                <div key={note.title} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{note.title}</p>
                      <p className="text-sm text-muted-foreground">{note.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{note.date}</span>
                    <Button variant="ghost" size="icon-sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
