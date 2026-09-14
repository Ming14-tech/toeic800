import React from "react";
import { 
  Target, 
  Zap, 
  Headphones, 
  BookOpen, 
  Bot, 
  FileText 
} from "lucide-react";
import { StudyProgress } from "../types";

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  progress: StudyProgress;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  progress,
}) => {
  const totalWrong = progress.wrongPart5Ids.length + progress.wrongLCIds.length;

  const navItems = [
    { id: "dashboard", label: "대시보드", icon: Target },
    { id: "part5", label: "Part 5", sub: "10분컷", icon: Zap },
    { id: "lc2", label: "LC 2", sub: "소거법", icon: Headphones },
    { id: "vocab", label: "800보카", sub: "패러", icon: BookOpen },
    { id: "coach", label: "AI코치", sub: "토비", icon: Bot },
    { id: "mistakes", label: "오답진단", icon: FileText, badge: totalWrong },
  ];

  return (
    <nav 
      id="mobile-bottom-navigation"
      aria-label="모바일 하단 내비게이션"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl px-1.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-6 gap-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all select-none touch-manipulation min-h-[48px] ${
                isActive
                  ? "text-white font-bold"
                  : "text-slate-400 hover:text-slate-200 active:scale-95"
              }`}
            >
              {/* Active Indicator Backdrop */}
              {isActive && (
                <span className="absolute inset-0 bg-gradient-to-b from-indigo-600/30 to-emerald-500/20 rounded-xl border border-indigo-500/30 -z-10" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? "text-emerald-400 scale-110"
                      : "text-slate-400"
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 min-w-[16px] h-4 text-[9px] font-black rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs border border-slate-900">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tighter mt-1 truncate max-w-full ${
                isActive ? "text-white font-bold" : "text-slate-400"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
