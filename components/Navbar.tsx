"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Button from "./Button";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">YogaLand TV</h1>
          <span className="text-sm text-gray-500">Admin Portal</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">{user?.email}</span>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
