"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Button from "./Button";
import toast from "react-hot-toast";
import { HiMenuAlt3 } from "react-icons/hi";

export default function Navbar({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="block md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiMenuAlt3 size={22} />
          </button>

          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-amber-600">
              YogaLand TV
            </h1>
            <span className="text-xs sm:text-sm text-gray-500">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline text-sm text-gray-700 truncate max-w-[120px] sm:max-w-[200px]">
            {user?.email}
          </span>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
