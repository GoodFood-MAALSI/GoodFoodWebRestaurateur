"use client";
import React from "react";
import { COLORS } from "@/app/constants";
import { LucideIcon } from "lucide-react";
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}
export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = COLORS.primary,
  bgColor = COLORS.background.primary,
  trend 
}: StatsCardProps) {
  return (
    <div 
      className="p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 relative overflow-hidden group"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background decoration */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-4 translate-x-4 group-hover:opacity-15 transition-opacity duration-200"
        style={{ backgroundColor: color }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="p-3 rounded-lg group-hover:scale-105 transition-transform duration-200"
            style={{ 
              backgroundColor: color + '20',
              color: color 
            }}
          >
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className="flex items-center space-x-1">
              <span 
                className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  trend.isPositive 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors duration-200">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
