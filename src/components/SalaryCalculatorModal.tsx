import { useState, useMemo } from 'react';
import { Calculator, Coins, HelpCircle, X, ArrowRight } from 'lucide-react';

interface SalaryCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterTopic?: (keyword: string) => void;
}

// 2026 대한민국 일반직 공무원 봉급표 기준 (단위: 원)
const SALARY_TABLE: Record<number, number[]> = {
  9: [
    1934200, 1957500, 1993400, 2049100, 2125500, 2217600, 2315700, 2417400, 2516400, 2611600,
    2703800, 2791400, 2873400, 2950500, 3023200, 3091100, 3154800, 3214500, 3270700, 3323400,
  ],
  8: [
    2032700, 2068400, 2137000, 2223800, 2320400, 2424400, 2530100, 2634400, 2736100, 2833900,
    2927200, 3015400, 3098500, 3176600, 3250100, 3319200, 3384200, 3445500, 3503200, 3557500,
  ],
  7: [
    2204600, 2269900, 2368100, 2480400, 2601700, 2728900, 2858100, 2985300, 3108900, 3227400,
    3340300, 3447300, 3548300, 3643300, 3732600, 3816600, 3895500, 3969700, 4039300, 4104700,
  ],
  6: [
    2438500, 2532400, 2651400, 2780700, 2917000, 3057100, 3198100, 3337900, 3474300, 3606100,
    3732600, 3853600, 3968800, 4078200, 4181800, 4279700, 4372200, 4459400, 4541700, 4619300,
  ],
  5: [
    2895400, 3032800, 3180400, 3334200, 3491000, 3647900, 3803100, 3954600, 4101100, 4241600,
    4375500, 4502500, 4622700, 4736100, 4842900, 4943200, 5037300, 5125500, 5208000, 5285100,
  ],
};

// 직급보조비 (단위: 원)
const POSITION_ALLOWANCE: Record<number, number> = {
  9: 175000,
  8: 175000,
  7: 180000,
  6: 185000,
  5: 250000,
};

// 시간외근무수당 단가 (시간당 단가, 근사치 원)
const OVERTIME_RATE: Record<number, number> = {
  9: 10420,
  8: 11450,
  7: 12690,
  6: 14120,
  5: 16280,
};

export default function SalaryCalculatorModal({
  isOpen,
  onClose,
  onFilterTopic,
}: SalaryCalculatorModalProps) {
  const [grade, setGrade] = useState<number>(9);
  const [step, setStep] = useState<number>(3); // 3호봉 default
  const [overtimeHours, setOvertimeHours] = useState<number>(10);
  const [familyAllowanceCount, setFamilyAllowanceCount] = useState<number>(0);

  if (!isOpen) return null;

  const mealAllowance = 140000; // 정액급식비 14만원
  const posAllowance = POSITION_ALLOWANCE[grade] || 175000;
  const baseSalary = SALARY_TABLE[grade]?.[step - 1] || 1993400;
  const overtimeRate = OVERTIME_RATE[grade] || 10420;
  const overtimePay = overtimeHours * overtimeRate;
  const familyPay = familyAllowanceCount * 40000; // 가족수당 (평균 부양가족당 4만원)

  // 총 지급액
  const grossPay = baseSalary + mealAllowance + posAllowance + overtimePay + familyPay;

  // 공제 내역 계산
  // 공무원연금 기여금: 기준소득월액의 약 9%
  const pensionDeduction = Math.round((baseSalary + posAllowance) * 0.09);
  // 건강보험료: 약 3.545%
  const healthInsurance = Math.round(grossPay * 0.03545);
  // 장기요양보험: 건보료의 약 12.95%
  const careInsurance = Math.round(healthInsurance * 0.1295);
  // 근로소득세 & 지방소득세 간이세액 추산
  const incomeTax = Math.round(grossPay * 0.025);
  const localTax = Math.round(incomeTax * 0.1);

  const totalDeductions =
    pensionDeduction + healthInsurance + careInsurance + incomeTax + localTax;
  const netTakeHome = grossPay - totalDeductions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">공무원 봉급·실수령액 계산기</h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                  일반직 기준
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                직급, 호봉, 초과근무 수당에 따른 예상 세후 실수령액 및 공제액 산출
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* Grade and Step Controls */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                직급 선택
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[9, 8, 7, 6, 5].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      grade === g
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g}급
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                호봉 선택 (1~20호봉)
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s}>
                      {s}호봉
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Allowance adjustments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">초과근무 시간 (월)</span>
                <span className="text-xs font-bold text-blue-600">{overtimeHours}시간</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0시간</span>
                <span>시간당 약 {overtimeRate.toLocaleString()}원</span>
                <span>50시간</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">부양가족 수당 대상</span>
                <span className="text-xs font-bold text-slate-800">{familyAllowanceCount}명</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[0, 1, 2, 3].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFamilyAllowanceCount(count)}
                    className={`py-1.5 rounded-lg text-xs font-medium border ${
                      familyAllowanceCount === count
                        ? 'bg-blue-50 text-blue-700 border-blue-400 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {count === 0 ? '없음' : `${count}명`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Highlight Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-700/80 gap-2">
              <div>
                <span className="text-xs text-slate-400 font-medium">
                  {grade}급 {step}호봉 예상 월 급여
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  <span className="text-emerald-400">{netTakeHome.toLocaleString()}</span>
                  <span className="text-base font-normal text-slate-300 ml-1">원 (예상 실수령액)</span>
                </div>
              </div>
              <div className="text-right sm:text-right">
                <div className="text-xs text-slate-400">세전 총 지급액</div>
                <div className="text-base font-bold text-slate-200">
                  {grossPay.toLocaleString()}원
                </div>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Earnings */}
              <div className="space-y-1.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="font-semibold text-emerald-400 flex items-center justify-between pb-1 border-b border-slate-700/60">
                  <span>지급 내역 (총 {grossPay.toLocaleString()}원)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>기본급</span>
                  <span className="font-mono">{baseSalary.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>정액급식비</span>
                  <span className="font-mono">{mealAllowance.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>직급보조비</span>
                  <span className="font-mono">{posAllowance.toLocaleString()}원</span>
                </div>
                {overtimeHours > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>초과근무수당 ({overtimeHours}h)</span>
                    <span className="font-mono text-blue-300">
                      +{overtimePay.toLocaleString()}원
                    </span>
                  </div>
                )}
                {familyPay > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>가족수당</span>
                    <span className="font-mono text-blue-300">
                      +{familyPay.toLocaleString()}원
                    </span>
                  </div>
                )}
              </div>

              {/* Deductions */}
              <div className="space-y-1.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="font-semibold text-rose-400 flex items-center justify-between pb-1 border-b border-slate-700/60">
                  <span>공제 내역 (총 -{totalDeductions.toLocaleString()}원)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>공무원연금 기여금 (9%)</span>
                  <span className="font-mono text-rose-300">
                    -{pensionDeduction.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>건강보험 + 요양보험</span>
                  <span className="font-mono text-rose-300">
                    -{(healthInsurance + careInsurance).toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>소득세 + 지방소득세</span>
                  <span className="font-mono text-rose-300">
                    -{(incomeTax + localTax).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              본 계산기는 2026 일반직 공무원 봉급표 및 행정안전부 수당 규정을 바탕으로 추산한 모의 계산입니다. 실제 정근수당(1·7월), 성과상여금, 명절휴가비(설·추석 각 기본급의 60%), 맞춤형 복지포인트 및 지자체별 조례에 따라 실수령액은 달라집니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onFilterTopic) onFilterTopic('처우·봉급·수당');
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            처우·봉급 게시판 토론 보러가기 <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
