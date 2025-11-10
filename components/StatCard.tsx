import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "primary",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-center justify-between transition-all hover:shadow-lg w-full">
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
          {value}
        </p>
      </div>
      {icon && (
        <div
          className={`ml-4 text-${color} text-2xl sm:text-3xl md:text-4xl opacity-80 flex-shrink-0`}
        >
          {icon}
        </div>
      )}
    </div>
  );
}
