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
  Flame,
  AlertOctagon,
  UserX,
  MoreHorizontal,
  EyeOff,
} from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  isAuthorBlocked?: boolean;
  onOpenDetail: (post: Post) => void;
  onToggleLike: (postId: string, e: React.MouseEvent) => void;
  onToggleDislike: (postId: string, e: React.MouseEvent) => void;
  onToggleBookmark: (postId: string, e: React.MouseEvent) => void;
  onTagClick?: (tag: string, e: React.MouseEvent) => void;
  onReportPost?: (post: Post, e: React.MouseEvent) => void;
  onBlockAuthor?: (authorNickname: string, e: React.MouseEvent) => void;
  onUnblockAuthor?: (authorNickname: string, e: React.MouseEvent) => void;
  onSendDirectMessage?: (authorNickname: string, authorAgency: string, initialContext?: string) => void;
}

export default function PostCard({
  post,
  isAuthorBlocked = false,
  onOpenDetail,
  onToggleLike,
  onToggleDislike,
  onToggleBookmark,
  onTagClick,
  onReportPost,
  onBlockAuthor,
  onUnblockAuthor,
  onSendDirectMessage,
}: PostCardProps) {
  const [showBlockedContent, setShowBlockedContent] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    alert('게시글 링크가 클립보드에 복사되었습니다.');
  };

  // If author is blocked and user has not clicked 'show anyway'
  if (isAuthorBlocked && !showBlockedContent) {
    return (
      <div
        id={`post-card-blocked-${post.id}`}
        className="p-4 bg-slate-100/80 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-500"
      >
        <div className="flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-slate-400" />
          <span>
            차단된 사용자 (<strong>{post.authorNickname}</strong>)의 게시물입니다.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowBlockedContent(true);
            }}
            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white rounded-lg border border-slate-200 font-medium transition-colors"
          >
            내용 보기
          </button>
          {onUnblockAuthor && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUnblockAuthor(post.authorNickname, e);
              }}
              className="px-2.5 py-1 text-rose-600 hover:text-rose-700 bg-white rounded-lg border border-rose-200 font-medium transition-colors"
            >
              차단 해제
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <article
      id={`post-card-${post.id}`}
      onClick={() => onOpenDetail(post)}
      className={`p-5 sm:p-6 bg-white rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between relative ${
        post.isBlockedByAdmin
          ? 'border-rose-300 bg-rose-50/20'
          : 'border-slate-200/85 hover:border-blue-400/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {post.isBlockedByAdmin && (
        <div className="mb-2 px-3 py-1 bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold rounded-lg flex items-center gap-1.5">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>관리자에 의해 블라인드(숨김) 조치된 게시글입니다.</span>
        </div>
      )}

      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Agency Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-800 border border-blue-200 text-[11px]">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              {post.authorAgency}
            </span>
            <span className="text-slate-300">·</span>
            <span className="font-semibold text-slate-700 truncate max-w-[120px]">
              {post.authorNickname}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400 text-[11px]">{post.createdAt}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {post.isHot && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-600 border border-rose-200 text-[10px] uppercase">
                <Flame className="w-3 h-3 text-rose-500 fill-rose-500" /> HOT
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
              {post.categoryName}
            </span>

            {/* Quick action menu */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="더보기"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 animate-in fade-in"
                >
                  {onSendDirectMessage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onSendDirectMessage(
                          post.authorNickname,
                          post.authorAgency,
                          `안녕하세요! 작성하신 글 [${post.title.slice(0, 18)}...] 보고 쪽지 드립니다.`
                        );
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      쪽지 보내기
                    </button>
                  )}
                  {onReportPost && (
                    <button
                      type="button"
                      onClick={(e) => {
                        setShowMenu(false);
                        onReportPost(post, e);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      신고하기
                    </button>
                  )}
                  {onBlockAuthor && (
                    <button
                      type="button"
                      onClick={(e) => {
                        setShowMenu(false);
                        onBlockAuthor(post.authorNickname, e);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      작성자 차단
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
          {post.title}
        </h3>

        {/* Content excerpt */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3.5">
          {post.content}
        </p>

        {/* Poll Indicator if present */}
        {post.poll && (
          <div className="mb-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
              <Vote className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">투표: {post.poll.question}</span>
            </div>
            <span className="text-[11px] text-blue-600 font-semibold shrink-0 ml-2">
              {post.poll.totalVotes}명 참여 중
            </span>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => onTagClick?.(tag, e)}
                className="text-[11px] font-medium text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded-md transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics & Actions: 좋아요 and 싫어요 */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          {/* Views */}
          <div className="flex items-center gap-1 text-[11px]">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.views}</span>
          </div>

          {/* Likes (좋아요) */}
          <button
            type="button"
            onClick={(e) => onToggleLike(post.id, e)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg transition-colors ${
              post.isLiked
                ? 'text-rose-600 bg-rose-50 font-bold'
                : 'hover:text-rose-600 hover:bg-rose-50/50'
            }`}
            title="좋아요 (공감)"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                post.isLiked ? 'fill-rose-600 text-rose-600' : 'text-slate-400'
              }`}
            />
            <span>{post.likes}</span>
          </button>

          {/* Dislikes (싫어요 / 비공감) */}
          <button
            type="button"
            onClick={(e) => onToggleDislike(post.id, e)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg transition-colors ${
              post.isDisliked
                ? 'text-slate-900 bg-slate-200 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="싫어요 (비공감)"
          >
            <ThumbsDown
              className={`w-3.5 h-3.5 ${
                post.isDisliked ? 'fill-slate-700 text-slate-700' : 'text-slate-400'
              }`}
            />
            <span>{post.dislikes || 0}</span>
          </button>

          {/* Comments count */}
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.commentsCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => onToggleBookmark(post.id, e)}
            title="북마크"
            className={`p-1.5 rounded-lg transition-colors ${
              post.isBookmarked
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                post.isBookmarked ? 'fill-blue-600 text-blue-600' : ''
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleShare}
            title="공유"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
