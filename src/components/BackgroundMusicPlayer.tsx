import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, ExternalLink, Minimize2, Maximize2 } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

const YOUTUBE_VIDEO_ID = 'yqOQ7UkOw94';
const STORAGE_BGM_PLAYING_KEY = 'gblind_bgm_playing_v1';
const STORAGE_BGM_VOLUME_KEY = 'gblind_bgm_volume_v1';
const STORAGE_BGM_MUTED_KEY = 'gblind_bgm_muted_v1';

interface BackgroundMusicPlayerProps {
  // Can be controlled externally from Header or other controls
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export default function BackgroundMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BGM_VOLUME_KEY);
      return saved !== null ? Number(saved) : 60;
    } catch {
      return 60;
    }
  });
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [hasEverInteracted, setHasEverInteracted] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const ytPlayerRef = useRef<any>(null);

  // Send command to YouTube iframe safely (via postMessage as resilient fallback)
  const sendIframeCommand = useCallback((func: string, args: any[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: func,
            args: args,
          }),
          '*'
        );
      }
    } catch (err) {
      console.warn('Could not send postMessage to YouTube player', err);
    }
  }, []);

  // Initialize YouTube IFrame API
  useEffect(() => {
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        ytPlayerRef.current = new window.YT.Player('youtube-bgm-iframe', {
          events: {
            onReady: (event: any) => {
              setIsPlayerReady(true);
              event.target.setVolume(volume);
              if (isMuted) {
                event.target.mute();
              } else {
                event.target.unMute();
              }
            },
            onStateChange: (event: any) => {
              // 1: Playing, 2: Paused, 0: Ended
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
            onError: (err: any) => {
              console.warn('YouTube BGM Player error:', err);
            },
          },
        });
      } catch (err) {
        console.warn('Failed to bind YT.Player, falling back to postMessage', err);
        setIsPlayerReady(true);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode?.insertBefore(tag, firstScript);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    return () => {
      // clean up
    };
  }, []);

  // Save volume preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BGM_VOLUME_KEY, String(volume));
    } catch {
      // ignore
    }
  }, [volume]);

  // Handle Play / Pause Toggle
  const handleTogglePlay = useCallback(() => {
    setHasEverInteracted(true);
    const nextState = !isPlaying;

    if (nextState) {
      // Play
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume);
          ytPlayerRef.current.playVideo();
        } catch {
          sendIframeCommand('unMute');
          sendIframeCommand('setVolume', [volume]);
          sendIframeCommand('playVideo');
        }
      } else {
        sendIframeCommand('unMute');
        sendIframeCommand('setVolume', [volume]);
        sendIframeCommand('playVideo');
      }
      setIsPlaying(true);
      setIsMuted(false);
    } else {
      // Pause
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {
          sendIframeCommand('pauseVideo');
        }
      } else {
        sendIframeCommand('pauseVideo');
      }
      setIsPlaying(false);
    }
  }, [isPlaying, volume, sendIframeCommand]);

  // Handle Mute Toggle (Sound ON / OFF)
  const handleToggleMute = useCallback(() => {
    setHasEverInteracted(true);
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (nextMuted) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.mute === 'function') {
        try {
          ytPlayerRef.current.mute();
        } catch {
          sendIframeCommand('mute');
        }
      } else {
        sendIframeCommand('mute');
      }
    } else {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.unMute === 'function') {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume);
        } catch {
          sendIframeCommand('unMute');
          sendIframeCommand('setVolume', [volume]);
        }
      } else {
        sendIframeCommand('unMute');
        sendIframeCommand('setVolume', [volume]);
      }
      // If was paused and user un-mutes, ensure it plays
      if (!isPlaying) {
        handleTogglePlay();
      }
    }
  }, [isMuted, volume, isPlaying, handleTogglePlay, sendIframeCommand]);

  // Handle Volume Slider Change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }

    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        ytPlayerRef.current.setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
          ytPlayerRef.current.unMute();
        }
      } catch {
        sendIframeCommand('setVolume', [newVolume]);
      }
    } else {
      sendIframeCommand('setVolume', [newVolume]);
    }
  };

  // Expose toggle event to custom window events for header button integration
  useEffect(() => {
    const handleCustomToggle = () => {
      handleTogglePlay();
    };
    window.addEventListener('gblind:toggle-bgm', handleCustomToggle);
    return () => {
      window.removeEventListener('gblind:toggle-bgm', handleCustomToggle);
    };
  }, [handleTogglePlay]);

  // Dispatch state changes to window so Header button stays in sync
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('gblind:bgm-state-changed', {
        detail: { isPlaying, isMuted, volume },
      })
    );
  }, [isPlaying, isMuted, volume]);

  return (
    <>
      {/* Hidden YouTube Iframe that stays alive across the whole single-page application */}
      <div
        style={{
          position: 'fixed',
          bottom: '-200px',
          right: '-200px',
          width: '1px',
          height: '1px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <iframe
          id="youtube-bgm-iframe"
          ref={iframeRef}
          title="공무원 블라인드 유튜브 BGM 플레이어"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&playsinline=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&origin=${encodeURIComponent(
            typeof window !== 'undefined' ? window.location.origin : ''
          )}`}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
      </div>

      {/* Floating BGM Player Controller (Bottom-Right) */}
      <div
        id="floating-bgm-widget"
        className="fixed bottom-4 right-4 z-40 select-none transition-all duration-300"
      >
        {isMinimized ? (
          /* Minimized pill state */
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg border transition-all cursor-pointer backdrop-blur-md ${
              isPlaying && !isMuted
                ? 'bg-slate-900/90 text-white border-blue-500/40 hover:bg-slate-900 shadow-blue-500/10'
                : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="BGM 플레이어 펼치기"
          >
            <div className="relative flex items-center justify-center">
              <Music className={`w-3.5 h-3.5 ${isPlaying && !isMuted ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`} />
              {isPlaying && !isMuted && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
              )}
            </div>
            <span className="text-xs font-bold tracking-tight">
              {isPlaying ? (isMuted ? 'BGM (음소거)' : 'BGM ON') : 'BGM OFF'}
            </span>
            <Maximize2 className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>
        ) : (
          /* Expanded Player Box */
          <div className="w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-3.5 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isPlaying && !isMuted
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-800 tracking-tight">공직자 힐링 BGM</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                        isPlaying && !isMuted
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isPlaying ? (isMuted ? '음소거' : '재생 중') : '정지됨'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">유튜브 음원 · 무한 반복</div>
                </div>
              </div>

              {/* Action buttons on header */}
              <div className="flex items-center gap-1">
                <a
                  href={`https://youtu.be/${YOUTUBE_VIDEO_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
                  title="유튜브에서 원본 영상 보기"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="플레이어 접기"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sound Wave Animation Visualizer (active when playing and not muted) */}
            <div className="h-4 bg-slate-100/80 rounded-lg px-2 flex items-center justify-between gap-1 overflow-hidden">
              {[40, 75, 55, 90, 65, 30, 85, 45, 95, 60, 35, 80, 50, 70, 40, 85].map((height, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying && !isMuted ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                  style={{
                    height: isPlaying && !isMuted ? `${Math.max(20, (height * (volume / 100)))}%` : '20%',
                    opacity: isPlaying && !isMuted ? 0.9 : 0.4,
                    animation: isPlaying && !isMuted ? `pulse 1.2s ease-in-out ${idx * 0.08}s infinite alternate` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Main Controls Row: Play/Pause, Sound ON/OFF Toggle, Volume Slider */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              {/* Play / Pause Main Button */}
              <button
                type="button"
                id="btn-bgm-play-toggle"
                onClick={handleTogglePlay}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isPlaying
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" />
                    <span>음악 일시정지</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>음악 켜기 (ON)</span>
                  </>
                )}
              </button>

              {/* Sound ON/OFF (Mute Toggle) Button */}
              <button
                type="button"
                id="btn-bgm-mute-toggle"
                onClick={handleToggleMute}
                className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                  isMuted || !isPlaying
                    ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                title={isMuted ? '소리 켜기 (소리 ON)' : '소리 끄기 (음소거)'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </div>

            {/* Volume Slider bar */}
            <div className="flex items-center gap-2 px-0.5">
              <span className="text-[10px] text-slate-400 font-semibold shrink-0">볼륨</span>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-500 font-bold w-7 text-right shrink-0">
                {isMuted ? '0%' : `${volume}%`}
              </span>
            </div>

            {/* Hint Notice */}
            {!hasEverInteracted && !isPlaying && (
              <div className="text-[10px] text-blue-600 bg-blue-50/80 px-2 py-1.5 rounded-lg border border-blue-100 leading-tight">
                💡 상단 <strong>[음악 켜기]</strong>를 누르시면 유튜브 힐링 배경음악이 시작됩니다. 언제든 켜고 끌 수 있습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
