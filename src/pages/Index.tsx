import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { VideoHero } from '@/components/VideoHero';
import { FeatureCard } from '@/components/FeatureCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatWidget } from '@/components/ChatWidget';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  Shield,
  ChevronRight,
  Star,
  Quote,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Smart Notes Library',
    description: 'Access thousands of notes organized by subject, topic, and difficulty. Search, filter, and download with ease.',
    gradient: 'primary' as const,
  },
  {
    icon: Calendar,
    title: 'Dynamic Timetables',
    description: 'View and manage your class schedules with drag-and-drop simplicity. Export to your favorite calendar apps.',
    gradient: 'accent' as const,
  },
  {
    icon: Clock,
    title: 'Attendance Tracking',
    description: 'Real-time attendance monitoring with detailed analytics. Never miss a class or meeting again.',
    gradient: 'highlight' as const,
  },
  {
    icon: Users,
    title: 'Campus Events',
    description: 'Stay updated with all campus activities, workshops, and seminars. RSVP and add to your calendar instantly.',
    gradient: 'primary' as const,
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    description: 'Get instant answers to your questions with our intelligent chatbot powered by advanced AI.',
    gradient: 'accent' as const,
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected. Role-based access ensures only authorized users see your information.',
    gradient: 'highlight' as const,
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Computer Science Student',
    content: 'NebulaLearn has completely transformed how I organize my study materials. The notes library is incredible!',
    avatar: 'SJ',
    rating: 5,
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Physics Professor',
    content: 'Uploading materials and tracking student attendance has never been easier. Highly recommended for educators.',
    avatar: 'MC',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Business Administration',
    content: 'The AI assistant helps me find exactly what I need in seconds. It\'s like having a personal study buddy!',
    avatar: 'ER',
    rating: 5,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <VideoHero />

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to enhance your learning experience and boost academic performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary/5 via-accent/5 to-highlight/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '50,000+', label: 'Active Students' },
              { value: '1M+', label: 'Notes Downloaded' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9/5', label: 'User Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold font-heading gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Loved by <span className="gradient-text">Students & Teachers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our community has to say about their experience with NebulaLearn.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className="h-full">
                  <CardContent className="p-6">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    <p className="text-foreground mb-6">{testimonial.content}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-highlight text-highlight" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-16 text-center"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8"
              >
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">Start Your Journey Today</span>
              </motion.div>
              
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                Join thousands of students and educators who are already experiencing the future of education.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild variant="glass" size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="hero-outline" size="xl">
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-xl">NebulaLearn</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering students and educators with intelligent tools for modern learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/notes" className="hover:text-primary transition-colors">Notes</Link></li>
                <li><Link to="/timetable" className="hover:text-primary transition-colors">Timetable</Link></li>
                <li><Link to="/events" className="hover:text-primary transition-colors">Events</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 NebulaLearn. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default Index;
