import React from 'react';
import { Search, Bell, HelpCircle, Settings } from "lucide-react";

function Topbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || "Admin User";
  const avatarName = username.substring(0, 2).toUpperCase();

  return (
    <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10 font-sans">


      <div className="flex-1 max-w-md">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-gray-100 border-transparent rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Tìm kiếm địa điểm hệ thống..."
          />
        </div>
      </div>


      <div className="flex items-center gap-4">


        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-indigo-600 transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-indigo-600 transition-colors">
            <Settings size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <div className="text-[12px] font-semibold text-gray-900">{username}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-tight">Quản trị viên</div>
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm border border-indigo-100">
            {avatarName}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Topbar;