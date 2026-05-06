"use client";

import React from "react";

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Phone outer shell */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[55px] shadow-2xl shadow-black/50 border-[12px] border-gray-800 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[30px] bg-black rounded-b-3xl z-50" />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-[44px] z-40 flex items-center justify-between px-8 text-white text-xs font-semibold">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px]">
              <div className="w-[3px] h-[6px] bg-white rounded-sm" />
              <div className="w-[3px] h-[8px] bg-white rounded-sm" />
              <div className="w-[3px] h-[10px] bg-white rounded-sm" />
              <div className="w-[3px] h-[12px] bg-white rounded-sm" />
            </div>
            <span className="ml-1">5G</span>
            <div className="w-6 h-3 border border-white rounded-sm ml-1 relative">
              <div className="absolute inset-[1px] right-[3px] bg-green-500 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="w-full h-full bg-gray-950 overflow-hidden">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-gray-600 rounded-full z-50" />
      </div>
    </div>
  );
}
