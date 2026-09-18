import { useState } from 'react';
import {
  Globe,
  Flame,
  Coffee,
  Coins,
  ShieldAlert,
  TrendingUp,
  Building2,
  Vote,
  ShieldCheck,
  Clock,
  PiggyBank,
  FileSpreadsheet,
  Cpu,
  GraduationCap,
  Shield,
  HeartHandshake,
  Calculator,
  Landmark,
  BookOpen,
  Activity,
  Briefcase,
  Truck,
  Home,
  UserX,
  AlertOctagon,
  Layers,
  Heart,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { AgencyCategory, BoardCategory, BoardCategoryType } from '../types';
import { BOARD_CATEGORIES } from '../data/mockData';

interface SidebarProps {
  currentCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedAgencyCategory: AgencyCategory;
  onSelectAgencyCategory: (cat: AgencyCategory) => void;
  onOpenSalaryCalculator: () => void;
  onOpenBlockManagement?: () => void;
  onOpenAdminReports?: () => void;
  onOpenDirectMessages?: () => void;
  unreadMessagesCount?: number;
  activeMainView?: 'community' | 'dating';
  onChangeMainView?: (view: 'community' | 'dating') => void;
  blockedUsersCount?: number;
  pendingReportsCount?: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <Globe className="w-4 h-4" />,
  best: <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />,
  salary: <Coins className="w-4 h-4 text-emerald-500" />,
  worklife: <Clock className="w-4 h-4 text-sky-500" />,
  grievance: <ShieldAlert className="w-4 h-4 text-rose-500" />,
  career: <TrendingUp className="w-4 h-4 text-blue-500" />,
  lounge: <Coffee className="w-4 h-4 text-amber-500" />,
  poll: <Vote className="w-4 h-4 text-purple-500" />,
  invest: <PiggyBank className="w-4 h-4 text-emerald-600" />,

  series_admin: <FileSpreadsheet className="w-4 h-4 text-indigo-500" />,
  series_tech: <Cpu className="w-4 h-4 text-cyan-600" />,
  series_edu: <GraduationCap className="w-4 h-4 text-amber-600" />,
  series_uniform: <Shield className="w-4 h-4 text-red-500" />,
  series_welfare: <HeartHandshake className="w-4 h-4 text-pink-500" />,
  series_tax: <Calculator className="w-4 h-4 text-teal-600" />,

  dept_moef: <Landmark className="w-4 h-4 text-blue-600" />,
  dept_mois: <Building2 className="w-4 h-4 text-indigo-600" />,
  dept_moe: <BookOpen className="w-4 h-4 text-amber-600" />,
  dept_mohw: <Activity className="w-4 h-4 text-emerald-600" />,
  dept_moel: <Briefcase className="w-4 h-4 text-teal-600" />,
  dept_molit: <Truck className="w-4 h-4 text-sky-600" />,
  dept_local: <Home className="w-4 h-4 text-rose-600" />,
};

const AGENCY_FILTERS: { id: AgencyCategory; label: string }[] = [
  { id: 'all', label: '전체 기관' },
  { id: 'central', label: '중앙부처·국가직' },
  { id: 'local', label: '지자체·지방직' },
  { id: 'education', label: '교육행정(교행)' },
  { id: 'police_fire', label: '경찰·소방' },
  { id: 'special', label: '기타·특별직' },
];

export default function Sidebar({
  currentCategory,
  onSelectCategory,
  selectedAgencyCategory,
  onSelectAgencyCategory,
  onOpenSalaryCalculator,
  onOpenBlockManagement,
  onOpenAdminReports,
  onOpenDirectMessages,
  unreadMessagesCount = 0,
  activeMainView = 'community',
  onChangeMainView,
  blockedUsersCount = 0,
  pendingReportsCount = 0,
}: SidebarProps) {
  // Category tab filter: 'all' | 'topic' | 'series' | 'ministry'
  const [activeTab, setActiveTab] = useState<'all' | BoardCategoryType>('all');

  const filteredBoards = BOARD_CATEGORIES.filter((b) => {
    if (activeTab === 'all') return true;
    return b.categoryType === activeTab;
  });

  return (
    <aside className="w-full lg:w-56 xl:w-60 shrink-0 space-y-4 lg:sticky lg:top-20 self-start transition-all">
      {/* Featured Menu: Dating & Direct Messages */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs space-y-1.5">
        {onChangeMainView && (
          <button
            type="button"
            id="sidebar-btn-dating"
            onClick={() => onChangeMainView('dating')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
              activeMainView === 'dating'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50/60 hover:bg-rose-100/80 text-rose-900 border border-rose-200/80'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  activeMainView === 'dating' ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left">
                <span className="font-black text-xs block">공무원 안심 소개팅</span>
                <span className={`text-[10px] block ${activeMainView === 'dating' ? 'text-rose-100' : 'text-rose-600'}`}>
                  소속 부처 인증 매칭
                </span>
              </div>
            </div>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                activeMainView === 'dating' ? 'bg-white text-rose-600' : 'bg-rose-600 text-white animate-pulse'
              }`}
            >
              HOT
            </span>
          </button>
        )}

        {onOpenDirectMessages && (
          <button
            type="button"
            id="sidebar-btn-messages"
            onClick={onOpenDirectMessages}
            className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span>내 쪽지 & 매칭함</span>
            </div>
            {unreadMessagesCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-extrabold text-[10px]">
                {unreadMessagesCount}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-normal">보관함</span>
            )}
          </button>
        )}
      </div>

      {/* Board Channels Navigation with Category Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>게시판 카테고리</span>
          </div>
        </div>

        {/* Tab Switcher: 전체 / 관심사별 / 직렬별 / 부처별 */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`py-1 rounded-lg transition-all text-center ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            전체
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('topic')}
            className={`py-1 rounded-lg transition-all text-center ${
              activeTab === 'topic'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            관심사
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('series')}
            className={`py-1 rounded-lg transition-all text-center ${
              activeTab === 'series'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            직렬별
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ministry')}
            className={`py-1 rounded-lg transition-all text-center ${
              activeTab === 'ministry'
                ? 'bg-white text-teal-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            부처별
          </button>
        </div>

        {/* Board Category List */}
        <nav className="space-y-1 max-h-[380px] overflow-y-auto pr-0.5">
          {filteredBoards.map((board) => {
            const isSelected = currentCategory === board.id;
            return (
              <button
                key={board.id}
                id={`sidebar-board-${board.id}`}
                type="button"
                onClick={() => onSelectCategory(board.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isSelected ? 'text-white' : ''}>
                    {CATEGORY_ICONS[board.id] || <Globe className="w-4 h-4" />}
                  </span>
                  <span className="truncate">{board.name}</span>
                </div>
                {board.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {board.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Safety & Moderation Quick Bar (신고 센터 & 차단 관리) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1.5">
        <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>이용자 안심 보호 설정</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        </div>

        {onOpenBlockManagement && (
          <button
            type="button"
            onClick={onOpenBlockManagement}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-slate-500" />
              <span>차단한 사용자 목록</span>
            </div>
            {blockedUsersCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                {blockedUsersCount}명
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">0명</span>
            )}
          </button>
        )}

        {onOpenAdminReports && (
          <button
            type="button"
            onClick={onOpenAdminReports}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              <span>신고 검토 센터</span>
            </div>
            {pendingReportsCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                {pendingReportsCount}건 대기
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">검토완료</span>
            )}
          </button>
        )}
      </div>

      {/* Agency Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
        <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>작성자 소속 분류 필터</span>
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
          {AGENCY_FILTERS.map((filter) => {
            const isSelected = selectedAgencyCategory === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onSelectAgencyCategory(filter.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Salary tool banner */}
      <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-900">공직자 필수 계산기</span>
          <Coins className="w-4 h-4 text-emerald-600" />
        </div>
        <p className="text-[11px] text-emerald-700 leading-relaxed">
          내 직급과 호봉의 기본급, 정액급식비, 직급보조비, 초과수당 및 세후 실수령액을 즉시 계산해보세요.
        </p>
        <button
          type="button"
          onClick={onOpenSalaryCalculator}
          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          호봉별 실수령액 조회하기
        </button>
      </div>
    </aside>
  );
}
