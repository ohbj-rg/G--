import { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Building,
  RefreshCw,
  Mail,
  UserCheck,
  X,
  Dices,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Agency, AgencyCategory, UserProfile } from '../types';
import { AGENCIES } from '../data/mockData';
import { generateUniqueNickname, isNicknameTaken } from '../utils/nicknameGenerator';

interface AgencyVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  existingNicknames?: string[];
  onUpdateUser: (user: UserProfile) => void;
}

export default function AgencyVerifyModal({
  isOpen,
  onClose,
  currentUser,
  existingNicknames = [],
  onUpdateUser,
}: AgencyVerifyModalProps) {
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(currentUser.agencyId);
  const [nickname, setNickname] = useState<string>(currentUser.nickname);
  const [showAgency, setShowAgency] = useState<boolean>(currentUser.showAgency);
  const [filterCategory, setFilterCategory] = useState<AgencyCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>(currentUser.emailPrefix || 'officer');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);
  const [verifySuccess, setVerifySuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAgency = AGENCIES.find((a) => a.id === selectedAgencyId) || AGENCIES[0];

  const filteredAgencies = AGENCIES.filter((agency) => {
    const matchesCategory = filterCategory === 'all' || agency.category === filterCategory;
    const matchesSearch =
      agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Duplicate nickname check
  const isDuplicate = useMemo(() => {
    const trimmed = nickname.trim();
    if (!trimmed) return false;
    // It's not duplicate if it's the user's current nickname
    if (trimmed.toLowerCase() === currentUser.nickname.toLowerCase()) return false;
    return isNicknameTaken(trimmed, existingNicknames);
  }, [nickname, currentUser.nickname, existingNicknames]);

  const handleGenerateRandomNickname = () => {
    const newName = generateUniqueNickname(existingNicknames);
    setNickname(newName);
  };

  const handleSimulateEmailVerify = () => {
    setIsVerifyingEmail(true);
    setTimeout(() => {
      setIsVerifyingEmail(false);
      setVerifySuccess(true);
      setTimeout(() => {
        setVerifySuccess(false);
      }, 3000);
    }, 600);
  };

  const handleSave = () => {
    if (isDuplicate) return;
    const chosenAgency = AGENCIES.find((a) => a.id === selectedAgencyId) || currentAgency;
    onUpdateUser({
      ...currentUser,
      agencyId: chosenAgency.id,
      agencyName: chosenAgency.name,
      agencyCategory: chosenAgency.category,
      nickname: nickname.trim() || generateUniqueNickname(existingNicknames),
      showAgency,
      isVerified: true,
      emailPrefix: emailInput,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">소속 기관 인증 및 익명 프로필 설정</h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                  공직자 전용
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                인증된 소속 기관 뱃지와 고유 익명 닉네임으로 자유롭게 소통하세요.
              </p>
            </div>
          </div>
          <button
            id="btn-close-verify-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* Current Status Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                G
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{currentUser.nickname}</span>
                  <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 인증 완료
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  현재 뱃지: <strong className="text-blue-200">{currentUser.agencyName}</strong>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60 leading-relaxed">
              🔒 <strong>비가역 해시 익명 보안</strong>
              <br />
              개인정보는 암호화 처리되며 시스템 관리자도 역추적할 수 없습니다.
            </div>
          </div>

          {/* Nickname Generation & Customization */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  익명 닉네임 설정 (중복 방지)
                </label>
                <p className="text-[11px] text-slate-400">
                  언제든 변경 가능하며, 기존 사용자 및 작성자와 중복되지 않는 고유 닉네임이어야 합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateRandomNickname}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                title="공직 맞춤형 랜덤 닉네임 생성"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>랜덤 생성</span>
              </button>
            </div>

            <div className="relative">
              <input
                id="input-nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 transition-all font-semibold ${
                  isDuplicate
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
                placeholder="예: 행정인, 민원처리반7호봉"
              />
            </div>

            {/* Status indicator */}
            {isDuplicate ? (
              <p className="text-rose-600 font-semibold text-xs flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                이미 사용 중인 닉네임입니다. 다른 닉네임을 입력하거나 [랜덤 생성]을 눌러주세요.
              </p>
            ) : nickname.trim() ? (
              <p className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                사용 가능한 고유 닉네임입니다.
              </p>
            ) : (
              <p className="text-slate-400 text-xs">
                닉네임을 비워둘 경우 자동으로 임의의 닉네임이 부여됩니다.
              </p>
            )}
          </div>

          {/* Badge Visibility Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800">소속 기관명 표시</span>
              <p className="text-[11px] text-slate-400">
                OFF 설정 시 게시글 및 댓글에 기관명 대신 '[공무원]'으로 표시됩니다.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showAgency}
                onChange={(e) => setShowAgency(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Agency Selection List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                소속 기관 선택 (20여 개 정부기관 및 지자체)
              </label>
              <span className="text-[11px] text-slate-400">
                선택됨: <strong className="text-blue-700">{currentAgency.name}</strong>
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterCategory === 'all'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                전체 ({AGENCIES.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('central')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterCategory === 'central'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                중앙부처
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('local')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterCategory === 'local'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                지자체
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('education')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterCategory === 'education'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                교육청(교행)
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('police_fire')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterCategory === 'police_fire'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                경찰·소방
              </button>
            </div>

            {/* Agency Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1">
              {filteredAgencies.map((agency) => {
                const isSelected = selectedAgencyId === agency.id;
                return (
                  <button
                    key={agency.id}
                    type="button"
                    onClick={() => setSelectedAgencyId(agency.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="text-xs truncate">{agency.name}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      @{agency.domain}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Simulation */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                공직자 메일 모의 인증
              </span>
              {verifySuccess && (
                <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 인증코드 발송 완료!
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800">
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-28 focus:outline-hidden text-right pr-1"
                />
                <span className="text-slate-500 font-medium">@{currentAgency.domain}</span>
              </div>
              <button
                type="button"
                onClick={handleSimulateEmailVerify}
                disabled={isVerifyingEmail}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isVerifyingEmail ? '전송 중...' : '재인증'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isDuplicate}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>설정 저장하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
