export type GrammarCategory = 
  | "전체"
  | "품사1초컷"
  | "분사구문"
  | "접속부사"
  | "수시태"
  | "전치사접속사"
  | "도치가정법"
  | "800킬러어휘";

export interface Part5Question {
  id: string;
  category: "품사1초컷" | "분사구문" | "접속부사" | "수시태" | "전치사접속사" | "도치가정법" | "800킬러어휘" | string;
  question: string;
  translation: string;
  options: string[];
  answer: number; // 0, 1, 2, 3
  explanation: string;
  structure: string; // e.g. "[분사구문 Having completed...] [주어 the team] [동사 submitted]..."
  tip800: string; // 620 -> 800 점프 킬러 포인트
  keyVocab: { word: string; meaning: string }[];
  isBookmarked?: boolean;
}

export interface LCOption {
  label: "A" | "B" | "C";
  text: string;
  translation: string;
  isTrap?: boolean;
  trapReason?: string;
}

export interface LCPart2Question {
  id: string;
  questionType: string; // e.g. "우회적/간접 답변", "반문형 답변", "Where 의문문", "Why 의문문", "평서문"
  audioScript: string;
  koreanTranslation: string;
  options: LCOption[];
  answer: number; // 0 for A, 1 for B, 2 for C
  eliminationStrategy: string;
  tip800: string;
  accent?: "US" | "UK" | "AU";
}

export interface ParaphrasePair {
  id: string;
  passageWord: string; // 본문/스크립트 표현
  choiceWord: string; // 정답 선택지 표현
  meaning: string;
  category: "동의어 치환" | "상위어 치환" | "구문 변형";
  exampleEn: string;
  exampleKo: string;
}

export interface VocabItem {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech: "noun" | "verb" | "adj" | "adv" | "prep" | "phrase";
  collocation: string;
  paraphraseWith?: string; // 800점 핵심: 패러프레이징 짝꿍
  exampleEn: string;
  exampleKo: string;
  category: string;
  day?: number; // 1 ~ 30
  level?: "620도약" | "800필수" | "850+킬러";
  isMastered?: boolean;
  isBookmarked?: boolean;
}

export interface DiagnosticReport {
  currentEstimatedScore: string;
  targetScore: string;
  scoreGap: string; // "+180점 도약"
  recommendedSplit: {
    lcTarget: number; // 430
    rcTarget: number; // 370
  };
  topStrengths: string[];
  criticalWeaknesses: string[];
  fourWeekRoadmap: {
    week: string;
    focus: string;
    dailyTime: string;
  }[];
  coachEncouragement: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface StudyProgress {
  currentScore: number; // 620
  targetScore: number; // 800
  solvedPart5: number;
  correctPart5: number;
  solvedLC: number;
  correctLC: number;
  masteredVocabCount: number;
  studyDaysStreak: number;
  wrongPart5Ids: string[];
  wrongLCIds: string[];
  bookmarkedPart5Ids: string[];
  bookmarkedVocabIds: string[];
}
