/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { Part5View } from "./components/Part5View";
import { LCPart2View } from "./components/LCPart2View";
import { VocabView } from "./components/VocabView";
import { AICoachView } from "./components/AICoachView";
import { MistakesAndReportView } from "./components/MistakesAndReportView";
import { DiagnosticModal } from "./components/DiagnosticModal";
import { 
  INITIAL_PART5_QUESTIONS, 
  INITIAL_LC2_QUESTIONS, 
  INITIAL_VOCAB_LIST 
} from "./data/toeicData";
import { 
  Part5Question, 
  LCPart2Question, 
  VocabItem, 
  ChatMessage, 
  StudyProgress, 
  DiagnosticReport 
} from "./types";

const LOCAL_STORAGE_KEY = "toeic_620_agent_state_v1";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [part5Questions, setPart5Questions] = useState<Part5Question[]>(INITIAL_PART5_QUESTIONS);
  const [lcQuestions, setLcQuestions] = useState<LCPart2Question[]>(INITIAL_LC2_QUESTIONS);
  const [vocabList, setVocabList] = useState<VocabItem[]>(INITIAL_VOCAB_LIST);

  // Progress state
  const [progress, setProgress] = useState<StudyProgress>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
    return {
      solvedPart5: 0,
      correctPart5: 0,
      solvedLC: 0,
      correctLC: 0,
      masteredVocabCount: 0,
      studyDaysStreak: 1,
      wrongPart5Ids: [],
      wrongLCIds: [],
      bookmarkedPart5Ids: [],
      bookmarkedVocabIds: [],
    };
  });

  const [masteredVocabIds, setMasteredVocabIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("toeic_620_mastered_vocab");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coach chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "model",
      content: `반갑습니다! 현재 620점에서 **목표 800점 (+180점 도약)**을 함께 달성할 전담 코치 **토비(Tobi)**입니다. 🎯

현재 620점을 보유하고 계시다면 기본 뼈대와 필수 문법 기초는 이미 갖추어진 상태입니다. 800점 돌파를 위한 가장 빠르고 확실한 득점 밸런스는 **LC 430점 + RC 370점**입니다:
- **RC 전략 (Part 5 10분 컷)**: 문제당 20초 이내에 분사구문·접속부사를 해결하여 Part 7 삼중지문 55분 확보
- **LC 전략 (우회적 답변 소거)**: 직답이 아닌 '제3자 확인/되묻는 반문형' 정답 포착 및 유사발음 함정 소거
- **패러프레이징 짝꿍 체화**: 지문 단어가 보기에 그대로 있으면 80% 오답, 유의어로 바뀐 정답을 1초 만에 찾기

취약 파트나 시간 배분, 헷갈리는 킬러 문항 등 무엇이든 편하게 질문해 주세요!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [coachInputPrompt, setCoachInputPrompt] = useState<string>("");
  const [isCoachLoading, setIsCoachLoading] = useState<boolean>(false);

  // AI Generation states
  const [isGeneratingPart5, setIsGeneratingPart5] = useState<boolean>(false);
  const [isGeneratingLC, setIsGeneratingLC] = useState<boolean>(false);

  // Diagnostic states
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState<boolean>(false);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState<boolean>(false);

  // Save progress to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem("toeic_620_mastered_vocab", JSON.stringify(masteredVocabIds));
    } catch (e) {
      console.error("Failed to save vocab progress", e);
    }
  }, [masteredVocabIds]);

  // Answer Part 5 Question
  const handleAnswerPart5 = (questionId: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const newWrong = isCorrect
        ? prev.wrongPart5Ids.filter((id) => id !== questionId)
        : prev.wrongPart5Ids.includes(questionId)
        ? prev.wrongPart5Ids
        : [...prev.wrongPart5Ids, questionId];

      return {
        ...prev,
        solvedPart5: prev.solvedPart5 + 1,
        correctPart5: prev.correctPart5 + (isCorrect ? 1 : 0),
        wrongPart5Ids: newWrong,
      };
    });
  };

  // Answer LC Question
  const handleAnswerLC = (questionId: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const newWrong = isCorrect
        ? prev.wrongLCIds.filter((id) => id !== questionId)
        : prev.wrongLCIds.includes(questionId)
        ? prev.wrongLCIds
        : [...prev.wrongLCIds, questionId];

      return {
        ...prev,
        solvedLC: prev.solvedLC + 1,
        correctLC: prev.correctLC + (isCorrect ? 1 : 0),
        wrongLCIds: newWrong,
      };
    });
  };

  // Toggle Part 5 Bookmark
  const handleTogglePart5Bookmark = (questionId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedPart5Ids.includes(questionId);
      return {
        ...prev,
        bookmarkedPart5Ids: exists
          ? prev.bookmarkedPart5Ids.filter((id) => id !== questionId)
          : [...prev.bookmarkedPart5Ids, questionId],
      };
    });
  };

  // Toggle Vocab Bookmark
  const handleToggleVocabBookmark = (id: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedVocabIds.includes(id);
      return {
        ...prev,
        bookmarkedVocabIds: exists
          ? prev.bookmarkedVocabIds.filter((x) => x !== id)
          : [...prev.bookmarkedVocabIds, id],
      };
    });
  };

  // Toggle Vocab Mastered
  const handleToggleVocabMastered = (id: string) => {
    setMasteredVocabIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      setProgress((p) => ({
        ...p,
        masteredVocabCount: next.length,
      }));
      return next;
    });
  };

  // Remove wrong question from mistakes
  const handleRemoveWrongPart5 = (id: string) => {
    setProgress((prev) => ({
      ...prev,
      wrongPart5Ids: prev.wrongPart5Ids.filter((x) => x !== id),
    }));
  };

  const handleRemoveWrongLC = (id: string) => {
    setProgress((prev) => ({
      ...prev,
      wrongLCIds: prev.wrongLCIds.filter((x) => x !== id),
    }));
  };

  // Retest question from mistake notebook
  const handleRetestQuestion = (type: "part5" | "lc2", id: string) => {
    if (type === "part5") {
      setCurrentTab("part5");
    } else {
      setCurrentTab("lc2");
    }
  };

  // AI Chat message sender
  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: userText,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsCoachLoading(true);

    try {
      const res = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          currentContext: {
            progressMetrics: {
              solvedPart5: progress.solvedPart5,
              correctPart5: progress.correctPart5,
              solvedLC: progress.solvedLC,
              correctLC: progress.correctLC,
            },
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        const botMsg: ChatMessage = {
          id: "msg-" + (Date.now() + 1),
          role: "model",
          content: data.reply,
          timestamp: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || "코치 응답 수신 실패");
      }
    } catch (error: any) {
      console.error("Failed to send message to coach:", error);
      const errorMsg: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        role: "model",
        content: "죄송합니다, 코치 토비와 연결 중 일시적인 오류가 발생했습니다. 잠시 후 다시 질문해 주세요!",
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsCoachLoading(false);
    }
  };

  // Ask Coach about specific question from Part 5 or LC
  const handleAskCoachAboutPart5 = (question: Part5Question, userChoice: number) => {
    const prompt = `[Part 5 800점 도약 킬러 문제 질문]
문제: "${question.question}"
선택지: ${question.options.join(", ")}
정답: ${question.options[question.answer]}
내가 고른 보기: ${question.options[userChoice]}

코치님, 현재 620점인 제가 이 문제를 왜 틀렸고 어떻게 20초 이내에 풀어야 목표 800점에 도달할 수 있는지, 끊어읽기와 핵심 킬러 포인트를 설명해 주세요!`;

    setCoachInputPrompt(prompt);
    setCurrentTab("coach");
    handleSendMessage(prompt);
  };

  const handleAskCoachAboutLC = (question: LCPart2Question, userChoice: number) => {
    const prompt = `[LC Part 2 800점 고난도 우회적 답변 질문]
질문 음성: "${question.audioScript}"
보기: (A) ${question.options[0].text} / (B) ${question.options[1].text} / (C) ${question.options[2].text}
정답: (${question.options[question.answer].label})
내가 고른 보기: (${question.options[userChoice].label})

코치님, 이 문제에서 어떤 함정을 어떻게 소거하고 800점 고난도 우회적·반문형 답변을 어떻게 포착해야 하는지 설명해 주세요!`;

    setCoachInputPrompt(prompt);
    setCurrentTab("coach");
    handleSendMessage(prompt);
  };

  // Generate AI Part 5 questions dynamically
  const handleGenerateAIPart5 = async (category: string) => {
    setIsGeneratingPart5(true);
    try {
      const res = await fetch("/api/generate/part5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, count: 3 }),
      });
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setPart5Questions((prev) => [...data.questions, ...prev]);
      }
    } catch (e) {
      console.error("Part 5 generation failed", e);
    } finally {
      setIsGeneratingPart5(false);
    }
  };

  // Generate AI LC Part 2 questions dynamically
  const handleGenerateAILC = async (trapType?: string) => {
    setIsGeneratingLC(true);
    try {
      const res = await fetch("/api/generate/lc2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trapType }),
      });
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setLcQuestions((prev) => [...data.questions, ...prev]);
      }
    } catch (e) {
      console.error("LC generation failed", e);
    } finally {
      setIsGeneratingLC(false);
    }
  };

  // Run AI Diagnostic
  const handleRunDiagnostic = async (testResults?: any) => {
    setIsRunningDiagnostic(true);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: testResults || {
            solvedPart5: progress.solvedPart5,
            correctPart5: progress.correctPart5,
            solvedLC: progress.solvedLC,
            correctLC: progress.correctLC,
          },
          answers: {
            wrongPart5Count: progress.wrongPart5Ids.length,
            wrongLCCount: progress.wrongLCIds.length,
          },
        }),
      });

      const data = await res.json();
      if (data.report) {
        setDiagnosticReport(data.report);
      }
    } catch (e) {
      console.error("Diagnostic error", e);
    } finally {
      setIsRunningDiagnostic(false);
      setIsDiagnosticModalOpen(false);
      setCurrentTab("mistakes");
    }
  };

  // Filtered lists for mistakes
  const wrongPart5Questions = part5Questions.filter((q) =>
    progress.wrongPart5Ids.includes(q.id)
  );
  const wrongLCQuestions = lcQuestions.filter((q) =>
    progress.wrongLCIds.includes(q.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header with Navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        progress={progress}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === "dashboard" && (
          <DashboardView
            progress={progress}
            onNavigate={(tab, ctx) => {
              if (ctx?.prompt) {
                setCoachInputPrompt(ctx.prompt);
                handleSendMessage(ctx.prompt);
              }
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onStartDiagnostic={() => setIsDiagnosticModalOpen(true)}
          />
        )}

        {currentTab === "part5" && (
          <Part5View
            questions={part5Questions}
            bookmarkedIds={progress.bookmarkedPart5Ids}
            wrongQuestionIds={progress.wrongPart5Ids}
            onAnswerQuestion={handleAnswerPart5}
            onToggleBookmark={handleTogglePart5Bookmark}
            onAskCoachAboutQuestion={handleAskCoachAboutPart5}
            onGenerateAIQuestions={handleGenerateAIPart5}
            isGeneratingAI={isGeneratingPart5}
          />
        )}

        {currentTab === "lc2" && (
          <LCPart2View
            questions={lcQuestions}
            wrongLCIds={progress.wrongLCIds}
            onAnswerQuestion={handleAnswerLC}
            onAskCoachAboutQuestion={handleAskCoachAboutLC}
            onGenerateAILCQuestions={handleGenerateAILC}
            isGeneratingAI={isGeneratingLC}
          />
        )}

        {currentTab === "vocab" && (
          <VocabView
            vocabList={vocabList}
            bookmarkedIds={progress.bookmarkedVocabIds}
            masteredCount={progress.masteredVocabCount}
            onToggleBookmark={handleToggleVocabBookmark}
            onToggleMastered={handleToggleVocabMastered}
            masteredIds={masteredVocabIds}
          />
        )}

        {currentTab === "coach" && (
          <AICoachView
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isCoachLoading}
            onClearChat={() =>
              setChatMessages([
                {
                  id: "welcome-reset",
                  role: "model",
                  content: "대화가 초기화되었습니다. 토익 620점과 관련해 무엇이든 물어보세요!",
                  timestamp: new Date().toISOString(),
                },
              ])
            }
            initialPrompt={coachInputPrompt}
          />
        )}

        {currentTab === "mistakes" && (
          <MistakesAndReportView
            wrongPart5Questions={wrongPart5Questions}
            wrongLCQuestions={wrongLCQuestions}
            onRemoveWrongPart5={handleRemoveWrongPart5}
            onRemoveWrongLC={handleRemoveWrongLC}
            onRetestQuestion={handleRetestQuestion}
            diagnosticReport={diagnosticReport}
            onRunDiagnostic={() => handleRunDiagnostic()}
            isRunningDiagnostic={isRunningDiagnostic}
          />
        )}
      </main>

      {/* Mini Diagnostic Modal */}
      <DiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        part5Pool={part5Questions}
        lcPool={lcQuestions}
        onCompleteDiagnostic={async (results) => {
          await handleRunDiagnostic(results);
        }}
        isLoadingReport={isRunningDiagnostic}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>TOEIC 620 Study Agent</strong> — LC 340 + RC 280 맞춤형 인공지능 토익 학습 솔루션
          </p>
          <div className="flex items-center gap-4">
            <span>Powered by Google Gemini 3.8 Flash</span>
            <span>•</span>
            <span>1초 컷 품사 공식 & LC 소거법 탑재</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
