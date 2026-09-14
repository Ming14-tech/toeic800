import React, { useState } from "react";
import { 
  FileText, 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Award, 
  Target,
  Loader2,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Part5Question, LCPart2Question, DiagnosticReport } from "../types";

interface MistakesAndReportViewProps {
  wrongPart5Questions: Part5Question[];
  wrongLCQuestions: LCPart2Question[];
  onRemoveWrongPart5: (id: string) => void;
  onRemoveWrongLC: (id: string) => void;
  onRetestQuestion: (type: "part5" | "lc2", id: string) => void;
  diagnosticReport: DiagnosticReport | null;
  onRunDiagnostic: () => Promise<void>;
  isRunningDiagnostic: boolean;
}

export const MistakesAndReportView: React.FC<MistakesAndReportViewProps> = ({
  wrongPart5Questions,
  wrongLCQuestions,
  onRemoveWrongPart5,
  onRemoveWrongLC,
  onRetestQuestion,
  diagnosticReport,
  onRunDiagnostic,
  isRunningDiagnostic,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"mistakes" | "diagnosis">("mistakes");
  const [mistakeFilter, setMistakeFilter] = useState<"all" | "part5" | "lc2">("all");

  const totalMistakes = wrongPart5Questions.length + wrongLCQuestions.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex space-x-2">
          <button
            id="tab-sub-mistakes"
            onClick={() => setActiveSubTab("mistakes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === "mistakes"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>나만의 오답노트 ({totalMistakes})</span>
          </button>
          <button
            id="tab-sub-diagnosis"
            onClick={() => setActiveSubTab("diagnosis")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === "diagnosis"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI 맞춤 800 도약 진단 & 로드맵</span>
          </button>
        </div>

        {activeSubTab === "diagnosis" && (
          <button
            id="btn-re-run-diagnosis"
            onClick={onRunDiagnostic}
            disabled={isRunningDiagnostic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            {isRunningDiagnostic ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>AI 진단 재실행</span>
          </button>
        )}
      </div>

      {activeSubTab === "mistakes" ? (
        /* Wrong Answer Notebook */
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">유형 필터:</span>
            {[
              { id: "all", label: `전체 (${totalMistakes})` },
              { id: "part5", label: `Part 5 (${wrongPart5Questions.length})` },
              { id: "lc2", label: `LC Part 2 (${wrongLCQuestions.length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setMistakeFilter(f.id as any)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  mistakeFilter === f.id
                    ? "bg-slate-800 text-white dark:bg-slate-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {totalMistakes === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                등록된 오답이 없습니다!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Part 5 족집게나 LC 파트 2를 풀면서 틀린 문제가 자동으로 이곳에 모입니다.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Part 5 Mistakes */}
              {(mistakeFilter === "all" || mistakeFilter === "part5") &&
                wrongPart5Questions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Part 5 • {q.category}
                        </span>
                        <span className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> 오답 복습
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRetestQuestion("part5", q.id)}
                          className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold transition-colors"
                        >
                          다시 풀기
                        </button>
                        <button
                          onClick={() => onRemoveWrongPart5(q.id)}
                          title="마스터함 (오답노트에서 제거)"
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {q.question}
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs space-y-1">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        정답: {q.options[q.answer]}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {q.explanation}
                      </p>
                      <p className="text-indigo-600 dark:text-indigo-400 font-mono pt-1">
                        구조: {q.structure}
                      </p>
                    </div>
                  </div>
                ))}

              {/* LC Part 2 Mistakes */}
              {(mistakeFilter === "all" || mistakeFilter === "lc2") &&
                wrongLCQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          LC Part 2 • {q.questionType}
                        </span>
                        <span className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> 오답 복습
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRetestQuestion("lc2", q.id)}
                          className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold transition-colors"
                        >
                          다시 풀기
                        </button>
                        <button
                          onClick={() => onRemoveWrongLC(q.id)}
                          title="마스터함 (오답노트에서 제거)"
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      "{q.audioScript}"
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs space-y-1">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        정답: ({q.options[q.answer].label}) {q.options[q.answer].text}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        소거 팁: {q.eliminationStrategy}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        /* Diagnostic Report & Study Plan */
        <div className="space-y-6">
          {!diagnosticReport ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  아직 생성된 AI 800점 도약 진단 보고서가 없습니다
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  현재 620점에서 목표 800점(LC 430 + RC 370) 달성을 위한
                  맞춤 처방전과 2주 핵심 로드맵을 AI가 분석해 드립니다.
                </p>
              </div>
              <button
                id="btn-trigger-ai-diagnosis"
                onClick={onRunDiagnostic}
                disabled={isRunningDiagnostic}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {isRunningDiagnostic ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI가 800점 도약 보고서 작성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>지금 620→800 AI 약점 진단 받기</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Estimate Card */}
              <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-indigo-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-indigo-300">현재 추정 실력 (기준점 620점)</span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      {diagnosticReport.estimatedScoreRange}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      목표 800점까지 점수 격차: <strong>{diagnosticReport.scoreGapTo800 || (diagnosticReport as any).scoreGapTo620}</strong>
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:w-64 text-xs space-y-2">
                    <span className="font-bold text-emerald-300">800점 도약 목표 조합</span>
                    <div className="flex justify-between">
                      <span className="text-slate-300">LC 목표 (청취)</span>
                      <strong className="text-blue-400">{diagnosticReport.recommendedSplit.lcTarget}점</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">RC 목표 (독해)</span>
                      <strong className="text-amber-400">{diagnosticReport.recommendedSplit.rcTarget}점</strong>
                    </div>
                    <div className="pt-1 border-t border-slate-800 flex justify-between font-bold">
                      <span>합계 목표</span>
                      <span className="text-emerald-400">
                        {diagnosticReport.recommendedSplit.lcTarget + diagnosticReport.recommendedSplit.rcTarget}점
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-950/40 rounded-xl border border-indigo-800/60 text-xs text-indigo-200">
                  💬 <strong>코치 토비의 800점 돌파 처방:</strong> {diagnosticReport.coachEncouragement}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 나의 강점 포인트 (620점 기반)
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {diagnosticReport.topStrengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
                  <span className="font-bold text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> 800점 돌파 긴급 보완 약점
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {diagnosticReport.criticalWeaknesses.map((w, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 2-Week Personalized Study Roadmap */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    토익 800점 도약 2주 완성 집중 로드맵
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diagnosticReport.twoWeekRoadmap.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                          {item.week}
                        </span>
                        <span className="text-slate-400">일일 {item.dailyTime}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {item.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
