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
  Download,
  ArrowRight,
} from "lucide-react";

/* ---------------- TYPES ---------------- */
interface User {
  id: number;
  email: string;
  role: "student" | "teacher";
  name?: string;
}

/* ---------------- CARD DATA ---------------- */
const studentCards = [
  {
    icon: FileText,
    title: "Notes",
    value: "24",
    subtitle: "Available",
    href: "/notes",
  },
  {
    icon: Calendar,
    title: "Classes",
    value: "5",
    subtitle: "Today",
    href: "/timetable",
  },
];

const teacherCards = [
  {
    icon: Upload,
    title: "Upload Notes",
    value: "",
    subtitle: "Add materials",
    href: "/teacher/upload",
  },
  {
    icon: Users,
    title: "Students",
    value: "120",
    subtitle: "Enrolled",
    href: "/teacher/students",
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

    fetch("http://localhost:5000/api/auth/me", {
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
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  if (!user) return <div className="p-6">Loading dashboard...</div>;

  const cards = user.role === "teacher" ? teacherCards : studentCards;

  return (
    <DashboardLayout
      userName={user.name || user.email}
      userRole={user.role === "teacher" ? "Teacher" : "Student"}
    >
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
                <Card className="cursor-pointer">
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
