import React, { useState } from "react";
import { 
  X, 
  BrainCircuit, 
  CheckCircle, 
  ArrowRight, 
  Loader2, 
  Headphones, 
  Zap, 
  Play, 
  Square 
} from "lucide-react";
import { Part5Question, LCPart2Question } from "../types";
import { speechService } from "../utils/audioSpeech";

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  part5Pool: Part5Question[];
  lcPool: LCPart2Question[];
  onCompleteDiagnostic: (results: {
    total: number;
    correct: number;
    part5Correct: number;
    lcCorrect: number;
    details: any[];
  }) => Promise<void>;
  isLoadingReport: boolean;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  part5Pool,
  lcPool,
  onCompleteDiagnostic,
  isLoadingReport,
}) => {
  if (!isOpen) return null;

  // 3 Part 5 + 2 LC questions
  const testQuestions = [
    { type: "p5" as const, data: part5Pool[0] },
    { type: "p5" as const, data: part5Pool[1] },
    { type: "p5" as const, data: part5Pool[2] },
    { type: "lc" as const, data: lcPool[0] },
    { type: "lc" as const, data: lcPool[1] },
  ].filter((q) => Boolean(q.data));

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPlayingLC, setIsPlayingLC] = useState<boolean>(false);

  const currentQ = testQuestions[stepIndex];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  const playLCAudio = (script: string, opts: { text: string }[]) => {
    if (isPlayingLC) {
      speechService.stop();
      setIsPlayingLC(false);
      return;
    }
    setIsPlayingLC(true);
    const full = `${script}. (A) ${opts[0].text}. (B) ${opts[1].text}. (C) ${opts[2].text}.`;
    speechService.speak(full, {
      rate: 1.0,
      onEnd: () => setIsPlayingLC(false),
      onError: () => setIsPlayingLC(false),
    });
  };

  const handleNextStep = async () => {
    if (selectedOption === null || !currentQ) return;
    speechService.stop();
    setIsPlayingLC(false);

    const nextAnswers = [...userAnswers, selectedOption];
    setUserAnswers(nextAnswers);
    setSelectedOption(null);

    if (stepIndex < testQuestions.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Finished all 5 questions
      let correct = 0;
      let part5Correct = 0;
      let lcCorrect = 0;
      const details = testQuestions.map((q, idx) => {
        const isRight = nextAnswers[idx] === q.data.answer;
        if (isRight) {
          correct++;
          if (q.type === "p5") part5Correct++;
          else lcCorrect++;
        }
        return {
          questionId: q.data.id,
          type: q.type,
          userChoice: nextAnswers[idx],
          correctAnswer: q.data.answer,
          isRight,
        };
      });

      await onCompleteDiagnostic({
        total: testQuestions.length,
        correct,
        part5Correct,
        lcCorrect,
        details,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            speechService.stop();
            onClose();
          }}
          disabled={isLoadingReport}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              토익 620 → 800 도약 약점 진단 (5문제)
            </h3>
            <p className="text-xs text-slate-400">
              진행 상황: {stepIndex + 1} / {testQuestions.length} (Part 5 800 킬러 & LC 우회적 답변)
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / testQuestions.length) * 100}%` }}
          />
        </div>

        {isLoadingReport ? (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                AI 코치 토비가 620→800 도약 처방전을 작성하고 있습니다...
              </h4>
              <p className="text-xs text-slate-500">
                Part 5 10분 컷 타임어택 능력 및 LC 우회적·반문형 소거력을 정밀 분석 중입니다.
              </p>
            </div>
          </div>
        ) : currentQ ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                {currentQ.type === "p5" ? <Zap className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
                {currentQ.type === "p5" ? "RC Part 5 문법" : "LC Part 2 리스닝"}
              </span>
            </div>

            {currentQ.type === "p5" ? (
              /* Part 5 Question */
              <div className="space-y-4">
                <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base leading-relaxed">
                  {(currentQ.data as Part5Question).question}
                </p>

                <div className="space-y-2">
                  {(currentQ.data as Part5Question).options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all ${
                        selectedOption === i
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 font-semibold ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* LC Part 2 Question */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                  <button
                    onClick={() =>
                      playLCAudio(
                        (currentQ.data as LCPart2Question).audioScript,
                        (currentQ.data as LCPart2Question).options
                      )
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                  >
                    {isPlayingLC ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        <span>재생 중지</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                        <span>음성 듣기 (Question + A·B·C)</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400">
                    음성을 듣고 알맞은 답변을 선택하세요
                  </p>
                </div>

                <div className="space-y-2">
                  {(currentQ.data as LCPart2Question).options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all ${
                        selectedOption === i
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 font-semibold ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <strong>({opt.label})</strong> {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleNextStep}
              disabled={selectedOption === null}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-40"
            >
              <span>{stepIndex === testQuestions.length - 1 ? "진단 결과 제출" : "다음 문제로"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
