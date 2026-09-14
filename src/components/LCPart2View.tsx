import React, { useState, useEffect } from "react";
import { 
  Headphones, 
  Play, 
  Square, 
  Volume2, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  X,
  Bot,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { LCPart2Question } from "../types";
import { speechService, Accent } from "../utils/audioSpeech";

interface LCPart2ViewProps {
  questions: LCPart2Question[];
  wrongLCIds: string[];
  onAnswerQuestion: (questionId: string, isCorrect: boolean) => void;
  onAskCoachAboutQuestion: (question: LCPart2Question, userChoice: number) => void;
  onGenerateAILCQuestions: (trapType?: string) => Promise<void>;
  isGeneratingAI: boolean;
}

export const LCPart2View: React.FC<LCPart2ViewProps> = ({
  questions,
  wrongLCIds,
  onAnswerQuestion,
  onAskCoachAboutQuestion,
  onGenerateAILCQuestions,
  isGeneratingAI,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<boolean[]>([false, false, false]);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [examMode, setExamMode] = useState<boolean>(true); // true = hide scripts
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [selectedAccent, setSelectedAccent] = useState<Accent>("US");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const currentQ = questions[currentIndex] || questions[0];
  const isWrongPreviously = currentQ ? wrongLCIds.includes(currentQ.id) : false;

  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleToggleEliminate = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasSubmitted) return;
    setEliminatedOptions((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !currentQ) return;
    setHasSubmitted(true);
    const isCorrect = selectedOption === currentQ.answer;
    onAnswerQuestion(currentQ.id, isCorrect);
  };

  const handleNext = () => {
    speechService.stop();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setEliminatedOptions([false, false, false]);
      setHasSubmitted(false);
      setIsPlayingAudio(false);
    }
  };

  const handlePrev = () => {
    speechService.stop();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setEliminatedOptions([false, false, false]);
      setHasSubmitted(false);
      setIsPlayingAudio(false);
    }
  };

  // Play full TOEIC sequence: Question -> pause -> (A) -> (B) -> (C)
  const playFullQuestionAudio = () => {
    if (!currentQ) return;
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const fullText = `${currentQ.audioScript}. (A). ${currentQ.options[0].text}. (B). ${currentQ.options[1].text}. (C). ${currentQ.options[2].text}.`;

    speechService.speak(fullText, {
      accent: selectedAccent,
      rate: playbackSpeed,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const playSingleText = (text: string) => {
    speechService.stop();
    speechService.speak(text, {
      accent: selectedAccent,
      rate: playbackSpeed,
    });
  };

  if (!currentQ) {
    return <div className="text-center py-12 text-slate-500">문제가 없습니다.</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls: Audio speed, accent, exam mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Accent & Speed */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <span className="text-slate-400 px-2 font-medium">발음:</span>
            {(["US", "UK", "AU"] as Accent[]).map((acc) => (
              <button
                key={acc}
                onClick={() => setSelectedAccent(acc)}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  selectedAccent === acc
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                {acc === "US" ? "🇺🇸 미국" : acc === "UK" ? "🇬🇧 영국" : "🇦🇺 호주"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <span className="text-slate-400 px-2 font-medium">배속:</span>
            {[0.8, 1.0, 1.2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded font-semibold transition-colors ${
                  playbackSpeed === spd
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Exam Mode Toggle & AI Gen */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-exam-mode"
            onClick={() => setExamMode(!examMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {examMode ? <EyeOff className="w-3.5 h-3.5 text-amber-500" /> : <Eye className="w-3.5 h-3.5 text-indigo-500" />}
            <span>{examMode ? "실전 모드 (스크립트 숨김)" : "학습 모드 (스크립트 공개)"}</span>
          </button>

          <button
            id="btn-ai-generate-lc2"
            onClick={() => onGenerateAILCQuestions()}
            disabled={isGeneratingAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            {isGeneratingAI ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>🤖 AI 새 LC 함정 문제</span>
          </button>
        </div>
      </div>

      {/* Main Question Audio Player & Question Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {currentQ.questionType}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              문제 {currentIndex + 1} / {questions.length}
            </span>
            {isWrongPreviously && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/50">
                복습 필요
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500">
            💡 오답이라고 생각되는 보기는 <strong>[X 소거]</strong> 버튼을 누르세요!
          </span>
        </div>

        {/* Central Audio Play Controller */}
        <div className="flex flex-col items-center justify-center p-6 mb-6 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/30 dark:from-slate-800/60 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-800">
          <button
            id="btn-play-full-audio"
            onClick={playFullQuestionAudio}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-md transition-all active:scale-95 ${
              isPlayingAudio
                ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                <span>재생 중지 (정지)</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>토익 실전 음성 듣기 (Question + A·B·C)</span>
              </>
            )}
          </button>

          {/* Script Display (Only in Study mode OR after submitted) */}
          {(!examMode || hasSubmitted) && (
            <div className="mt-5 text-center space-y-1 animate-fadeIn max-w-xl">
              <p className="font-semibold text-slate-900 dark:text-white text-base">
                "{currentQ.audioScript}"
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentQ.koreanTranslation}
              </p>
            </div>
          )}

          {examMode && !hasSubmitted && (
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-blue-500" />
              실전 모드 활성화 중: 스크립트가 숨겨져 있습니다. 음성에 집중하세요!
            </p>
          )}
        </div>

        {/* 3 Options with Elimination Buttons */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isEliminated = eliminatedOptions[idx];
            const isCorrect = idx === currentQ.answer;

            let cardStyle = "border-slate-200 dark:border-slate-800 hover:border-blue-300";
            if (hasSubmitted) {
              if (isCorrect) {
                cardStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold";
              } else if (isSelected && !isCorrect) {
                cardStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100";
              } else {
                cardStyle = "border-slate-200 dark:border-slate-800 opacity-60";
              }
            } else if (isEliminated) {
              cardStyle = "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 opacity-40 line-through";
            } else if (isSelected) {
              cardStyle = "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20 font-semibold";
            }

            return (
              <div
                key={idx}
                id={`lc2-opt-${idx}`}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                    {opt.label}
                  </span>
                  <div>
                    {/* In exam mode before submit, only show Option label and play button */}
                    {!examMode || hasSubmitted ? (
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {opt.text}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {opt.translation}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-medium">보기 ({opt.label}) 선택하기</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSingleText(opt.text);
                    }}
                    title="이 보기만 다시 듣기"
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {!hasSubmitted && (
                    <button
                      type="button"
                      id={`btn-eliminate-${idx}`}
                      onClick={(e) => handleToggleEliminate(idx, e)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 border transition-colors ${
                        isEliminated
                          ? "bg-rose-500 text-white border-rose-600"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600"
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{isEliminated ? "소거 취소" : "X 소거"}</span>
                    </button>
                  )}

                  {hasSubmitted && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {hasSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit or Explanation */}
        {!hasSubmitted ? (
          <button
            id="btn-submit-lc2"
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-40"
          >
            정답 및 소거법 검증하기
          </button>
        ) : (
          <div className="space-y-4 pt-2">
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
                    ? "정답입니다! 소거법이 정확하게 들어맞았습니다."
                    : `오답입니다. 정답은 (${currentQ.options[currentQ.answer].label}) 입니다.`}
                </p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentQ.eliminationStrategy}
                </p>
              </div>
            </div>

            {/* Trap breakdown for each option */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                보기별 800점 고난도 함정 분석 표
              </span>
              <div className="space-y-1.5">
                {currentQ.options.map((opt, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                      ({opt.label})
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {opt.isTrap ? (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          [함정] {opt.trapReason}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          [정답] 적절한 응답 / 800점 우회적·반문형 답변
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 800 Tip */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                토익 800점 LC 430+ 달성 비법
              </span>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                {currentQ.tip800 || (currentQ as any).tip620}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
              <button
                id="btn-ask-coach-lc2"
                onClick={() => onAskCoachAboutQuestion(currentQ, selectedOption || 0)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>AI 코치에게 LC 소거법 질문</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="btn-prev-lc-q"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>이전</span>
                </button>
                <button
                  id="btn-next-lc-q"
                  onClick={handleNext}
                  disabled={currentIndex >= questions.length - 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm disabled:opacity-40"
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
