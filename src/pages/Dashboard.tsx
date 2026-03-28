import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  FileText,
  Upload,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

/* ---------------- TYPES ---------------- */
interface User {
  id: number;
  email: string;
  role: "student" | "teacher" | "admin"; // ✅ FIXED
  name?: string;
}

/* ---------------- CARD DATA ---------------- */
const studentCards = [
  {
    icon: FileText,
    title: "Notes",
    subtitle: "Available",
    href: "/notes",
  },
  {
    icon: Calendar,
    title: "Classes",
    subtitle: "Today",
    href: "/timetable",
  },
  {
    icon: Calendar,
    title: "Events & Notices",
    subtitle: "Latest updates",
    href: "/student/events",
  },
  {
    icon: Calendar,
    title: "Attendance",
    subtitle: "Latest updates",
    href: "/student/attendance",
  },
];

const teacherCards = [
  {
    icon: Users,
    title: "Manage Attendance",
    subtitle: "Mark / Update",
    href: "/teacher/attendance",
  },
  {
    icon: Calendar,
    title: "Post Events",
    subtitle: "Create notice",
    href: "/teacher/events",
  },
  {
    icon: Upload,
    title: "Upload Notes",
    subtitle: "Add materials",
    href: "/teacher/upload",
  },
  {
    icon: Users,
    title: "Students",
    subtitle: "Enrolled",
    href: "/teacher/students",
  },
];

// ✅ NEW ADMIN CARDS
const adminCards = [
  {
    icon: Users,
    title: "👑 Manage Users",
    subtitle: "Change roles",
    href: "/admin",
  },
  {
    icon: FileText,
    title: "All Notes",
    subtitle: "View materials",
    href: "/notes",
  },
  {
    icon: Calendar,
    title: "Manage Events",
    subtitle: "Admin control",
    href: "/admin/events",
  },
];

/* ---------------- COMPONENT ---------------- */
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        navigate("/login"); 
      });
  }, [navigate]);

  if (!user) return <div className="p-6">Loading dashboard...</div>;

  // ✅ FIXED ROLE LOGIC
  const cards =
    user.role === "admin"
      ? adminCards
      : user.role === "teacher"
      ? teacherCards
      : studentCards;

  return (
    <DashboardLayout
      userName={user.name || user.email}
      userRole={
        user.role === "admin"
          ? "Admin"
          : user.role === "teacher"
          ? "Teacher"
          : "Student"
      }
    >
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={card.href}>
                <Card className="cursor-pointer hover:shadow-md transition">
                  <CardContent className="p-6">
                    <Icon className="w-6 h-6 text-primary mb-4" />
                    <p className="font-medium">{card.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* STUDENT ONLY */}
      {user.role === "student" && (
        <Card className="mt-8">
          <CardHeader className="flex justify-between">
            <CardTitle>Recent Notes</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/notes">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Latest uploaded study materials
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;