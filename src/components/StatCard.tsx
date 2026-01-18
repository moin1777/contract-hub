import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'indigo' | 'green' | 'yellow' | 'red' | 'gray';
}

const colorClasses = {
  indigo: 'bg-indigo-50 text-indigo-600',
  green: 'bg-emerald-50 text-emerald-600',
  yellow: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  gray: 'bg-gray-100 text-gray-600',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
        <Icon size={22} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{title}</span>
      </div>
    </div>
  );
};

export default StatCard;
