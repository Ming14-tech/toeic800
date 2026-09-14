import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Bookmark, 
  BookmarkCheck, 
  Bot, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Lightbulb, 
  Loader2,
  Clock,
  Timer
} from "lucide-react";
import { Part5Question, GrammarCategory } from "../types";

interface Part5ViewProps {
  questions: Part5Question[];
  bookmarkedIds: string[];
  wrongQuestionIds: string[];
  onAnswerQuestion: (questionId: string, isCorrect: boolean) => void;
  onToggleBookmark: (questionId: string) => void;
  onAskCoachAboutQuestion: (question: Part5Question, userChoice: number) => void;
  onGenerateAIQuestions: (category: string) => Promise<void>;
  isGeneratingAI: boolean;
}

export const Part5View: React.FC<Part5ViewProps> = ({
  questions,
  bookmarkedIds,
  wrongQuestionIds,
  onAnswerQuestion,
  onToggleBookmark,
  onAskCoachAboutQuestion,
  onGenerateAIQuestions,
  isGeneratingAI,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory>("전체");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  
  // 10-minute cut (20-second per question) speed timer
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const timerRef = useRef<any>(null);

  // Filter questions by category
  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory === "전체") return true;
    return q.category === selectedCategory;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const isBookmarked = currentQ ? bookmarkedIds.includes(currentQ.id) : false;
  const isWrongPreviously = currentQ ? wrongQuestionIds.includes(currentQ.id) : false;

  // Reset timer on question change
  useEffect(() => {
    setSecondsElapsed(0);
    setFinalTime(null);
    if (!hasSubmitted) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, hasSubmitted, selectedCategory]);

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !currentQ) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setFinalTime(secondsElapsed);
    setHasSubmitted(true);
    const isCorrect = selectedOption === currentQ.answer;
    onAnswerQuestion(currentQ.id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
      setShowTranslation(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setHasSubmitted(false);
      setShowTranslation(false);
    }
  };

  const handleCategoryChange = (cat: GrammarCategory) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setShowTranslation(false);
  };

  const categories: { label: string; value: GrammarCategory }[] = [
    { label: "전체 800 대비", value: "전체" },
    { label: "품사 1초 컷 (속도전)", value: "품사1초컷" },
    { label: "분사구문 (800 킬러)", value: "분사구문" },
    { label: "접속부사 vs 접속사", value: "접속부사" },
    { label: "도치 / 가정법", value: "도치가정법" },
    { label: "수-시-태 공식", value: "수시태" },
    { label: "전치사 vs 접속사", value: "전치사접속사" },
    { label: "800 킬러 어휘", value: "800킬러어휘" },
  ];

  if (!currentQ) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 mb-4">해당 카테고리의 문제가 없습니다.</p>
        <button
          onClick={() => handleCategoryChange("전체")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
        >
          전체 카테고리로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Category Pills & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.value}
              id={`p5-cat-${cat.value}`}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          id="btn-gen-ai-part5"
          onClick={() => onGenerateAIQuestions(selectedCategory)}
          disabled={isGeneratingAI}
          className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100 transition-colors shrink-0 disabled:opacity-50"
        >
          {isGeneratingAI ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          )}
          <span>{isGeneratingAI ? "AI 문제 출제 중..." : "AI 800 킬러 문제 추가 생성"}</span>
        </button>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Header & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
              문제 {currentIndex + 1} / {filteredQuestions.length}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {currentQ.category}
            </span>
            {isWrongPreviously && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                복습 필요 오답
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 20s Speed Timer Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
              secondsElapsed > 25 && !hasSubmitted
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-300 animate-pulse"
                : secondsElapsed > 18 && !hasSubmitted
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border-amber-300"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}>
              <Timer className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                {hasSubmitted ? `소요 ${finalTime}초` : `${secondsElapsed}초 (목표: 20초 컷)`}
              </span>
            </div>

            <button
              id={`btn-bookmark-p5-${currentQ.id}`}
              onClick={() => onToggleBookmark(currentQ.id)}
              className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
              title={isBookmarked ? "북마크 해제" : "북마크 추가"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed tracking-tight">
            {currentQ.question}
          </p>

          {/* Korean Translation Toggle */}
          <div>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTranslation ? "해석 숨기기" : "한국어 해석 보기"}</span>
            </button>
            {showTranslation && (
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                {currentQ.translation}
              </p>
            )}
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === currentQ.answer;

            let optionStyle = "border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200";

            if (hasSubmitted) {
              if (isCorrectAnswer) {
                optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/20";
              } else if (isSelected && !isCorrectAnswer) {
                optionStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through opacity-80";
              } else {
                optionStyle = "border-slate-200 dark:border-slate-800 opacity-60";
              }
            } else if (isSelected) {
              optionStyle = "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 font-semibold ring-2 ring-indigo-500/20";
            }

            return (
              <button
                key={idx}
                id={`p5-opt-${idx}`}
                onClick={() => handleSelectOption(idx)}
                disabled={hasSubmitted}
                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between min-h-[48px] touch-manipulation active:scale-[0.99] ${optionStyle}`}
              >
                <span className="leading-relaxed">{opt}</span>
                {hasSubmitted && isCorrectAnswer && (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                )}
                {hasSubmitted && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit / Action Buttons */}
        {!hasSubmitted ? (
          <button
            id="btn-submit-part5"
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px] touch-manipulation active:scale-[0.99]"
          >
            <Zap className="w-4 h-4" />
            <span>정답 확인하기 (20초 타임어택 검증)</span>
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Speed Feedback Banner */}
            <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
              (finalTime || 0) <= 20
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium"
            }`}>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {(finalTime || 0) <= 20
                  ? `⚡ ${finalTime}초 주파 완료! (800점 합격 페이스 유지)`
                  : `⚠️ ${finalTime}초 소요: 실전에서는 20초 이내 결단해야 Part 7 독해 시간을 확보합니다.`}
              </span>
              <span className="text-[11px] font-bold">목표: 30문제 10분 컷</span>
            </div>

            {/* Answer Result Banner */}
            <div
              className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
                selectedOption === currentQ.answer
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                  : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
              }`}
            >
              {selectedOption === currentQ.answer ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">
                  {selectedOption === currentQ.answer
                    ? "정답입니다! 800점 도약에 한 걸음 더 다가섰습니다."
                    : `오답입니다. 정답은 ${currentQ.options[currentQ.answer]} 입니다.`}
                </p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>

            {/* Syntactic Structure Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                문장 구조 끊어읽기 (직독직해 분석)
              </span>
              <p className="font-mono text-indigo-900 dark:text-indigo-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
                {currentQ.structure}
              </p>
            </div>

            {/* 800 Point Shortcut Tip */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                토익 800점 점프 킬러 공식
              </span>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                {currentQ.tip800 || (currentQ as any).tip620}
              </p>
            </div>

            {/* Key Vocab tags */}
            {currentQ.keyVocab && currentQ.keyVocab.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-medium">핵심 어휘:</span>
                {currentQ.keyVocab.map((v, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    <strong>{v.word}</strong>: {v.meaning}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar: Ask Coach & Next Question */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
              <button
                id="btn-ask-coach-this-q"
                onClick={() => onAskCoachAboutQuestion(currentQ, selectedOption || 0)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors min-h-[44px] touch-manipulation active:scale-[0.99]"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>AI 코치 토비에게 800점 눈높이 1:1 질문</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="btn-prev-question"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-3 sm:py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 min-h-[44px] touch-manipulation"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>이전</span>
                </button>
                <button
                  id="btn-next-question"
                  onClick={handleNext}
                  disabled={currentIndex >= filteredQuestions.length - 1}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-5 py-3 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-40 min-h-[44px] touch-manipulation active:scale-[0.99]"
                >
                  <span>다음 문제</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
