import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RotateCcw, 
  Lightbulb, 
  HelpCircle, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { ChatMessage } from "../types";

interface AICoachViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  initialPrompt?: string;
}

export const AICoachView: React.FC<AICoachViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  initialPrompt,
}) => {
  const [inputText, setInputText] = useState<string>(initialPrompt || "");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText("");
    onSendMessage(text);
  };

  const quickPrompts = [
    "현재 620점인데 800점까지 4주 집중 시간표 짜줘!",
    "Part 5 10분 컷(문제당 20초) 훈련 비법 알려줘",
    "Part 7 패러프레이징(동의어 치환) 빠르게 찾는 법",
    "LC Part 2 우회적·반문형 고난도 답변 소거 요령",
    "분사구문 vs 접속부사 800 킬러 문제 공략법",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[780px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
      {/* Coach Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                1:1 토익 620→800 도약 AI 코치 '토비 (Tobi)'
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              현재 620점 → 목표 800점 (LC 430 + RC 370) 타임어택 & 패러프레이징 전문 코칭
            </p>
          </div>
        </div>

        <button
          onClick={onClearChat}
          title="대화 초기화"
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg text-xs flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">대화 초기화</span>
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 sm:px-4 py-2.5 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> 추천 질문:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(prompt);
            }}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs touch-manipulation shrink-0 min-h-[34px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                반갑습니다! 토익 620 마스터 코치 토비입니다.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Part 5에서 헷갈리는 문법, 틀린 문제의 끊어읽기, LC 보기 소거 꿀팁 등
                토익 620점 달성에 필요한 모든 것을 편하게 물어보세요!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? "bg-slate-800 text-white"
                    : "bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-xs"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 shadow-xs"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-xs rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span>토비가 620점 맞춤 해설과 전략을 정리하고 있습니다...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          id="input-coach-chat"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="토익 620점 관련 질문이나 문장을 입력하세요... (예: 'although와 despite 차이점')"
          disabled={isLoading}
          className="flex-1 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 min-h-[44px]"
        />
        <button
          type="submit"
          id="btn-send-coach-msg"
          disabled={!inputText.trim() || isLoading}
          className="p-3 sm:p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition-all disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
