// Korean Civil Servant Anonymous Nickname Generator

const PREFIXES = [
  '성실한',
  '칼퇴기원',
  '민원해결사',
  '문서기안',
  '예산심의',
  '야근요정',
  '당직사관',
  '커피수혈',
  '법령해석',
  '청렴결백',
  '원스톱',
  '인허가달인',
  '공직수호',
  '스마트행정',
  '지방자치',
  '서류검토',
  '기안의신',
  '열정가득',
  '소통전문',
  '안전제일',
  '규정준수',
  '칼퇴요정',
  '국고보조금',
  '감사대비',
];

const NOUNS = [
  '행정인',
  '민원처리반',
  '주무관',
  '기안자',
  '총무담당',
  '교육연구원',
  '소방교',
  '경위',
  '세무관',
  '감사관',
  '행정관',
  '사무관',
  '순경',
  '소방사',
  '서기보',
  '기록관',
  '시설담당',
];

const RANKS = [
  '1호봉',
  '2호봉',
  '3호봉',
  '4호봉',
  '5호봉',
  '6호봉',
  '7호봉',
  '8호봉',
  '9호봉',
  '10호봉',
  '12호봉',
  '15호봉',
];

// Classic quick templates as mentioned in prompt
const SPECIAL_TEMPLATES = [
  '행정인',
  '민원처리반7호봉',
  '예산편성관',
  '결재선탑승자',
  '동주민센터지킴이',
  '초과근무러',
  '감사받는주무관',
  '칼퇴희망7호봉',
];

/**
 * Check if a nickname is already taken by existing users, posts, or comments
 */
export function isNicknameTaken(nickname: string, existingNicknames: string[]): boolean {
  if (!nickname) return false;
  const target = nickname.trim().toLowerCase();
  return existingNicknames.some((n) => n.trim().toLowerCase() === target);
}

/**
 * Generates a unique anonymous nickname not present in existingNicknames
 */
export function generateUniqueNickname(existingNicknames: string[] = []): string {
  const existingSet = new Set(existingNicknames.map((n) => n.trim().toLowerCase()));

  // 1. Try a few times with pattern: Prefix + Noun (or Noun + Rank, or Special Template)
  for (let attempt = 0; attempt < 50; attempt++) {
    let candidate = '';
    const style = Math.random();

    if (style < 0.25) {
      // Special template + random rank or bare
      const base = SPECIAL_TEMPLATES[Math.floor(Math.random() * SPECIAL_TEMPLATES.length)];
      candidate = base;
    } else if (style < 0.6) {
      // Noun + Rank (e.g., "민원처리반7호봉", "행정인3호봉")
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
      candidate = `${noun}${rank}`;
    } else if (style < 0.85) {
      // Prefix + Noun (e.g., "칼퇴기원주무관", "문서기안행정인")
      const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      candidate = `${prefix}${noun}`;
    } else {
      // Prefix + Noun + Rank (e.g., "야근요정주무관5호봉")
      const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
      candidate = `${prefix}${noun}${rank}`;
    }

    if (!existingSet.has(candidate.toLowerCase())) {
      return candidate;
    }
  }

  // Fallback with random digits to guarantee uniqueness
  const baseNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${baseNoun}_${randomNum}`;
}
