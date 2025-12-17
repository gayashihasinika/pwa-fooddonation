// frontend/src/Layouts/AuthenticatedLayout.tsx
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Settings,
  Home,
  Plus,
  Package,
  Trophy,
  Users,
  ClipboardList,
  Menu,
  X,
  Truck,
  Bell,
  MessageSquare,
  Star,
  Zap,
  Heart,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: "donor" | "volunteer" | "receiver" | "admin" | null;
  organization?: string | null;
  phone?: string | null;
}

interface Props {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setCurrentUser(res.data);
      } catch (error) {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <p className="text-2xl text-orange-700">Loading your dashboard...</p>
      </div>
    );
  }

  const sidebarGroups = {
    donor: [
      {
        title: "My Activity",
        items: [
          { icon: <Home />, label: "Dashboard", path: "/donors/dashboard" },
          { icon: <Plus />, label: "Post Donation", path: "/donors/post-donation/post-donation-list" },
          { icon: <Package />, label: "My Donations", path: "/donor/my-donation" },
          { icon: <Truck />, label: "Delivery Claims", path: "/donor/claims" },
        ],
      },
      {
        title: "Gamification",
        items: [
          { icon: <Star />, label: "My Badges", path: "/donor/gamification/badges" },
          { icon: <Zap />, label: "Challenges", path: "/donor/gamification/challenges" },
          { icon: <Heart />, label: "My Streak", path: "/donor/gamification/streak" },
        ],
      },
    ],
    volunteer: [
      {
        title: "Volunteer Hub",
        items: [
          { icon: <Home />, label: "Dashboard", path: "/volunteers/dashboard" },
          { icon: <Truck />, label: "Delivery Tasks", path: "/volunteers/delivery-tasks" },
          { icon: <MessageSquare />, label: "Messages", path: "/volunteers/messages" },
          { icon: <Bell />, label: "Notifications", path: "/volunteers/notifications" },
        ],
      },
    ],
    receiver: [
      {
        title: "Find Food",
        items: [
          { icon: <Home />, label: "Dashboard", path: "/receivers/dashboard" },
          { icon: <Package />, label: "Available Donations", path: "/receivers/donations" },
          { icon: <ClipboardList />, label: "My Requests", path: "/receivers/requests" },
          { icon: <Bell />, label: "Notifications", path: "/receivers/notifications" },
        ],
      },
    ],
    admin: [
      {
        title: "Admin Panel",
        items: [
          { icon: <Home />, label: "Dashboard", path: "/admin/dashboard" },
          { icon: <Users />, label: "User Management", path: "/admin/users" },
          { icon: <Package />, label: "Donations", path: "/admin/donations" },
          { icon: <Truck />, label: "Claims & Delivery", path: "/admin/claims" },
        ],
      },
      {
        title: "Gamification Tools",
        items: [
          { icon: <Trophy />, label: "Badges", path: "/admin/gamification/badge-manager" },
          { icon: <Star />, label: "Points System", path: "/admin/gamification/points-config" },
          { icon: <Zap />, label: "Challenges", path: "/admin/gamification/challenge-manager" },
        ],
      },
    ],
  } as const;

  const groups = sidebarGroups[currentUser.role || "donor"];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || sidebarOpen) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed md:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-orange-600 via-amber-500 to-orange-600 text-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-3xl">🍲</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">FeedSriLanka</h2>
                    <p className="text-sm opacity-90">Welcome back!</p>
                  </div>
                </div>
                {isMobile && (
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X size={24} />
                  </button>
                )}
              </div>
            </div>

            {/* User Profile */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 ring-4 ring-white/30">
                  <AvatarImage src={`/avatars/${currentUser.role}.png`} />
                  <AvatarFallback className="bg-white/20 text-2xl">
                    {currentUser.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{currentUser.name || "User"}</p>
                  <p className="text-sm opacity-90 capitalize">{currentUser.role}</p>
                  {currentUser.organization && (
                    <p className="text-xs opacity-80 mt-1">{currentUser.organization}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-8">
              {groups.map((group, i) => (
                <div key={i}>
                  <h3 className="text-xs uppercase tracking-wider opacity-80 mb-4 px-2">
                    {group.title}
                  </h3>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const isActive = location.pathname.startsWith(item.path);
                      return (
                        <Button
                          key={item.label}
                          variant="ghost"
                          onClick={() => {
                            navigate(item.path);
                            if (isMobile) setSidebarOpen(false);
                          }}
                          className={`w-full justify-start gap-4 text-lg py-6 rounded-xl transition-all ${isActive
                              ? "bg-white/20 font-bold shadow-lg scale-105"
                              : "hover:bg-white/10 hover:scale-102"
                            }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-6 border-t border-white/20">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-4 text-lg py-6 rounded-xl hover:bg-white/10"
              >
                <LogOut size={24} />
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-30">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 rounded-xl hover:bg-orange-100 transition"
              >
                <Menu size={28} className="text-orange-700" />
              </button>
              <h1 className="text-3xl font-bold text-orange-800">
                {(currentUser.role
                  ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
                  : "User"
                )} Portal
              </h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ring-4 ring-orange-200 hover:ring-orange-400 transition">
                  <AvatarImage src={`/avatars/${currentUser.role}.png`} />
                  <AvatarFallback className="bg-orange-200 text-orange-800 text-xl">
                    {currentUser.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="mr-3" size={18} />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-3" size={18} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-orange-800 text-white py-8 text-center">
          <p className="text-xl font-semibold mb-2">FeedSriLanka ❤️</p>
          <p className="opacity-90">
            Reducing food waste • Feeding families • Building hope across Sri Lanka
          </p>
          <p className="text-sm mt-4 opacity-75">
            © {new Date().getFullYear()} FeedSriLanka — Made with love for our nation
          </p>
        </footer>
      </div>
    </div>
  );
}