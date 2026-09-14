import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "toeic-620-study-agent" });
});

// AI Coach Chat
app.post("/api/coach/chat", async (req, res) => {
  try {
    const { messages, currentContext } = req.body;
    const ai = getAi();

    const systemInstruction = `당신은 현재 토익 620점 수험생을 800점대로 초단기 도약시키는 대한민국 최고의 1:1 토익 맞춤형 AI 코치 '토비(Tobi)'입니다.

[토익 620점 수험생의 현실적 상태 & 800점 도약 핵심 공식]
- 현재 점수: 620점 (기초 품사, 기본 단어는 알고 있으나 정체기)
- 목표 점수: 800점 (+180점 점프 달성!)
- 800점 황금 달성 전략: **LC 430점 이상 (84개+) + RC 370점 이상 (75개+)**
- 620점대의 4대 병목 현상과 해결책:
  1. [RC 시간 부족 극복]: 620점대는 Part 5에서 18~20분을 소비해 Part 7 삼중지문 15~20문제를 찍습니다. Part 5 30문제를 **10분~11분 컷(문제당 평균 20초)**으로 풀어 Part 7에 55분 이상을 확보해야 800점이 나옵니다!
  2. [패러프레이징(Paraphrasing) 훈련]: 800점 시험의 정답은 지문 단어가 그대로 나오는 것이 아니라 유의어(renovate -> refurbish, submit -> hand in)로 100% 치환됩니다. 지문 단어가 그대로 나온 보기는 오답 함정임을 명심시킵니다.
  3. [800 킬러 문법 정복]: 분사구문(능동 ing vs 수동 p.p.), 접속부사(however, nevertheless, therefore) vs 부사절 접속사(although, because), 부정어 도치(Seldom, Only after), 복합명사/숙어 완벽 정복.
  4. [LC Part 2 우회적 답변 & Part 3/4 스키밍]: 질문에 직답하지 않고 튕겨내는 간접 응답("I haven't checked", "Ask Ms. Lee") 및 성우 음성이 나오기 전 질문 3개 키워드를 미리 읽는 스키밍 테크닉 지도.

[응답 가이드라인]
1. 620점에서 800점으로 점프하려는 학습자를 위해 명확하고 실전적인 솔루션을 제시합니다.
2. 문장 분석 요청 시: [주어] [동사] [목적어] (수식어 거품) 및 분사구문/접속부사의 문맥을 정확히 끊어읽기로 짚어줍니다.
3. 문제 해설 시: "620점대가 왜 이 오답에 낚였는지"와 "800점으로 가기 위한 20초 컷 핵심 단서"를 반드시 설명합니다.
4. 마지막은 항상 '800점 점프 꿀팁'을 1문장으로 요약해 제시합니다.
${currentContext ? `\n[현재 학습 컨텍스트]\n${JSON.stringify(currentContext)}` : ""}`;

    const formattedContents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Coach error:", error);
    res.status(500).json({
      error: "AI 코치 응답 생성 중 오류가 발생했습니다.",
      details: error?.message || String(error),
    });
  }
});

// Generate dynamic Part 5 questions for 620 -> 800 jump
app.post("/api/generate/part5", async (req, res) => {
  try {
    const { category, count = 3 } = req.body;
    const ai = getAi();

    const prompt = `토익 620점에서 800점으로 도약하기 위한 고난도 Part 5 실전 연습 문제 ${count}문제를 JSON 배열 형식으로 생성해주세요.
주제: ${category || "분사구문 또는 접속부사 또는 도치/가정법 또는 800킬러어휘"}

각 문제는 다음 JSON 스키마를 만족해야 합니다:
[
  {
    "id": "gen_p5_1",
    "category": "분사구문" | "접속부사" | "도치가정법" | "800킬러어휘" | "품사1초컷" | "수시태",
    "question": "영어 문장 (빈칸은 _______ 표시)",
    "translation": "한국어 번역",
    "options": ["(A) 단어1", "(B) 단어2", "(C) 단어3", "(D) 단어4"],
    "answer": 0, // 0 for A, 1 for B, 2 for C, 3 for D
    "explanation": "800점 목표 수험생을 위한 상세한 풀이 및 오답 분석 (한국어)",
    "structure": "[주어] ... [동사] ...",
    "tip800": "620->800 점프를 위한 20초 컷 핵심 단서 및 풀이 비법",
    "keyVocab": [{"word": "단어", "meaning": "뜻"}]
  }
]
반드시 유효한 JSON 형식(코드 블록 마크다운 없이 순수 JSON)으로만 응답하세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ questions: parsed });
  } catch (error: any) {
    console.error("Part 5 Gen error:", error);
    res.status(500).json({ error: "문제 생성 중 오류가 발생했습니다." });
  }
});

// Generate dynamic LC Part 2 questions for 800 level
app.post("/api/generate/lc2", async (req, res) => {
  try {
    const { trapType } = req.body;
    const ai = getAi();

    const prompt = `토익 620->800점 점프를 위한 LC Part 2 고난도 오답 소거법 연습 문제 3문제를 JSON 배열로 생성해주세요.
${trapType ? `집중 훈련 함정 유형: ${trapType}` : "간접/우회적 답변, 반문형(되묻기) 답변, 제3의 답변, 평서문 응답"}

JSON 스키마:
[
  {
    "id": "gen_lc2_1",
    "questionType": "우회적/간접 답변" | "반문형 답변" | "평서문" | "제안/요청",
    "audioScript": "Question spoken text",
    "koreanTranslation": "질문 한국어 번역",
    "options": [
      { "label": "A", "text": "Option A spoken text", "translation": "A 번역", "isTrap": true, "trapReason": "유사발음 함정" },
      { "label": "B", "text": "Option B spoken text", "translation": "B 번역", "isTrap": false, "trapReason": "" },
      { "label": "C", "text": "Option C spoken text", "translation": "C 번역", "isTrap": true, "trapReason": "의문사 의문문에 Yes/No 답변 불가" }
    ],
    "answer": 1, // 0 for A, 1 for B, 2 for C
    "eliminationStrategy": "800점 달성을 위한 소거법 전략 설명 (한국어)",
    "tip800": "800점 수험생이 반드시 챙겨야 할 우회적 답변 패턴"
  }
]
반드시 유효한 JSON 형식으로만 응답하세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ questions: parsed });
  } catch (error: any) {
    console.error("LC Part 2 Gen error:", error);
    res.status(500).json({ error: "LC 문제 생성 중 오류가 발생했습니다." });
  }
});

// AI Diagnostic analysis for 620 -> 800 jump
app.post("/api/diagnose", async (req, res) => {
  try {
    const { results, answers } = req.body;
    const ai = getAi();

    const prompt = `사용자는 현재 토익 620점이며, 목표 점수는 800점(+180점 점프)입니다. 다음 테스트 및 학습 결과를 분석하여 800점 도약 맞춤 처방전을 JSON 형식으로 작성해주세요.
테스트 결과: ${JSON.stringify(results)}
오답 분석: ${JSON.stringify(answers)}

JSON 스키마:
{
  "currentEstimatedScore": "620점",
  "targetScore": "800점",
  "scoreGap": "+180점 도약",
  "recommendedSplit": { "lcTarget": 430, "rcTarget": 370 },
  "topStrengths": ["기본 문장 품사 파악력", "간단한 의문사 응답 인지"],
  "criticalWeaknesses": ["Part 5 18분 이상 지체(시간 부족)", "분사구문 및 접속부사 킬러 문법 오답", "LC 우회적 답변 대처 취약", "패러프레이징 인식 부족"],
  "fourWeekRoadmap": [
    { "week": "1주차", "focus": "Part 5 10분 컷 타임어택 (문제당 20초) & LC Part 2 우회적/반문 답변 소거", "dailyTime": "60분" },
    { "week": "2주차", "focus": "800 킬러 문법(분사구문, 접속부사 vs 접속사) & Part 3/4 문제 키워드 스키밍", "dailyTime": "60분" },
    { "week": "3주차", "focus": "800 필수 패러프레이징 100쌍 암기 & Part 7 단일/이중 지문 근거 찾기 속도전", "dailyTime": "75분" },
    { "week": "4주차", "focus": "LC 430 + RC 370 실전 모의고사 2회분 & Part 5 10분 컷 실전 세팅", "dailyTime": "90분" }
  ],
  "coachEncouragement": "현재 620점은 뼈대가 잡힌 점수이므로, Part 5 속도를 줄이고 패러프레이징과 우회적 답변만 잡으면 4주 안에 800점 돌파가 충분히 가능합니다!"
}
순수 JSON으로만 응답하세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ report: parsed });
  } catch (error: any) {
    console.error("Diagnose error:", error);
    res.status(500).json({ error: "진단 보고서 생성 중 오류가 발생했습니다." });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
