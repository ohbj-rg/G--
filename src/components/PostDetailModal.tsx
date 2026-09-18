import { useState } from 'react';
import {
  Heart,
  ThumbsDown,
  MessageSquare,
  Eye,
  Bookmark,
  Vote,
  ShieldCheck,
  Share2,
  Send,
  CornerDownRight,
  Flame,
  AlertOctagon,
  X,
  UserX,
  EyeOff,
  MoreVertical,
} from 'lucide-react';
import { Comment, Post, UserProfile, ReportTargetType } from '../types';

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onToggleLike: (postId: string) => void;
  onToggleDislike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onAddComment: (postId: string, content: string, parentCommentId?: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onDislikeComment: (postId: string, commentId: string) => void;
  onTagClick?: (tag: string) => void;
  onOpenReportModal: (targetType: ReportTargetType, targetId: string, titleOrExcerpt: string, author: string) => void;
  onBlockUser: (nickname: string) => void;
  onUnblockUser: (nickname: string) => void;
  onSendDirectMessage?: (authorNickname: string, authorAgency: string, initialContext?: string) => void;
}

export default function PostDetailModal({
  post,
  isOpen,
  onClose,
  currentUser,
  onToggleLike,
  onToggleDislike,
  onToggleBookmark,
  onVotePoll,
  onAddComment,
  onLikeComment,
  onDislikeComment,
  onTagClick,
  onOpenReportModal,
  onBlockUser,
  onUnblockUser,
  onSendDirectMessage,
}: PostDetailModalProps) {
  const [commentText, setCommentText] = useState<string>('');
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [revealedCommentIds, setRevealedCommentIds] = useState<Record<string, boolean>>({});
  const [activeCommentMenuId, setActiveCommentMenuId] = useState<string | null>(null);

  if (!isOpen || !post) return null;

  const isPostAuthorBlocked = currentUser.blockedUsers?.includes(post.authorNickname);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('게시글 링크가 클립보드에 복사되었습니다.');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleReplySubmit = (parentCommentId: string) => {
    if (!replyText.trim()) return;
    onAddComment(post.id, replyText.trim(), parentCommentId);
    setReplyText('');
    setReplyTargetId(null);
  };

  const toggleRevealComment = (id: string) => {
    setRevealedCommentIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Blind Security Watermark Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] select-none overflow-hidden text-[13px] font-mono leading-loose rotate-[-12deg] z-0">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap">
              G-BLIND GOV ANONYMOUS SECURE PLATFORM · 사내망 역추적 불가 · GOV-SECURE-HASH-ID
            </div>
          ))}
        </div>

        {/* Header Bar */}
        <div className="relative z-10 px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
              {post.categoryName}
            </span>
            {post.isHot && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 font-bold border border-rose-200">
                <Flame className="w-3.5 h-3.5 fill-rose-500" /> HOT 게시글
              </span>
            )}
            {post.isBlockedByAdmin && (
              <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 font-bold">
                블라인드 처리됨
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Send DM to Author */}
            {onSendDirectMessage && post.authorNickname !== currentUser.nickname && (
              <button
                onClick={() =>
                  onSendDirectMessage(
                    post.authorNickname,
                    post.authorAgency,
                    `안녕하세요! [${post.title.slice(0, 20)}...] 게시글을 보고 쪽지 드립니다.`
                  )
                }
                className="px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1 text-xs font-bold"
                title="작성자에게 쪽지 보내기"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>쪽지 보내기</span>
              </button>
            )}

            {/* Report Post */}
            <button
              onClick={() => onOpenReportModal('post', post.id, post.title, post.authorNickname)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="게시글 신고"
            >
              <AlertOctagon className="w-4 h-4" />
            </button>

            {/* Block Author */}
            {post.authorNickname !== currentUser.nickname && (
              <button
                onClick={() => {
                  if (isPostAuthorBlocked) {
                    onUnblockUser(post.authorNickname);
                  } else {
                    onBlockUser(post.authorNickname);
                  }
                }}
                className={`p-2 rounded-xl border transition-colors ${
                  isPostAuthorBlocked
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={isPostAuthorBlocked ? '작성자 차단 해제' : '작성자 차단'}
              >
                <UserX className="w-4 h-4" />
              </button>
            )}

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(post.id)}
              className={`p-2 rounded-xl border transition-colors ${
                post.isBookmarked
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              title="북마크"
            >
              <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-blue-600' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors"
              title="링크 복사"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              id="btn-close-post-detail"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="relative z-10 p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* Author Blocked Warning Banner */}
          {isPostAuthorBlocked && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-amber-600" />
                <span>현재 차단 목록에 등록된 사용자({post.authorNickname})의 게시물입니다.</span>
              </div>
              <button
                type="button"
                onClick={() => onUnblockUser(post.authorNickname)}
                className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-800 font-bold hover:bg-amber-100 transition-colors"
              >
                차단 해제
              </button>
            </div>
          )}

          {/* Author Meta Info */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {post.authorAgency.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-bold text-blue-700 text-xs px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    {post.authorAgency}
                  </span>
                  <span className="font-semibold text-slate-800 text-xs">
                    {post.authorNickname}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span>{post.createdAt}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> 조회 {post.views}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onOpenReportModal('user', post.id, `작성자 신고: ${post.authorNickname}`, post.authorNickname)
                }
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                사용자 신고
              </button>
            </div>
          </div>

          {/* Post Title */}
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
            {post.title}
          </h1>

          {/* Post Main Body */}
          <div className="space-y-4 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-normal">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    onClose();
                    onTagClick?.(tag);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-medium transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Interactive Poll Component */}
          {post.poll && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5 my-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vote className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-slate-900 text-sm">익명 투표</span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  총 {post.poll.totalVotes.toLocaleString()}명 투표
                </span>
              </div>

              <div className="font-semibold text-slate-800 text-sm">{post.poll.question}</div>

              <div className="space-y-2 pt-1">
                {post.poll.options.map((option) => {
                  const isVoted = post.poll?.userVotedOptionId === option.id;
                  const total = post.poll?.totalVotes || 1;
                  const percentage = total > 0 ? Math.round((option.votes / total) * 100) : 0;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onVotePoll(post.id, option.id)}
                      className={`relative w-full text-left p-3 rounded-xl border transition-all overflow-hidden ${
                        isVoted
                          ? 'border-blue-500 bg-blue-50/70 font-semibold'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Percentage Bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${
                          isVoted ? 'bg-blue-200/50' : 'bg-slate-100'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />

                      {/* Option Text and Stats */}
                      <div className="relative z-10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              isVoted
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isVoted && '✓'}
                          </div>
                          <span className="text-slate-800">{option.text}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-500">{option.votes}표</span>
                          <span className={`font-bold ${isVoted ? 'text-blue-700' : 'text-slate-700'}`}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                * 투표는 100% 익명으로 집계되며 다른 선택지를 클릭하여 변경할 수 있습니다.
              </p>
            </div>
          )}

          {/* Sympathy & Like / Dislike Dual Action Section */}
          <div className="py-6 flex flex-col items-center justify-center border-y border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                id="btn-like-post"
                type="button"
                onClick={() => onToggleLike(post.id)}
                className={`px-5 py-2.5 rounded-full border text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xs ${
                  post.isLiked
                    ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-rose-100'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>공감 {post.likes}</span>
              </button>

              {/* Dislike Button */}
              <button
                id="btn-dislike-post"
                type="button"
                onClick={() => onToggleDislike(post.id)}
                className={`px-5 py-2.5 rounded-full border text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xs ${
                  post.isDisliked
                    ? 'bg-slate-200 border-slate-400 text-slate-900 shadow-slate-200'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                <ThumbsDown
                  className={`w-4 h-4 ${
                    post.isDisliked ? 'fill-slate-800 text-slate-800' : ''
                  }`}
                />
                <span>비공감 {post.dislikes || 0}</span>
              </button>
            </div>
            <span className="text-[11px] text-slate-400">
              익명 평가이며 한 항목만 선택 가능합니다.
            </span>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-600" />
                댓글 <span className="text-blue-600">{post.commentsCount}</span>
              </h3>
              <span className="text-xs text-slate-400">최신순</span>
            </div>

            {/* Comment Input Box */}
            <form onSubmit={handleCommentSubmit} className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
                    {currentUser.showAgency ? currentUser.agencyName : '공무원'}
                  </span>
                  <span>{currentUser.nickname}</span>
                </div>
                <span className="text-[11px] text-slate-400">익명 보호</span>
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글을 남겨보세요. 서로를 존중하는 공직 문화를 함께 만듭니다."
                rows={2}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> 등록
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-3 pt-2">
              {post.comments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  아직 등록된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                </div>
              ) : (
                post.comments.map((comment) => {
                  const isCommentBlocked = currentUser.blockedUsers?.includes(comment.authorNickname);
                  const isRevealed = revealedCommentIds[comment.id];

                  if (isCommentBlocked && !isRevealed) {
                    return (
                      <div
                        key={comment.id}
                        className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-500"
                      >
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>차단한 사용자 ({comment.authorNickname})의 댓글입니다.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleRevealComment(comment.id)}
                            className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-600 hover:text-slate-900 font-medium text-[11px]"
                          >
                            보기
                          </button>
                          <button
                            type="button"
                            onClick={() => onUnblockUser(comment.authorNickname)}
                            className="px-2 py-0.5 bg-white rounded border border-rose-200 text-rose-600 font-medium text-[11px]"
                          >
                            차단 해제
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={comment.id}
                      className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {comment.authorAgency}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {comment.authorNickname}
                          </span>
                          {comment.isPostAuthor && (
                            <span className="px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">
                              작성자
                            </span>
                          )}
                          <span className="text-slate-400 text-[11px]">{comment.createdAt}</span>
                        </div>

                        {/* Comment Likes, Dislikes & More Menu */}
                        <div className="flex items-center gap-2">
                          {/* Like */}
                          <button
                            type="button"
                            onClick={() => onLikeComment(post.id, comment.id)}
                            className={`flex items-center gap-1 transition-colors ${
                              comment.isLiked
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-400 hover:text-rose-600'
                            }`}
                            title="댓글 좋아요"
                          >
                            <Heart
                              className={`w-3 h-3 ${
                                comment.isLiked ? 'fill-rose-600 text-rose-600' : ''
                              }`}
                            />
                            <span>{comment.likes}</span>
                          </button>

                          {/* Dislike */}
                          <button
                            type="button"
                            onClick={() => onDislikeComment(post.id, comment.id)}
                            className={`flex items-center gap-1 transition-colors ${
                              comment.isDisliked
                                ? 'text-slate-900 font-bold'
                                : 'text-slate-400 hover:text-slate-900'
                            }`}
                            title="댓글 비공감"
                          >
                            <ThumbsDown
                              className={`w-3 h-3 ${
                                comment.isDisliked ? 'fill-slate-700 text-slate-700' : ''
                              }`}
                            />
                            <span>{comment.dislikes || 0}</span>
                          </button>

                          {/* Comment Options Dropdown */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveCommentMenuId(
                                  activeCommentMenuId === comment.id ? null : comment.id
                                )
                              }
                              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {activeCommentMenuId === comment.id && (
                              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 animate-in fade-in">
                                {onSendDirectMessage && comment.authorNickname !== currentUser.nickname && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveCommentMenuId(null);
                                      onSendDirectMessage(
                                        comment.authorNickname,
                                        comment.authorAgency,
                                        `댓글 남겨주신 내용 보고 쪽지 드립니다: "${comment.content.slice(0, 20)}..."`
                                      );
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-1.5 font-medium"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    쪽지 보내기
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveCommentMenuId(null);
                                    onOpenReportModal(
                                      'comment',
                                      comment.id,
                                      comment.content,
                                      comment.authorNickname
                                    );
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                                >
                                  <AlertOctagon className="w-3 h-3" />
                                  댓글 신고
                                </button>
                                {comment.authorNickname !== currentUser.nickname && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveCommentMenuId(null);
                                      onBlockUser(comment.authorNickname);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                                  >
                                    <UserX className="w-3 h-3" />
                                    작성자 차단
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-700 leading-relaxed whitespace-pre-line pl-1">
                        {comment.content}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setReplyTargetId(replyTargetId === comment.id ? null : comment.id)
                          }
                          className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          {replyTargetId === comment.id ? '답글 닫기' : '답글 달기'}
                        </button>
                      </div>

                      {/* Inline Reply Form */}
                      {replyTargetId === comment.id && (
                        <div className="mt-2 pl-4 border-l-2 border-blue-400 space-y-2 animate-in fade-in">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="답글을 입력하세요..."
                              className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleReplySubmit(comment.id);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleReplySubmit(comment.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                            >
                              작성
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Nested replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-slate-200">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="p-2.5 bg-slate-50 rounded-lg space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-slate-800 text-[11px]">
                                    {reply.authorAgency} · {reply.authorNickname}
                                  </span>
                                  {reply.isPostAuthor && (
                                    <span className="px-1 py-0.2 rounded-sm bg-blue-100 text-blue-700 text-[9px] font-bold">
                                      원작자
                                    </span>
                                  )}
                                  <span className="text-slate-400 text-[10px]">
                                    {reply.createdAt}
                                  </span>
                                </div>
                              </div>
                              <p className="text-slate-700 leading-relaxed">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
