import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TrendingWidget from './components/TrendingWidget';
import PostCard from './components/PostCard';
import PostDetailModal from './components/PostDetailModal';
import CreatePostModal from './components/CreatePostModal';
import AgencyVerifyModal from './components/AgencyVerifyModal';
import SalaryCalculatorModal from './components/SalaryCalculatorModal';
import ReportModal from './components/ReportModal';
import AdminReportModal from './components/AdminReportModal';
import BlockManagementModal from './components/BlockManagementModal';
import DirectMessagesModal from './components/DirectMessagesModal';
import DatingSection from './components/DatingSection';
import EditDatingProfileModal from './components/EditDatingProfileModal';
import BackgroundMusicPlayer from './components/BackgroundMusicPlayer';
import {
  AgencyCategory,
  Post,
  ReportItem,
  ReportTargetType,
  SortOrder,
  UserProfile,
  DirectConversation,
  DirectMessage,
  DatingProfile,
  ContactExchangeInfo,
} from './types';
import {
  INITIAL_POSTS,
  INITIAL_USER,
  BOARD_CATEGORIES,
  INITIAL_DATING_PROFILES,
  INITIAL_CONVERSATIONS,
} from './data/mockData';
import { generateUniqueNickname } from './utils/nicknameGenerator';
import { generateSmartReply } from './utils/datingReplies';
import {
  Filter,
  PenSquare,
  RefreshCcw,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  UserX,
  AlertOctagon,
  Heart,
  MessageSquare,
  Search,
  X,
  Trash2,
} from 'lucide-react';

const STORAGE_POSTS_KEY = 'gblind_posts_v1';
const STORAGE_USER_KEY = 'gblind_user_v1';
const STORAGE_REPORTS_KEY = 'gblind_reports_v1';
const STORAGE_CONVERSATIONS_KEY = 'gblind_conversations_v1';
const STORAGE_DATING_KEY = 'gblind_dating_profiles_v1';
const STORAGE_MY_DATING_KEY = 'gblind_my_dating_profile_v1';

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'report-demo-1',
    targetType: 'post',
    targetId: 'post-1',
    targetTitleOrExcerpt: '2026년 공무원 봉급표 확정안 및 기본급 인상률 체감',
    targetAuthor: '기재부_예산돌이',
    reason: '공직 기밀 및 직무상 비밀/보안 정보 누설',
    details: '아직 대외 공개되지 않은 부처 내부 품의 서식과 관련된 내용이 포함되어 있는지 확인 부탁드립니다.',
    reportedAt: '10분 전',
    status: 'pending',
  },
  {
    id: 'report-demo-2',
    targetType: 'comment',
    targetId: 'c-demo-1',
    targetTitleOrExcerpt: '특정 과장님 성향 실명 언급 및 인신공격',
    targetAuthor: '새벽근무자9호봉',
    reason: '특정 공직자/민원인 개인정보 신상 털기 및 사생활 침해',
    details: '지자체 특정 과 부서원만 알 수 있는 직속 상사 호칭을 적시해 비방하고 있습니다.',
    reportedAt: '1시간 전',
    status: 'action_taken',
    actionNote: '블라인드 숨김 조치 완료',
  },
];

export default function App() {
  // Load posts from localStorage or mockData
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POSTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_POSTS;
  });

  // Load user profile, auto-generating a unique anonymous nickname if first visit
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const initialNick = generateUniqueNickname([]);
    return {
      ...INITIAL_USER,
      nickname: initialNick,
      blockedUsers: [],
    };
  });

  // Reports state for admin moderation
  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REPORTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REPORTS;
  });

  // Main View Switcher: 'community' (게시판) or 'dating' (공무원 소개팅)
  const [activeMainView, setActiveMainView] = useState<'community' | 'dating'>('community');

  // Direct Messages Conversations state
  const [conversations, setConversations] = useState<DirectConversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONVERSATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CONVERSATIONS;
  });

  // Dating Profiles state
  const [datingProfiles, setDatingProfiles] = useState<DatingProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DATING_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_DATING_PROFILES;
  });

  // My Dating Profile
  const [myDatingProfile, setMyDatingProfile] = useState<DatingProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MY_DATING_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Navigation & Filtering
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [selectedAgencyCategory, setSelectedAgencyCategory] = useState<AgencyCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeKeyword, setActiveKeyword] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');

  // Modals
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState<boolean>(false);
  const [isAdminReportsOpen, setIsAdminReportsOpen] = useState<boolean>(false);
  const [isBlockManagementOpen, setIsBlockManagementOpen] = useState<boolean>(false);
  const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState<boolean>(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isEditDatingProfileOpen, setIsEditDatingProfileOpen] = useState<boolean>(false);

  // Report Modal state
  const [reportModalData, setReportModalData] = useState<{
    isOpen: boolean;
    targetType: ReportTargetType;
    targetId: string;
    targetTitleOrExcerpt: string;
    targetAuthor: string;
  }>({
    isOpen: false,
    targetType: 'post',
    targetId: '',
    targetTitleOrExcerpt: '',
    targetAuthor: '',
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
    } catch {
      // ignore
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch {
      // ignore
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DATING_KEY, JSON.stringify(datingProfiles));
    } catch {
      // ignore
    }
  }, [datingProfiles]);

  useEffect(() => {
    try {
      if (myDatingProfile) {
        localStorage.setItem(STORAGE_MY_DATING_KEY, JSON.stringify(myDatingProfile));
      } else {
        localStorage.removeItem(STORAGE_MY_DATING_KEY);
      }
    } catch {
      // ignore
    }
  }, [myDatingProfile]);

  // Keep selectedPost synced when posts change
  useEffect(() => {
    if (selectedPost) {
      const updated = posts.find((p) => p.id === selectedPost.id);
      if (updated) setSelectedPost(updated);
    }
  }, [posts]);

  // Collect all currently registered nicknames in posts and comments for uniqueness check
  const existingNicknames = useMemo(() => {
    const nickSet = new Set<string>();
    nickSet.add(currentUser.nickname);
    posts.forEach((p) => {
      nickSet.add(p.authorNickname);
      p.comments.forEach((c) => {
        nickSet.add(c.authorNickname);
        c.replies?.forEach((r) => nickSet.add(r.authorNickname));
      });
    });
    return Array.from(nickSet);
  }, [posts, currentUser.nickname]);

  // Filter and Sort Logic
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // Exclude posts from blocked authors
        if (currentUser.blockedUsers?.includes(post.authorNickname)) return false;

        const hasSearch = Boolean(searchQuery.trim());

        // Category filter: when global search is not active, apply currentCategory filter.
        // When searching, search across all boards so keywords like '악성민원' are found everywhere!
        if (!hasSearch) {
          if (currentCategory === 'best') {
            if (!post.isHot && post.likes < 10) return false;
          } else if (currentCategory === 'poll') {
            if (!post.poll) return false;
          } else if (currentCategory !== 'all') {
            if (post.categoryId !== currentCategory) return false;
          }

          // Agency category filter
          if (selectedAgencyCategory !== 'all') {
            if (post.authorAgencyCategory !== selectedAgencyCategory) return false;
          }
        } else {
          // If search is active, still respect agency category filter if user explicitly chose one
          if (selectedAgencyCategory !== 'all') {
            if (post.authorAgencyCategory !== selectedAgencyCategory) return false;
          }
        }

        // Search Query filter: matches title, content, agency, author, category, or tags
        if (hasSearch) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = post.title.toLowerCase().includes(q);
          const matchContent = post.content.toLowerCase().includes(q);
          const matchAgency = post.authorAgency.toLowerCase().includes(q);
          const matchAuthor = post.authorNickname.toLowerCase().includes(q);
          const matchCategory = post.categoryName.toLowerCase().includes(q);
          const matchTags = post.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchContent && !matchAgency && !matchAuthor && !matchCategory && !matchTags) {
            return false;
          }
        }

        // Active Keyword filter
        if (activeKeyword.trim()) {
          const k = activeKeyword.toLowerCase().trim();
          const matchTags = post.tags?.some((t) => t.toLowerCase().includes(k));
          const matchTitle = post.title.toLowerCase().includes(k);
          const matchContent = post.content.toLowerCase().includes(k);
          if (!matchTags && !matchTitle && !matchContent) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'popular') return b.likes - a.likes;
        if (sortOrder === 'comments') return b.commentsCount - a.commentsCount;
        return 0; // default latest based on original array order
      });
  }, [posts, currentCategory, selectedAgencyCategory, searchQuery, activeKeyword, sortOrder, currentUser.blockedUsers]);

  // Count matching dating profiles for the active search query
  const matchingDatingProfilesCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase().trim();
    return datingProfiles.filter((p) => {
      if (currentUser.blockedUsers?.includes(p.userNickname)) return false;
      const matchNick = p.userNickname.toLowerCase().includes(q);
      const matchAgency = p.agencyName.toLowerCase().includes(q);
      const matchSeries = p.jobSeries.toLowerCase().includes(q);
      const matchRegion = p.regionLabel.toLowerCase().includes(q);
      const matchMbti = p.mbti.toLowerCase().includes(q);
      const matchIntro = p.introduction.toLowerCase().includes(q);
      const matchHobbies = p.hobbies.some((h) => h.toLowerCase().includes(q));
      const matchIdeal = p.idealType.toLowerCase().includes(q);
      return (
        matchNick ||
        matchAgency ||
        matchSeries ||
        matchRegion ||
        matchMbti ||
        matchIntro ||
        matchHobbies ||
        matchIdeal
      );
    }).length;
  }, [datingProfiles, currentUser.blockedUsers, searchQuery]);

  // Global search submit handler
  const handleSearchSubmit = (query: string) => {
    const q = query.trim();
    setSearchQuery(q);
    if (!q) return;

    // Reset board category so global search covers all categories
    setCurrentCategory('all');

    const qLower = q.toLowerCase();
    const hasDatingMatches = datingProfiles.some(
      (p) =>
        !currentUser.blockedUsers?.includes(p.userNickname) &&
        (p.userNickname.toLowerCase().includes(qLower) ||
          p.agencyName.toLowerCase().includes(qLower) ||
          p.jobSeries.toLowerCase().includes(qLower) ||
          p.introduction.toLowerCase().includes(qLower) ||
          p.hobbies.some((h) => h.toLowerCase().includes(qLower)))
    );

    const hasPostMatches = posts.some(
      (p) =>
        !currentUser.blockedUsers?.includes(p.authorNickname) &&
        (p.title.toLowerCase().includes(qLower) ||
          p.content.toLowerCase().includes(qLower) ||
          p.authorAgency.toLowerCase().includes(qLower) ||
          p.tags?.some((t) => t.toLowerCase().includes(qLower)))
    );

    // If currently on dating view and query matches posts but no dating profiles, switch to community feed
    if (activeMainView === 'dating' && !hasDatingMatches && hasPostMatches) {
      setActiveMainView('community');
    }
  };

  // User Actions: Block & Unblock
  const handleBlockUser = (nicknameToBlock: string) => {
    if (!nicknameToBlock || nicknameToBlock === currentUser.nickname) return;
    if (currentUser.blockedUsers?.includes(nicknameToBlock)) return;

    setCurrentUser((prev) => ({
      ...prev,
      blockedUsers: [...(prev.blockedUsers || []), nicknameToBlock],
    }));
  };

  const handleUnblockUser = (nicknameToUnblock: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      blockedUsers: (prev.blockedUsers || []).filter((nick) => nick !== nicknameToUnblock),
    }));
  };

  // Report Handling
  const handleOpenReportModal = (
    targetType: ReportTargetType,
    targetId: string,
    targetTitleOrExcerpt: string,
    targetAuthor: string
  ) => {
    setReportModalData({
      isOpen: true,
      targetType,
      targetId,
      targetTitleOrExcerpt,
      targetAuthor,
    });
  };

  const handleSubmitReport = (
    reportData: Omit<ReportItem, 'id' | 'reportedAt' | 'status'>,
    alsoBlockAuthor?: boolean
  ) => {
    const newReport: ReportItem = {
      ...reportData,
      id: `report-${Date.now()}`,
      reportedAt: '방금 전',
      status: 'pending',
    };
    setReports((prev) => [newReport, ...prev]);

    if (alsoBlockAuthor && reportData.targetAuthor) {
      handleBlockUser(reportData.targetAuthor);
    }
  };

  const handleAdminTakeAction = (reportId: string, action: 'hide' | 'ban_user' | 'dismiss') => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    if (action === 'hide') {
      // Hide post or comment
      if (report.targetType === 'post') {
        setPosts((prev) =>
          prev.map((p) => (p.id === report.targetId ? { ...p, isBlockedByAdmin: true } : p))
        );
      } else if (report.targetType === 'comment') {
        setPosts((prev) =>
          prev.map((p) => ({
            ...p,
            comments: p.comments.map((c) =>
              c.id === report.targetId
                ? { ...c, content: '[관리자에 의해 블라인드 처리된 댓글입니다]' }
                : c
            ),
          }))
        );
      }
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: 'action_taken', actionNote: '블라인드(숨김) 조치 완료' }
            : r
        )
      );
    } else if (action === 'ban_user') {
      // Block user
      handleBlockUser(report.targetAuthor);
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: 'action_taken', actionNote: `작성자(${report.targetAuthor}) 차단 조치` }
            : r
        )
      );
    } else if (action === 'dismiss') {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: 'dismissed', actionNote: '이상 없음 (반려)' }
            : r
        )
      );
    }
  };

  const handleClearAllReports = () => {
    if (confirm('모든 신고 내역을 비우시겠습니까?')) {
      setReports([]);
    }
  };

  // Add Post
  const handleAddPost = (
    newPostData: Omit<Post, 'id' | 'createdAt' | 'views' | 'likes' | 'dislikes' | 'commentsCount' | 'comments'>
  ) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: '방금 전',
      views: 1,
      likes: 0,
      dislikes: 0,
      commentsCount: 0,
      comments: [],
      isLiked: false,
      isDisliked: false,
      isBookmarked: false,
    };
    setPosts([newPost, ...posts]);
    setSelectedPost(newPost);
  };

  // Toggle Like with mutual exclusivity against Dislike
  const handleToggleLike = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const willBeLiked = !p.isLiked;
        return {
          ...p,
          isLiked: willBeLiked,
          likes: willBeLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          // If was disliked, cancel dislike
          isDisliked: willBeLiked ? false : p.isDisliked,
          dislikes: willBeLiked && p.isDisliked ? Math.max(0, (p.dislikes || 1) - 1) : p.dislikes || 0,
        };
      })
    );
  };

  // Toggle Dislike with mutual exclusivity against Like
  const handleToggleDislike = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const willBeDisliked = !p.isDisliked;
        return {
          ...p,
          isDisliked: willBeDisliked,
          dislikes: willBeDisliked ? (p.dislikes || 0) + 1 : Math.max(0, (p.dislikes || 1) - 1),
          // If was liked, cancel like
          isLiked: willBeDisliked ? false : p.isLiked,
          likes: willBeDisliked && p.isLiked ? Math.max(0, p.likes - 1) : p.likes,
        };
      })
    );
  };

  const handleToggleBookmark = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, isBookmarked: !p.isBookmarked };
      })
    );
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.poll) return p;
        const currentVoted = p.poll.userVotedOptionId;
        if (currentVoted === optionId) return p;

        const updatedOptions = p.poll.options.map((opt) => {
          if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
          if (opt.id === currentVoted) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });

        const newTotal = currentVoted ? p.poll.totalVotes : p.poll.totalVotes + 1;

        return {
          ...p,
          poll: {
            ...p.poll,
            options: updatedOptions,
            totalVotes: newTotal,
            userVotedOptionId: optionId,
          },
        };
      })
    );
  };

  const handleAddComment = (postId: string, content: string, parentCommentId?: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const authorAgency = currentUser.showAgency ? currentUser.agencyName : '공무원';

        if (parentCommentId) {
          const updatedComments = p.comments.map((c) => {
            if (c.id !== parentCommentId) return c;
            return {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `rep-${Date.now()}`,
                  authorNickname: currentUser.nickname,
                  authorAgency,
                  content,
                  createdAt: '방금 전',
                  likes: 0,
                  dislikes: 0,
                  isPostAuthor: currentUser.nickname === p.authorNickname,
                },
              ],
            };
          });
          return {
            ...p,
            comments: updatedComments,
            commentsCount: p.commentsCount + 1,
          };
        } else {
          const newComment = {
            id: `c-${Date.now()}`,
            authorNickname: currentUser.nickname,
            authorAgency,
            content,
            createdAt: '방금 전',
            likes: 0,
            dislikes: 0,
            isPostAuthor: currentUser.nickname === p.authorNickname,
            replies: [],
          };
          return {
            ...p,
            comments: [newComment, ...p.comments],
            commentsCount: p.commentsCount + 1,
          };
        }
      })
    );
  };

  // Comment Like and Dislike handlers
  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const updated = p.comments.map((c) => {
          if (c.id !== commentId) return c;
          const willBeLiked = !c.isLiked;
          return {
            ...c,
            isLiked: willBeLiked,
            likes: willBeLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
            isDisliked: willBeLiked ? false : c.isDisliked,
            dislikes: willBeLiked && c.isDisliked ? Math.max(0, (c.dislikes || 1) - 1) : c.dislikes || 0,
          };
        });
        return { ...p, comments: updated };
      })
    );
  };

  const handleDislikeComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const updated = p.comments.map((c) => {
          if (c.id !== commentId) return c;
          const willBeDisliked = !c.isDisliked;
          return {
            ...c,
            isDisliked: willBeDisliked,
            dislikes: willBeDisliked ? (c.dislikes || 0) + 1 : Math.max(0, (c.dislikes || 1) - 1),
            isLiked: willBeDisliked ? false : c.isLiked,
            likes: willBeDisliked && c.isLiked ? Math.max(0, c.likes - 1) : c.likes,
          };
        });
        return { ...p, comments: updated };
      })
    );
  };

  // Direct Messages & Dating Handlers
  const handleOpenDirectMessages = (
    partnerNickname?: string,
    partnerAgency?: string,
    initialMessage?: string
  ) => {
    if (partnerNickname && partnerNickname !== currentUser.nickname) {
      // Find existing conversation
      const existing = conversations.find((c) => c.partnerNickname === partnerNickname);
      if (existing) {
        if (initialMessage) {
          const newMsg: DirectMessage = {
            id: `msg-${Date.now()}`,
            senderNickname: currentUser.nickname,
            senderAgency: currentUser.agencyName,
            content: initialMessage,
            createdAt: '방금 전',
            isMe: true,
            isRead: true,
          };
          setConversations((prev) =>
            prev.map((c) =>
              c.id === existing.id
                ? {
                    ...c,
                    messages: [...c.messages, newMsg],
                    lastMessage: initialMessage,
                    updatedAt: '방금 전',
                  }
                : c
            )
          );
        }
        setActiveConversationId(existing.id);
      } else {
        // Create new conversation
        const newMsgList: DirectMessage[] = initialMessage
          ? [
              {
                id: `msg-${Date.now()}`,
                senderNickname: currentUser.nickname,
                senderAgency: currentUser.agencyName,
                content: initialMessage,
                createdAt: '방금 전',
                isMe: true,
                isRead: true,
              },
            ]
          : [];

        const matchingProfile = datingProfiles.find((p) => p.userNickname === partnerNickname);

        const newConv: DirectConversation = {
          id: `conv-${Date.now()}`,
          partnerNickname,
          partnerAgency: partnerAgency || matchingProfile?.agencyName || '공직자',
          partnerAvatarEmoji: matchingProfile?.avatarEmoji || '🌸',
          partnerAvatarBgColor: matchingProfile?.avatarBgColor || 'bg-rose-100 text-rose-700',
          matchingStatus: 'none',
          partnerContactInfo: matchingProfile?.defaultContactInfo,
          messages: newMsgList,
          lastMessage: initialMessage || '쪽지 대화가 시작되었습니다.',
          updatedAt: '방금 전',
          unreadCount: 0,
        };

        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
      }
    } else if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
    setIsDirectMessagesOpen(true);
  };

  const handleDeleteMessage = (conversationId: string, messageId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const remaining = c.messages.filter((m) => m.id !== messageId);
        const lastMsg = remaining.length > 0 ? remaining[remaining.length - 1] : null;
        return {
          ...c,
          messages: remaining,
          lastMessage: lastMsg ? lastMsg.content : '쪽지가 삭제되었습니다.',
          lastMessageTime: lastMsg ? lastMsg.createdAt : '방금 전',
          updatedAt: '방금 전',
        };
      })
    );
  };

  const handleSendMessage = async (
    conversationId: string,
    text: string,
    image?: { url: string; name?: string }
  ) => {
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderNickname: currentUser.nickname,
      senderAgency: currentUser.agencyName,
      content: text,
      imageUrl: image?.url,
      imageName: image?.name,
      createdAt: '방금 전',
      isMe: true,
      isRead: true,
    };

    const displayText = text || (image ? `[사진] ${image.name || '이미지 첨부'}` : '');

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: displayText,
          updatedAt: '방금 전',
        };
      })
    );

    // Interactive smart reply: simulate partner replying with topic-appropriate response
    const targetConv = conversations.find((c) => c.id === conversationId);
    if (targetConv && !targetConv.isPartnerBlocked) {
      const matchingProfile = datingProfiles.find(
        (p) => p.id === targetConv.datingProfileId || p.userNickname === targetConv.partnerNickname
      );

      // Attempt AI smart reply via backend proxy, fallback to client smart rules
      let smartReplyText = '';
      try {
        const res = await fetch('/api/chat-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partnerNickname: targetConv.partnerNickname,
            partnerAgency: targetConv.partnerAgency,
            jobSeries: matchingProfile?.jobSeries,
            region: matchingProfile?.regionLabel,
            birthYear: matchingProfile?.birthYear,
            hobbies: matchingProfile?.hobbies,
            mbti: matchingProfile?.mbti,
            isDating: Boolean(targetConv.datingProfileId || matchingProfile),
            conversationHistory: targetConv.messages.slice(-6).map((m) => ({
              isMe: m.isMe,
              content: m.content,
            })),
            userMessage: text,
            hasImage: Boolean(image),
            imageName: image?.name,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reply) {
            smartReplyText = data.reply;
          }
        }
      } catch {
        // Fallback gracefully
      }

      if (!smartReplyText) {
        smartReplyText = generateSmartReply(
          targetConv,
          text,
          matchingProfile,
          Boolean(image),
          image?.name
        );
      }

      setTimeout(() => {
        const replyMsg: DirectMessage = {
          id: `msg-reply-${Date.now()}`,
          senderNickname: targetConv.partnerNickname,
          senderAgency: targetConv.partnerAgency,
          content: smartReplyText,
          createdAt: '방금 전',
          isMe: false,
          isRead: false,
        };

        setConversations((currentList) =>
          currentList.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: [...c.messages, replyMsg],
              lastMessage: smartReplyText,
              updatedAt: '방금 전',
              unreadCount: c.id === activeConversationId ? 0 : c.unreadCount + 1,
            };
          })
        );
      }, 1000);
    }
  };

  const handleStartNewConversation = (
    partnerNickname: string,
    partnerAgency: string,
    initialMessage?: string
  ): string => {
    const existing = conversations.find((c) => c.partnerNickname === partnerNickname);
    if (existing) {
      if (initialMessage) {
        handleSendMessage(existing.id, initialMessage);
      }
      setActiveConversationId(existing.id);
      return existing.id;
    }

    const matchingProfile = datingProfiles.find((p) => p.userNickname === partnerNickname);
    const newId = `conv-${Date.now()}`;
    const newMsgList: DirectMessage[] = initialMessage
      ? [
          {
            id: `msg-${Date.now()}`,
            senderNickname: currentUser.nickname,
            senderAgency: currentUser.agencyName,
            content: initialMessage,
            createdAt: '방금 전',
            isMe: true,
            isRead: true,
          },
        ]
      : [];

    const newConv: DirectConversation = {
      id: newId,
      partnerNickname,
      partnerAgency: partnerAgency || matchingProfile?.agencyName || '공직자',
      partnerAvatarEmoji: matchingProfile?.avatarEmoji || '🌸',
      partnerAvatarBgColor: matchingProfile?.avatarBgColor || 'bg-rose-100 text-rose-700',
      matchingStatus: 'none',
      partnerContactInfo: matchingProfile?.defaultContactInfo,
      messages: newMsgList,
      lastMessage: initialMessage || '쪽지 대화가 시작되었습니다.',
      updatedAt: '방금 전',
      unreadCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  const handleRequestMatch = (conversationId: string, contactInfo: ContactExchangeInfo) => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              matchingStatus: 'requested_by_me',
              myContactInfo: contactInfo,
            }
          : c
      )
    );

    // Simulated interactive partner acceptance after 2.5s for demo experience!
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          if (c.matchingStatus !== 'requested_by_me') return c;

          const matchNoticeMsg: DirectMessage = {
            id: `msg-matched-${Date.now()}`,
            senderNickname: c.partnerNickname,
            senderAgency: c.partnerAgency,
            content: `🎉 ${c.partnerNickname} 님께서 매칭을 수락하셨습니다! 이제 상호 연락처가 안전하게 교환되었습니다. 축하드립니다!`,
            createdAt: '방금 전',
            isMe: false,
            isRead: false,
          };

          return {
            ...c,
            matchingStatus: 'matched',
            messages: [...c.messages, matchNoticeMsg],
            lastMessage: '🎉 상호 매칭이 성사되었습니다!',
            partnerContactInfo: c.partnerContactInfo || {
              contactType: 'kakao',
              contactValue: c.partnerNickname.slice(0, 3) + '_gov77',
              note: '매칭되어 기뻐요! 카카오톡으로 편하게 연락주세요 :)',
            },
          };
        })
      );
    }, 2500);
  };

  const handleAcceptMatch = (conversationId: string, contactInfo: ContactExchangeInfo) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const acceptNoticeMsg: DirectMessage = {
          id: `msg-matched-accepted-${Date.now()}`,
          senderNickname: '시스템 알림',
          senderAgency: 'G-BLIND 안심매칭',
          content: `🎉 상호 매칭이 성공적으로 성사되었습니다! 이제 하단에서 ${c.partnerNickname} 님의 연락처를 확인하실 수 있습니다.`,
          createdAt: '방금 전',
          isMe: false,
          isRead: true,
        };
        return {
          ...c,
          matchingStatus: 'matched',
          myContactInfo: contactInfo,
          messages: [...c.messages, acceptNoticeMsg],
          lastMessage: '🎉 상호 매칭이 성사되었습니다!',
          partnerContactInfo: c.partnerContactInfo || {
            contactType: 'kakao',
            contactValue: c.partnerNickname.slice(0, 4) + '_talk',
            note: '매칭 감사합니다! 주말에 시간 되실 때 편하게 톡 주세요 ^^',
          },
        };
      })
    );
  };

  const handleDeclineMatch = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, matchingStatus: 'declined' } : c))
    );
  };

  const handleCancelMatch = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, matchingStatus: 'none' } : c))
    );
  };

  const handleToggleLikeProfile = (profileId: string) => {
    setDatingProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profileId) return p;
        const willLike = !p.isLikedByMe;
        return {
          ...p,
          isLikedByMe: willLike,
          likesCount: willLike ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      })
    );
  };

  const handleSaveMyDatingProfile = (profile: DatingProfile) => {
    setMyDatingProfile(profile);
    setDatingProfiles((prev) => {
      const idx = prev.findIndex((p) => p.userNickname === currentUser.nickname);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = profile;
        return next;
      } else {
        return [profile, ...prev];
      }
    });
  };

  const handleResetData = () => {
    if (confirm('초기 데모 데이터로 재설정하시겠습니까? (작성한 글, 소개팅 프로필, 쪽지 대화가 초기화됩니다)')) {
      setPosts(INITIAL_POSTS);
      const initialNick = generateUniqueNickname([]);
      const freshUser = { ...INITIAL_USER, nickname: initialNick, blockedUsers: [] };
      setCurrentUser(freshUser);
      setReports(INITIAL_REPORTS);
      setConversations(INITIAL_CONVERSATIONS);
      setDatingProfiles(INITIAL_DATING_PROFILES);
      setMyDatingProfile(null);
      localStorage.removeItem(STORAGE_POSTS_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_REPORTS_KEY);
      localStorage.removeItem(STORAGE_CONVERSATIONS_KEY);
      localStorage.removeItem(STORAGE_DATING_KEY);
      localStorage.removeItem(STORAGE_MY_DATING_KEY);
    }
  };

  const currentBoardInfo =
    BOARD_CATEGORIES.find((b) => b.id === currentCategory) || BOARD_CATEGORIES[0];

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const blockedUsersCount = currentUser.blockedUsers?.length || 0;

  const unreadMessagesCount = useMemo(() => {
    return conversations
      .filter((c) => !currentUser.blockedUsers?.includes(c.partnerNickname))
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [conversations, currentUser.blockedUsers]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Header with quick tools, block manager, report center */}
      <Header
        currentUser={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onOpenCreatePost={() => setIsCreateModalOpen(true)}
        onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        onOpenSalaryCalculator={() => setIsSalaryModalOpen(true)}
        onOpenBlockManagement={() => setIsBlockManagementOpen(true)}
        onOpenAdminReports={() => setIsAdminReportsOpen(true)}
        onOpenDirectMessages={() => handleOpenDirectMessages()}
        unreadMessagesCount={unreadMessagesCount}
        activeMainView={activeMainView}
        onChangeMainView={setActiveMainView}
        blockedUsersCount={blockedUsersCount}
        pendingReportsCount={pendingReportsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1400px] 2xl:max-w-[1536px] mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
          {/* Left Sidebar with categorized boards and safety menu */}
          <Sidebar
            currentCategory={currentCategory}
            onSelectCategory={(catId) => {
              setCurrentCategory(catId);
              setActiveKeyword('');
              setActiveMainView('community');
            }}
            selectedAgencyCategory={selectedAgencyCategory}
            onSelectAgencyCategory={setSelectedAgencyCategory}
            onOpenSalaryCalculator={() => setIsSalaryModalOpen(true)}
            onOpenBlockManagement={() => setIsBlockManagementOpen(true)}
            onOpenAdminReports={() => setIsAdminReportsOpen(true)}
            onOpenDirectMessages={() => handleOpenDirectMessages()}
            unreadMessagesCount={unreadMessagesCount}
            activeMainView={activeMainView}
            onChangeMainView={setActiveMainView}
            blockedUsersCount={blockedUsersCount}
            pendingReportsCount={pendingReportsCount}
          />

          {/* Center Content Feed (Community or Blind Dating) */}
          {activeMainView === 'dating' ? (
            <section className="flex-1 w-full min-w-0 space-y-4">
              <DatingSection
                currentUser={currentUser}
                datingProfiles={datingProfiles}
                myDatingProfile={myDatingProfile}
                onOpenEditProfile={() => setIsEditDatingProfileOpen(true)}
                onOpenDirectMessages={handleOpenDirectMessages}
                onToggleLikeProfile={handleToggleLikeProfile}
                onOpenReportModal={(targetAuthor) =>
                  handleOpenReportModal('user', `dating-${targetAuthor}`, '소개팅 프로필 신고', targetAuthor)
                }
                onBlockUser={handleBlockUser}
                unreadMessagesCount={unreadMessagesCount}
                globalSearchQuery={searchQuery}
                onClearGlobalSearch={() => setSearchQuery('')}
                onSwitchToCommunity={() => setActiveMainView('community')}
                communityMatchCount={filteredPosts.length}
              />
            </section>
          ) : (
            <section className="flex-1 w-full min-w-0 space-y-4">
              {/* Active Search Query Results Banner */}
              {searchQuery.trim() && (
                <div className="p-4 bg-blue-50/90 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          '{searchQuery}' 게시글 검색 결과
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                          {filteredPosts.length}건
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        제목, 본문, 작성자, 소속 기관, 해시태그 전체에서 검색되었습니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {matchingDatingProfilesCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveMainView('dating')}
                        className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>소개팅 프로필 ({matchingDatingProfilesCount}명) 보기</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>검색 초기화</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Feed Banner / Category Header */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                      {searchQuery.trim() ? '검색 결과' : currentBoardInfo.name}
                    </h1>
                    {activeKeyword && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                        #{activeKeyword}
                        <button
                          onClick={() => setActiveKeyword('')}
                          className="text-blue-400 hover:text-blue-700 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {searchQuery.trim()
                      ? `'${searchQuery}' 검색어와 일치하는 글 목록입니다.`
                      : `${currentBoardInfo.description} · ${filteredPosts.length}개의 이야기`}
                  </p>
                </div>

                {/* Sort controls */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSortOrder('latest')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      sortOrder === 'latest'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    최신순
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortOrder('popular')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      sortOrder === 'popular'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    공감순
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortOrder('comments')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      sortOrder === 'comments'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    댓글순
                  </button>
                </div>
              </div>

              {/* Write shortcut prompt bar */}
              <div
                onClick={() => setIsCreateModalOpen(true)}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs flex items-center justify-between gap-3 cursor-pointer group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {currentUser.showAgency ? currentUser.agencyName.slice(0, 1) : '공'}
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                    [{currentUser.nickname}] 님, 동료 공직자들과 나누고 싶은 이야기를 적어보세요...
                  </span>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>글쓰기</span>
                </button>
              </div>

              {/* Posts Feed */}
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <MessageCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-700">해당 조건의 게시글이 없습니다</h3>
                  <p className="text-xs text-slate-400">
                    선택하신 검색어나 필터 조건에 일치하는 글이 아직 없습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveKeyword('');
                      setSelectedAgencyCategory('all');
                      setCurrentCategory('all');
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors inline-block"
                  >
                    전체 글 보기
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPosts.map((post) => {
                    const isAuthorBlocked = currentUser.blockedUsers?.includes(post.authorNickname);
                    return (
                      <PostCard
                        key={post.id}
                        post={post}
                        isAuthorBlocked={isAuthorBlocked}
                        onOpenDetail={(p) => setSelectedPost(p)}
                        onToggleLike={handleToggleLike}
                        onToggleDislike={handleToggleDislike}
                        onToggleBookmark={handleToggleBookmark}
                        onTagClick={(tag, e) => {
                          e.stopPropagation();
                          setActiveKeyword(tag);
                        }}
                        onReportPost={(p, e) => {
                          e.stopPropagation();
                          handleOpenReportModal('post', p.id, p.title, p.authorNickname);
                        }}
                        onBlockAuthor={(author, e) => {
                          e.stopPropagation();
                          handleBlockUser(author);
                        }}
                        onUnblockAuthor={(author, e) => {
                          e.stopPropagation();
                          handleUnblockUser(author);
                        }}
                        onSendDirectMessage={(nick, agency, initialCtx) => {
                          handleOpenDirectMessages(nick, agency, initialCtx);
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Footer helper */}
              <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>공무원 블라인드 익명 보호 시스템 가동 중 (단방향 해시 암호화)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAdminReportsOpen(true)}
                    className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <AlertOctagon className="w-3 h-3" />
                    관리자 신고 검토 ({pendingReportsCount})
                  </button>
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 hover:underline"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    데모 데이터 초기화
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Right Sidebar */}
          <TrendingWidget
            onSelectKeyword={(keyword) => {
              setActiveKeyword(keyword);
              if (keyword) setCurrentCategory('all');
            }}
            activeKeyword={activeKeyword}
            onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
          />
        </div>
      </main>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        initialCategoryId={currentCategory}
        onAddPost={handleAddPost}
      />

      <PostDetailModal
        post={selectedPost}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        currentUser={currentUser}
        onToggleLike={handleToggleLike}
        onToggleDislike={handleToggleDislike}
        onToggleBookmark={handleToggleBookmark}
        onVotePoll={handleVotePoll}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onDislikeComment={handleDislikeComment}
        onTagClick={(tag) => {
          setActiveKeyword(tag);
          setCurrentCategory('all');
        }}
        onOpenReportModal={handleOpenReportModal}
        onBlockUser={handleBlockUser}
        onUnblockUser={handleUnblockUser}
        onSendDirectMessage={(nick, agency, initialMsg) => {
          handleOpenDirectMessages(nick, agency, initialMsg);
        }}
      />

      <AgencyVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        currentUser={currentUser}
        existingNicknames={existingNicknames}
        onUpdateUser={setCurrentUser}
      />

      <SalaryCalculatorModal
        isOpen={isSalaryModalOpen}
        onClose={() => setIsSalaryModalOpen(false)}
        onFilterTopic={() => {
          setCurrentCategory('salary');
        }}
      />

      <ReportModal
        isOpen={reportModalData.isOpen}
        onClose={() => setReportModalData((prev) => ({ ...prev, isOpen: false }))}
        targetType={reportModalData.targetType}
        targetId={reportModalData.targetId}
        targetTitleOrExcerpt={reportModalData.targetTitleOrExcerpt}
        targetAuthor={reportModalData.targetAuthor}
        onSubmitReport={handleSubmitReport}
      />

      <AdminReportModal
        isOpen={isAdminReportsOpen}
        onClose={() => setIsAdminReportsOpen(false)}
        reports={reports}
        onTakeAction={handleAdminTakeAction}
        onClearAllReports={handleClearAllReports}
      />

      <BlockManagementModal
        isOpen={isBlockManagementOpen}
        onClose={() => setIsBlockManagementOpen(false)}
        blockedUsers={currentUser.blockedUsers || []}
        onUnblockUser={handleUnblockUser}
        onBlockUser={handleBlockUser}
      />

      {/* Direct Messages Modal (쪽지함 및 1:1 대화, 안심 연락처 교환) */}
      <DirectMessagesModal
        isOpen={isDirectMessagesOpen}
        onClose={() => setIsDirectMessagesOpen(false)}
        currentUser={currentUser}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onSendMessage={handleSendMessage}
        onDeleteMessage={handleDeleteMessage}
        onRequestMatch={handleRequestMatch}
        onAcceptMatch={handleAcceptMatch}
        onDeclineMatch={handleDeclineMatch}
        onCancelMatchRequest={handleCancelMatch}
        onStartNewConversation={handleStartNewConversation}
        onOpenReportModal={(author) =>
          handleOpenReportModal('user', `dm-${author}`, '쪽지 상대방 신고', author)
        }
        onBlockUser={handleBlockUser}
      />

      {/* Edit Dating Profile Modal (공무원 소개팅 내 프로필 등록/수정) */}
      <EditDatingProfileModal
        isOpen={isEditDatingProfileOpen}
        onClose={() => setIsEditDatingProfileOpen(false)}
        currentUser={currentUser}
        myProfile={myDatingProfile}
        onSaveProfile={handleSaveMyDatingProfile}
      />

      {/* YouTube Background Music Player (온/오프 및 볼륨 컨트롤 지원) */}
      <BackgroundMusicPlayer />
    </div>
  );
}
