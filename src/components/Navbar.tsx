import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  GraduationCap,
  ChevronDown,
} from 'lucide-react';

const navLinks = [
  { name: 'Features', href: '/#features' },
  { name: 'Notes', href: '/notes' },
  { name: 'Timetable', href: '/timetable' },
  { name: 'Events', href: '/events' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-4 mt-4">
        <div className="glass-card rounded-2xl px-6 py-4 shadow-soft-md">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <span className="font-heading font-bold text-xl gradient-text">
                NebulaLearn
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium ${
                    location.pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden md:flex items-center gap-4">

              {/* 🔥 IF USER LOGGED IN */}
              {user ? (
                <div className="flex items-center gap-3">

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    {user.name?.charAt(0)}
                  </div>

                  {/* Name + Role */}
                  <div className="text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>

                  {/* Logout */}
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  {/* Guest */}
                  <Button asChild variant="ghost">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild variant="gradient">
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col gap-2 mt-4">

                  {navLinks.map((link) => (
                    <Link key={link.name} to={link.href}>
                      {link.name}
                    </Link>
                  ))}

                  {/* Mobile Auth */}
                  {user ? (
                    <Button onClick={handleLogout}>Logout</Button>
                  ) : (
                    <>
                      <Link to="/login">Sign In</Link>
                      <Link to="/register">Register</Link>
                    </>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </nav>
    </header>
  );
};

export default Navbar;