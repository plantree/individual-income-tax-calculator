/**
 * 个人所得税计算工具
 */

// 个人所得税税率表
const TAX_RATES = [
  { threshold: 0, rate: 0.03, quickDeduction: 0 },
  { threshold: 36000, rate: 0.1, quickDeduction: 2520 },
  { threshold: 144000, rate: 0.2, quickDeduction: 16920 },
  { threshold: 300000, rate: 0.25, quickDeduction: 31920 },
  { threshold: 420000, rate: 0.3, quickDeduction: 52920 },
  { threshold: 660000, rate: 0.35, quickDeduction: 85920 },
  { threshold: 960000, rate: 0.45, quickDeduction: 181920 },
];

/**
 * 计算应纳税所得额
 * @param income 累计收入
 * @param threshold 起征点（默认5000元/月）
 * @param insurance 社保公积金等专项扣除
 * @param specialDeduction 专项附加扣除
 * @returns 应纳税所得额
 */
export function calculateTaxableIncome(
  income: number,
  threshold: number = 5000,
  insurance: number = 0,
  specialDeduction: number = 0
): number {
  return Math.max(0, income - threshold - insurance - specialDeduction);
}

/**
 * 获取适用税率区间
 * @param taxableIncome 应纳税所得额
 * @returns 税率信息 {threshold, rate, quickDeduction}
 */
export function getTaxRate(taxableIncome: number) {
  // 从高到低查找适用的税率区间
  for (let i = TAX_RATES.length - 1; i >= 0; i--) {
    if (taxableIncome > TAX_RATES[i].threshold) {
      return {
        ...TAX_RATES[i],
        level: i + 1,
      };
    }
  }
  return { ...TAX_RATES[0], level: 1 };
}

/**
 * 计算累计应缴纳的个人所得税
 * @param taxableIncome 应纳税所得额
 * @returns 应缴纳的个人所得税
 */
export function calculateTax(taxableIncome: number): number {
  const { rate, quickDeduction } = getTaxRate(taxableIncome);
  return taxableIncome * rate - quickDeduction;
}

/**
 * 计算下月应缴纳的个人所得税
 * @param totalIncome 累计收入
 * @param totalTaxPaid 累计已缴纳税款
 * @param currentMonth 当前月份（1-12）
 * @param currentMonthIncome 下月收入
 * @param threshold 起征点（默认5000元/月）
 * @param insurance 社保公积金等专项扣除
 * @param specialDeduction 专项附加扣除
 * @returns 计算结果
 */
export function calculateMonthlyTax({
  totalIncome,
  totalTaxPaid,
  currentMonth,
  currentMonthIncome,
  threshold = 5000,
  insurance = 0,
  specialDeduction = 0,
}: {
  totalIncome: number;
  totalTaxPaid: number;
  currentMonth: number;
  currentMonthIncome: number;
  threshold?: number;
  insurance?: number;
  specialDeduction?: number;
}) {
  // 确保月份在有效范围内
  const month = Math.max(1, Math.min(12, currentMonth));
  
  // 更新累计收入（当前月份的累计收入 + 下月收入）
  const newTotalIncome = totalIncome + currentMonthIncome;
  
  // 下月对应的月份数
  const nextMonth = month + 1 > 12 ? 1 : month + 1;
  
  // 计算累计应纳税所得额（使用实际月份）
  const taxableIncome = calculateTaxableIncome(
    newTotalIncome,
    threshold * nextMonth,
    insurance * nextMonth,
    specialDeduction * nextMonth
  );
  
  // 计算累计应缴纳税款
  const totalTaxDue = calculateTax(taxableIncome);
  
  // 计算下月应缴纳税款
  const currentMonthTax = Math.max(0, totalTaxDue - totalTaxPaid);
  
  // 获取当前税率区间
  const taxRate = getTaxRate(taxableIncome);
  
  return {
    currentMonthTax,
    newTotalIncome,
    totalTaxDue,
    taxRate,
  };
}