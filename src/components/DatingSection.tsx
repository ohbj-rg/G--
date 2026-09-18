import { useState, useMemo } from 'react';
import {
  Heart,
  Send,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  UserPlus,
  MapPin,
  Calendar,
  Briefcase,
  SlidersHorizontal,
  ChevronRight,
  Smile,
  AlertOctagon,
  UserX,
  MessageSquare,
  Building,
} from 'lucide-react';
import { DatingProfile, DatingGender, DatingRegion, UserProfile } from '../types';

interface DatingSectionProps {
  currentUser: UserProfile;
  datingProfiles: DatingProfile[];
  myDatingProfile: DatingProfile | null;
  onOpenEditProfile: () => void;
  onOpenDirectMessages: (partnerNickname?: string, partnerAgency?: string, starterMessage?: string) => void;
  onToggleLikeProfile: (profileId: string) => void;
  onOpenReportModal?: (targetAuthor: string) => void;
  onBlockUser?: (nickname: string) => void;
  unreadMessagesCount: number;
  globalSearchQuery?: string;
  onClearGlobalSearch?: () => void;
  onSwitchToCommunity?: () => void;
  communityMatchCount?: number;
}

export default function DatingSection({
  currentUser,
  datingProfiles,
  myDatingProfile,
  onOpenEditProfile,
  onOpenDirectMessages,
  onToggleLikeProfile,
  onOpenReportModal,
  onBlockUser,
  unreadMessagesCount,
  globalSearchQuery = '',
  onClearGlobalSearch,
  onSwitchToCommunity,
  communityMatchCount = 0,
}: DatingSectionProps) {
  const [selectedGender, setSelectedGender] = useState<'all' | DatingGender>('all');
  const [selectedRegion, setSelectedRegion] = useState<DatingRegion>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'popular' | 'age'>('popular');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const effectiveSearch = (globalSearchQuery || searchKeyword).trim();

  // Filter profiles based on current controls
  const filteredProfiles = useMemo(() => {
    return datingProfiles
      .filter((p) => {
        // Exclude blocked users
        if (currentUser.blockedUsers?.includes(p.userNickname)) return false;

        // Gender filter
        if (selectedGender !== 'all' && p.gender !== selectedGender) return false;

        // Region filter
        if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;

        // Search keyword filter
        if (effectiveSearch) {
          const q = effectiveSearch.toLowerCase();
          const matchNick = p.userNickname.toLowerCase().includes(q);
          const matchAgency = p.agencyName.toLowerCase().includes(q);
          const matchSeries = p.jobSeries.toLowerCase().includes(q);
          const matchRegion = p.regionLabel.toLowerCase().includes(q);
          const matchMbti = p.mbti.toLowerCase().includes(q);
          const matchIntro = p.introduction.toLowerCase().includes(q);
          const matchHobbies = p.hobbies.some((h) => h.toLowerCase().includes(q));
          const matchIdeal = p.idealType.toLowerCase().includes(q);
          if (!matchNick && !matchAgency && !matchSeries && !matchRegion && !matchMbti && !matchIntro && !matchHobbies && !matchIdeal) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'popular') return b.likesCount - a.likesCount;
        if (sortOrder === 'age') return b.birthYear - a.birthYear; // younger first
        return 0; // latest
      });
  }, [datingProfiles, currentUser.blockedUsers, selectedGender, selectedRegion, sortOrder, effectiveSearch]);

  const handleStartChatWithProfile = (profile: DatingProfile) => {
    const starterMessage = `안녕하세요 ${profile.userNickname} 선생님! 소개팅 프로필 보고 가치관과 취미가 잘 맞을 것 같아 쪽지 드립니다 :)`;
    onOpenDirectMessages(profile.userNickname, profile.agencyName, starterMessage);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Banner with Safety Guarantee and Cherry Blossom Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-indigo-700 text-white p-6 sm:p-8 shadow-md">
        {/* Cherry blossom background decorations */}
        <div className="pointer-events-none absolute -right-8 -top-8 text-7xl sm:text-8xl opacity-20 select-none">🌸</div>
        <div className="pointer-events-none absolute right-1/4 -bottom-6 text-6xl opacity-15 select-none">🌸</div>
        <div className="pointer-events-none absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-pink-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-rose-400/25 blur-xl" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-white shadow-2xs">
              <span className="text-sm">🌸</span>
              <span>2026 봄 벚꽃 시즌 특별 오픈</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-white shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-200" />
              <span>100% 공직 메일 인증 안심 블라인드</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            🌸 벚꽃 흩날리는 봄날,<br className="hidden sm:inline" />
            공직 생활을 함께 나눌 따뜻한 인연을 만나보세요
          </h1>

          <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
            중앙부처, 지자체, 교육행정, 경찰·소방 등 동일한 공직 가치관을 지닌 동료 공직자 간 안심 블라인드 매칭입니다.
            대화 중 <strong>상호 매칭에 동의한 경우에만</strong> 연락처가 안전하게 교환됩니다.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenEditProfile}
              className="px-5 py-2.5 bg-white text-rose-600 hover:bg-rose-50 active:scale-95 rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{myDatingProfile ? '내 소개팅 프로필 수정' : '내 소개팅 프로필 등록하기'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenDirectMessages()}
              className="px-4 py-2.5 bg-rose-700/80 hover:bg-rose-700 text-white rounded-xl text-xs font-bold border border-rose-300/40 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>내 쪽지 & 매칭함</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-rose-600 font-black text-[10px]">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Gender Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start">
            <button
              type="button"
              onClick={() => setSelectedGender('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedGender === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender('female')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedGender === 'female' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              여성 공직자
            </button>
            <button
              type="button"
              onClick={() => setSelectedGender('male')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedGender === 'male' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              남성 공직자
            </button>
          </div>

          {/* Search input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="부처, 직렬, MBTI, 취미(#테니스) 검색..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 focus:bg-white text-xs text-slate-900 rounded-xl border border-transparent focus:border-rose-400 focus:outline-hidden"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 self-end md:self-auto">
            <span className="text-[11px] font-bold text-slate-400">정렬:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-100 text-xs font-semibold text-slate-800 rounded-lg border-none focus:outline-hidden"
            >
              <option value="popular">인기순 (호감 많은 순)</option>
              <option value="latest">최신 등록순</option>
              <option value="age">나이순</option>
            </select>
          </div>
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            권역:
          </span>
          {[
            { id: 'all', label: '전체 지역' },
            { id: 'sejong_chungcheong', label: '세종·충청' },
            { id: 'seoul', label: '서울' },
            { id: 'gyeonggi', label: '경기·인천' },
            { id: 'yeongnam', label: '영남권' },
            { id: 'honam', label: '호남권' },
            { id: 'gangwon_jeju', label: '강원·제주' },
          ].map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => setSelectedRegion(reg.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRegion === reg.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current User's Profile Card Highlight */}
      {myDatingProfile && (
        <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl ${myDatingProfile.avatarBgColor} flex items-center justify-center text-2xl shrink-0 shadow-2xs`}
            >
              {myDatingProfile.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px]">
                  내 소개팅 프로필
                </span>
                <span className="font-bold text-sm text-slate-900">{myDatingProfile.userNickname}</span>
                <span className="text-xs text-slate-500">
                  {myDatingProfile.agencyName} · {myDatingProfile.jobSeries}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{myDatingProfile.introduction}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenEditProfile}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-2xs self-start sm:self-auto shrink-0"
          >
            프로필 수정
          </button>
        </div>
      )}

      {/* Search status banner if active */}
      {effectiveSearch && (
        <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                  '{effectiveSearch}' 소개팅 프로필 검색 결과
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold">
                  {filteredProfiles.length}명
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                닉네임, 부처, 직렬, 지역, MBTI, 취미, 이상형에서 검색되었습니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {communityMatchCount > 0 && onSwitchToCommunity && (
              <button
                type="button"
                onClick={onSwitchToCommunity}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-200 transition-colors flex items-center gap-1"
              >
                <span>게시글 결과 ({communityMatchCount}건) 보기</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchKeyword('');
                if (onClearGlobalSearch) onClearGlobalSearch();
              }}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
            >
              검색 초기화
            </button>
          </div>
        </div>
      )}

      {/* Dating Profiles Cards Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Smile className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
          <h3 className="text-sm font-bold text-slate-700">해당 조건에 맞는 공직자 프로필이 없습니다.</h3>
          <p className="text-xs text-slate-400">필터를 재설정하거나 첫 번째로 프로필을 등록해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfiles.map((profile) => {
            const isMe = profile.userNickname === currentUser.nickname;
            return (
              <div
                key={profile.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-rose-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top Section */}
                <div className="p-5 space-y-3.5">
                  {/* Avatar + Agency Badge + Specs Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-13 h-13 rounded-2xl ${profile.avatarBgColor} flex items-center justify-center text-2xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                      >
                        {profile.avatarEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-900 text-sm">{profile.userNickname}</span>
                          {profile.verifiedBadge && (
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-sm bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold"
                              title="공무원 인증 완료"
                            >
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              인증
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-slate-700">{profile.agencyName}</span>
                          <span>·</span>
                          <span>{profile.jobSeries}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <span>{profile.birthYear}년생 ({2026 - profile.birthYear + 1}세)</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-slate-600">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {profile.regionLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Like button */}
                    <button
                      type="button"
                      onClick={() => onToggleLikeProfile(profile.id)}
                      className={`p-2 rounded-xl border transition-all flex flex-col items-center gap-0.5 shrink-0 ${
                        profile.isLikedByMe
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50'
                      }`}
                      title="호감 표시하기"
                    >
                      <Heart
                        className={`w-4 h-4 ${profile.isLikedByMe ? 'fill-rose-500 text-rose-500' : ''}`}
                      />
                      <span className="text-[10px] font-bold">{profile.likesCount}</span>
                    </button>
                  </div>

                  {/* Spec Chips (MBTI, Height, Smoking, Experience) */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[11px]">
                      MBTI {profile.mbti}
                    </span>
                    {profile.height && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {profile.height}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                      {profile.smoking}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium text-[11px]">
                      {profile.experienceYears}
                    </span>
                  </div>

                  {/* Self Introduction Quote */}
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed italic border border-slate-100">
                    "{profile.introduction}"
                  </div>

                  {/* Ideal Type and Weekend Style */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-600 shrink-0 text-[11px]">이상형:</span>
                      <span className="text-slate-600 line-clamp-2">{profile.idealType}</span>
                    </div>
                    {profile.weekendStyle && (
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-indigo-600 shrink-0 text-[11px]">주말엔:</span>
                        <span className="text-slate-600 line-clamp-1">{profile.weekendStyle}</span>
                      </div>
                    )}
                  </div>

                  {/* Hobbies tags */}
                  <div className="flex flex-wrap gap-1">
                    {profile.hobbies.map((hobby) => (
                      <span
                        key={hobby}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        #{hobby}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>{profile.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onOpenReportModal && !isMe && (
                      <button
                        type="button"
                        onClick={() => onOpenReportModal(profile.userNickname)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                        title="프로필 신고"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isMe ? (
                      <button
                        type="button"
                        onClick={onOpenEditProfile}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-300 transition-colors"
                      >
                        내 프로필 수정
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartChatWithProfile(profile)}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>쪽지 보내기</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
