// src/Layouts/AuthenticatedLayout.tsx
import React, { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Menu, X, LogOut, Settings, Home, Plus, Package, Trophy, Users, ClipboardList } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [language, setLanguage] = useState("English");

    const location = useLocation();

    // Fetch logged-in user info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Try sessionStorage first, fallback to localStorage
                const token = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token");
                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const res = await axios.get("http://127.0.0.1:8001/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.data) setCurrentUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                window.location.href = "/login";
            }
        };

        fetchUser();
    }, []);

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
                    { icon: <Home size={18} />, label: "Dashboard", href: "#" },
                    { icon: <Plus size={18} />, label: "Post Donation", href: "/donor/post-donation" },
                    { icon: <Package size={18} />, label: "My Donations", href: "/donor/my-donations" },
                    { icon: <Trophy size={18} />, label: "Leaderboard", href: "/donor/leaderboard" },
                ],
            },
        ],
        volunteer: [
            {
                group: "Volunteer Tools",
                items: [
                    { icon: <Home size={18} />, label: "Dashboard", href: "#" },
                    { icon: <ClipboardList size={18} />, label: "Assigned Tasks", href: "/volunteer/tasks" },
                    { icon: <Package size={18} />, label: "Donations", href: "/volunteer/donations" },
                ],
            },
        ],
        receiver: [
            {
                group: "Receiver Tools",
                items: [
                    { icon: <Home size={18} />, label: "Dashboard", href: "#" },
                    { icon: <Package size={18} />, label: "Request Donations", href: "/receiver/requests" },
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

    const handleLogout = () => (window.location.href = "/logout");

    return (
        <div className="flex min-h-screen bg-[#ECFDF5]">
            {/* Sidebar */}
            <aside
                className={`flex flex-col bg-gradient-to-b from-[#059669] to-[#047857] text-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
                    }`}
            >
                {/* User Info */}
                <div className="flex flex-col items-center p-4 border-b border-white/20">
                    <Avatar className="cursor-pointer mb-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <AvatarImage src={roleAvatar[currentUser.role || "donor"]} />
                        <AvatarFallback>{currentUser.name?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
                    </Avatar>
                    {sidebarOpen && (
                        <div className="text-center">
                            <p className="font-semibold">{currentUser.name || currentUser.email}</p>
                            {currentUser.organization && <p className="text-xs text-white/70">{currentUser.organization}</p>}
                            <p className="text-xs text-white/70">{currentUser.role?.toUpperCase()}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
                    {currentGroups.map((group, idx) => (
                        <div key={idx}>
                            {sidebarOpen && (
                                <h4 className="text-[10px] sm:text-xs font-semibold uppercase mb-1 tracking-wide text-white/70">
                                    {group.group}
                                </h4>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item, i) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Button
                                            key={i}
                                            variant="ghost"
                                            onClick={() => (window.location.href = item.href)}
                                            className={`w-full justify-start rounded-md pl-3 border-l-4 transition ${isActive
                                                    ? "bg-white text-[#065F46] font-semibold border-white"
                                                    : "text-white border-transparent hover:bg-white/20 hover:border-white"
                                                }`}
                                        >
                                            <span className="mr-2">{item.icon}</span>
                                            {sidebarOpen && item.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-2 pb-4 border-t border-white/20 mt-auto">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-white rounded-md pl-3 border-l-4 border-transparent hover:bg-white/20 hover:border-white"
                    >
                        <LogOut size={16} className="mr-2" /> {sidebarOpen && "Logout"}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex justify-between items-center p-4 bg-[#D1FAE5] shadow-md sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-2xl font-bold text-[#065F46]">
                        <span>🍽️ Feed SriLanka</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option>Sinhala</option>
                            <option>Tamil</option>
                            <option>English</option>
                        </select>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar className="cursor-pointer hover:ring-2 hover:ring-[#059669] transition">
                                    <AvatarImage src={roleAvatar[currentUser.role || "donor"]} alt="profile" />
                                    <AvatarFallback>{currentUser.name?.charAt(0).toUpperCase() ?? "U"}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="flex items-center gap-2">
                                    <Settings size={16} /> Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2" onClick={handleLogout}>
                                    <LogOut size={16} /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>

                {/* Footer */}
                <footer className="bg-[#D1FAE5] text-center p-4 text-sm text-[#065F46] border-t">
                    © 2025 Feed SriLanka. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
