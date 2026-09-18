import { useState } from 'react';
import { Flame, TrendingUp, Vote, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { HOT_KEYWORDS } from '../data/mockData';

interface TrendingWidgetProps {
  onSelectKeyword: (keyword: string) => void;
  activeKeyword?: string;
  onOpenVerifyModal: () => void;
}

export default function TrendingWidget({
  onSelectKeyword,
  activeKeyword,
  onOpenVerifyModal,
}: TrendingWidgetProps) {
  // Mini widget poll state
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [votes, setVotes] = useState({
    opt1: 524,
    opt2: 89,
    opt3: 312,
  });

  const total = votes.opt1 + votes.opt2 + votes.opt3;

  const handleVote = (opt: 'opt1' | 'opt2' | 'opt3') => {
    if (votedOption === opt) return;
    setVotes((prev) => ({
      ...prev,
      [opt]: prev[opt] + 1,
      ...(votedOption ? { [votedOption]: Math.max(0, prev[votedOption as keyof typeof prev] - 1) } : {}),
    }));
    setVotedOption(opt);
  };

  return (
    <div className="w-full lg:w-64 xl:w-72 2xl:w-80 shrink-0 space-y-4 lg:sticky lg:top-20 self-start transition-all">
      {/* Realtime Hot Keywords */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-slate-900 text-sm">실시간 공직 핫키워드</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">LIVE</span>
        </div>

        <div className="mt-3 space-y-1.5">
          {HOT_KEYWORDS.map((keyword, index) => {
            const isRankTop3 = index < 3;
            const isSelected = activeKeyword === keyword;
            return (
              <button
                key={keyword}
                type="button"
                onClick={() => onSelectKeyword(isSelected ? '' : keyword)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-4 font-black text-center text-xs ${
                      isRankTop3 ? 'text-rose-600' : 'text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="truncate">#{keyword}</span>
                </div>
                <TrendingUp className="w-3 h-3 text-slate-300" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Civil Service Mini Poll Widget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">오늘의 공직 즉석 투표</h3>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700">
            실시간
          </span>
        </div>

        <div className="text-xs font-semibold text-slate-800 leading-snug">
          "공직 사회 '주 4.5일제(금요일 오후 퇴근)' 단계적 도입에 대해 어떻게 생각하시나요?"
        </div>

        <div className="space-y-2">
          {[
            { id: 'opt1', text: '매우 찬성 (청년 공무원 이탈 방지 필수)', count: votes.opt1 },
            { id: 'opt2', text: '시기상조 (대민 행정 공백 및 여론 부담)', count: votes.opt2 },
            { id: 'opt3', text: '부서별/직렬별 유연근무로 대체', count: votes.opt3 },
          ].map((item) => {
            const isVoted = votedOption === item.id;
            const pct = Math.round((item.count / total) * 100);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleVote(item.id as 'opt1' | 'opt2' | 'opt3')}
                className={`relative w-full text-left p-2.5 rounded-xl border text-xs transition-all overflow-hidden ${
                  isVoted
                    ? 'border-purple-500 bg-purple-50/60 font-semibold'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                }`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 ${
                    isVoted ? 'bg-purple-200/50' : 'bg-slate-200/40'
                  }`}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-slate-800 truncate pr-2">{item.text}</span>
                  <span className="font-bold font-mono shrink-0">{pct}%</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
          <span>참여 {total.toLocaleString()}명</span>
          <span className="text-purple-600 font-medium">익명 집계 중</span>
        </div>
      </div>

      {/* Safety / Verification Promo Card */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>공직자 인증 배지 혜택</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          소속 기관 뱃지를 설정하면 다른 부처 및 지자체 동료들과 더 높은 신뢰 속에서 일대일 인사교류 및 업무 노하우를 공유할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={onOpenVerifyModal}
          className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 rounded-xl transition-colors shadow-2xs"
        >
          내 기관 뱃지 설정하기
        </button>
      </div>
    </div>
  );
}
