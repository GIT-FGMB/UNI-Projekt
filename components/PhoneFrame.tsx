"use client";

import React from "react";
import { Wifi, BatteryFull } from "lucide-react";

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Phone outer shell – classic white */}
      <div className="relative w-[375px] h-[812px] bg-white rounded-[55px] shadow-xl shadow-gray-400/40 border-[12px] border-gray-200 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[28px] bg-white rounded-b-2xl z-50" />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-[44px] z-40 flex items-center justify-between px-8 text-gray-800 text-xs font-semibold">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[2px] items-end">
              <div className="w-[3px] h-[5px] bg-gray-700 rounded-sm" />
              <div className="w-[3px] h-[7px] bg-gray-700 rounded-sm" />
              <div className="w-[3px] h-[9px] bg-gray-700 rounded-sm" />
              <div className="w-[3px] h-[11px] bg-gray-700 rounded-sm" />
            </div>
            <Wifi size={13} className="text-gray-700 ml-0.5" />
            <div className="w-[22px] h-[11px] border-[1.5px] border-gray-700 rounded-[3px] ml-0.5 relative">
              <div className="absolute top-[1px] left-[1px] bottom-[1px] right-[4px] bg-gray-700 rounded-[1px]" />
              <div className="absolute right-[-3px] top-[2.5px] w-[1.5px] h-[4px] bg-gray-700 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="w-full h-full bg-white overflow-hidden">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-gray-400 rounded-full z-50" />
      </div>
    </div>
  );
}
