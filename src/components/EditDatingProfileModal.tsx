import { useState } from 'react';
import { X, Heart, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { DatingProfile, UserProfile, DatingGender, DatingRegion, ContactExchangeInfo } from '../types';

interface EditDatingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  myProfile: DatingProfile | null;
  onSaveProfile: (profile: DatingProfile) => void;
}

const EMOJI_AVATARS = [
  { emoji: '🌸', label: '벚꽃', bg: 'bg-rose-100 text-rose-700' },
  { emoji: '🌿', label: '새싹', bg: 'bg-emerald-100 text-emerald-700' },
  { emoji: '☕', label: '커피', bg: 'bg-amber-100 text-amber-800' },
  { emoji: '🏃‍♂️', label: '러닝', bg: 'bg-blue-100 text-blue-700' },
  { emoji: '🧁', label: '디저트', bg: 'bg-pink-100 text-pink-700' },
  { emoji: '🚲', label: '자전거', bg: 'bg-teal-100 text-teal-700' },
  { emoji: '✈️', label: '여행', bg: 'bg-sky-100 text-sky-700' },
  { emoji: '👔', label: '정장', bg: 'bg-indigo-100 text-indigo-700' },
  { emoji: '🚒', label: '안전', bg: 'bg-red-100 text-red-700' },
  { emoji: '🎨', label: '예술', bg: 'bg-purple-100 text-purple-700' },
];

const PRESET_HOBBIES = [
  '한강러닝',
  '헬스/웨이트',
  '카페투어',
  '근교드라이브',
  '홈베이킹/요리',
  '캠핑/글램핑',
  '테니스',
  '전시회/뮤지컬',
  '반려동물산책',
  '독서/서점',
  '재테크/부동산',
  '여행',
];

export default function EditDatingProfileModal({
  isOpen,
  onClose,
  currentUser,
  myProfile,
  onSaveProfile,
}: EditDatingProfileModalProps) {
  const [jobSeries, setJobSeries] = useState<string>(myProfile?.jobSeries || '일반행정 7급');
  const [experienceYears, setExperienceYears] = useState<string>(myProfile?.experienceYears || '4년차');
  const [birthYear, setBirthYear] = useState<number>(myProfile?.birthYear || 1995);
  const [gender, setGender] = useState<DatingGender>(myProfile?.gender || 'female');
  const [region, setRegion] = useState<DatingRegion>(myProfile?.region || 'sejong_chungcheong');
  const [regionLabel, setRegionLabel] = useState<string>(myProfile?.regionLabel || '세종 정부청사 / 대전');
  const [mbti, setMbti] = useState<string>(myProfile?.mbti || 'ENFJ');
  const [height, setHeight] = useState<string>(myProfile?.height || '168cm');
  const [smoking, setSmoking] = useState<'비흡연' | '흡연'>(myProfile?.smoking || '비흡연');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(
    myProfile?.hobbies || ['한강러닝', '카페투어', '근교드라이브']
  );
  const [weekendStyle, setWeekendStyle] = useState<string>(
    myProfile?.weekendStyle || '주말엔 맛있는 거 먹고 여유롭게 산책하거나 드라이브 즐겨요'
  );
  const [idealType, setIdealType] = useState<string>(
    myProfile?.idealType || '대화 코드가 잘 통하고 서로의 공직 생활을 따뜻하게 지지해 줄 수 있는 분'
  );
  const [introduction, setIntroduction] = useState<string>(
    myProfile?.introduction ||
      '퇴근 후 저녁 시간이나 주말에 편하게 티타임 가지며 소소한 일상을 공유할 좋은 인연을 찾습니다 :)'
  );
  const [avatarEmoji, setAvatarEmoji] = useState<string>(myProfile?.avatarEmoji || '🌸');
  const [avatarBgColor, setAvatarBgColor] = useState<string>(
    myProfile?.avatarBgColor || 'bg-rose-100 text-rose-700'
  );
  const [contactType, setContactType] = useState<'kakao' | 'phone' | 'openchat'>(
    myProfile?.defaultContactInfo?.contactType || 'kakao'
  );
  const [contactValue, setContactValue] = useState<string>(
    myProfile?.defaultContactInfo?.contactValue || currentUser.nickname.slice(0, 4) + '_talk'
  );
  const [contactNote, setContactNote] = useState<string>(
    myProfile?.defaultContactInfo?.note || '매칭 성사 시 카카오톡으로 편하게 연락주세요'
  );

  if (!isOpen) return null;

  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby));
    } else {
      if (selectedHobbies.length >= 5) {
        alert('취미는 최대 5개까지 선택할 수 있습니다.');
        return;
      }
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!introduction.trim() || !idealType.trim()) {
      alert('자기소개와 이상형을 작성해주세요.');
      return;
    }

    const defaultContact: ContactExchangeInfo = {
      contactType,
      contactValue: contactValue.trim(),
      note: contactNote.trim(),
    };

    const newOrUpdatedProfile: DatingProfile = {
      id: myProfile?.id || `dating-${Date.now()}`,
      userNickname: currentUser.nickname,
      agencyName: currentUser.agencyName,
      agencyCategory: currentUser.agencyCategory,
      jobSeries: jobSeries.trim(),
      experienceYears: experienceYears.trim(),
      birthYear: Number(birthYear),
      gender,
      region,
      regionLabel: regionLabel.trim(),
      mbti: mbti.toUpperCase().trim(),
      height: height.trim(),
      smoking,
      hobbies: selectedHobbies,
      weekendStyle: weekendStyle.trim(),
      idealType: idealType.trim(),
      introduction: introduction.trim(),
      verifiedBadge: true,
      avatarEmoji,
      avatarBgColor,
      likesCount: myProfile?.likesCount || 1,
      createdAt: myProfile?.createdAt || '방금 전',
      isMyProfile: true,
      defaultContactInfo: defaultContact,
    };

    onSaveProfile(newOrUpdatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center backdrop-blur-xs">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">내 공무원 소개팅 프로필 등록/수정</h2>
              <p className="text-xs text-rose-100">
                100% 인증된 공직자만을 위한 신뢰 기반 블라인드 매칭 프로필
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Verification Notice */}
          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold">현재 소속: {currentUser.agencyName} ({currentUser.nickname})</span>
              <p className="text-[11px] text-blue-700 mt-0.5">
                안심 블라인드 원칙에 따라 연락처는 <strong>서로 대화 후 상호 매칭에 동의한 상대방에게만</strong> 안전하게 교환됩니다.
              </p>
            </div>
          </div>

          {/* Avatar Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">대표 이모지 아바타 선택</label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {EMOJI_AVATARS.map((av) => {
                const isSelected = avatarEmoji === av.emoji;
                return (
                  <button
                    key={av.emoji}
                    type="button"
                    onClick={() => {
                      setAvatarEmoji(av.emoji);
                      setAvatarBgColor(av.bg);
                    }}
                    className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all border ${
                      isSelected
                        ? 'ring-2 ring-rose-500 scale-105 border-rose-400 bg-rose-50'
                        : 'border-slate-200 hover:bg-slate-100 bg-slate-50'
                    }`}
                  >
                    {av.emoji}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic specs: Gender, Age, Height, Smoking */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">성별</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    gender === 'female'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  여성
                </button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    gender === 'male'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  남성
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">출생년도</label>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-100 text-xs font-semibold text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden"
              >
                {Array.from({ length: 25 }, (_, i) => 2002 - i).map((y) => (
                  <option key={y} value={y}>
                    {y}년생 ({2026 - y + 1}세)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">MBTI</label>
              <input
                type="text"
                value={mbti}
                onChange={(e) => setMbti(e.target.value)}
                maxLength={4}
                placeholder="예: ENFJ, ISTJ..."
                className="w-full px-3 py-2 bg-slate-100 text-xs font-bold text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden uppercase"
              />
            </div>
          </div>

          {/* Job details: Series & Level, Experience, Height, Smoking */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">직렬 및 직급</label>
              <input
                type="text"
                required
                value={jobSeries}
                onChange={(e) => setJobSeries(e.target.value)}
                placeholder="예: 일반행정 7급, 교행 8급, 사무관..."
                className="w-full px-3 py-2 bg-slate-100 text-xs text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">공직 연차</label>
              <select
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 text-xs text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden"
              >
                <option value="1년차 미만">1년차 미만 (신규)</option>
                <option value="1~2년차">1~2년차</option>
                <option value="3~4년차">3~4년차</option>
                <option value="5~7년차">5~7년차</option>
                <option value="8년차 이상">8년차 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">흡연 여부</label>
              <select
                value={smoking}
                onChange={(e) => setSmoking(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-100 text-xs text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden"
              >
                <option value="비흡연">비흡연</option>
                <option value="흡연">흡연</option>
              </select>
            </div>
          </div>

          {/* Region and Region Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">근무 권역</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as DatingRegion)}
                className="w-full px-3 py-2 bg-slate-100 text-xs text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden"
              >
                <option value="sejong_chungcheong">세종특별자치시 / 대전·충청권</option>
                <option value="seoul">서울특별시 / 수도권</option>
                <option value="gyeonggi">경기도 / 인천</option>
                <option value="yeongnam">영남권 (부산·대구·울산·경북·경남)</option>
                <option value="honam">호남권 (광주·전북·전남)</option>
                <option value="gangwon_jeju">강원권 / 제주도</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">희망/세부 활동 지역</label>
              <input
                type="text"
                required
                value={regionLabel}
                onChange={(e) => setRegionLabel(e.target.value)}
                placeholder="예: 세종청사 / 대전 유성구, 서울 강남..."
                className="w-full px-3 py-2 bg-slate-100 text-xs text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Hobbies Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              관심사 및 취미 (최대 5개 선택)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_HOBBIES.map((hobby) => {
                const isSelected = selectedHobbies.includes(hobby);
                return (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => toggleHobby(hobby)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80'
                    }`}
                  >
                    #{hobby} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekend Style & Ideal Type */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">주말 및 여가 스타일</label>
              <input
                type="text"
                value={weekendStyle}
                onChange={(e) => setWeekendStyle(e.target.value)}
                placeholder="예: 주말엔 운동하고 예쁜 카페 찾아다니거나 넷플릭스 봐요"
                className="w-full px-3 py-2 bg-slate-100 text-xs text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">원하는 이상형 / 만나고 싶은 동료</label>
              <input
                type="text"
                required
                value={idealType}
                onChange={(e) => setIdealType(e.target.value)}
                placeholder="예: 다정하고 대화가 잘 통하는 분, 공직 고충을 함께 나눌 분"
                className="w-full px-3 py-2 bg-slate-100 text-xs text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">자기소개 (진솔한 한 마디)</label>
              <textarea
                rows={3}
                required
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="성격, 가치관, 업무 분위기, 퇴근 후 일상 등 상대방이 편안하게 다가올 수 있는 이야기를 적어주세요."
                className="w-full px-3 py-2 bg-slate-100 text-xs text-slate-900 rounded-xl border border-transparent focus:bg-white focus:border-rose-500 focus:outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Exchanged Contact Registration Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-slate-900">상호 매칭 시 교환될 내 연락처</span>
            </div>
            <p className="text-[11px] text-slate-500">
              * 상대방과 쪽지로 대화하다가 서로 '매칭 수락'을 눌렀을 때만 안전하게 노출됩니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">연락처 종류</label>
                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white text-xs text-slate-800 rounded-lg border border-slate-200"
                >
                  <option value="kakao">카카오톡 ID</option>
                  <option value="openchat">오픈채팅방 주소</option>
                  <option value="phone">전화번호</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">연락처 값</label>
                <input
                  type="text"
                  required
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="예: kakao_id_123"
                  className="w-full px-3 py-1.5 bg-white text-xs text-slate-800 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>소개팅 프로필 등록하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
