import React from "react";
import { 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  BookOpen, 
  Bot,
  BrainCircuit,
  ChevronRight,
  TrendingUp,
  Flame,
  Layers
} from "lucide-react";
import { STRATEGY_800_RULES } from "../data/toeicData";
import { StudyProgress } from "../types";

interface DashboardViewProps {
  progress: StudyProgress;
  onNavigate: (tab: string, context?: any) => void;
  onStartDiagnostic: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  onNavigate,
  onStartDiagnostic,
}) => {
  const part5Accuracy = progress.solvedPart5 > 0 
    ? Math.round((progress.correctPart5 / progress.solvedPart5) * 100) 
    : 0;
  const lcAccuracy = progress.solvedLC > 0 
    ? Math.round((progress.correctLC / progress.solvedLC) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero 620 -> 800 Target Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>현재 620점 → 목표 800점 도약 에이전트 가동 (+180점 점프)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              현재 <span className="text-indigo-400">620점</span>이신가요? <br className="hidden sm:inline" />
              <span className="text-emerald-400">LC 430점 + RC 370점</span>의 초정밀 황금 밸런스로 800점을 돌파합니다!
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              620점은 기초 뼈대가 있는 점수입니다. 800점으로 가는 핵심 승부처는 
              <strong> Part 5 10분 컷 타임어택</strong>으로 Part 7 삼중지문 55분을 확보하고, 
              <strong> 패러프레이징 족보</strong>와 <strong> LC 우회적 답변 소거법</strong>을 장악하는 것입니다.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-quick-diagnostic"
                onClick={onStartDiagnostic}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-md shadow-emerald-600/30 active:scale-95"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>620→800 AI 약점 진단 테스트</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="btn-ask-coach-strategy"
                onClick={() => onNavigate("coach", { prompt: "현재 토익 620점인데 800점까지 4주 만에 올리는 파트별 시간 배분과 공부 전략 알려줘!" })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-sm transition-all"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>코치 토비에게 800점 도약 전략 질문</span>
              </button>
            </div>
          </div>

          {/* Target Score Blueprint Card: 620 -> 800 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 w-full lg:w-88 backdrop-blur-sm shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">620 → 800 도약 설계표</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                +180점 점프
              </span>
            </div>
            
            {/* Score Comparison Badge */}
            <div className="flex items-center justify-between p-2.5 mb-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <div className="text-center">
                <span className="text-slate-400 block text-[11px]">현재 보유 점수</span>
                <span className="text-base font-extrabold text-indigo-300">620점</span>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-semibold">+180 점프</span>
              </div>
              <div className="text-center">
                <span className="text-slate-400 block text-[11px]">목표 점수</span>
                <span className="text-base font-extrabold text-emerald-400">800점 달성</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-blue-400" /> LC (Listening)
                  </span>
                  <span className="text-blue-400 font-bold">목표 430점 (84개+)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-[86%]" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Part 2 우회적 답변 & Part 3/4 키워드 스키밍</p>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> RC (Reading)
                  </span>
                  <span className="text-amber-400 font-bold">목표 370점 (75개+)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-[74%]" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Part 5 10분 컷 (26개+) + Part 7 55분 확보</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">누적 훈련 완료</span>
                <span className="font-bold text-white">
                  {progress.solvedPart5 + progress.solvedLC}문제 풀이 · 단어 {progress.masteredVocabCount}개 완료
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 620 Scorer Bottleneck Breaker */}
      <section className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            620점 정체기 탈출! 800점 도약 3대 절대 공식
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 1. Part 5 '10분 컷' 주파
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              620점대는 Part 5에서 18분을 쓰다 Part 7 20문제를 찍습니다. 문제당 20초 이내로 끝내 삼중지문 시간을 벌어야 합니다.
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> 2. 패러프레이징(유의어) 치환
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              800점 시험 정답은 지문 단어가 절대 그대로 안 나옵니다. (renovate → refurbish) 동의어 전환을 체화하세요.
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" /> 3. LC 우회적·반문형 소거
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Where 질문에 '아직 미정이다'나 되묻는 반문형 보기를 포착하고, 유사발음 함정을 100% 지워내야 430점이 나옵니다.
            </p>
          </div>
        </div>
      </section>

      {/* Today's 800 Jump Core Missions */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              오늘의 800점 도약 15분 트레이닝
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            620점 취약 영역을 집중 공략하는 매일 미션
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mission 1 */}
          <div 
            onClick={() => onNavigate("part5")}
            className="group cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                  <Zap className="w-3.5 h-3.5" /> Part 5 속도전
                </span>
                <span className="text-xs text-slate-400 font-medium">소요 5분</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                분사구문 & 접속부사 20초 컷
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                800점 변별력 문항을 20초 이내에 푸는 실전 타임어택 훈련
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>{progress.solvedPart5 > 0 ? `정답률 ${part5Accuracy}%` : "10분 컷 시작하기"}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mission 2 */}
          <div 
            onClick={() => onNavigate("lc2")}
            className="group cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                  <Headphones className="w-3.5 h-3.5" /> LC Part 2
                </span>
                <span className="text-xs text-slate-400 font-medium">소요 5분</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                우회적·반문형 답변 집중 소거
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                질문에 직답하지 않는 고난도 영국·호주 발음 킬러 문제 격파
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>{progress.solvedLC > 0 ? `정답률 ${lcAccuracy}%` : "소거 훈련 시작"}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mission 3 */}
          <div 
            onClick={() => onNavigate("vocab")}
            className="group cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                  <BookOpen className="w-3.5 h-3.5" /> 패러프레이징
                </span>
                <span className="text-xs text-slate-400 font-medium">소요 5분</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                800 빈출 패러프레이징 짝꿍 암기
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                지문 표현 ↔ 선택지 정답 1:1 유의어 치환 족보 마스터
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>{progress.masteredVocabCount}개 완료</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 800 Strategy Golden Rules */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              620 → 800 점프 골든 룰 (Golden Rules)
            </h2>
          </div>
          <span className="text-xs text-slate-500">실전 시험장에서 점수를 만드는 4대 공식</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STRATEGY_800_RULES.map((rule, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {rule.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {rule.desc}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  전략 #{idx + 1}
                </span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {rule.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
