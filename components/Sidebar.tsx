'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdDashboard, MdVideoLibrary, MdCampaign } from 'react-icons/md';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard size={24} /> },
  { name: 'Videos', path: '/videos', icon: <MdVideoLibrary size={24} /> },
  { name: 'Ads', path: '/ads', icon: <MdCampaign size={24} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6 flex flex-col">
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => {
            //const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-300
                  ${pathname === item.path ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
