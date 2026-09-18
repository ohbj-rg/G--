import { useState } from 'react';
import { AlertOctagon, ShieldAlert, X, CheckCircle2, UserX } from 'lucide-react';
import { ReportItem, ReportTargetType } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetTitleOrExcerpt: string;
  targetAuthor: string;
  onSubmitReport: (report: Omit<ReportItem, 'id' | 'reportedAt' | 'status'>, alsoBlockAuthor?: boolean) => void;
}

const REPORT_REASONS = [
  '비방, 욕설, 인신공격 및 혐오 표현',
  '공직 기밀 및 직무상 비밀/보안 정보 누설',
  '허위사실 유포 및 동료 공직자 명예훼손',
  '특정 공직자/민원인 개인정보 신상 털기 및 사생활 침해',
  '영리 목적의 광고, 도배 및 부적절한 홍보',
  '공무원 품위유지 의무 위반 및 기타 부적절한 행위',
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitleOrExcerpt,
  targetAuthor,
  onSubmitReport,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [alsoBlock, setAlsoBlock] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const getTargetTypeLabel = () => {
    switch (targetType) {
      case 'post':
        return '게시글 신고';
      case 'comment':
        return '댓글 신고';
      case 'user':
        return '사용자 신고';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(
      {
        targetType,
        targetId,
        targetTitleOrExcerpt,
        targetAuthor,
        reason: selectedReason,
        details: customReason.trim() || undefined,
      },
      alsoBlock
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{getTargetTypeLabel()}</h3>
              <p className="text-[11px] text-slate-500">관리자 검토 및 운영원칙에 따라 조치됩니다</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-900">신고가 정상 접수되었습니다</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              신고 내역이 관리자 검토 센터로 전달되었습니다.
              {alsoBlock && ` 또한 '${targetAuthor}' 사용자가 차단되었습니다.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Target Summary Card */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">대상 작성자: {targetAuthor}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  {targetType}
                </span>
              </div>
              <p className="text-slate-800 font-medium line-clamp-2 italic">
                "{targetTitleOrExcerpt}"
              </p>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                신고 사유를 선택해 주세요
              </label>
              <div className="space-y-1.5">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedReason === reason
                        ? 'border-rose-400 bg-rose-50/50 text-rose-950 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Detailed Memo */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                구체적인 사유 및 정황 (선택 사항)
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="관리자가 신속하고 정확하게 검토할 수 있도록 상세 내용을 적어주세요."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Also block author checkbox */}
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 cursor-pointer text-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={alsoBlock}
                onChange={(e) => setAlsoBlock(e.target.checked)}
                className="rounded-sm text-rose-600 focus:ring-rose-500"
              />
              <div className="flex items-center gap-1.5 font-semibold">
                <UserX className="w-3.5 h-3.5 text-rose-600" />
                <span>이 사용자의 글과 댓글도 즉시 함께 차단하기</span>
              </div>
            </label>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-[11px] leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                허위 신고 시 커뮤니티 이용에 제한을 받을 수 있습니다. 건전한 공직 소통을 위해 신중히 접수해 주세요.
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <AlertOctagon className="w-4 h-4" />
                신고 접수
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
