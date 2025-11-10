import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          sessionStorage.getItem("auth_token") ||
          localStorage.getItem("auth_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://127.0.0.1:8001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) setCurrentUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
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
        group: "Donor Tools",
        items: [
          { icon: <Home size={18} />, label: "Dashboard", href: "/donors/dashboard" },
          {
            icon: <Plus size={18} />,
            label: "Post Donation",
            href: "/donors/post-donation/post-donation-list",
          },
          {
            icon: <Package size={18} />,
            label: "My Donations",
            href: "/donor/my-donations",
          },
          {
            icon: <Trophy size={18} />,
            label: "Leaderboard",
            href: "/donor/leaderboard",
          },
        ],
      },
    ],
    volunteer: [
      {
        group: "Volunteer Tools",
        items: [
          { icon: <Home size={18} />, label: "Dashboard", href: "volunteer/dashboard" },
          {
            icon: <ClipboardList size={18} />,
            label: "Assigned Tasks",
            href: "/volunteer/tasks",
          },
          {
            icon: <Package size={18} />,
            label: "Donations",
            href: "/volunteer/donations",
          },
        ],
      },
    ],
    receiver: [
      {
        group: "Receiver Tools",
        items: [
          { icon: <Home size={18} />, label: "Dashboard", href: "receiver/dashboard" },
          {
            icon: <Package size={18} />,
            label: "Request Donations",
            href: "/receiver/requests",
          },
        ],
      },
    ],
    admin: [
      {
        group: "Admin Tools",
        items: [
          { icon: <Home size={18} />, label: "Dashboard", href: "/admin/dashboard" },
          { icon: <Users size={18} />, label: "Users", href: "/admin/users" },
          { icon: <Package size={18} />, label: "All Donations", href: "/admin/donations" },
        ],
      },
    ],
  };

  const currentGroups = sidebarGroups[currentUser.role || "donor"] || [];

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-rose-50 via-orange-50 to-amber-100">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: window.innerWidth < 768 ? -260 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth < 768 ? -260 : 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-rose-500 via-orange-400 to-amber-400 text-white shadow-2xl flex flex-col`}
          >
            {/* Close Button for Mobile */}
            <div className="md:hidden flex justify-end p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-rose-600/30 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center p-5 border-b border-white/30">
              <Avatar className="cursor-pointer mb-2 ring-2 ring-white/30 hover:ring-yellow-300 transition">
                <AvatarImage src={roleAvatar[currentUser.role || "donor"]} />
                <AvatarFallback>
                  {currentUser.name?.charAt(0).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-semibold">{currentUser.name || currentUser.email}</p>
                {currentUser.organization && (
                  <p className="text-xs text-white/70">{currentUser.organization}</p>
                )}
                <p className="text-xs text-white/70">{currentUser.role?.toUpperCase()}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
              {currentGroups.map((group, idx) => (
                <div key={idx}>
                  <h4 className="text-xs uppercase mb-2 tracking-wide text-white/70">
                    {group.group}
                  </h4>
                  <div className="space-y-1">
                    {group.items.map((item, i) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <motion.div whileHover={{ scale: 1.03 }} key={i}>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              navigate(item.href);
                              if (window.innerWidth < 768) setSidebarOpen(false);
                            }}
                            className={`w-full justify-start rounded-lg pl-3 transition-all ${
                              isActive
                                ? "bg-white text-rose-600 font-semibold shadow-md"
                                : "text-white hover:bg-white/20"
                            }`}
                          >
                            <span className="mr-2">{item.icon}</span>
                            {item.label}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/30">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-white hover:bg-rose-600/40 transition rounded-lg"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for Mobile */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-30 border-b">
          <div className="flex items-center gap-2 text-2xl font-bold text-rose-600">
            <button
              className="p-2 rounded-md hover:bg-rose-100 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <span className="tracking-tight">🍽️ Feed SriLanka</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-rose-400 transition">
                <AvatarImage
                  src={roleAvatar[currentUser.role || "donor"]}
                  alt="profile"
                />
                <AvatarFallback>
                  {currentUser.name?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2"
              >
                <Settings size={16} /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gradient-to-b from-orange-50 via-rose-50 to-amber-100 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-white text-center p-4 text-sm text-rose-600 border-t">
          © {new Date().getFullYear()} Feed SriLanka — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
