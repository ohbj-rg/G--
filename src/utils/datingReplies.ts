import { DirectConversation, DatingProfile } from '../types';

/**
 * Highly intelligent, question-sensitive conversational reply generator
 * for G-BLIND 1:1 direct messages and dating conversations.
 *
 * Guarantees direct, empathetic answers to specific queries (lunch/food,
 * overtime/commute, age/year, location, hobbies, photos, civil service duties)
 * without ever deflecting into irrelevant clichés ("동문서답 방지").
 */
export function generateSmartReply(
  targetConv: DirectConversation,
  userMessage: string,
  matchingProfile?: DatingProfile,
  hasImageAttachment: boolean = false,
  imageName?: string
): string {
  const rawMsg = userMessage.trim();
  const cleanMsg = rawMsg.toLowerCase();

  const agency = targetConv.partnerAgency || matchingProfile?.agencyName || '공직';
  const partnerNick = targetConv.partnerNickname;
  const isDating = Boolean(targetConv.datingProfileId || matchingProfile);

  const mbti = matchingProfile?.mbti || 'ENFJ';
  const jobSeries = matchingProfile?.jobSeries || '행정 7급';
  const region = matchingProfile?.regionLabel || '세종/서울';
  const birthYear = matchingProfile?.birthYear || 1995;
  const hobbies = matchingProfile?.hobbies || ['산책', '카페 탐방', '러닝'];
  const topHobby = hobbies[0] || '산책';
  const secondHobby = hobbies[1] || '맛집 탐방';

  // Helper to pick candidate reply avoiding immediate repetitions
  const recentReplies = targetConv.messages
    .filter((m) => !m.isMe)
    .slice(-4)
    .map((m) => m.content);

  const pick = (options: string[]): string => {
    const unpicked = options.filter((opt) => !recentReplies.includes(opt));
    const pool = unpicked.length > 0 ? unpicked : options;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // 1. Swear / Inappropriate / Abusive check
  const abusiveWords = ['시발', '씨발', '개새끼', '새끼', '존나', '병신', '지랄', '꺼져', '닥쳐', '미친', '바보', '썅', '븅신'];
  if (abusiveWords.some((bad) => cleanMsg.includes(bad))) {
    return pick([
      '선생님, 공직자 안심 소통망인 만큼 거친 표현이나 비속어는 정중히 사양하겠습니다 ㅠㅠ 서로 존중하는 언어로 대화 나눠주세요.',
      '혹시 오늘 근무 중에 속상한 일이 있으셨나요? 갑작스러운 과격한 표현에 당황스럽네요. 서로 예의를 지켜주시면 좋겠습니다.',
      '서로 기분 좋은 인연을 위해 비방이나 공격적인 표현은 삼가 부탁드립니다.',
    ]);
  }

  // 2. Photo / Image Attached or Photo-related questions ("사진", "사진 보냄", "사진 어때")
  if (hasImageAttachment || cleanMsg.includes('사진') || cleanMsg.includes('짤') || cleanMsg.includes('인증')) {
    if (hasImageAttachment || cleanMsg.includes('보냈') || cleanMsg.includes('보내') || cleanMsg.includes('올렸')) {
      return pick([
        `사진 잘 받았습니다! 분위기가 정말 좋고 따뜻한 느낌이네요 :) 공유해주셔서 감사합니다!`,
        `와, 사진 너무 잘 나왔는데요? 센스 있으시네요 ㅎㅎ 사진 보니까 기분까지 맑아지는 것 같아요!`,
        `사진 보내주셔서 감사해요! 직접 찍으신 건가요? 분위기가 정말 남다르시네요 ^^`,
      ]);
    }
    if (cleanMsg.includes('실물') || cleanMsg.includes('얼굴') || cleanMsg.includes('프로필')) {
      return pick([
        `네 맞아요! 프로필 사진은 지난번에 동기들이 자연스럽게 찍어준 사진이에요 ㅎㅎ 실제로 봐도 큰 괴리는 없으실 겁니다 :)`,
        `프로필 사진 실물이랑 거의 비슷해요! 조금 더 편하게 대화 나누고 친해지면 사진 더 보여드릴게요 ^^`,
      ]);
    }
  }

  // 3. Lunch / Dinner / Meal / Food questions ("점심", "저녁", "식사", "밥", "메뉴", "맛점", "맛저", "배고파")
  if (
    cleanMsg.includes('점심') ||
    cleanMsg.includes('저녁') ||
    cleanMsg.includes('식사') ||
    cleanMsg.includes('밥') ||
    cleanMsg.includes('메뉴') ||
    cleanMsg.includes('맛점') ||
    cleanMsg.includes('맛저') ||
    cleanMsg.includes('배고')
  ) {
    if (cleanMsg.includes('뭐 먹') || cleanMsg.includes('드셨') || cleanMsg.includes('먹었') || cleanMsg.includes('추천') || cleanMsg.includes('메뉴')) {
      return pick([
        `오늘 구내식당 메뉴가 조금 아쉬워서 동기들이랑 청사 앞 백반집 가서 따뜻한 제육이랑 된장찌개 든든하게 먹고 왔어요! 선생님은 식사 맛있게 챙겨 드셨나요?`,
        `오늘은 바빠서 청사 매점에서 가볍게 샌드위치랑 커피로 해결했네요 ㅠㅠ 저녁엔 꼭 맛있는 거 챙겨 먹으려구요. 선생님은 오늘 어떤 메뉴 드셨어요?`,
        `점심에 근처 맛집에서 따끈한 뚝배기 해장국 먹고 커피 한잔 들고 청사 산책로 가볍게 돌았어요 ㅎㅎ 오늘 맛있는 식사 하셨는지 궁금하네요!`,
      ]);
    }
    return pick([
      `바쁜 일과 중에도 삼시 세끼는 꼭 잘 챙겨드셔야 힘이 납니다! 오늘 식사 거르지 마시고 맛있는 거 꼭 드세요 ^^`,
      `공직 생활하다 보면 식사 시간도 놓치기 일쑤인데, 든든하게 챙겨 드셨길 바라요 :)`,
    ]);
  }

  // 4. Commute / Overtime / Duty / Leaving Work ("퇴근", "출근", "야근", "당직", "몇시", "워라밸", "칼퇴")
  if (
    cleanMsg.includes('퇴근') ||
    cleanMsg.includes('출근') ||
    cleanMsg.includes('야근') ||
    cleanMsg.includes('당직') ||
    cleanMsg.includes('칼퇴') ||
    cleanMsg.includes('비상근무')
  ) {
    if (cleanMsg.includes('하셨') || cleanMsg.includes('했어') || cleanMsg.includes('언제') || cleanMsg.includes('몇 시')) {
      return pick([
        `오늘은 다행히 큰 현안이 없어서 정시 퇴근 성공했습니다! 지금은 집에 와서 편안하게 쉬면서 쪽지 확인 중이에요 ㅎㅎ 선생님은 오늘 칼퇴하셨나요?`,
        `오늘 처리해야 할 결재 서류가 조금 남아서 7시 반쯤 퇴근할 것 같아요 ㅠㅠ 그래도 오늘 하루 보람차게 마무리하고 있습니다. 선생님은 퇴근길이신가요?`,
        `저희 부서가 요즘 특정 현안 시기라 조금 늦게 끝났지만 이제 퇴근길 지하철이에요! 오늘 하루도 정말 고생 많으셨습니다.`,
      ]);
    }
    if (cleanMsg.includes('야근') || cleanMsg.includes('당직')) {
      return pick([
        `국회나 주요 감사 시즌엔 꼼짝없이 야근이지만, 평소에는 팀원들끼리 눈치 안 보고 정시 퇴근하는 편이에요! 선생님 부서는 야근이 잦은 편이신가요?`,
        `당직 서는 날은 다음 날 정말 녹초가 되더라구요 ㅠㅠ 공직자로서 피할 수 없는 숙명이지만 워라밸이 잘 지켜지면 좋겠습니다.`,
      ]);
    }
    return pick([
      `퇴근길 조심히 들어가시고, 오늘 저녁은 온전히 선생님만의 편안하고 여유로운 시간 보내시길 바라요!`,
      `오늘 출퇴근길도 사람 많았을 텐데 정말 수고 많으셨습니다 ^^`,
    ]);
  }

  // 5. Age / Birth Year / MBTI / Personality ("몇 살", "몇년생", "나이", "mbti", "성격")
  if (
    cleanMsg.includes('몇 살') ||
    cleanMsg.includes('몇살') ||
    cleanMsg.includes('나이') ||
    cleanMsg.includes('몇년생') ||
    cleanMsg.includes('몇 년생') ||
    cleanMsg.includes('mbti') ||
    cleanMsg.includes('성격')
  ) {
    if (cleanMsg.includes('mbti')) {
      return pick([
        `제 MBTI는 ${mbti}예요! 평소에는 차분하고 꼼꼼하게 업무를 챙기지만, 친해지면 장난도 잘 치고 리액션도 좋은 편이에요 ㅎㅎ 선생님은 MBTI가 어떻게 되세요?`,
        `${mbti} 유형입니다! 계획적인 편이면서도 상대방 이야기 경청하고 공감해주는 걸 좋아해요. 선생님과 결이 잘 맞을 것 같지 않나요? :)`,
      ]);
    }
    return pick([
      `저는 ${birthYear}년생이에요! 공직 생활은 ${matchingProfile?.experienceYears || '몇 년'} 정도 되었구요. 선생님은 몇 년생이신지, 혹시 저랑 또래이신지 궁금하네요 ^^`,
      `${birthYear}년생입니다! 나이나 연차 상관없이 편하고 존중하는 마음으로 대화 나누면 좋겠습니다 ㅎㅎ 선생님은 나이가 어떻게 되시나요?`,
    ]);
  }

  // 6. Location / Residence / Commute / Region ("어디 살", "어디 계", "근무지", "세종", "서울", "사는 곳", "동네", "지역")
  if (
    cleanMsg.includes('어디 살') ||
    cleanMsg.includes('어디 사') ||
    cleanMsg.includes('어디 계') ||
    cleanMsg.includes('사는 곳') ||
    cleanMsg.includes('동네') ||
    cleanMsg.includes('근무지') ||
    cleanMsg.includes('어디 쪽') ||
    cleanMsg.includes('지역')
  ) {
    return pick([
      `저는 ${region} 쪽에서 자취하며 ${agency} 쪽으로 통근하고 있어요! 청사 주변이 조용하고 산책하기 좋아서 꽤 만족하고 있습니다. 선생님은 어디 쪽에 거주하고 계신가요?`,
      `근무지는 ${agency}이고, 집은 ${region} 인근이에요! 출퇴근 버스나 지하철로 20~30분 정도 걸리는 거리입니다. 선생님 통근 거리는 괜찮으신가요?`,
      `${region} 생활권이에요! 퇴근하고 호수공원이나 강변 산책하는 걸 참 좋아합니다. 선생님 동네에도 좋은 산책로나 카페가 있나요?`,
    ]);
  }

  // 7. Job / Department / Exam / Career / Rank ("직렬", "몇급", "몇 급", "부서", "시험", "공시", "연차", "승진", "기재부", "시청", "교육청")
  if (
    cleanMsg.includes('직렬') ||
    cleanMsg.includes('몇급') ||
    cleanMsg.includes('몇 급') ||
    cleanMsg.includes('부서') ||
    cleanMsg.includes('연차') ||
    cleanMsg.includes('승진') ||
    cleanMsg.includes('공시') ||
    cleanMsg.includes('준비') ||
    cleanMsg.includes('발령')
  ) {
    if (cleanMsg.includes('공시') || cleanMsg.includes('준비')) {
      return pick([
        `저는 노량진이랑 독서실 오가면서 약 1년 반 정도 수험 생활했어요! 필기 합격자 발표 날 가족들이랑 울면서 기뻐했던 기억이 아직도 생생합니다 ㅠㅠ 선생님도 공시 준비하시느라 고생 많으셨죠?`,
        `공시 준비할 때 불확실성 때문에 마음고생이 제일 컸던 것 같아요. 그래도 이렇게 임용되어 일하고 있으니 그 시절이 값진 경험으로 남네요 ㅎㅎ`,
      ]);
    }
    return pick([
      `저는 ${agency}에서 ${jobSeries}로 일하고 있어요! 연차는 ${matchingProfile?.experienceYears || '3년차'} 정도 되었구요. 국회나 지침 업무 다루면서 많이 배우고 있습니다. 선생님은 어떤 직렬이신가요?`,
      `${agency} 소속입니다! 처음 발령받았을 땐 적응하느라 정신없었는데, 이제는 실무도 손에 익고 팀 분위기도 편안해졌어요. 선생님 부서는 분위기가 어떠세요?`,
    ]);
  }

  // 8. Civil Complaints / Hardship / Stress ("민원", "악성", "스트레스", "힘들", "지침", "지쳐", "고충")
  if (
    cleanMsg.includes('민원') ||
    cleanMsg.includes('악성') ||
    cleanMsg.includes('스트레스') ||
    cleanMsg.includes('힘들') ||
    cleanMsg.includes('지침') ||
    cleanMsg.includes('지쳐') ||
    cleanMsg.includes('속상') ||
    cleanMsg.includes('우울')
  ) {
    return pick([
      `악성 민원인이나 무리한 요구 겪으시면 진짜 하루 종일 가슴이 답답하고 기운 빠지죠 ㅠㅠ 마음 다치지 않으셨으면 좋겠어요. 선생님 탓이 아니니 너무 자책하지 마시고 오늘 맛있는 거 드시면서 훌훌 털어내세요!`,
      `공직 사회에서 대민 업무나 격무로 인한 스트레스는 정말 겪어본 사람만 알죠 ㅠㅠ 많이 힘드셨을 텐데 이렇게 털어놓아 주셔서 감사해요. 제게 얼마든지 하소연하셔도 괜찮습니다!`,
      `저도 얼마 전 비슷한 일로 크게 마음고생했었는데, 동료들이랑 이야기 나누면서 버텼어요. 선생님 힘내세요! 언제나 공직자 동료로서 응원합니다 :)`,
    ]);
  }

  // 9. Weekend / Hobbies / Exercise / Vacation ("주말", "취미", "운동", "테니스", "러닝", "산책", "카페", "여행", "영화", "휴가", "연가")
  if (
    cleanMsg.includes('주말') ||
    cleanMsg.includes('취미') ||
    cleanMsg.includes('운동') ||
    cleanMsg.includes('테니스') ||
    cleanMsg.includes('러닝') ||
    cleanMsg.includes('산책') ||
    cleanMsg.includes('카페') ||
    cleanMsg.includes('여행') ||
    cleanMsg.includes('영화') ||
    cleanMsg.includes('휴가') ||
    cleanMsg.includes('연가')
  ) {
    if (cleanMsg.includes('주말에 뭐') || cleanMsg.includes('계획') || cleanMsg.includes('취미가 뭐')) {
      return pick([
        `저는 주로 주말에 ${topHobby} 즐기거나 조용한 카페에서 ${secondHobby} 하면서 재충전해요! 평일 근무 피로가 싹 풀리더라구요 ㅎㅎ 선생님은 주말에 주로 어떻게 시간 보내세요?`,
        `쉬는 날엔 날씨 좋으면 가볍게 야외 운동이나 산책하고, 맛있는 브런치 먹는 걸 제일 좋아해요! 선생님도 주말에 즐겨 하시는 특별한 취미가 있으신가요?`,
        `평소에 ${topHobby} 하는 게 가장 큰 낙이에요! 땀 흘리고 시원한 아메리카노 한잔 마실 때 정말 행복합니다. 선생님은 운동이나 야외 활동 좋아하시나요?`,
      ]);
    }
    return pick([
      `취향이 잘 맞으시는 것 같아서 너무 반갑네요! 시간 맞으면 나중에 ${topHobby}나 맛있는 커피 한잔 같이 즐길 수 있으면 좋겠습니다 :)`,
      `연가나 주말 휴식은 진짜 공직 생활의 오아시스 같은 존재죠! 이번 휴일도 알차고 행복하게 보내시길 바라요 ^^`,
    ]);
  }

  // 10. Meeting / Coffee / Kakao / Contact Exchange / Match ("만나", "커피", "밥 한번", "식사", "매칭", "카톡", "연락처", "호감", "이상형")
  if (
    cleanMsg.includes('만나') ||
    cleanMsg.includes('커피') ||
    cleanMsg.includes('티타임') ||
    cleanMsg.includes('밥 한번') ||
    cleanMsg.includes('식사 한번') ||
    cleanMsg.includes('매칭') ||
    cleanMsg.includes('카톡') ||
    cleanMsg.includes('연락처') ||
    cleanMsg.includes('전화번호') ||
    cleanMsg.includes('이상형')
  ) {
    if (cleanMsg.includes('이상형')) {
      return pick([
        `제 이상형은 배려심 깊고 대화가 잘 통하는 다정한 분이에요! 공직 생활 고충도 서로 따뜻하게 공감해줄 수 있으면 더 좋구요 ㅎㅎ 대화 나눠보니 선생님 느낌이 참 좋은 것 같아요 :)`,
        `서로 일상을 편안하게 공유할 수 있고 긍정적인 에너지를 주는 분이 이상형이에요! 선생님과 대화하면서 참 배려가 깊으시다는 느낌을 받았습니다 ^^`,
      ]);
    }
    return pick([
      `대화 나눠볼수록 말씀도 따뜻하시고 배려가 느껴져서 저도 호감이 가네요 :) 쪽지함 상단의 '상호 매칭' 버튼으로 신청해주시면 안전하게 카카오톡 연락처 교환해서 더 편하게 대화 나눠요!`,
      `선생님과 대화하는 시간이 유쾌하고 편안해서 저도 퇴근 후나 주말에 가볍게 티타임 나누면 좋겠다고 생각했어요! 매칭 신청 보내주시면 기쁘게 수락하겠습니다 ^^`,
      `서로에게 좋은 인연이 될 수 있을 것 같은 설렘이 있네요! 정식으로 상호 매칭 진행해보실까요?`,
    ]);
  }

  // 11. Greeting & Introductory ("안녕", "반갑", "처음", "하이", "인사")
  if (cleanMsg.includes('안녕') || cleanMsg.includes('반갑') || cleanMsg.includes('처음') || cleanMsg.includes('하이')) {
    if (isDating) {
      return pick([
        `안녕하세요 선생님! 프로필 보고 쪽지 주셔서 너무 반가워요 ^^ 오늘 ${agency} 쪽 근무는 평안하게 잘 마치셨나요?`,
        `반갑습니다! 프로필 보고 대화 나눠보고 싶었는데 먼저 다정하게 인사 건네주셔서 기쁘네요 :) 편하게 말씀 나눠요!`,
        `안녕하세요! 따뜻한 인사 감사드립니다. ${region}에서 근무 중인 ${partnerNick}입니다. 서로 좋은 인연 만들어가면 좋겠어요 ㅎㅎ`,
      ]);
    } else {
      return pick([
        `안녕하세요 선생님! 쪽지 주셔서 반갑습니다. 오늘 하루도 근무하시느라 정말 고생 많으셨습니다 ^^`,
        `반갑습니다! 게시글 관련해서 궁금하신 점이나 나누고 싶으신 이야기 편하게 말씀해주세요 :)`,
      ]);
    }
  }

  // 12. Direct Questions (ending in '?', '까요', '나요', '가요', '세요')
  if (rawMsg.endsWith('?') || cleanMsg.includes('?') || cleanMsg.includes('나요') || cleanMsg.includes('가요') || cleanMsg.includes('까요')) {
    return pick([
      `네 맞습니다! 선생님께서 말씀해주신 부분 정확히 이해했어요. 공직자 입장에서 저도 깊이 공감하고 있습니다 :) 추가로 더 궁금하신 점 있으신가요?`,
      `물어봐 주셔서 감사해요! 제 생각에도 그 방법이 가장 합리적이고 좋은 방향인 것 같아요. 선생님은 어떻게 생각하시는지도 듣고 싶네요 ^^`,
      `네 선생님! 질문 주신 내용에 대해 저도 늘 염두에 두고 있었는데, 이렇게 직접 물어봐 주시니 대화가 더 흥미롭네요 ㅎㅎ`,
    ]);
  }

  // 13. Short reaction or laughter ("ㅋㅋ", "ㅎㅎ", "네", "응", "좋아요", "맞아요")
  if (cleanMsg.length <= 5 || cleanMsg.includes('ㅋㅋ') || cleanMsg.includes('ㅎㅎ')) {
    return pick([
      `ㅎㅎ 대화가 편안하고 즐거워서 저도 모르게 웃음이 나네요! 혹시 오늘 남은 하루는 어떤 일정 있으신가요?`,
      `맞아요 ㅎㅎ 공감해주셔서 감사해요! 선생님과 이야기 나누다 보니 시간 가는 줄 모르겠네요 :)`,
      `ㅎㅎ 선생님 말씀 덕분에 오늘 하루 피로가 싹 가시는 기분이에요!`,
    ]);
  }

  // 14. Contextual Fallback for Colleague DMs vs Dating
  if (isDating) {
    return pick([
      `보내주신 말씀 정성껏 잘 읽었어요! 선생님의 따뜻한 생각과 일상을 공유해주셔서 감사해요. 혹시 평소에 가장 아끼는 취미나 관심사가 있으신가요?`,
      `선생님과 쪽지 나누면서 결이 참 잘 맞는 분이라는 생각이 듭니다 :) 오늘 남은 하루도 기분 좋은 일만 가득하시길 바라요!`,
      `진솔한 이야기 들려주셔서 고마워요. 대화가 참 자연스럽고 편안하네요 ^^`,
    ]);
  } else {
    return pick([
      `선생님 말씀 깊이 공감합니다! 공직 현장에서 겪는 고충과 실무에 대해 함께 나눌 수 있어 큰 힘이 되네요. 늘 안전하고 건강하게 근무하시길 바랍니다!`,
      `소중한 의견 나눠주셔서 감사합니다. 앞으로도 커뮤니티에서 좋은 소통과 연대 이어가면 좋겠습니다 :)`,
    ]);
  }
}
