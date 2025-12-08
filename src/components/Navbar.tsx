import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-4 mt-4">
        <div className="glass-card rounded-2xl px-6 py-4 shadow-soft-md">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
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
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Button asChild variant="ghost">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="gradient">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        location.pathname === link.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild variant="gradient" className="w-full">
                      <Link to="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
                    </Button>
                  </div>
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
