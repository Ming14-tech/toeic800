import React, { useState, useMemo } from "react";
import { 
  BookOpen, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  RotateCw, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Repeat, 
  Lightbulb,
  CheckCircle,
  XCircle,
  List,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { VocabItem } from "../types";
import { PARAPHRASE_PAIRS } from "../data/toeicData";
import { speechService } from "../utils/audioSpeech";

interface VocabViewProps {
  vocabList: VocabItem[];
  bookmarkedIds: string[];
  masteredCount: number;
  onToggleBookmark: (id: string) => void;
  onToggleMastered: (id: string) => void;
  masteredIds: string[];
}

export const VocabView: React.FC<VocabViewProps> = ({
  vocabList,
  bookmarkedIds,
  masteredCount,
  onToggleBookmark,
  onToggleMastered,
  masteredIds,
}) => {
  const [activeMode, setActiveMode] = useState<"list" | "cards" | "paraphrase" | "quiz">("list");
  const [selectedDay, setSelectedDay] = useState<number | "all">(1);
  const [selectedLevel, setSelectedLevel] = useState<string>("전체");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);

  // Available Days (1 to 30)
  const daysList = useMemo(() => {
    const days = new Set<number>();
    vocabList.forEach((v) => {
      if (v.day) days.add(v.day);
    });
    return Array.from(days).sort((a, b) => a - b);
  }, [vocabList]);

  // Categories list
  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    vocabList.forEach((v) => {
      if (v.category) cats.add(v.category);
    });
    return ["전체", "북마크 ⭐", ...Array.from(cats)];
  }, [vocabList]);

  // Filtered vocabulary list
  const filteredVocab = useMemo(() => {
    return vocabList.filter((item) => {
      // Day filter
      if (selectedDay !== "all" && item.day !== selectedDay) {
        return false;
      }

      // Level filter
      if (selectedLevel !== "전체" && item.level !== selectedLevel) {
        return false;
      }

      // Category filter
      if (selectedCategory === "북마크 ⭐") {
        if (!bookmarkedIds.includes(item.id)) return false;
      } else if (selectedCategory !== "전체" && item.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.word.toLowerCase().includes(q) || 
          item.meaning.includes(q) ||
          (item.collocation && item.collocation.toLowerCase().includes(q)) ||
          (item.paraphraseWith && item.paraphraseWith.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [vocabList, selectedDay, selectedLevel, selectedCategory, bookmarkedIds, searchQuery]);

  // Day Mastered Stats
  const currentDayStats = useMemo(() => {
    if (selectedDay === "all") {
      return { total: vocabList.length, mastered: masteredCount };
    }
    const dayWords = vocabList.filter((v) => v.day === selectedDay);
    const dayMastered = dayWords.filter((v) => masteredIds.includes(v.id)).length;
    return { total: dayWords.length, mastered: dayMastered };
  }, [vocabList, selectedDay, masteredIds, masteredCount]);

  const currentItem = filteredVocab[currentIndex] || filteredVocab[0];
  const isMastered = currentItem ? masteredIds.includes(currentItem.id) : false;
  const isBookmarked = currentItem ? bookmarkedIds.includes(currentItem.id) : false;

  const playPronunciation = (word: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    speechService.speak(word, { accent: "US", rate: 0.95 });
  };

  const handleNextCard = () => {
    if (currentIndex < filteredVocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  // Generate 4 options for quiz
  const currentQuizItem = filteredVocab[quizIndex] || filteredVocab[0];
  const getQuizOptions = (item?: VocabItem) => {
    const target = item || currentQuizItem;
    if (!target) return [];
    const others = vocabList
      .filter((v) => v.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [...others, target].sort((a, b) => a.word.localeCompare(b.word));
  };

  const [quizOptions, setQuizOptions] = useState<VocabItem[]>(getQuizOptions());

  const handleQuizAnswer = (optIndex: number, optItem: VocabItem) => {
    if (quizSubmitted) return;
    setQuizSelectedOption(optIndex);
    setQuizSubmitted(true);
    if (optItem.id === currentQuizItem.id) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < filteredVocab.length - 1) {
      const nextIndex = quizIndex + 1;
      setQuizIndex(nextIndex);
      setQuizSubmitted(false);
      setQuizSelectedOption(null);
      const nextItem = filteredVocab[nextIndex];
      setQuizOptions(getQuizOptions(nextItem));
    }
  };

  const renderLevelBadge = (level?: string) => {
    if (level === "620도약") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          620 도약
        </span>
      );
    }
    if (level === "850+킬러") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          850+ 킬러
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
        800 필수
      </span>
    );
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* 1,000 Vocab Header & Total Progress Overview */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-indigo-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 text-xs font-extrabold border border-indigo-400/30">
                30일 완성 커리큘럼
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                총 {vocabList.length}개 최다빈출 어휘
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              토익 620 → 800+ 최다빈출 1,000단어 마스터
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed max-w-2xl">
              단순 암기가 아닌 <strong>'패러프레이징 짝꿍 + 비즈니스 연어(Collocation) + LC 영국/호주 발음'</strong>으로 실전 시험 1초 정답을 체화합니다.
            </p>
          </div>

          {/* Quick Mastery Progress Metric */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[170px] shrink-0 text-right sm:text-center space-y-1">
            <div className="flex items-center justify-between sm:justify-center gap-2 text-xs font-semibold text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>전체 암기 진도율</span>
            </div>
            <p className="text-2xl font-black text-white">
              {masteredCount} <span className="text-xs text-indigo-200 font-normal">/ {vocabList.length}단어</span>
            </p>
            <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((masteredCount / (vocabList.length || 1)) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switch Bar & Search Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Mode Toggle with 4 modes */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-fit overflow-x-auto no-scrollbar">
          <button
            id="btn-vocab-mode-list"
            onClick={() => setActiveMode("list")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[38px] touch-manipulation ${
              activeMode === "list"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <List className="w-4 h-4 shrink-0" />
            <span>단어 목록 (List)</span>
          </button>
          <button
            id="btn-vocab-mode-cards"
            onClick={() => {
              setActiveMode("cards");
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[38px] touch-manipulation ${
              activeMode === "cards"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>플래시카드</span>
          </button>
          <button
            id="btn-vocab-mode-paraphrase"
            onClick={() => setActiveMode("paraphrase")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[38px] touch-manipulation ${
              activeMode === "paraphrase"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Repeat className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>800 패러프레이징 족보</span>
          </button>
          <button
            id="btn-vocab-mode-quiz"
            onClick={() => {
              setActiveMode("quiz");
              setQuizIndex(0);
              setQuizScore(0);
              setQuizSubmitted(false);
              setQuizSelectedOption(null);
              setQuizOptions(getQuizOptions());
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[38px] touch-manipulation ${
              activeMode === "quiz"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>스피드 퀴즈</span>
          </button>
        </div>

        {/* Search */}
        {activeMode !== "paraphrase" && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="1,000단어, 뜻, 예문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        )}
      </div>

      {/* Day Selector & Filters (When in List, Cards, or Quiz mode) */}
      {activeMode !== "paraphrase" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          {/* Day Selector Tabs with Horizontal Scroll */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Day 선택 (Day 1 - Day 30)</span>
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {selectedDay === "all" ? "전체 1,000단어" : `Day ${selectedDay} (${currentDayStats.mastered}/${currentDayStats.total} 암기)`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
              <button
                type="button"
                onClick={() => {
                  setSelectedDay("all");
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedDay === "all"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                전체 Day (1~30)
              </button>

              {daysList.map((dayNum) => {
                const dayItems = vocabList.filter((v) => v.day === dayNum);
                const dayDone = dayItems.filter((v) => masteredIds.includes(v.id)).length;
                const isAllDone = dayDone === dayItems.length && dayItems.length > 0;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      setSelectedDay(dayNum);
                      setCurrentIndex(0);
                      setIsFlipped(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
                      selectedDay === dayNum
                        ? "bg-indigo-600 text-white shadow-sm font-bold"
                        : isAllDone
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <span>Day {dayNum}</span>
                    {isAllDone && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Filter & Category Filter Chips */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            {/* Level Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">목표 레벨:</span>
              {["전체", "620도약", "800필수", "850+킬러"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    selectedLevel === lvl
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Category Dropdown or Chip */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">카테고리:</span>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Mode 1: Paraphrase Mode */}
      {activeMode === "paraphrase" ? (
        <div className="space-y-6">
          {/* Paraphrase Guidance Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 border border-emerald-500/20 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-200 text-sm">
              <Lightbulb className="w-4 h-4 text-emerald-500" />
              <span>토익 800점 불변의 정답 법칙: '패러프레이징(재표현)'</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              토익 LC Part 3/4와 RC Part 7에서 <strong>지문에 나온 단어가 보기에 그대로 있으면 80% 이상 오답 함정</strong>입니다.
              정답은 반드시 동의어·상위어·구문 전환 형태로 치환되어 출제됩니다. 아래 빈출 패러프레이징 쌍을 눈에 익혀두세요!
            </p>
          </div>

          {/* Grid of Paraphrase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARAPHRASE_PAIRS.map((pair) => (
              <div
                key={pair.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-emerald-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {pair.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {pair.meaning}
                  </span>
                </div>

                {/* Match Box */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">지문 / 음성 단어</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {pair.passageWord}
                    </p>
                  </div>
                  
                  <div className="flex items-center px-2">
                    <Repeat className="w-4 h-4 text-emerald-500 animate-pulse" />
                  </div>

                  <div className="space-y-0.5 text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">정답 선택지 변환</span>
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {pair.choiceWord}
                    </p>
                  </div>
                </div>

                {/* Example Comparison */}
                <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-xs space-y-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {pair.exampleEn}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {pair.exampleKo}
                  </p>
                </div>

                {/* Pronunciation button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => speechService.speak(pair.choiceWord, { accent: "US" })}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>정답 발음 듣기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredVocab.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-slate-600 dark:text-slate-400 font-semibold">해당 조건에 맞는 단어가 없습니다.</p>
          <button
            onClick={() => {
              setSelectedDay("all");
              setSelectedLevel("전체");
              setSelectedCategory("전체");
              setSearchQuery("");
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 underline font-semibold"
          >
            필터 초기화하기
          </button>
        </div>
      ) : activeMode === "list" ? (
        /* Mode 2: List View (Best for scanning 1,000 words quickly!) */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              총 <strong>{filteredVocab.length}</strong>개 단어 표시 중
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              이 목록 중 암기 완료: {filteredVocab.filter((v) => masteredIds.includes(v.id)).length}개
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredVocab.map((item) => {
              const itemMastered = masteredIds.includes(item.id);
              const itemBookmarked = bookmarkedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    itemMastered
                      ? "bg-slate-50/70 dark:bg-slate-900/60 border-emerald-300 dark:border-emerald-800/60"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm"
                  }`}
                >
                  {/* Top row: Day badge, Level, Category & Action buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.day && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          Day {item.day}
                        </span>
                      )}
                      {renderLevelBadge(item.level)}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.category} • {item.partOfSpeech}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => playPronunciation(item.word, e)}
                        title="발음 듣기"
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(item.id)}
                        title="북마크"
                        className={`p-1.5 rounded-full transition-colors ${
                          itemBookmarked
                            ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {itemBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleMastered(item.id)}
                        title={itemMastered ? "암기 완료 취소" : "외웠어요"}
                        className={`p-1.5 rounded-full transition-colors ${
                          itemMastered
                            ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                            : "text-slate-400 hover:text-emerald-600"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Word & Meaning */}
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      {item.word}
                    </h3>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 text-right">
                      {item.meaning}
                    </p>
                  </div>

                  {/* Collocation & Paraphrase */}
                  <div className="space-y-1 text-xs">
                    {item.collocation && (
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mr-1.5">연어</span>
                        {item.collocation}
                      </div>
                    )}
                    {item.paraphraseWith && (
                      <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                        <Repeat className="w-3 h-3 shrink-0" />
                        <span className="text-[10px] font-bold uppercase mr-1">패러프레이징</span>
                        {item.paraphraseWith}
                      </div>
                    )}
                  </div>

                  {/* Example sentence */}
                  <div className="text-[11px] pt-1.5 border-t border-slate-100 dark:border-slate-800 space-y-0.5 text-slate-500 dark:text-slate-400">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      "{item.exampleEn}"
                    </p>
                    <p>{item.exampleKo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeMode === "cards" ? (
        /* Mode 3: Flashcard View */
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              단어 <strong>{currentIndex + 1}</strong> / {filteredVocab.length}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              외운 단어: {masteredCount}개
            </span>
          </div>

          {/* Interactive Flippable Card */}
          <div
            id="flashcard-box"
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative min-h-[320px] rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 border-2 border-indigo-100 dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between cursor-pointer hover:border-indigo-300 transition-all select-none"
          >
            {/* Top Card Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentItem.day && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-black bg-indigo-600 text-white shadow-sm">
                    Day {currentItem.day}
                  </span>
                )}
                {renderLevelBadge(currentItem.level)}
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {currentItem.category} • {currentItem.partOfSpeech}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => playPronunciation(currentItem.word, e)}
                  title="발음 듣기"
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(currentItem.id);
                  }}
                  className={`p-2 rounded-full border transition-colors ${
                    isBookmarked
                      ? "bg-amber-50 text-amber-500 border-amber-300 dark:bg-amber-950/40"
                      : "text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600"
                  }`}
                >
                  {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Main Word or Meaning Content */}
            <div className="py-6 text-center space-y-4">
              {!isFlipped ? (
                /* Front Side: English word + collocation + paraphrase badge */
                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {currentItem.word}
                  </h2>
                  <div className="inline-block px-4 py-1.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
                    <p className="text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                      연어(Collocation): {currentItem.collocation}
                    </p>
                  </div>

                  {currentItem.paraphraseWith && (
                    <div className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>800 패러프레이징 짝: {currentItem.paraphraseWith}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-4">
                    <RotateCw className="w-3.5 h-3.5" />
                    카드를 클릭하면 한국어 뜻과 토익 예문이 나타납니다
                  </p>
                </div>
              ) : (
                /* Back Side: Korean meaning + example sentence */
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {currentItem.meaning}
                  </h3>
                  <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs sm:text-sm">
                    <p className="font-medium text-slate-900 dark:text-white leading-relaxed">
                      "{currentItem.exampleEn}"
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {currentItem.exampleKo}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card Bar: Mastered Toggle & Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMastered(currentItem.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all min-h-[40px] touch-manipulation ${
                  isMastered
                    ? "bg-emerald-500 text-white border-emerald-600"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isMastered ? "암기 완료됨" : "외웠어요 (체크)"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevCard();
                  }}
                  disabled={currentIndex === 0}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextCard();
                  }}
                  disabled={currentIndex >= filteredVocab.length - 1}
                  className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation active:scale-95"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 4: Speed Quiz View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-500">
              퀴즈 진행: <strong>{quizIndex + 1}</strong> / {filteredVocab.length}
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              현재 점수: {quizScore}점
            </span>
          </div>

          <div className="text-center py-4 space-y-2">
            <div className="flex items-center justify-center gap-2">
              {currentQuizItem.day && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Day {currentQuizItem.day}
                </span>
              )}
              {renderLevelBadge(currentQuizItem.level)}
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              다음 단어의 올바른 한국어 뜻은?
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentQuizItem.word}
            </h3>
            <p className="text-xs text-slate-400">
              {currentQuizItem.collocation}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizOptions.map((opt, i) => {
              const isSelected = quizSelectedOption === i;
              const isCorrect = opt.id === currentQuizItem.id;

              let btnStyle = "border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50";
              if (quizSubmitted) {
                if (isCorrect) {
                  btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through";
                } else {
                  btnStyle = "opacity-40 border-slate-200 dark:border-slate-800";
                }
              }

              return (
                <button
                  key={i}
                  id={`quiz-opt-${i}`}
                  onClick={() => handleQuizAnswer(i, opt)}
                  disabled={quizSubmitted}
                  className={`p-4 rounded-xl border text-sm text-left transition-all flex items-center justify-between min-h-[48px] touch-manipulation active:scale-[0.99] ${btnStyle}`}
                >
                  <span>{opt.meaning}</span>
                  {quizSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />}
                  {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className="pt-4 flex justify-end">
              <button
                id="btn-next-quiz"
                onClick={handleNextQuizQuestion}
                disabled={quizIndex >= filteredVocab.length - 1}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 min-h-[44px] touch-manipulation active:scale-95"
              >
                <span>다음 단어</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
