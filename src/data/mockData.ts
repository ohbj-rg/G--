import { Agency, BoardCategory, Post, UserProfile, DatingProfile, DirectConversation } from '../types';

export const AGENCIES: Agency[] = [
  { id: 'moef', name: '기획재정부', category: 'central', shortName: '기재부', domain: 'moef.go.kr', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'mois', name: '행정안전부', category: 'central', shortName: '행안부', domain: 'mois.go.kr', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'nts', name: '국세청', category: 'central', shortName: '국세청', domain: 'nts.go.kr', badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: 'moel', name: '고용노동부', category: 'central', shortName: '노동부', domain: 'moel.go.kr', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'mohw', name: '보건복지부', category: 'central', shortName: '복지부', domain: 'mohw.go.kr', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'molit', name: '국토교통부', category: 'central', shortName: '국토부', domain: 'molit.go.kr', badgeColor: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 'moe', name: '교육부', category: 'central', shortName: '교육부', domain: 'moe.go.kr', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'mpm', name: '인사혁신처', category: 'central', shortName: '인사처', domain: 'mpm.go.kr', badgeColor: 'bg-violet-100 text-violet-800 border-violet-200' },
  { id: 'moj', name: '법무부', category: 'central', shortName: '법무부', domain: 'moj.go.kr', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'kpost', name: '우정사업본부', category: 'special', shortName: '우정본부', domain: 'koreapost.go.kr', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'seoul', name: '서울특별시청', category: 'local', shortName: '서울시', domain: 'seoul.go.kr', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 'gg', name: '경기도청', category: 'local', shortName: '경기도', domain: 'gg.go.kr', badgeColor: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'busan', name: '부산광역시청', category: 'local', shortName: '부산시', domain: 'busan.go.kr', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'sejong', name: '세종특별자치시청', category: 'local', shortName: '세종시', domain: 'sejong.go.kr', badgeColor: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'gangnam', name: '강남구청', category: 'local', shortName: '강남구', domain: 'gangnam.go.kr', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'suwon', name: '수원시청', category: 'local', shortName: '수원시', domain: 'suwon.go.kr', badgeColor: 'bg-lime-100 text-lime-800 border-lime-200' },
  { id: 'sen', name: '서울특별시교육청', category: 'education', shortName: '서울교행', domain: 'sen.go.kr', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'goe', name: '경기도교육청', category: 'education', shortName: '경기교행', domain: 'goe.go.kr', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'npa', name: '경찰청', category: 'police_fire', shortName: '경찰청', domain: 'police.go.kr', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'nfa', name: '소방청', category: 'police_fire', shortName: '소방청', domain: 'nfa.go.kr', badgeColor: 'bg-red-100 text-red-800 border-red-200' },
];

export const BOARD_CATEGORIES: BoardCategory[] = [
  // 1. 관심사별 (Topics)
  { id: 'all', name: '전체글', slug: 'all', description: '공무원 블라인드 전체 실시간 피드', icon: 'Globe', categoryType: 'topic' },
  { id: 'best', name: '실시간 베스트', slug: 'best', description: '많은 공감을 얻은 인기 게시글', icon: 'Flame', badge: 'HOT', categoryType: 'topic' },
  { id: 'salary', name: '처우·봉급·수당', slug: 'salary', description: '호봉, 정액급식비, 직급보조비, 성과급', icon: 'Coins', categoryType: 'topic' },
  { id: 'worklife', name: '워라밸·복무', slug: 'worklife', description: '유연근무, 육아휴직, 연가, 정시퇴근', icon: 'Clock', categoryType: 'topic' },
  { id: 'grievance', name: '업무 고충·민원', slug: 'grievance', description: '악성민원 대처, 감사, 당직, 결재 스트레스', icon: 'ShieldAlert', categoryType: 'topic' },
  { id: 'career', name: '인사고충·전보', slug: 'career', description: '일대일 전입교환, 승진 적체, 이직·면직', icon: 'TrendingUp', categoryType: 'topic' },
  { id: 'lounge', name: '공직자 라운지', slug: 'lounge', description: '소소한 일상, 부서 뒷이야기, 점심 메뉴', icon: 'Coffee', categoryType: 'topic' },
  { id: 'poll', name: '익명 투표', slug: 'poll', description: '공직 사회 현안 실시간 여론조사', icon: 'Vote', categoryType: 'topic' },
  { id: 'invest', name: '연금·재테크', slug: 'invest', description: '공무원연금 개혁, 내집마련, 퇴직준비', icon: 'PiggyBank', categoryType: 'topic' },

  // 2. 직렬별 (Series)
  { id: 'series_admin', name: '일반행정', slug: 'series-admin', description: '국가직·지방직 행정직렬 소통방', icon: 'FileSpreadsheet', categoryType: 'series' },
  { id: 'series_tech', name: '기술직 (토목·건축·전산)', slug: 'series-tech', description: '토목, 건축, 기계, 전산, 농업, 환경 등 기술직', icon: 'Cpu', categoryType: 'series' },
  { id: 'series_edu', name: '교육행정 (교행)', slug: 'series-edu', description: '각 시도 교육청 및 유·초·중·고 행정실', icon: 'GraduationCap', categoryType: 'series' },
  { id: 'series_uniform', name: '경찰·소방', slug: 'series-uniform', description: '현장 제복공무원, 교대근무, 위험수당', icon: 'Shield', categoryType: 'series' },
  { id: 'series_welfare', name: '사회복지·보건', slug: 'series-welfare', description: '맞춤형복지팀, 보건소, 간호직 고충', icon: 'HeartHandshake', categoryType: 'series' },
  { id: 'series_tax', name: '세무·관세', slug: 'series-tax', description: '국세청·관세청 세무조사 및 민원 소통', icon: 'Calculator', categoryType: 'series' },

  // 3. 부처별 (Ministries)
  { id: 'dept_moef', name: '기획재정부', slug: 'dept-moef', description: '예산실, 세제실, 재정사업 심의 소통', icon: 'Landmark', categoryType: 'ministry' },
  { id: 'dept_mois', name: '행정안전부', slug: 'dept-mois', description: '지방재정, 정부조직, 청사관리, 재난안전', icon: 'Building2', categoryType: 'ministry' },
  { id: 'dept_moe', name: '교육부', slug: 'dept-moe', description: '교육정책, 교원수급, 늘봄학교, 대학지원', icon: 'BookOpen', categoryType: 'ministry' },
  { id: 'dept_mohw', name: '보건복지부', slug: 'dept-mohw', description: '의료개혁, 기초연금, 아동수당, 건강보험', icon: 'Activity', categoryType: 'ministry' },
  { id: 'dept_moel', name: '고용노동부', slug: 'dept-moel', description: '근로감독관 고충, 실업급여, 중대재해', icon: 'Briefcase', categoryType: 'ministry' },
  { id: 'dept_molit', name: '국토교통부', slug: 'dept-molit', description: '주택정책, GTX 철도, 도로망, 인허가', icon: 'Truck', categoryType: 'ministry' },
  { id: 'dept_local', name: '지자체·주민센터', slug: 'dept-local', description: '시도청 본청, 시군구청, 동주민센터 현장', icon: 'Home', categoryType: 'ministry' },
];

export const HOT_KEYWORDS: string[] = [
  '정액급식비',
  '악성민원',
  '봉급표',
  '전출입교환',
  '유연근무',
  '초과근무수당',
  '성과상여금',
  '늘봄학교',
  '승진적체',
  '공무원연금',
];

export const INITIAL_USER: UserProfile = {
  id: 'user-default-1',
  nickname: '민원처리반7호봉',
  agencyId: 'seoul',
  agencyName: '서울특별시청',
  agencyCategory: 'local',
  isVerified: true,
  showAgency: true,
  emailPrefix: 'officer77',
  blockedUsers: [],
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    categoryId: 'salary',
    categoryName: '처우·봉급·수당',
    categoryType: 'topic',
    title: '공무원 기본급 및 정액급식비·직급보조비 인상안 어떻게 체감하시나요?',
    content: `올해 공무원 처우개선 관련해서 뉴스도 많이 나오고 각 공무원 노조에서도 요구안이 계속 나오고 있습니다.

실제로 현직분들이 느끼시기에 현재 물가상승률 대비 수당과 기본급 체감이 어떤지 궁금합니다.

특히 정액급식비(현재 14~15만원 선)는 한 끼 4,500원 꼴이라 주변 식당 김치찌개 하나도 못 사먹는 수준인데, 최소 22만원 이상 현실화가 시급하다고 봅니다.

주무관님들의 솔직한 생각과 각 기관의 분위기 투표 및 추천/비추천 부탁드립니다.`,
    authorNickname: '물가상승체감러',
    authorAgency: '기획재정부',
    authorAgencyCategory: 'central',
    showAgency: true,
    createdAt: '10분 전',
    views: 1420,
    likes: 184,
    dislikes: 6,
    commentsCount: 3,
    isHot: true,
    tags: ['봉급표', '정액급식비', '처우개선', '수당'],
    poll: {
      id: 'poll-1',
      question: '가장 시급하게 현실화되어야 할 공무원 수당 항목은?',
      options: [
        { id: 'opt-1', text: '정액급식비 현실화 (월 22만원 이상)', votes: 342 },
        { id: 'opt-2', text: '직급보조비 현실화 (하위직 집중 인상)', votes: 198 },
        { id: 'opt-3', text: '초과근무수당 단가 현실화 (근로기준법 연동)', votes: 275 },
        { id: 'opt-4', text: '기본급 자체 대폭 인상 (청년공무원 기준)', votes: 412 },
      ],
      totalVotes: 1227,
      userVotedOptionId: 'opt-1',
    },
    comments: [
      {
        id: 'c-1',
        authorNickname: '서울시7급',
        authorAgency: '서울특별시청',
        content: '기재부 현직분이 올려주시니 더 와닿네요 ㅠㅠ 정액급식비 진짜 식당 밥값 1만원 시대에 14만원은 너무 가혹합니다. 점심 한번 편하게 먹고 싶어요.',
        createdAt: '8분 전',
        likes: 29,
        dislikes: 1,
        replies: [
          {
            id: 'c-1-1',
            authorNickname: '물가상승체감러',
            authorAgency: '기획재정부',
            content: '저희도 예산 편성할 때 치열하게 다투지만 항상 국회나 재정당국 전체 조율에서 깎이는 게 참 마음 아픕니다. 현장 목소리 계속 전달하겠습니다.',
            createdAt: '5분 전',
            likes: 14,
            dislikes: 0,
            isPostAuthor: true,
          }
        ]
      },
      {
        id: 'c-2',
        authorNickname: '면직고민주무관',
        authorAgency: '경기도청',
        content: '신규 9급 기본급이 최저임금 간당간당하니 2030 이탈율이 역대급이죠. 제 동기도 지난달에 면직하고 공기업 갔습니다. 빠른 처우 정상화가 절실합니다.',
        createdAt: '4분 전',
        likes: 21,
        dislikes: 2,
        replies: []
      },
      {
        id: 'c-3',
        authorNickname: '교행4년차',
        authorAgency: '경기도교육청',
        content: '초과근무수당도 통상임금의 1.5배 주는 사기업과 달리 공무원은 시급 단가가 9급 기준 1만원 안팎이라 야근하면 현타옵니다.',
        createdAt: '2분 전',
        likes: 12,
        dislikes: 0,
        replies: []
      }
    ]
  },
  {
    id: 'post-2',
    categoryId: 'grievance',
    categoryName: '업무 고충·민원',
    categoryType: 'topic',
    title: '[공유] 악성 상습 민원인 통화 폭언 대처법 및 통화 녹음 고지 가이드',
    content: `지자체 주민센터 및 인허가 부서 주무관님들 고생 많으십니다.

최근 폭언과 상습 억지 민원으로 정신과 상담받는 동료들이 많아서, 제가 2년간 법무팀 및 감사부서와 조율하며 정리한 [민원처리에 관한 법률 제4조 공무원 보호조치 매뉴얼] 실전 팁 요약해드립니다.

1. 통화 시작 즉시: "본 통화는 민원 처리 및 담당자 보호를 위해 녹음됩니다" 자동 고지 활성화 필수.
2. 비하/욕설 시작 시 1차 경고: "선생님, 지금 말씀하신 언사는 폭언에 해당할 수 있으며 상담이 즉시 종료될 수 있습니다." (감정 섞지 말고 건조하게)
3. 지속 시 즉시 통화 종료: "경고에도 불구하고 폭언이 계속되어 통화를 종료합니다." 후 끊기. 이후 일지 작성.
4. 반복 내방 민원: 절대 혼자 응대하지 마시고 팀장님/부서장 동석 및 CCTV 녹화 구역으로 유도.

절대 혼자 삭히지 마시고 청사 내 안전요원 호출벨 누르세요. 우리 몸과 정신 건강이 1순위입니다.`,
    authorNickname: '민원방어전문가',
    authorAgency: '서울특별시청',
    authorAgencyCategory: 'local',
    showAgency: true,
    createdAt: '35분 전',
    views: 2890,
    likes: 312,
    dislikes: 3,
    commentsCount: 2,
    isHot: true,
    tags: ['악성민원', '민원응대', '공무원보호', '팁공유'],
    comments: [
      {
        id: 'c-201',
        authorNickname: '새내기동주민센터',
        authorAgency: '강남구청',
        content: '선배님 글 복사해서 모니터 옆에 붙여뒀습니다. 어제도 30분 동안 소리지르는 민원인 때문에 울었는데 큰 힘이 됩니다. 정말 감사합니다.',
        createdAt: '20분 전',
        likes: 38,
        dislikes: 0,
        replies: []
      },
      {
        id: 'c-202',
        authorNickname: '인허가담당자',
        authorAgency: '부산광역시청',
        content: '관리자(과장, 국장) 분들이 나서서 방어해주는 문화가 정착되어야 합니다. 담당자한테만 던져놓고 뒤로 빠지는 상사들 정말 반성해야 해요.',
        createdAt: '15분 전',
        likes: 27,
        dislikes: 1,
        replies: []
      }
    ]
  },
  {
    id: 'post-3',
    categoryId: 'worklife',
    categoryName: '워라밸·복무',
    categoryType: 'topic',
    title: '유연근무(시차출퇴근제 8 to 5) 눈치 안 보고 쓰는 부서 계신가요?',
    content: `저희 과는 팀장님이 9시 정각 출근에 6시 정각 퇴근을 엄격하게 고수하시는 스타일이라, 유연근무 쓰겠다고 올리면 "무슨 일 있냐", "부서에 상시 자리를 지켜야지" 하면서 결재를 미루십니다.

인사혁신처 공문에는 유연근무 적극 활성화하라고 내려왔는데, 실무 부서 체감은 아직 10년 전과 똑같네요.

다른 부처나 지자체는 8시 출근 5시 퇴근, 혹은 금요일 조기퇴근제 자유롭게 쓰고 계신가요?`,
    authorNickname: '칼퇴하고픈_주무관',
    authorAgency: '행정안전부',
    authorAgencyCategory: 'central',
    showAgency: true,
    createdAt: '50분 전',
    views: 920,
    likes: 98,
    dislikes: 4,
    commentsCount: 1,
    tags: ['유연근무', '시차출퇴근', '워라밸', '부서분위기'],
    comments: [
      {
        id: 'c-301',
        authorNickname: '세종라이프',
        authorAgency: '기획재정부',
        content: '세종 청사 쪽은 과바과이긴 하지만 주 1~2회 8-5 근무나 금요일 재택근무 거의 80% 이상 보장됩니다. 상사 마인드가 제일 중요해요.',
        createdAt: '30분 전',
        likes: 18,
        dislikes: 0,
        replies: []
      }
    ]
  },
  {
    id: 'post-4',
    categoryId: 'series_admin',
    categoryName: '일반행정',
    categoryType: 'series',
    title: '[일반행정] 국가직 일행 vs 지방직 일행 현실 고민 비교',
    content: `수험생들이나 타 직렬 분들이 가장 많이 묻는 게 국가직과 지방직 차이인데요.

국가직 3년, 지방직 4년 둘 다 겪어본 입장에서 솔직하게 정리해봅니다.

1. 업무 성격: 국가직은 정책 기획, 지침 하달, 통계 위주 / 지방직은 대민 집행, 인허가, 현장 점검, 행사 동원.
2. 민원 강도: 지방직 >>> 국가직 (지방직 주민센터 민원은 차원이 다름).
3. 순환 근무: 국가직은 세종/대전 또는 전국 권역 순환 / 지방직은 연고지 안착 가능.
4. 비상근무: 지방직은 여름 풍수해, 겨울 제설, 산불, 선거 동원 잦음.

일장일단이 명확하니 연고지 안정성을 원하면 지방직, 거시적 정책과 덜한 민원을 원하면 국가직 추천합니다.`,
    authorNickname: '행정양다리선배',
    authorAgency: '서울특별시청',
    authorAgencyCategory: 'local',
    showAgency: true,
    createdAt: '1시간 전',
    views: 1650,
    likes: 142,
    dislikes: 8,
    commentsCount: 1,
    tags: ['일반행정', '국가직지방직', '현직비교', '직렬고민'],
    comments: [
      {
        id: 'c-401',
        authorNickname: '공시합격자7호',
        authorAgency: '경기도청',
        content: '지방직 비상근무 주말에 불려나가는 게 진짜 큰 복병이었습니다 ㅠㅠ 그래도 연고지 통근 하나는 만족해요.',
        createdAt: '45분 전',
        likes: 15,
        dislikes: 0,
        replies: []
      }
    ]
  },
  {
    id: 'post-5',
    categoryId: 'series_tech',
    categoryName: '기술직 (토목·건축·전산)',
    categoryType: 'series',
    title: '[토목/건축] 공사 감독이랑 공공발주 예산 집행할 때 꿀팁 나눕니다',
    content: `기술직 주무관님들 연말 결산 및 공사 준공검사 시즌 다가오면 감리단이랑 시공사 사이에서 골치 아프시죠.

제가 공공발주 5년 차에 감사원 감사 무사통과했던 체크리스트 공유합니다:
1. 설계변경 사전 승인: 현장 실정보고서 날짜와 설계변경 심의회 의결일 철저히 일치시킬 것.
2. 자재 검수부: 관급자재 현장 반입 사진 및 시험성적서 원본 바인더 즉시 철해둘 것.
3. 안전관리비 집행: 영수증 품목이 현장 안전용품에 정확히 해당하는지 사진 대조.

서류 하나로 징계와 포상이 갈립니다. 모르는 건 바로 선배들에게 물어보세요!`,
    authorNickname: '토목현직감독관',
    authorAgency: '국토교통부',
    authorAgencyCategory: 'central',
    showAgency: true,
    createdAt: '2시간 전',
    views: 890,
    likes: 76,
    dislikes: 1,
    commentsCount: 0,
    tags: ['기술직', '토목직', '공사감독', '감사대비'],
    comments: []
  },
  {
    id: 'post-6',
    categoryId: 'dept_mohw',
    categoryName: '보건복지부',
    categoryType: 'ministry',
    title: '[복지부] 최근 복지사업 확대에 따른 담당자 인력 확충 건의 현황',
    content: `생계급여 기준 완화 및 의료급여 개편, 긴급복지 지원 기준 변경 등으로 일선 지자체와 복지부 내 사업부서 모두 업무량이 2배 이상 늘어난 상태입니다.

현장의 사회복지직 주무관님들이 번아웃 직전이라는 목소리를 매일 듣고 있습니다.

본부 차원에서도 기재부 행안부와 협의하여 일선 통합조사관리팀 및 찾아가는 복지전담팀 정원 증원을 지속 건의 중입니다.`,
    authorNickname: '복지정책지킴이',
    authorAgency: '보건복지부',
    authorAgencyCategory: 'central',
    showAgency: true,
    createdAt: '3시간 전',
    views: 1120,
    likes: 89,
    dislikes: 3,
    commentsCount: 1,
    tags: ['보건복지부', '사회복지직', '복지전달체계', '인력충원'],
    comments: [
      {
        id: 'c-601',
        authorNickname: '동주민센터복지사',
        authorAgency: '강남구청',
        content: '수급자 관리 인원이 1인당 200가구가 넘습니다. 본부에서 꼭 인력 증원 성사시켜주세요 ㅠㅠ',
        createdAt: '2시간 전',
        likes: 22,
        dislikes: 0,
        replies: []
      }
    ]
  },
  {
    id: 'post-7',
    categoryId: 'dept_moe',
    categoryName: '교육부',
    categoryType: 'ministry',
    title: '[교육부/교행] 늘봄학교 확대 및 방과후학교 행정 분무 갈등 어떻게 해결하고 계신가요?',
    content: `늘봄학교 전면 도입과 관련하여 교원과 교육행정직 간의 업무 분장으로 각 학교 현장에서 잡음이 끊이지 않고 있습니다.

교육청 늘봄지원센터 전담 인력 배치 속도보다 현장 시행 속도가 더 빨라서 중간에 낀 행정실 주무관들의 피로도가 극에 달했는데요.

모범적으로 역할 분담이 안착된 시도 교육청 사례가 있다면 공유 부탁드립니다.`,
    authorNickname: '학교행정실장',
    authorAgency: '경기도교육청',
    authorAgencyCategory: 'education',
    showAgency: true,
    createdAt: '4시간 전',
    views: 1350,
    likes: 104,
    dislikes: 5,
    commentsCount: 0,
    tags: ['교육부', '교육행정', '늘봄학교', '업무분장'],
    comments: []
  },
  {
    id: 'post-8',
    categoryId: 'career',
    categoryName: '인사고충·전보',
    categoryType: 'topic',
    title: '[일대일 교환] 국가직(세종청사 행정직 7급) ↔ 서울·경기 지자체 일대일 전입 희망자 찾습니다',
    content: `안녕하세요. 세종 정부청사 중앙부처 행정 7급(호봉 6호봉) 재직 중입니다.

개인적인 가정 사정(부모님 봉양 및 서울 본가 통근)으로 인해 서울시청 또는 경기 남부권(수원, 성남, 용인 등) 지자체 일대일 인사교류 희망하시는 분을 찾고 있습니다.

- 현 소속: 세종 중앙행정기관 (직렬: 일반행정 7급)
- 부서 분위기: 칼퇴 보장, 야근 거의 없음, 유연근무 100% 활성화
- 희망 기관: 서울시 본청/사업소 또는 서울 자치구, 경기 남부
- 협의: 전출입 동의 부서장님 구두 협의 완료

서로 윈윈할 수 있는 선생님 계시면 댓글 달아주시면 안전하게 연락 나누고 싶습니다.`,
    authorNickname: '서울귀향희망자',
    authorAgency: '행정안전부',
    authorAgencyCategory: 'central',
    showAgency: true,
    createdAt: '5시간 전',
    views: 950,
    likes: 42,
    dislikes: 1,
    commentsCount: 1,
    tags: ['일대일교류', '인사교류', '세종청사', '국가직지방직'],
    comments: [
      {
        id: 'c-801',
        authorNickname: '세종가고싶은7급',
        authorAgency: '서울특별시청',
        content: '선생님 저 서울 모 자치구 일행 7급인데 세종으로 이사 계획 중입니다! 부서 동의 여부 확인 후 조율 가능할까요?',
        createdAt: '4시간 전',
        likes: 8,
        dislikes: 0,
        replies: []
      }
    ]
  }
];

export const INITIAL_DATING_PROFILES: DatingProfile[] = [
  {
    id: 'dating-1',
    userNickname: '세종의봄',
    agencyName: '기획재정부',
    agencyCategory: 'central',
    jobSeries: '일반행정 7급',
    experienceYears: '5년차',
    birthYear: 1995,
    gender: 'female',
    region: 'sejong_chungcheong',
    regionLabel: '세종청사 / 대전',
    mbti: 'ENFJ',
    height: '166cm',
    smoking: '비흡연',
    hobbies: ['테니스', '브런치 맛집', '미술 전시회', '근교 드라이브'],
    weekendStyle: '토요일엔 운동하고 맛있는 저녁 먹고, 일요일엔 푹 쉬거나 예쁜 카페 가요',
    idealType: '대화 결이 맞고 서로의 직무 스트레스를 다정하게 보듬어줄 수 있는 따뜻한 분',
    introduction: '세종에서 자취 중인 7급 주무관입니다. 공직 문화나 고충을 잘 이해해 줄 수 있는 동료 공직자분을 만나고 싶어요 :)',
    verifiedBadge: true,
    avatarEmoji: '🌸',
    avatarBgColor: 'bg-rose-100 text-rose-700',
    likesCount: 28,
    createdAt: '1일 전',
    defaultContactInfo: {
      contactType: 'kakao',
      contactValue: 'spring_sejong_95',
      note: '카카오톡 오픈프로필로 연결됩니다',
    },
  },
  {
    id: 'dating-2',
    userNickname: '주말러너주무관',
    agencyName: '서울특별시청',
    agencyCategory: 'local',
    jobSeries: '일반행정 7급',
    experienceYears: '6년차',
    birthYear: 1993,
    gender: 'male',
    region: 'seoul',
    regionLabel: '서울 중구·마포',
    mbti: 'ESTJ',
    height: '181cm',
    smoking: '비흡연',
    hobbies: ['한강 러닝', '웨이트 트레이닝', '캠핑', '에스프레소 바'],
    weekendStyle: '아침 일찍 러닝이나 운동 후 오후에 서점이나 카페에서 여유 즐기기',
    idealType: '자기 관리 꾸준히 하고 긍정적인 가치관을 공유할 수 있는 밝은 분',
    introduction: '서울시청 본청 근무 중입니다. 퇴근 후와 주말의 소소한 일상을 함께 나누며 오래 알아갈 좋은 인연을 찾습니다.',
    verifiedBadge: true,
    avatarEmoji: '🏃‍♂️',
    avatarBgColor: 'bg-blue-100 text-blue-700',
    likesCount: 35,
    createdAt: '2일 전',
    defaultContactInfo: {
      contactType: 'kakao',
      contactValue: 'run_seoul_93',
      note: '카카오톡 ID로 연락주세요!',
    },
  },
  {
    id: 'dating-3',
    userNickname: '여의도칼퇴요정',
    agencyName: '교육부',
    agencyCategory: 'education',
    jobSeries: '교육행정 8급',
    experienceYears: '4년차',
    birthYear: 1996,
    gender: 'female',
    region: 'seoul',
    regionLabel: '서울 영등포·여의도',
    mbti: 'ISFP',
    height: '163cm',
    smoking: '비흡연',
    hobbies: ['홈베이킹', '필라테스', '뮤지컬 관람', '도서관 산책'],
    weekendStyle: '집에서 요리하거나 날씨 좋은 날엔 한강공원 피크닉',
    idealType: '차분하고 다정다감하며 사소한 배려를 소중히 여기는 분',
    introduction: '학교 행정실에서 근무 중인 교행직입니다. 방학 기간 워라밸이 좋아 여유 있는 편이에요. 편안한 티타임부터 시작해요!',
    verifiedBadge: true,
    avatarEmoji: '🧁',
    avatarBgColor: 'bg-amber-100 text-amber-700',
    likesCount: 42,
    createdAt: '3일 전',
    defaultContactInfo: {
      contactType: 'kakao',
      contactValue: 'fairy_edu_96',
      note: '매칭 성공 시 카카오톡으로 대화해요',
    },
  },
  {
    id: 'dating-4',
    userNickname: '세종밤하늘',
    agencyName: '행정안전부',
    agencyCategory: 'central',
    jobSeries: '일반행정 7급',
    experienceYears: '4년차',
    birthYear: 1994,
    gender: 'male',
    region: 'sejong_chungcheong',
    regionLabel: '세종 정부청사',
    mbti: 'INTP',
    height: '177cm',
    smoking: '비흡연',
    hobbies: ['금강 자전거 라이딩', 'LP 음반 감상', '국내 소도시 여행', '요리'],
    weekendStyle: '근교 한적한 드라이브 코스 찾아가기, 잔잔한 음악 듣기',
    idealType: '서로의 개인 시간과 취향을 존중하면서도 깊은 대화를 나눌 수 있는 분',
    introduction: '세종 청사에서 행정 업무를 맡고 있습니다. 세종이나 대전, 충청권 근무하시는 분과 천천히 알아가고 싶습니다.',
    verifiedBadge: true,
    avatarEmoji: '🚲',
    avatarBgColor: 'bg-teal-100 text-teal-700',
    likesCount: 19,
    createdAt: '3일 전',
    defaultContactInfo: {
      contactType: 'openchat',
      contactValue: 'open.kakao.com/o/sSejongNight',
      note: '카카오톡 오픈채팅방 링크',
    },
  },
  {
    id: 'dating-5',
    userNickname: '달콤한복지사',
    agencyName: '경기도청',
    agencyCategory: 'local',
    jobSeries: '사회복지직 8급',
    experienceYears: '3년차',
    birthYear: 1997,
    gender: 'female',
    region: 'gyeonggi',
    regionLabel: '경기 수원·광교',
    mbti: 'INFJ',
    height: '165cm',
    smoking: '비흡연',
    hobbies: ['반려견 산책', '보드게임', '수채화 그리기', '식물 가꾸기'],
    weekendStyle: '호수공원 산책, 아기자기한 동네 카페 투어',
    idealType: '마음이 따뜻하고 사려 깊은 분, 동물 좋아하시는 분이면 더 좋아요',
    introduction: '주민복지 현장에서 일하고 있는 8급 주무관입니다. 서로의 힘든 하루를 웃으며 털어놓을 수 있는 짝을 찾습니다!',
    verifiedBadge: true,
    avatarEmoji: '🌿',
    avatarBgColor: 'bg-emerald-100 text-emerald-700',
    likesCount: 31,
    createdAt: '4일 전',
    defaultContactInfo: {
      contactType: 'kakao',
      contactValue: 'sweet_welfare_97',
      note: '카카오톡 연락처입니다',
    },
  },
  {
    id: 'dating-6',
    userNickname: '불꽃안전관',
    agencyName: '소방청',
    agencyCategory: 'police_fire',
    jobSeries: '소방위 (간부출신)',
    experienceYears: '5년차',
    birthYear: 1992,
    gender: 'male',
    region: 'sejong_chungcheong',
    regionLabel: '세종 본청 / 대전',
    mbti: 'ENFP',
    height: '183cm',
    smoking: '비흡연',
    hobbies: ['클라이밍', '수영', '캠핑', '목공 DIY'],
    weekendStyle: '자연 속에서 캠핑하거나 활기찬 아웃도어 액티비티',
    idealType: '웃음 코드가 잘 맞고 유쾌하며 진솔한 소통을 좋아하는 분',
    introduction: '소방청 기획부서에서 근무하고 있습니다. 든든하고 신뢰할 수 있는 짝꿍이 되어드리겠습니다!',
    verifiedBadge: true,
    avatarEmoji: '🚒',
    avatarBgColor: 'bg-red-100 text-red-700',
    likesCount: 46,
    createdAt: '5일 전',
    defaultContactInfo: {
      contactType: 'kakao',
      contactValue: 'fire_safe_92',
      note: '카카오톡 ID입니다',
    },
  },
];

export const INITIAL_CONVERSATIONS: DirectConversation[] = [
  {
    id: 'conv-1',
    partnerNickname: '세종의봄',
    partnerAgency: '기획재정부',
    partnerAgencyCategory: 'central',
    datingProfileId: 'dating-1',
    lastMessage: 'ㅎㅎ 대화 나눠보니 결이 참 잘 맞으시는 것 같아요. 실례가 안 된다면 최종 매칭 신청 보내드렸는데 괜찮으시면 수락 부탁드려요!',
    lastMessageTime: '10분 전',
    unreadCount: 1,
    matchingStatus: 'requested_by_partner',
    matchingRequestedAt: '10분 전',
    partnerContactInfo: {
      contactType: 'kakao',
      contactValue: 'spring_sejong_95',
      note: '매칭 수락 시 즉시 확인 가능합니다',
    },
    messages: [
      {
        id: 'm-101',
        conversationId: 'conv-1',
        senderNickname: '세종의봄',
        senderAgency: '기획재정부',
        receiverNickname: '민원처리반7호봉',
        content: '안녕하세요! 소개팅 프로필 보고 가치관과 취미가 잘 맞을 것 같아 쪽지 드렸습니다 :)',
        createdAt: '어제 오후 8:15',
        isRead: true,
      },
      {
        id: 'm-102',
        conversationId: 'conv-1',
        senderNickname: '민원처리반7호봉',
        senderAgency: '행정안전부',
        receiverNickname: '세종의봄',
        content: '안녕하세요 세종의봄 선생님! 반갑습니다. 저도 프로필 보았는데 같은 중앙부처 근무자라 반가웠어요.',
        createdAt: '어제 오후 8:40',
        isRead: true,
      },
      {
        id: 'm-103',
        conversationId: 'conv-1',
        senderNickname: '세종의봄',
        senderAgency: '기획재정부',
        receiverNickname: '민원처리반7호봉',
        content: '기재부 예산 시즌이라 정신없었는데, 따뜻한 답장 덕분에 힐링되네요! 주말에 세종이나 대전 쪽 자주 가시나요?',
        createdAt: '어제 오후 9:02',
        isRead: true,
      },
      {
        id: 'm-104',
        conversationId: 'conv-1',
        senderNickname: '민원처리반7호봉',
        senderAgency: '행정안전부',
        receiverNickname: '세종의봄',
        content: '네! 금강변이나 호수공원 근처 카페 자주 가요. 요즘 날씨가 좋아서 산책하기 딱 좋더라구요 ㅎㅎ',
        createdAt: '어제 오후 9:25',
        isRead: true,
      },
      {
        id: 'm-105',
        conversationId: 'conv-1',
        senderNickname: '세종의봄',
        senderAgency: '기획재정부',
        receiverNickname: '민원처리반7호봉',
        content: 'ㅎㅎ 대화 나눠보니 결이 참 잘 맞으시는 것 같아요. 실례가 안 된다면 최종 매칭 신청 보내드렸는데 괜찮으시면 수락 부탁드려요!',
        createdAt: '10분 전',
        isRead: false,
      },
    ],
  },
  {
    id: 'conv-2',
    partnerNickname: '주말러너주무관',
    partnerAgency: '서울특별시청',
    partnerAgencyCategory: 'local',
    datingProfileId: 'dating-2',
    lastMessage: '선생님 상호 매칭 축하드려요! 카톡으로 연락드릴게요 :)',
    lastMessageTime: '1시간 전',
    unreadCount: 0,
    matchingStatus: 'matched',
    matchedAt: '1시간 전',
    myContactInfo: {
      contactType: 'kakao',
      contactValue: 'civic_hero_7',
      note: '편하실 때 카톡 주세요!',
    },
    partnerContactInfo: {
      contactType: 'kakao',
      contactValue: 'run_seoul_93',
      note: '카카오톡 ID입니다. 언제든 연락 환영합니다!',
    },
    messages: [
      {
        id: 'm-201',
        conversationId: 'conv-2',
        senderNickname: '주말러너주무관',
        senderAgency: '서울특별시청',
        receiverNickname: '민원처리반7호봉',
        content: '안녕하세요! 공직자 소개팅 보고 쪽지 보냅니다. 서울시청에서 근무 중이에요.',
        createdAt: '3일 전',
        isRead: true,
      },
      {
        id: 'm-202',
        conversationId: 'conv-2',
        senderNickname: '민원처리반7호봉',
        senderAgency: '행정안전부',
        receiverNickname: '주말러너주무관',
        content: '반갑습니다! 러닝 좋아하신다고 들었는데 저도 가벼운 조깅 즐겨해요.',
        createdAt: '2일 전',
        isRead: true,
      },
      {
        id: 'm-203',
        conversationId: 'conv-2',
        senderNickname: '주말러너주무관',
        senderAgency: '서울특별시청',
        receiverNickname: '민원처리반7호봉',
        content: '오 정말요? 나중에 기회 되면 커피 한 잔 하면서 이야기 더 나눠봐요!',
        createdAt: '어제',
        isRead: true,
      },
      {
        id: 'm-204',
        conversationId: 'conv-2',
        senderNickname: '주말러너주무관',
        senderAgency: '서울특별시청',
        receiverNickname: '민원처리반7호봉',
        content: '선생님 상호 매칭 축하드려요! 카톡으로 연락드릴게요 :)',
        createdAt: '1시간 전',
        isRead: true,
      },
    ],
  },
  {
    id: 'conv-3',
    partnerNickname: '여의도칼퇴요정',
    partnerAgency: '교육부',
    partnerAgencyCategory: 'education',
    datingProfileId: 'dating-3',
    lastMessage: '교행직 방학 일정이나 행정실 고충 공감해주셔서 감사해요!',
    lastMessageTime: '3시간 전',
    unreadCount: 0,
    matchingStatus: 'none',
    messages: [
      {
        id: 'm-301',
        conversationId: 'conv-3',
        senderNickname: '여의도칼퇴요정',
        senderAgency: '교육부',
        receiverNickname: '민원처리반7호봉',
        content: '안녕하세요! 늘봄학교 관련 게시글에서 댓글 보고 반가워서 쪽지 드렸어요.',
        createdAt: '어제',
        isRead: true,
      },
      {
        id: 'm-302',
        conversationId: 'conv-3',
        senderNickname: '민원처리반7호봉',
        senderAgency: '행정안전부',
        receiverNickname: '여의도칼퇴요정',
        content: '안녕하세요 여의도칼퇴요정님! 교행 현장 고충이 워낙 크다고 들어서 마음이 쓰였는데 소통해서 좋습니다.',
        createdAt: '5시간 전',
        isRead: true,
      },
      {
        id: 'm-303',
        conversationId: 'conv-3',
        senderNickname: '여의도칼퇴요정',
        senderAgency: '교육부',
        receiverNickname: '민원처리반7호봉',
        content: '교행직 방학 일정이나 행정실 고충 공감해주셔서 감사해요!',
        createdAt: '3시간 전',
        isRead: true,
      },
    ],
  },
];
