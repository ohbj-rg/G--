import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  PenSquare,
  Calculator,
  Building,
  X,
  UserX,
  AlertOctagon,
  User,
  Heart,
  MessageSquare,
  Flame,
  Volume2,
  VolumeX,
  Music,
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: (q: string) => void;
  onOpenCreatePost: () => void;
  onOpenVerifyModal: () => void;
  onOpenSalaryCalculator: () => void;
  onOpenBlockManagement?: () => void;
  onOpenAdminReports?: () => void;
  onOpenDirectMessages?: () => void;
  unreadMessagesCount?: number;
  activeMainView?: 'community' | 'dating';
  onChangeMainView?: (view: 'community' | 'dating') => void;
  blockedUsersCount?: number;
  pendingReportsCount?: number;
  isCherryBlossomActive?: boolean;
  onToggleCherryBlossoms?: () => void;
}

export default function Header({
  currentUser,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenCreatePost,
  onOpenVerifyModal,
  onOpenSalaryCalculator,
  onOpenBlockManagement,
  onOpenAdminReports,
  onOpenDirectMessages,
  unreadMessagesCount = 0,
  activeMainView = 'community',
  onChangeMainView,
  blockedUsersCount = 0,
  pendingReportsCount = 0,
  isCherryBlossomActive = true,
  onToggleCherryBlossoms,
}: HeaderProps) {
  const [bgmState, setBgmState] = useState<{ isPlaying: boolean; isMuted: boolean; volume: number }>({
    isPlaying: false,
    isMuted: false,
    volume: 60,
  });

  useEffect(() => {
    const handleBgmUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean; isMuted: boolean; volume: number }>;
      if (customEvent.detail) {
        setBgmState(customEvent.detail);
      }
    };
    window.addEventListener('gblind:bgm-state-changed', handleBgmUpdate);
    return () => {
      window.removeEventListener('gblind:bgm-state-changed', handleBgmUpdate);
    };
  }, []);

  const handleToggleBgm = () => {
    window.dispatchEvent(new CustomEvent('gblind:toggle-bgm'));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all">
      <div className="max-w-[1400px] 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Main Navigation Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 shrink-0">
          <div
            onClick={() => onChangeMainView?.('community')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 group-hover:bg-blue-600 transition-colors text-white flex items-center justify-center shadow-xs shrink-0">
              <span className="font-black text-base sm:text-lg tracking-tighter text-blue-400 group-hover:text-white">G</span>
              <span className="font-extrabold text-xs sm:text-sm text-white">B</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-black text-slate-900 text-sm sm:text-lg tracking-tight">공무원 블라인드</span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-blue-600 text-white rounded-md tracking-wider hidden xs:inline">
                  G-BLIND
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden md:inline">
                대한민국 공직자 안심 익명 소통망
              </span>
            </div>
          </div>

          {/* Primary View Switcher Tabs: 익명 커뮤니티 vs 공무원 소개팅 */}
          {onChangeMainView && (
            <div className="flex items-center gap-0.5 p-1 bg-slate-100/90 rounded-xl text-xs font-black">
              <button
                type="button"
                id="btn-nav-community"
                onClick={() => onChangeMainView('community')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMainView === 'community'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>게시판</span>
              </button>
              <button
                type="button"
                id="btn-nav-dating"
                onClick={() => onChangeMainView('dating')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer relative group ${
                  activeMainView === 'dating'
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 text-white shadow-xs font-bold'
                    : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50/90'
                }`}
              >
                <span className="text-base leading-none select-none inline-block transition-transform group-hover:rotate-12 group-hover:scale-125">
                  🌸
                </span>
                <span className="font-extrabold tracking-tight">공무원 소개팅</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-black flex items-center gap-0.5 tracking-tight ${
                    activeMainView === 'dating'
                      ? 'bg-white/25 text-white backdrop-blur-xs'
                      : 'bg-pink-100 text-pink-700 border border-pink-200'
                  }`}
                >
                  <span className="text-[10px] leading-none">🌸</span>
                  <span>벚꽃 NEW</span>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Center: Search Bar (Desktop / Tablet only) */}
        <div className="hidden md:block flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2">
          <form onSubmit={handleFormSubmit} className="relative">
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
              title="검색 실행"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              id="input-global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="고민, 민원, 부처, 수당, 소개팅 검색..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100/90 hover:bg-slate-200/60 focus:bg-white text-xs text-slate-900 rounded-xl border border-transparent focus:border-blue-500 focus:outline-hidden transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  if (onSearchSubmit) onSearchSubmit('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="검색어 지우기"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Right: Quick Tools, Direct Messages & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* BGM SOUND ON/OFF TOGGLE BUTTON */}
          <button
            id="btn-header-bgm-toggle"
            type="button"
            onClick={handleToggleBgm}
            className={`p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              bgmState.isPlaying && !bgmState.isMuted
                ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs'
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={
              bgmState.isPlaying && !bgmState.isMuted
                ? '유튜브 힐링 BGM 끄기 (소리 OFF)'
                : '유튜브 힐링 BGM 켜기 (소리 ON)'
            }
          >
            {bgmState.isPlaying && !bgmState.isMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="hidden xl:inline text-blue-700 font-bold">BGM ON</span>
                {/* Visualizer micro-animation */}
                <span className="flex items-end gap-0.5 h-3 ml-0.5">
                  <span className="w-0.5 h-3 bg-blue-600 rounded-full animate-bounce" />
                  <span className="w-0.5 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:150ms]" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden xl:inline text-slate-500 font-medium">BGM OFF</span>
              </>
            )}
          </button>

          {/* CHERRY BLOSSOM PETALS TOGGLE BUTTON */}
          {onToggleCherryBlossoms && (
            <button
              id="btn-header-blossom-toggle"
              type="button"
              onClick={onToggleCherryBlossoms}
              className={`p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isCherryBlossomActive
                  ? 'bg-pink-50 border-pink-300 text-pink-700 shadow-2xs hover:bg-pink-100'
                  : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={
                isCherryBlossomActive
                  ? '흩날리는 벚꽃 효과 끄기 (벚꽃 OFF)'
                  : '봄맞이 흩날리는 벚꽃 효과 켜기 (벚꽃 ON)'
              }
            >
              <span className={`text-sm leading-none select-none transition-transform ${isCherryBlossomActive ? 'animate-bounce' : 'opacity-60'}`}>
                🌸
              </span>
              <span className="hidden xl:inline font-bold">
                {isCherryBlossomActive ? '벚꽃 ON' : '벚꽃 OFF'}
              </span>
            </button>
          )}

          {/* DIRECT MESSAGES (쪽지함) BUTTON */}
          {onOpenDirectMessages && (
            <button
              id="btn-header-messages"
              type="button"
              onClick={onOpenDirectMessages}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 border border-slate-200 transition-colors flex items-center gap-1.5"
              title="공직자 안심 쪽지함"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">쪽지함</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-extrabold animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          )}

          {/* Salary Calculator Button */}
          <button
            id="btn-open-salary"
            type="button"
            onClick={onOpenSalaryCalculator}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
            title="공무원 봉급·실수령액 계산기"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span className="hidden xl:inline">봉급 계산</span>
          </button>

          {/* Block Management Button */}
          {onOpenBlockManagement && (
            <button
              id="btn-header-block-mgmt"
              type="button"
              onClick={onOpenBlockManagement}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
              title="사용자 차단 목록 관리"
            >
              <UserX className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline">차단 목록</span>
              {blockedUsersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                  {blockedUsersCount}
                </span>
              )}
            </button>
          )}

          {/* Admin Reports Review Button */}
          {onOpenAdminReports && (
            <button
              id="btn-header-admin-reports"
              type="button"
              onClick={onOpenAdminReports}
              className="relative p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
              title="관리자 신고 검토 센터"
            >
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span className="hidden lg:inline">신고 센터</span>
              {pendingReportsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          )}

          {/* User Agency & Nickname Badge / Profile Button */}
          <button
            id="btn-open-verify"
            type="button"
            onClick={onOpenVerifyModal}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100/70 text-blue-900 transition-all flex items-center gap-1.5 text-xs font-semibold group"
            title="익명 닉네임 및 소속 기관 변경"
          >
            <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 text-left">
              <span className="truncate max-w-[80px] sm:max-w-[110px] font-bold">
                {currentUser.showAgency ? currentUser.agencyName : '공무원'}
              </span>
              <span className="text-blue-600 font-medium text-[11px] truncate max-w-[70px] sm:max-w-[90px]">
                · {currentUser.nickname}
              </span>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 hidden sm:inline" />
          </button>

          {/* Write Post Button */}
          <button
            id="btn-header-create-post"
            type="button"
            onClick={onOpenCreatePost}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <PenSquare className="w-4 h-4" />
            <span className="hidden sm:inline">글쓰기</span>
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="키워드, 기관, 수당, 직렬 검색..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100 text-xs text-slate-900 rounded-xl border border-transparent focus:border-blue-500 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
