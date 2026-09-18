export type AgencyCategory = 'all' | 'central' | 'local' | 'education' | 'police_fire' | 'special';

export interface Agency {
  id: string;
  name: string;
  category: AgencyCategory;
  shortName: string;
  domain: string;
  badgeColor?: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  agencyId: string;
  agencyName: string;
  agencyCategory: AgencyCategory;
  isVerified: boolean;
  showAgency: boolean;
  emailPrefix?: string;
  blockedUsers: string[]; // List of blocked user nicknames
}

export type BoardCategoryType = 'topic' | 'series' | 'ministry';

export interface BoardCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  badge?: string;
  categoryType: BoardCategoryType; // 'topic' (관심사별), 'series' (직렬별), 'ministry' (부처별)
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface CommentReply {
  id: string;
  authorNickname: string;
  authorAgency: string;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isPostAuthor?: boolean;
}

export interface Comment {
  id: string;
  authorNickname: string;
  authorAgency: string;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isPostAuthor?: boolean;
  replies: CommentReply[];
}

export interface Post {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryType?: BoardCategoryType;
  title: string;
  content: string;
  authorNickname: string;
  authorAgency: string;
  authorAgencyCategory: AgencyCategory;
  showAgency: boolean;
  createdAt: string;
  views: number;
  likes: number;
  dislikes: number;
  commentsCount: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isBookmarked?: boolean;
  poll?: Poll;
  tags: string[];
  comments: Comment[];
  isHot?: boolean;
  badge?: string;
  isBlockedByAdmin?: boolean;
}

export type SortOrder = 'latest' | 'popular' | 'comments';

export type ReportTargetType = 'post' | 'comment' | 'user';

export interface ReportItem {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetTitleOrExcerpt: string;
  targetAuthor: string;
  reason: string;
  details?: string;
  reportedAt: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  actionNote?: string;
}

// ----------------------------------------------------
// 쪽지 & 매칭 (Direct Messaging & Mutual Matching)
// ----------------------------------------------------
export type MatchingStatus = 'none' | 'requested_by_me' | 'requested_by_partner' | 'matched' | 'declined';

export interface ContactExchangeInfo {
  contactType: 'kakao' | 'phone' | 'openchat';
  contactValue: string;
  note?: string;
}

export interface DirectMessage {
  id: string;
  conversationId?: string;
  senderNickname: string;
  senderAgency: string;
  receiverNickname?: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  isMe?: boolean;
  isSystemEvent?: boolean;
  imageUrl?: string;
  imageName?: string;
}

export interface DirectConversation {
  id: string;
  partnerNickname: string;
  partnerAgency: string;
  partnerAgencyCategory?: AgencyCategory;
  partnerAvatarEmoji?: string;
  partnerAvatarBgColor?: string;
  datingProfileId?: string;
  lastMessage: string;
  lastMessageTime?: string;
  updatedAt?: string;
  unreadCount: number;
  matchingStatus: MatchingStatus;
  matchingRequestedAt?: string;
  matchedAt?: string;
  myContactInfo?: ContactExchangeInfo;
  partnerContactInfo?: ContactExchangeInfo;
  messages: DirectMessage[];
  isPartnerBlocked?: boolean;
}

// ----------------------------------------------------
// 공무원 소개팅 (Civil Servant Blind Dating)
// ----------------------------------------------------
export type DatingGender = 'female' | 'male';
export type DatingRegion = 'all' | 'seoul' | 'gyeonggi' | 'sejong_chungcheong' | 'yeongnam' | 'honam' | 'gangwon_jeju';

export interface DatingProfile {
  id: string;
  userNickname: string;
  agencyName: string;
  agencyCategory: AgencyCategory;
  jobSeries: string; // e.g. '일반행정 7급', '교육행정 8급', '기재부 사무관 5급', '소방교'
  experienceYears: string; // e.g. '3년차', '5년차'
  birthYear: number; // e.g. 1995
  gender: DatingGender;
  region: DatingRegion;
  regionLabel: string; // e.g. '세종시/대전', '서울 여의도·강남', '경기 남부'
  mbti: string;
  height?: string;
  smoking: '비흡연' | '흡연';
  hobbies: string[];
  weekendStyle: string;
  idealType: string;
  introduction: string;
  verifiedBadge: boolean;
  avatarEmoji: string;
  avatarBgColor: string;
  likesCount: number;
  isLikedByMe?: boolean;
  createdAt: string;
  isMyProfile?: boolean;
  defaultContactInfo?: ContactExchangeInfo;
}
