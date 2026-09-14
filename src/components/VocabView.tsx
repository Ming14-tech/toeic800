import React, { useState } from "react";
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
  Flame
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
  const [activeMode, setActiveMode] = useState<"cards" | "paraphrase" | "quiz">("cards");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);

  const categories = [
    "전체",
    "패러프레이징 짝꿍",
    "800 필수 어휘",
    "비즈니스 심화",
    "인사/채용",
    "회의/일정",
    "출장/교통",
    "북마크 ⭐",
  ];

  const filteredVocab = vocabList.filter((item) => {
    if (selectedCategory === "북마크 ⭐") {
      if (!bookmarkedIds.includes(item.id)) return false;
    } else if (selectedCategory !== "전체" && item.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.word.toLowerCase().includes(q) || 
        item.meaning.includes(q) ||
        (item.paraphraseWith && item.paraphraseWith.toLowerCase().includes(q))
      );
    }
    return true;
  });

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
  const getQuizOptions = () => {
    if (!currentQuizItem) return [];
    const others = vocabList
      .filter((v) => v.id !== currentQuizItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const combined = [...others, currentQuizItem].sort((a, b) => a.word.localeCompare(b.word));
    return combined;
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
      setQuizIndex(quizIndex + 1);
      setQuizSubmitted(false);
      setQuizSelectedOption(null);
      const nextItem = filteredVocab[quizIndex + 1];
      const others = vocabList
        .filter((v) => v.id !== nextItem.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setQuizOptions([...others, nextItem].sort((a, b) => a.word.localeCompare(b.word)));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header: Mode Switch & Category Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Mode Toggle with Paraphrase Mode */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-fit overflow-x-auto no-scrollbar">
          <button
            id="btn-vocab-mode-cards"
            onClick={() => setActiveMode("cards")}
            className={`flex items-center gap-2 px-3.5 py-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[40px] touch-manipulation ${
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
            className={`flex items-center gap-2 px-3.5 py-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[40px] touch-manipulation ${
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
            className={`flex items-center gap-2 px-3.5 py-2.5 sm:py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[40px] touch-manipulation ${
              activeMode === "quiz"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span>스피드 퀴즈</span>
          </button>
        </div>

        {/* Search */}
        {activeMode !== "paraphrase" && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 sm:top-2.5" />
            <input
              type="text"
              placeholder="단어 또는 뜻 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-base sm:text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-h-[40px] sm:min-h-0"
            />
          </div>
        )}
      </div>

      {/* Category Pills (for cards & quiz) */}
      {activeMode !== "paraphrase" && (
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
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
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">해당 조건에 맞는 단어가 없습니다.</p>
        </div>
      ) : activeMode === "cards" ? (
        /* Mode 2: Flashcard View */
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
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {currentItem.category} • {currentItem.partOfSpeech}
              </span>

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
        /* Mode 3: Speed Quiz View */
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
