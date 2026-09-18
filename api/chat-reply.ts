import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      partnerNickname,
      partnerAgency,
      jobSeries,
      region,
      birthYear,
      hobbies,
      mbti,
      isDating,
      conversationHistory,
      userMessage,
      hasImage,
      imageName,
    } = req.body || {};

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({ reply: null, reason: 'NO_API_KEY' });
    }

    const systemInstruction = `당신은 대한민국 공직자 안심 커뮤니티 'G-BLIND(공무원 블라인드)'에서 활동 중인 실제 공직자이자 대화 상대인 '${partnerNickname}'(${partnerAgency}${jobSeries ? `, ${jobSeries}` : ''})입니다.
당신의 프로필 정보:
- 소속 기관/부처: ${partnerAgency}
- 직렬/직급: ${jobSeries || '행정 7급'}
- 지역: ${region || '세종/서울'}
- 출생년도: ${birthYear || 1995}년생
- MBTI: ${mbti || 'ENFJ'}
- 취미: ${Array.isArray(hobbies) ? hobbies.join(', ') : '산책, 맛집 탐방'}
- 대화 모드: ${isDating ? '공직자 안심 소개팅 1:1 대화' : '공직자 동료 간 1:1 쪽지'}

★ 절대 지켜야 할 규칙 (동문서답 엄격 금지):
1. 상대방이 물어본 질문이나 건넨 말에 대해 **절대로 동문서답(엉뚱한 딴소리, 회피성 매크로)을 하지 마십시오.**
2. 만약 상대방이 구체적인 질문(예: 점심/저녁 식사 메뉴, 퇴근 여부, 나이, 사는 곳, 출퇴근 시간, 업무 고충, 취미, 주말 계획, 공시 수험기간, 소개팅 소감 등)을 물었다면, 반드시 그 질문에 대해 당신의 프로필과 한국 공직자 현실에 기반하여 명확하고 구체적으로 1차 답변을 먼저 하세요.
3. ${hasImage ? `상대방이 쪽지와 함께 사진(파일명: ${imageName || '사진'})을 전송했습니다. 사진을 잘 확인했음을 언급하고, 사진에 대해 다정하고 자연스러운 소감이나 반응을 꼭 덧붙이세요.` : ''}
4. 상대방을 부를 때는 정중하고 다정한 '선생님' 호칭과 예의 바른 공직자 어조(~하셨나요?, ~해요/습니다)를 사용하세요.
5. 너무 길지 않게 1~3문장 내외의 자연스러운 실시간 모바일 메신저 스타일로 답장하세요.`;

    const historySummary = Array.isArray(conversationHistory)
      ? conversationHistory
          .slice(-5)
          .map((m: any) => `${m.isMe ? '상대방(사용자)' : partnerNickname}: ${m.content || '(사진 첨부)'}`)
          .join('\n')
      : '';

    const prompt = `[최근 대화 내역]\n${historySummary || '(첫 대화)'}\n\n[상대방의 새로운 쪽지]\n${userMessage || (hasImage ? '(사진을 전송했습니다)' : '')}\n\n위 쪽지에 대해 동문서답하지 말고, 당신('${partnerNickname}')으로서 질문에 직접 대답하고 자연스럽게 답장해주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text?.trim();
    if (!replyText) {
      return res.status(200).json({ reply: null, reason: 'EMPTY_RESPONSE' });
    }

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error('Error in Vercel /api/chat-reply:', error);
    return res.status(200).json({ reply: null, error: String(error) });
  }
}
