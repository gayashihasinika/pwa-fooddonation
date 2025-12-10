// src/Layouts/AuthenticatedLayout.tsx
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile only
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Detect mobile on mount + resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
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
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  const roleAvatar: Record<string, string> = {
    donor: "/avatars/donor.png",
    volunteer: "/avatars/volunteer.png",
    receiver: "/avatars/receiver.png",
    admin: "/avatars/admin.png",
  };

  const sidebarGroups = {
    donor: [
      {
        group: "Main",
        items: [
          { icon: <Home size={18} />, label: "Dashboard", href: "/donors/dashboard" },
          { icon: <Plus size={18} />, label: "Post Donation", href: "/donors/post-donation/post-donation-list" },
          { icon: <ClipboardList size={18} />, label: "My Donations", href: "/donor/my-donation" },
          { icon: <Trophy size={18} />, label: "Leaderboard", href: "/donor/leaderboard" },
        ],
      },
      {
        group: "Gamification",
        items: [
          { icon: <Star size={18} />, label: "My Badges", href: "/donor/gamification/badges" },
          { icon: <Zap size={18} />, label: "Challenges", href: "/donor/gamification/challenges" },
        ],
      }
    ],
    volunteer: [
      {
        group: "Main",
        items: [
          { icon: <Home size={18} />, label: "Dashboard", href: "/volunteers/dashboard" },
          { icon: <Truck size={18} />, label: "Delivery Tasks", href: "/volunteers/delivery-tasks" },
          { icon: <MessageSquare size={18} />, label: "Communications", href: "/volunteers/communications" },
        ],
      },
    ],
    receiver: [
      {
        group: "Main",
        items: [
          { icon: <Home size={18} />, label: "Dashboard", href: "/receivers/dashboard" },
          { icon: <Package size={18} />, label: "Available Donations", href: "/receivers/available-donations" },
          { icon: <Bell size={18} />, label: "Notifications", href: "/receivers/notifications" },
        ],
      },
    ],
    admin: [
  {
    group: "Core Management",
    items: [
      { icon: <Home size={18} />, label: "Dashboard", href: "/admin/dashboard" },
      { icon: <Users size={18} />, label: "User Management", href: "/admin/users" },
      { icon: <Package size={18} />, label: "Donation Management", href: "/admin/donations" },
      { icon: <Truck size={18} />, label: "Claim & Delivery", href: "/admin/claims" },
    ],
  },
  {
    group: "Gamification",
    items: [
      {
        icon: <Trophy size={18} />,
        label: "Badge Management",
        href: "/admin/gamification/badge-manager"
      },
      {
        icon: <Star size={18} />,
        label: "Points & Rewards",
        href: "/admin/gamification/points-config"
      },
      {
        icon: <Zap size={18} />,
        label: "Challenges & Events",
        href: "/admin/gamification/challenge-manager"
      },
    ],
  },
],
  } as const;

  const currentGroups = sidebarGroups[currentUser.role || "donor"] || [];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  // Show sidebar if: desktop OR (mobile and sidebarOpen)
  const showSidebar = !isMobile || sidebarOpen;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-rose-50 via-orange-50 to-amber-100">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-rose-500 via-orange-400 to-amber-400 text-white shadow-2xl flex flex-col`}
          >
            {/* Mobile Close Button */}
            {isMobile && (
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition"
                >
                  <X size={24} />
                </button>
              </div>
            )}

            {/* User Info */}
            <div className="flex flex-col items-center p-5 border-b border-white/20">
              <Avatar className="h-16 w-16 ring-4 ring-white/30">
                <AvatarImage src={roleAvatar[currentUser.role || "donor"]} />
                <AvatarFallback className="text-2xl">
                  {currentUser.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold mt-3">{currentUser.name || "User"}</p>
              {currentUser.organization && (
                <p className="text-sm opacity-90">{currentUser.organization}</p>
              )}
              <p className="text-xs bg-white/20 px-3 py-1 rounded-full mt-2">
                {currentUser.role?.toUpperCase()}
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
              {currentGroups.map((group, idx) => (
                <div key={idx}>
                  <h4 className="text-xs uppercase tracking-wider opacity-80 mb-3">
                    {group.group}
                  </h4>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Button
                          key={item.label}
                          variant="ghost"
                          onClick={() => {
                            navigate(item.href);
                            if (isMobile) setSidebarOpen(false);
                          }}
                          className={`w-full justify-start text-left rounded-lg ${
                            isActive
                              ? "bg-white text-rose-600 font-bold shadow-lg"
                              : "hover:bg-white/20"
                          }`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/20">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-white hover:bg-white/20"
              >
                <LogOut size={18} className="mr-3" /> Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-30 border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-2xl font-bold text-rose-600">Feed SriLanka</h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-4 hover:ring-rose-200 transition">
                  <AvatarImage src={roleAvatar[currentUser.role || "donor"]} />
                  <AvatarFallback>{currentUser.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2" size={16} /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2" size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 bg-gradient-to-b from-orange-50 to-rose-50 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-white text-center py-4 text-sm text-gray-600 border-t">
          © {new Date().getFullYear()} Feed SriLanka — Made with love for Sri Lanka
        </footer>
      </div>
    </div>
  );
}