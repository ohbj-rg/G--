import { useState } from 'react';
import {
  PenSquare,
  Plus,
  Trash2,
  Building,
  Vote,
  AlertTriangle,
  X,
  Hash,
  Layers,
} from 'lucide-react';
import { BoardCategory, BoardCategoryType, Poll, Post, UserProfile } from '../types';
import { BOARD_CATEGORIES } from '../data/mockData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  initialCategoryId?: string;
  onAddPost: (newPost: Omit<Post, 'id' | 'createdAt' | 'views' | 'likes' | 'dislikes' | 'commentsCount' | 'comments'>) => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  initialCategoryId,
  onAddPost,
}: CreatePostModalProps) {
  const [selectedCatType, setSelectedCatType] = useState<BoardCategoryType>('topic');
  const [categoryId, setCategoryId] = useState<string>(() => {
    if (initialCategoryId && initialCategoryId !== 'all' && initialCategoryId !== 'best') {
      return initialCategoryId;
    }
    return 'lounge';
  });

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [showAgency, setShowAgency] = useState<boolean>(currentUser.showAgency);
  const [hasPoll, setHasPoll] = useState<boolean>(false);
  const [pollQuestion, setPollQuestion] = useState<string>('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const selectableBoards = BOARD_CATEGORIES.filter((b) => b.id !== 'all' && b.id !== 'best');
  const currentGroupBoards = selectableBoards.filter((b) => b.categoryType === selectedCatType);

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      if (tags.length >= 5) {
        setError('태그는 최대 5개까지 등록 가능합니다.');
        return;
      }
      setTags([...tags, clean]);
      setTagInput('');
      setError('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const next = [...pollOptions];
    next[index] = val;
    setPollOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('글 제목을 입력해 주세요.');
      return;
    }
    if (!content.trim()) {
      setError('글 내용을 작성해 주세요.');
      return;
    }

    let pollData: Poll | undefined;
    if (hasPoll) {
      if (!pollQuestion.trim()) {
        setError('투표 주제를 입력해 주세요.');
        return;
      }
      const validOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        setError('투표 선택지는 최소 2개 이상 입력해야 합니다.');
        return;
      }
      pollData = {
        id: `poll-${Date.now()}`,
        question: pollQuestion.trim(),
        options: validOptions.map((text, idx) => ({
          id: `opt-${idx + 1}`,
          text,
          votes: 0,
        })),
        totalVotes: 0,
      };
    }

    const currentCat = selectableBoards.find((c) => c.id === categoryId) || selectableBoards[0];

    onAddPost({
      categoryId: currentCat.id,
      categoryName: currentCat.name,
      categoryType: currentCat.categoryType,
      title: title.trim(),
      content: content.trim(),
      authorNickname: currentUser.nickname,
      authorAgency: showAgency ? currentUser.agencyName : '공무원',
      authorAgencyCategory: currentUser.agencyCategory,
      showAgency,
      poll: pollData,
      tags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <PenSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">공직자 익명 글쓰기</h2>
              <p className="text-xs text-slate-500">
                작성자: <strong className="text-slate-800">{currentUser.nickname}</strong>
                {showAgency ? ` (${currentUser.agencyName})` : ' (기관 미노출)'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-create-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-slate-700">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Board Category Selection: Categorized by topic / series / ministry */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              게시판 선택 (관심사 / 직렬 / 부처별)
            </label>

            {/* Type selector tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setSelectedCatType('topic');
                  const first = selectableBoards.find((b) => b.categoryType === 'topic');
                  if (first) setCategoryId(first.id);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedCatType === 'topic'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                관심사·주제별
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCatType('series');
                  const first = selectableBoards.find((b) => b.categoryType === 'series');
                  if (first) setCategoryId(first.id);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedCatType === 'series'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                직렬별 게시판
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCatType('ministry');
                  const first = selectableBoards.find((b) => b.categoryType === 'ministry');
                  if (first) setCategoryId(first.id);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedCatType === 'ministry'
                    ? 'bg-white text-teal-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                부처·기관별 게시판
              </button>
            </div>

            {/* Boards in chosen group */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {currentGroupBoards.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setCategoryId(b.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    categoryId === b.id
                      ? 'border-blue-500 bg-blue-50/80 text-blue-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="truncate font-semibold">{b.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{b.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              제목
            </label>
            <input
              id="input-post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="동료 공직자들과 나눌 이야기의 제목을 적어주세요"
              maxLength={100}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
            />
          </div>

          {/* Content textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              본문 내용
            </label>
            <textarea
              id="textarea-post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="업무 고충, 처우 개선, 조직문화, 일대일 전출입 교류 등 자유롭게 적어보세요. 직무상 비밀 및 특정인 비방은 삼가 바랍니다."
              rows={6}
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              태그 등록 (선택, 최대 5개)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="예: 봉급표, 악성민원, 전출입 (엔터로 추가)"
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl"
              >
                추가
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-600 ml-1 text-slate-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Poll section toggle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">익명 투표 첨부하기</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPoll}
                  onChange={(e) => setHasPoll(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {hasPoll && (
              <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    투표 주제 / 질문
                  </label>
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="예: 정액급식비 적정 수준은 얼마일까요?"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600">
                    선택지 (2개~4개)
                  </label>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-center text-xs font-bold text-slate-400">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                        placeholder={`선택지 ${idx + 1} 입력`}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePollOption(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddPollOption}
                      className="mt-1 px-3 py-1 bg-white border border-dashed border-slate-300 hover:border-blue-400 text-blue-600 text-xs font-semibold rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> 선택지 추가
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Show Agency Badge Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-xs font-bold text-slate-800">소속 기관 뱃지 표시</span>
                <p className="text-[11px] text-slate-400">
                  체크 해제 시 '{currentUser.agencyName}' 대신 '[공무원]'으로 통칭 표시됩니다.
                </p>
              </div>
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

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * 등록 후에는 완전 익명 처리되어 수정이 불가합니다.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
              >
                취소
              </button>
              <button
                id="btn-submit-create-post"
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>등록하기</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
