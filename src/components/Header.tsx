import React from "react";
import { 
  GraduationCap, 
  Target, 
  Zap, 
  Headphones, 
  BookOpen, 
  Bot, 
  FileText,
  Flame
} from "lucide-react";
import { StudyProgress } from "../types";

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  progress: StudyProgress;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, progress }) => {
  const navItems = [
    { id: "dashboard", label: "학습 대시보드", icon: Target },
    { id: "part5", label: "Part 5 (10분 컷)", icon: Zap },
    { id: "lc2", label: "LC 2 우회 답변", icon: Headphones },
    { id: "vocab", label: "800 보카 & 패러프레이징", icon: BookOpen },
    { id: "coach", label: "AI 코치 토비", icon: Bot },
    { id: "mistakes", label: "오답노트 & 800 진단", icon: FileText },
  ];

  const totalWrong = progress.wrongPart5Ids.length + progress.wrongLCIds.length;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Target Badge */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onTabChange("dashboard")}
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-emerald-300 bg-clip-text text-transparent">
                  TOEIC 620 → 800
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  +180점 점프 코칭
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                현재 620점 → 목표 800점 확정 (LC 430 + RC 370)
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-amber-300">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
              <span className="font-medium text-[11px] sm:text-xs">{progress.studyDaysStreak || 1}일 연속</span>
            </div>
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <span>푼 문제 <strong className="text-white">{progress.solvedPart5 + progress.solvedLC}</strong></span>
              <span className="w-px h-3 bg-slate-700" />
              <span>암기 단어 <strong className="text-emerald-400">{progress.masteredVocabCount}</strong></span>
              {totalWrong > 0 && (
                <>
                  <span className="w-px h-3 bg-slate-700" />
                  <span className="text-rose-400 font-semibold">오답 {totalWrong}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Bar (Hidden on Mobile, handled by MobileBottomNav) */}
        <nav className="hidden md:flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.id === "mistakes" && totalWrong > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                    {totalWrong}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
