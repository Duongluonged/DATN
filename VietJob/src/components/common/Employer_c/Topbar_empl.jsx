import React from 'react';
import { Search, Bell, HelpCircle, Settings } from "lucide-react";

function Topbar_empl() {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user?.username || "Admin User";
    const avatarName = username.substring(0, 2).toUpperCase();

    return (
        <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10 font-sans">
            <div className="flex items-center gap-4 ml-auto">

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
                        <div className="text-[10px] text-gray-500 uppercase tracking-tight">Nhà tuyển dụng</div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm border border-indigo-100">
                        {avatarName}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Topbar_empl;