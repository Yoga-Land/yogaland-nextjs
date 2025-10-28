"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdVideoLibrary, MdCampaign } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={22} /> },
  { name: "Videos", path: "/videos", icon: <MdVideoLibrary size={22} /> },
  { name: "Ads", path: "/ads", icon: <MdCampaign size={22} /> },
];

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]);

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden s top-0"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={` fixed md:sticky top-0 h-screen lg:top-16
        md:h-[calc(100vh-4rem)] bg-white shadow-lg z-50 w-64 transform
        transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
        {/* Header for mobile */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 md:hidden">
          <h2 className="text-lg font-semibold text-amber-600">Menu</h2>
          <button onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>
        {/* Navigation */}
        <div className="p-5 h-full">
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${
            pathname === item.path
              ? "bg-amber-500 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
              >
                {item.icon}
                <span className="text-sm sm:text-base">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
