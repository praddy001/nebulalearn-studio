import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TeacherUpload from "./pages/TeacherUpload";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotesList from "./pages/NotesList";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherEvents from "./pages/teacher/TeacherEvents";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentEvents from "./pages/student/StudentEvents";
import TeacherStudents from "./pages/teacher/TeacherStudents";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role={null}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/attendance"
            element={
              <ProtectedRoute role="teacher">
                <TeacherAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/events"
            element={
              <ProtectedRoute role="teacher">
                <TeacherEvents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/upload"
            element={
              <ProtectedRoute role="teacher">
                <TeacherUpload />
              </ProtectedRoute>
            }
          />
          

          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute role="teacher">
                <TeacherStudents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes"
            element={
              <ProtectedRoute role={null}>
                <NotesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute role="student">
                <StudentAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/events"
            element={
              <ProtectedRoute role="student">
                <StudentEvents />
              </ProtectedRoute>
            }
          />


          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
