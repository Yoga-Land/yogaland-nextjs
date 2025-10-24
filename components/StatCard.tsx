import React from 'react';

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
  color = 'primary',
}: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {icon && (
          <div className={`text-${color} text-4xl opacity-80`}>{icon}</div>
        )}
      </div>
    </div>
  );
}
