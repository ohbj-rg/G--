import { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  X,
  Eye,
  Trash2,
  ShieldCheck,
  UserX,
  Clock,
  Filter,
} from 'lucide-react';
import { ReportItem } from '../types';

interface AdminReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ReportItem[];
  onTakeAction: (reportId: string, action: 'hide' | 'ban_user' | 'dismiss') => void;
  onClearAllReports?: () => void;
}

export default function AdminReportModal({
  isOpen,
  onClose,
  reports,
  onTakeAction,
  onClearAllReports,
}: AdminReportModalProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!isOpen) return null;

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'pending') return r.status === 'pending';
    if (filterStatus === 'action_taken') return r.status === 'action_taken';
    if (filterStatus === 'dismissed') return r.status === 'dismissed';
    return true;
  });

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-xs text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">관리자 신고 검토 센터</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  대기 {pendingCount}건
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                사용자가 접수한 신고 내역을 공직자 윤리 및 운영규정에 의거하여 신속히 검토합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>상태 필터:</span>
            <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                전체 ({reports.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                검토 대기 ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('action_taken')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterStatus === 'action_taken'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                조치 완료
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('dismissed')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterStatus === 'dismissed'
                    ? 'bg-white text-slate-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                반려
              </button>
            </div>
          </div>

          {onClearAllReports && reports.length > 0 && (
            <button
              type="button"
              onClick={onClearAllReports}
              className="text-slate-400 hover:text-rose-600 text-[11px] flex items-center gap-1 hover:underline"
            >
              <Trash2 className="w-3 h-3" /> 내역 전체 비우기
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs text-slate-700">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">검토할 신고 내역이 없습니다</p>
              <p className="text-slate-400 text-[11px]">
                건전하고 깨끗한 공직자 커뮤니티가 유지되고 있습니다.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        report.targetType === 'post'
                          ? 'bg-blue-100 text-blue-800'
                          : report.targetType === 'comment'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {report.targetType === 'post'
                        ? '게시글'
                        : report.targetType === 'comment'
                        ? '댓글'
                        : '사용자'}
                    </span>
                    <span className="font-bold text-slate-900">
                      대상: {report.targetAuthor}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      · {report.reportedAt}
                    </span>
                  </div>

                  <div>
                    {report.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 검토 대기
                      </span>
                    )}
                    {report.status === 'action_taken' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 조치 완료 ({report.actionNote})
                      </span>
                    )}
                    {report.status === 'dismissed' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                        반려됨 (이상 없음)
                      </span>
                    )}
                  </div>
                </div>

                {/* Excerpt */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium line-clamp-2">
                  "{report.targetTitleOrExcerpt}"
                </div>

                {/* Report Reason */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="space-y-0.5">
                    <div className="text-rose-700 font-semibold flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      신고사유: {report.reason}
                    </div>
                    {report.details && (
                      <p className="text-slate-500 text-[11px] pl-4">
                        상세내용: {report.details}
                      </p>
                    )}
                  </div>

                  {/* Actions for pending items */}
                  {report.status === 'pending' ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onTakeAction(report.id, 'hide')}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] border border-rose-200 transition-colors flex items-center gap-1"
                        title="해당 콘텐츠를 피드에서 가림"
                      >
                        <Eye className="w-3 h-3" />
                        블라인드 처리
                      </button>
                      <button
                        type="button"
                        onClick={() => onTakeAction(report.id, 'ban_user')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold text-[11px] border border-slate-300 transition-colors flex items-center gap-1"
                        title="작성자를 차단 목록에 추가"
                      >
                        <UserX className="w-3 h-3" />
                        사용자 제재
                      </button>
                      <button
                        type="button"
                        onClick={() => onTakeAction(report.id, 'dismiss')}
                        className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-[11px] transition-colors"
                      >
                        반려
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">
                      조치가 완료된 사안입니다.
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>신고는 철저히 익명으로 보장되며 피신고자에게 신고자 정보가 전달되지 않습니다.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
