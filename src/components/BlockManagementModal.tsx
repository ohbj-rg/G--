import { useState } from 'react';
import { UserX, ShieldCheck, X, Trash2, Plus, UserCheck, AlertCircle } from 'lucide-react';

interface BlockManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedUsers: string[];
  onUnblockUser: (nickname: string) => void;
  onBlockUser: (nickname: string) => void;
}

export default function BlockManagementModal({
  isOpen,
  onClose,
  blockedUsers,
  onUnblockUser,
  onBlockUser,
}: BlockManagementModalProps) {
  const [newNickname, setNewNickname] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newNickname.trim();
    if (!trimmed) {
      setError('차단할 사용자의 닉네임을 입력해 주세요.');
      return;
    }
    if (blockedUsers.includes(trimmed)) {
      setError('이미 차단 목록에 등록된 사용자입니다.');
      return;
    }
    onBlockUser(trimmed);
    setNewNickname('');
    setError('');
    setSuccessMsg(`'${trimmed}' 사용자가 차단되었습니다.`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">사용자 차단 관리</h3>
              <p className="text-[11px] text-slate-500">
                차단한 사용자의 게시글과 댓글은 피드에서 숨김 처리됩니다
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto text-xs">
          {/* Manual Add Input */}
          <form onSubmit={handleAddBlock} className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              닉네임으로 직접 차단 등록
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNickname}
                onChange={(e) => {
                  setNewNickname(e.target.value);
                  setError('');
                }}
                placeholder="차단할 사용자 닉네임 입력..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> 차단
              </button>
            </div>
            {error && <p className="text-rose-600 font-semibold text-[11px]">{error}</p>}
            {successMsg && (
              <p className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> {successMsg}
              </p>
            )}
          </form>

          {/* Notice */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-blue-900 text-[11px] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>차단 효과 안내</strong>
              <br />
              차단된 사용자가 작성한 새 글과 댓글은 피드 목록 및 게시글 상세에서 자동으로 가려집니다. 상대방에게는 차단 사실이 통보되지 않습니다.
            </div>
          </div>

          {/* Blocked Users List */}
          <div>
            <div className="flex items-center justify-between pb-2 font-bold text-slate-700 border-b border-slate-100">
              <span>현재 차단 목록</span>
              <span className="text-slate-400 font-medium">총 {blockedUsers.length}명</span>
            </div>

            <div className="mt-2 space-y-1.5 max-h-60 overflow-y-auto">
              {blockedUsers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  현재 차단한 사용자가 없습니다.
                </div>
              ) : (
                blockedUsers.map((nickname) => (
                  <div
                    key={nickname}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                        <UserX className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-800">{nickname}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUnblockUser(nickname)}
                      className="px-2.5 py-1 text-[11px] text-slate-600 hover:text-rose-600 hover:bg-white border border-slate-300 rounded-lg font-semibold transition-all shadow-2xs"
                    >
                      차단 해제
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
