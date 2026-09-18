import { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Heart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Clock,
  MessageSquare,
  UserX,
  AlertOctagon,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  Search,
  Check,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
} from 'lucide-react';
import { DirectConversation, DirectMessage, UserProfile, ContactExchangeInfo } from '../types';

interface DirectMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  conversations: DirectConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, content: string, image?: { url: string; name?: string }) => void;
  onDeleteMessage?: (conversationId: string, messageId: string) => void;
  onRequestMatch: (conversationId: string, contactInfo: ContactExchangeInfo) => void;
  onAcceptMatch: (conversationId: string, contactInfo: ContactExchangeInfo) => void;
  onDeclineMatch: (conversationId: string) => void;
  onCancelMatchRequest: (conversationId: string) => void;
  onStartNewConversation: (partnerNickname: string, partnerAgency: string, initialMessage?: string) => string;
  onOpenReportModal?: (targetAuthor: string) => void;
  onBlockUser?: (nickname: string) => void;
}

export default function DirectMessagesModal({
  isOpen,
  onClose,
  currentUser,
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onDeleteMessage,
  onRequestMatch,
  onAcceptMatch,
  onDeclineMatch,
  onCancelMatchRequest,
  onStartNewConversation,
  onOpenReportModal,
  onBlockUser,
}: DirectMessagesModalProps) {
  const [inputText, setInputText] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showNewChatDialog, setShowNewChatDialog] = useState<boolean>(false);
  const [newChatNick, setNewChatNick] = useState<string>('');
  const [newChatAgency, setNewChatAgency] = useState<string>('행정안전부');
  const [newChatMessage, setNewChatMessage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [deleteConfirmMsgId, setDeleteConfirmMsgId] = useState<string | null>(null);

  // Photo upload states
  const [stagedImage, setStagedImage] = useState<{ url: string; name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Matching dialog states
  const [isMatchPromptOpen, setIsMatchPromptOpen] = useState<boolean>(false);
  const [matchContactType, setMatchContactType] = useState<'kakao' | 'phone' | 'openchat'>('kakao');
  const [matchContactValue, setMatchContactValue] = useState<string>('');
  const [matchNote, setMatchNote] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0] || null;

  // Scroll to bottom of message list on updates
  useEffect(() => {
    if (activeConv && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConv?.messages?.length, activeConversationId, isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, GIF, WebP)만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('이미지 크기는 최대 10MB 이하만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setStagedImage({
        url: dataUrl,
        name: file.name,
        size: formattedSize,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        handleFileSelect(file);
      }
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !stagedImage) || !activeConv) return;
    onSendMessage(
      activeConv.id,
      inputText.trim(),
      stagedImage ? { url: stagedImage.url, name: stagedImage.name } : undefined
    );
    setInputText('');
    setStagedImage(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleOpenMatchPrompt = (mode: 'request' | 'accept') => {
    // Pre-fill contact if available
    if (activeConv?.myContactInfo) {
      setMatchContactType(activeConv.myContactInfo.contactType);
      setMatchContactValue(activeConv.myContactInfo.contactValue);
      setMatchNote(activeConv.myContactInfo.note || '');
    } else {
      setMatchContactValue(currentUser.nickname.slice(0, 4) + '_talk');
      setMatchNote('편하게 카카오톡으로 연락주세요 :)');
    }
    setIsMatchPromptOpen(true);
  };

  const handleConfirmMatchAction = () => {
    if (!matchContactValue.trim() || !activeConv) return;
    const info: ContactExchangeInfo = {
      contactType: matchContactType,
      contactValue: matchContactValue.trim(),
      note: matchNote.trim(),
    };

    if (activeConv.matchingStatus === 'requested_by_partner') {
      onAcceptMatch(activeConv.id, info);
    } else {
      onRequestMatch(activeConv.id, info);
    }
    setIsMatchPromptOpen(false);
  };

  const handleCreateNewChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatNick.trim()) return;
    const convId = onStartNewConversation(
      newChatNick.trim(),
      newChatAgency.trim() || '공직자',
      newChatMessage.trim() || '안녕하세요! 익명 쪽지 드립니다.'
    );
    setShowNewChatDialog(false);
    setNewChatNick('');
    setNewChatMessage('');
    onSelectConversation(convId);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      c.partnerNickname.toLowerCase().includes(q) ||
      c.partnerAgency.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden h-[88vh] max-h-[760px] flex flex-col">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black tracking-tight">공직자 안심 쪽지함</h2>
                <span className="px-1.5 py-0.5 rounded-sm bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                  E2E 암호화 안심 보호
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                대화 상대와 서로 마음이 맞으면 상호 매칭을 통해 안전하게 연락처를 교환할 수 있습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Conversation List + Right Active Chat */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Conversations List */}
          <div className="w-full sm:w-80 md:w-88 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0">
            {/* Search and New Message Header */}
            <div className="p-3 border-b border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">대화 목록 ({conversations.length})</span>
                <button
                  type="button"
                  onClick={() => setShowNewChatDialog(true)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Send className="w-3 h-3" />
                  <span>새 쪽지</span>
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="대화 상대, 소속기관 검색..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-100 text-xs text-slate-800 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/70">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                  <MessageCircle className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                  <p>쪽지 대화 내역이 없습니다.</p>
                  <p className="text-[11px] text-slate-400">
                    소개팅 프로필이나 게시글에서 '쪽지 보내기'를 눌러 소통을 시작해보세요!
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeConv?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => onSelectConversation(conv.id)}
                      className={`w-full p-3 text-left transition-colors flex items-start gap-2.5 relative ${
                        isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                        {conv.partnerAgency.slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {conv.partnerNickname}
                            </span>
                            <span className="px-1.5 py-0.2 rounded-sm bg-slate-200 text-slate-700 text-[10px] font-medium shrink-0">
                              {conv.partnerAgency}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>

                        {/* Matching status badges */}
                        <div className="mt-1 flex items-center gap-1">
                          {conv.matchingStatus === 'matched' && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              상호 매칭 성공!
                            </span>
                          )}
                          {conv.matchingStatus === 'requested_by_partner' && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-sm bg-rose-100 text-rose-800 text-[10px] font-extrabold animate-pulse">
                              <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                              매칭 신청 수신됨
                            </span>
                          )}
                          {conv.matchingStatus === 'requested_by_me' && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-bold">
                              <Clock className="w-2.5 h-2.5 text-amber-600" />
                              매칭 응답 대기중
                            </span>
                          )}
                        </div>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Active Chat Room */}
          {activeConv ? (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Active Chat Header */}
              <div className="px-4 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
                    {activeConv.partnerAgency.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">{activeConv.partnerNickname}</span>
                      <span className="px-1.5 py-0.2 rounded-sm bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        {activeConv.partnerAgency} 인증
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">익명 보호 모드 가동 중</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {onOpenReportModal && (
                    <button
                      type="button"
                      onClick={() => onOpenReportModal(activeConv.partnerNickname)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 text-xs transition-colors"
                      title="상대방 신고하기"
                    >
                      <AlertOctagon className="w-4 h-4" />
                    </button>
                  )}
                  {onBlockUser && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`'${activeConv.partnerNickname}' 님을 차단하시겠습니까?`)) {
                          onBlockUser(activeConv.partnerNickname);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 text-xs transition-colors"
                      title="상대방 차단하기"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* MUTUAL MATCHING STATUS BANNER (상호 매칭 상태 및 신청/수락 영역) */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
                {activeConv.matchingStatus === 'none' && (
                  <div className="p-3 bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 rounded-xl border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Heart className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">상호 매칭 신청</span>
                          <span className="text-[10px] text-rose-600 font-semibold bg-white/80 px-1.5 py-0.2 rounded-sm border border-rose-200">
                            상호 동의 시에만 연락처 공개
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          대화가 잘 통하셨나요? 최종 매칭을 신청해 카카오톡 ID/연락처를 안전하게 교환해보세요.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenMatchPrompt('request')}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>최종 매칭 신청하기</span>
                    </button>
                  </div>
                )}

                {activeConv.matchingStatus === 'requested_by_me' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-amber-900">상대방의 매칭 수락을 기다리는 중입니다</span>
                        <p className="text-[11px] text-amber-700">
                          상대방도 매칭을 수락하면 서로의 연락처가 즉시 공개됩니다.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onCancelMatchRequest(activeConv.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg self-start sm:self-auto"
                    >
                      신청 취소
                    </button>
                  </div>
                )}

                {activeConv.matchingStatus === 'requested_by_partner' && (
                  <div className="p-3.5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 animate-bounce">
                        <Heart className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-rose-950">
                            {activeConv.partnerNickname} 님이 매칭을 신청했습니다!
                          </span>
                          <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                            호감 확인
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-800">
                          수락하시면 회원님의 카카오톡/연락처가 공유되며 상대방의 연락처를 확인할 수 있습니다.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onDeclineMatch(activeConv.id)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
                      >
                        정중히 거절
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenMatchPrompt('accept')}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>매칭 수락하기</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeConv.matchingStatus === 'matched' && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-xl border border-emerald-300 shadow-xs space-y-3 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-emerald-950">🎉 상호 매칭이 완료되었습니다!</span>
                            <span className="px-1.5 py-0.2 rounded-sm bg-emerald-600 text-white text-[10px] font-bold">
                              연락처 교환 성공
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-800">
                            두 분 모두 호감을 표시하셨습니다. 교환된 연락처로 더 깊은 대화를 나눠보세요!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Exchanged contact cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {/* Partner's Contact Info */}
                      <div className="p-3 bg-white rounded-lg border border-emerald-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">
                            {activeConv.partnerNickname} 님의 연락처
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.2 rounded-sm">
                            {activeConv.partnerContactInfo?.contactType === 'kakao' ? '카카오톡 ID' : '오픈채팅'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <span className="text-xs font-mono font-bold text-slate-900 select-all">
                            {activeConv.partnerContactInfo?.contactValue || 'spring_sejong_95'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(activeConv.partnerContactInfo?.contactValue || 'spring_sejong_95')
                            }
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId ? '복사됨' : '복사'}</span>
                          </button>
                        </div>
                        {activeConv.partnerContactInfo?.note && (
                          <p className="text-[10px] text-slate-400">{activeConv.partnerContactInfo.note}</p>
                        )}
                      </div>

                      {/* My Contact Info */}
                      <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">내가 공개한 연락처</span>
                          <button
                            type="button"
                            onClick={() => handleOpenMatchPrompt('request')}
                            className="text-[10px] text-blue-600 hover:underline font-semibold"
                          >
                            수정
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <span className="text-xs font-mono font-bold text-slate-800">
                            {activeConv.myContactInfo?.contactValue || 'civic_hero_7'}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            상대방에게 공개됨
                          </span>
                        </div>
                        {activeConv.myContactInfo?.note && (
                          <p className="text-[10px] text-slate-400">{activeConv.myContactInfo.note}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Flow Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 relative transition-colors ${
                  isDragging ? 'bg-blue-50/70 ring-2 ring-blue-400 ring-inset' : ''
                }`}
              >
                {isDragging && (
                  <div className="absolute inset-0 z-20 bg-blue-600/10 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-blue-700 pointer-events-none border-2 border-dashed border-blue-500 rounded-xl m-2">
                    <UploadCloud className="w-10 h-10 mb-2 animate-bounce" />
                    <p className="font-bold text-sm">사진을 여기에 놓으세요</p>
                    <p className="text-xs text-blue-600 mt-0.5">안심 쪽지에 이미지가 첨부됩니다 (최대 10MB)</p>
                  </div>
                )}

                <div className="text-center py-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-600 text-[10px] font-medium">
                    대화 시작 · 공직자 안심 가이드라인 준수
                  </span>
                </div>

                {activeConv.messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                    <p>주고받은 쪽지가 없습니다.</p>
                    <p className="text-[11px] text-slate-400">새로운 쪽지를 보내 대화를 시작해보세요.</p>
                  </div>
                ) : (
                  activeConv.messages.map((msg) => {
                    const isMe = msg.senderNickname === currentUser.nickname;
                    const isDeletingThis = deleteConfirmMsgId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        className={`group flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 relative`}
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 px-1">
                          <span className="font-semibold">{isMe ? '나' : msg.senderNickname}</span>
                          {!isMe && (
                            <span className="px-1.5 py-0.2 rounded-sm bg-slate-200 text-slate-700 text-[9px] font-medium">
                              {msg.senderAgency}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">{msg.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-1.5 max-w-full">
                          {/* If isMe, show delete button on the left of bubble */}
                          {isMe && onDeleteMessage && (
                            <div className="flex items-center shrink-0">
                              {isDeletingThis ? (
                                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-red-200 shadow-md animate-in fade-in text-[10px]">
                                  <span className="text-red-600 font-bold px-1">쪽지 삭제?</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDeleteMessage(activeConv.id, msg.id);
                                      setDeleteConfirmMsgId(null);
                                    }}
                                    className="px-2 py-0.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded font-bold transition-all"
                                  >
                                    삭제
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmMsgId(null)}
                                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-medium transition-colors"
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmMsgId(msg.id)}
                                  className="opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                                  title="보낸 쪽지 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}

                          {/* Message bubble */}
                          <div
                            className={`max-w-[85%] sm:max-w-md px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words shadow-2xs ${
                              isMe
                                ? 'bg-blue-600 text-white rounded-tr-xs'
                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                            }`}
                          >
                            {/* Attached Image */}
                            {msg.imageUrl && (
                              <div className="mb-2 overflow-hidden rounded-xl bg-slate-900/10 max-w-full">
                                <img
                                  src={msg.imageUrl}
                                  alt={msg.imageName || '쪽지 첨부 이미지'}
                                  className="max-h-60 sm:max-h-72 w-auto max-w-full rounded-xl object-contain cursor-zoom-in hover:brightness-95 transition-all bg-black/5"
                                  onClick={() => setLightboxImageUrl(msg.imageUrl || null)}
                                  referrerPolicy="no-referrer"
                                />
                                {msg.imageName && (
                                  <div
                                    className={`flex items-center gap-1 text-[10px] mt-1.5 px-1 truncate ${
                                      isMe ? 'text-blue-100' : 'text-slate-500'
                                    }`}
                                  >
                                    <ImageIcon className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{msg.imageName}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Text Content */}
                            {msg.content && <div className="leading-relaxed break-words">{msg.content}</div>}
                          </div>

                          {/* If !isMe, allow user to delete/clear received message too */}
                          {!isMe && onDeleteMessage && (
                            <div className="flex items-center shrink-0">
                              {isDeletingThis ? (
                                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-red-200 shadow-md animate-in fade-in text-[10px]">
                                  <span className="text-red-600 font-bold px-1">삭제?</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDeleteMessage(activeConv.id, msg.id);
                                      setDeleteConfirmMsgId(null);
                                    }}
                                    className="px-2 py-0.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded font-bold transition-all"
                                  >
                                    삭제
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmMsgId(null)}
                                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-medium transition-colors"
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmMsgId(msg.id)}
                                  className="opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                                  title="받은 쪽지 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Icebreaker suggestions */}
              <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-slate-400 font-bold shrink-0">추천 쪽지:</span>
                {[
                  '오늘 점심 뭐 드셨어요?',
                  '오늘 혹시 야근 있으신가요?',
                  '주말에 주로 어떤 취미 즐기세요?',
                  '프로필 보고 쪽지 남겨봅니다 :)',
                  '식사 맛있게 하세요!',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setInputText(chip)}
                    className="px-2 py-0.5 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-600 text-[10px] font-medium whitespace-nowrap transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Staged Image Preview Banner */}
              {stagedImage && (
                <div className="px-4 py-2 bg-blue-50/90 border-t border-blue-100 flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={stagedImage.url}
                      alt={stagedImage.name}
                      className="w-10 h-10 object-cover rounded-lg border border-blue-200 shrink-0 bg-white"
                    />
                    <div className="text-left overflow-hidden">
                      <div className="text-xs font-semibold text-slate-800 truncate">{stagedImage.name}</div>
                      <div className="text-[10px] text-blue-600 font-medium">{stagedImage.size} · 첨부 완료 (전송 버튼을 누르면 전달됩니다)</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStagedImage(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="사진 첨부 취소"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Message Input Footer */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                    e.target.value = '';
                  }}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2.5 rounded-xl border transition-colors shrink-0 flex items-center justify-center cursor-pointer ${
                    stagedImage
                      ? 'bg-blue-50 border-blue-300 text-blue-600'
                      : 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600'
                  }`}
                  title="사진 첨부 (JPG, PNG, GIF, WebP / 최대 10MB)"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onPaste={handlePaste}
                  placeholder={
                    stagedImage
                      ? '사진과 함께 전송할 메시지를 입력하세요 (선택)...'
                      : `${activeConv.partnerNickname} 님에게 보낼 쪽지 내용을 입력하세요 (클립보드 이미지 붙여넣기 지원)...`
                  }
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 focus:bg-white text-xs text-slate-900 rounded-xl border border-transparent focus:border-blue-500 focus:outline-hidden transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() && !stagedImage}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>전송</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-xs">
              <MessageSquare className="w-10 h-10 mb-2 text-slate-300" />
              <p>좌측에서 대화를 선택하거나 새 쪽지를 보내보세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* FULL-SCREEN IMAGE LIGHTBOX MODAL */}
      {lightboxImageUrl && (
        <div
          className="fixed inset-0 z-70 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2.5 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
              <span className="text-xs font-medium text-slate-300">사진 원본 보기</span>
              <button
                type="button"
                onClick={() => setLightboxImageUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 flex items-center justify-center overflow-auto max-h-[80vh]">
              <img
                src={lightboxImageUrl}
                alt="확대 이미지"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* MATCHING CONTACT INPUT MODAL PROMPT */}
      {isMatchPromptOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {activeConv?.matchingStatus === 'requested_by_partner'
                    ? '매칭 수락 & 내 연락처 교환'
                    : '최종 매칭 신청 & 내 연락처 등록'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMatchPromptOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 leading-relaxed">
              <strong>🔒 안심 교환 원칙:</strong> 등록하신 연락처는 상대방도 매칭을 수락하여{' '}
              <strong>양방향 상호 매칭이 성사된 순간에만</strong> 안전하게 공개됩니다.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">교환할 연락처 수단</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'kakao', label: '카카오톡 ID' },
                    { id: 'openchat', label: '오픈채팅 링크' },
                    { id: 'phone', label: '휴대전화 번호' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMatchContactType(item.id as any)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        matchContactType === item.id
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {matchContactType === 'kakao'
                    ? '카카오톡 ID'
                    : matchContactType === 'openchat'
                    ? '오픈채팅방 주소 (open.kakao.com/...)'
                    : '전화번호 (- 포함)'}
                </label>
                <input
                  type="text"
                  value={matchContactValue}
                  onChange={(e) => setMatchContactValue(e.target.value)}
                  placeholder={
                    matchContactType === 'kakao'
                      ? '예: gov_official_94'
                      : matchContactType === 'openchat'
                      ? 'https://open.kakao.com/o/...'
                      : '010-0000-0000'
                  }
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">전달할 한 줄 메시지 (선택)</label>
                <input
                  type="text"
                  value={matchNote}
                  onChange={(e) => setMatchNote(e.target.value)}
                  placeholder="예: 편하실 때 카톡 주세요, 주말 티타임 환영합니다 :)"
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsMatchPromptOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmMatchAction}
                disabled={!matchContactValue.trim()}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>
                  {activeConv?.matchingStatus === 'requested_by_partner'
                    ? '매칭 수락 완료'
                    : '매칭 신청 전송'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW DIRECT MESSAGE DIALOG */}
      {showNewChatDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateNewChatSubmit}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">새 쪽지 작성</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewChatDialog(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">받는 분 닉네임</label>
                <input
                  type="text"
                  required
                  value={newChatNick}
                  onChange={(e) => setNewChatNick(e.target.value)}
                  placeholder="예: 세종의봄, 주말러너주무관..."
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">받는 분 소속 기관 (선택)</label>
                <input
                  type="text"
                  value={newChatAgency}
                  onChange={(e) => setNewChatAgency(e.target.value)}
                  placeholder="예: 기획재정부, 서울시청, 경기도교육청..."
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">첫 쪽지 내용</label>
                <textarea
                  rows={3}
                  required
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="공직 생활 고충이나 질문, 소통하고 싶은 내용을 정중하게 적어주세요."
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewChatDialog(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>쪽지 보내기</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
