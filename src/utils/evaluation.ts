import type { StandingTest, TwoStepTest, Locomo25, EvaluationResult } from '../types/rokomo';

/**
 * 立ち上がりテストの評価
 * 判定基準（日本整形外科学会ロコモ度テスト）:
 * - ロコモ度3: 両脚40cm不可
 * - ロコモ度2: 両脚20cm不可（片脚40cmも不可の場合）
 * - ロコモ度1: 片脚40cm不可
 * - 問題なし: 片脚40cm可
 * @returns リスクレベル 0-3
 */
export function evaluateStandingTest(test: StandingTest): number {
  // ロコモ度3: 両脚40cmができない
  if (test.bothLegs40cm === false) {
    return 3;
  }

  // ロコモ度2: 両脚20cmができない、または片脚40cmができない
  if (test.bothLegs20cm === false) {
    return 2;
  }

  // ロコモ度1: 片脚40cmができない
  if (test.oneLeg40cm === false) {
    return 1;
  }

  // 問題なし: 片脚40cmができる
  return 0;
}

/**
 * 2ステップテストの評価
 * 判定基準（日本整形外科学会ロコモ度テスト）:
 * - ロコモ度3: 2ステップ値が0.9未満
 * - ロコモ度2: 2ステップ値が0.9以上1.1未満
 * - ロコモ度1: 2ステップ値が1.1以上1.3未満
 * - 問題なし: 2ステップ値が1.3以上
 * @returns リスクレベル 0-3
 */
export function evaluateTwoStepTest(test: TwoStepTest): number {
  // scoreが直接渡されている場合はそれを使用、なければbetterDistanceから計算
  const score = test.score || (test.betterDistance / test.height);

  if (score < 0.9) {
    return 3; // ロコモ度3
  }

  if (score < 1.1) {
    return 2; // ロコモ度2
  }

  if (score < 1.3) {
    return 1; // ロコモ度1
  }

  return 0; // 問題なし
}

/**
 * ロコモ25質問票の評価
 * @returns リスクレベル 0-3
 */
export function evaluateLocomo25(locomo25: Locomo25): number {
  const totalScore = Object.values(locomo25).reduce((sum, score) => {
    // total フィールドは除外
    if (typeof score === 'number') {
      return sum + score;
    }
    return sum;
  }, 0);

  if (totalScore >= 24) {
    return 3; // ロコモ度3
  }

  if (totalScore >= 16) {
    return 2; // ロコモ度2
  }

  if (totalScore >= 7) {
    return 1; // ロコモ度1
  }

  return 0; // 正常
}

/**
 * 総合評価
 */
export function evaluateOverall(
  standingLevel: number,
  twoStepLevel: number,
  locomo25Level: number
): EvaluationResult {
  // 最も高いリスクレベルを採用
  const maxLevel = Math.max(standingLevel, twoStepLevel, locomo25Level);

  let totalRisk: EvaluationResult['total_risk'];
  switch (maxLevel) {
    case 3:
      totalRisk = 'ロコモ度3';
      break;
    case 2:
      totalRisk = 'ロコモ度2';
      break;
    case 1:
      totalRisk = 'ロコモ度1';
      break;
    default:
      totalRisk = 'なし';
  }

  return {
    standing_risk_level: standingLevel,
    two_step_risk_level: twoStepLevel,
    locomo25_risk_level: locomo25Level,
    total_risk: totalRisk,
  };
}

/**
 * ロコモ25の合計スコアを計算
 */
export function calculateLocomo25Total(answers: number[]): number {
  return answers.reduce((sum, score) => sum + score, 0);
}

/**
 * 年代別2ステップ値の平均値
 * 出典: 日本整形外科学会ロコモ度テスト
 * https://locomo-joa.jp/check/test/two-step
 */
const AGE_AVERAGE_TWO_STEP: { [key: string]: number } = {
  '20-24': 1.66,
  '25-29': 1.64,
  '30-34': 1.62,
  '35-39': 1.60,
  '40-44': 1.58,
  '45-49': 1.55,
  '50-54': 1.52,
  '55-59': 1.48,
  '60-64': 1.44,
  '65-69': 1.39,
  '70-74': 1.33,
  '75-79': 1.26,
  '80-': 1.17,
};

/**
 * 年代に応じた2ステップ値の平均を取得
 */
export function getAgeAverageTwoStep(age: number): number {
  if (age < 25) return AGE_AVERAGE_TWO_STEP['20-24'];
  if (age < 30) return AGE_AVERAGE_TWO_STEP['25-29'];
  if (age < 35) return AGE_AVERAGE_TWO_STEP['30-34'];
  if (age < 40) return AGE_AVERAGE_TWO_STEP['35-39'];
  if (age < 45) return AGE_AVERAGE_TWO_STEP['40-44'];
  if (age < 50) return AGE_AVERAGE_TWO_STEP['45-49'];
  if (age < 55) return AGE_AVERAGE_TWO_STEP['50-54'];
  if (age < 60) return AGE_AVERAGE_TWO_STEP['55-59'];
  if (age < 65) return AGE_AVERAGE_TWO_STEP['60-64'];
  if (age < 70) return AGE_AVERAGE_TWO_STEP['65-69'];
  if (age < 75) return AGE_AVERAGE_TWO_STEP['70-74'];
  if (age < 80) return AGE_AVERAGE_TWO_STEP['75-79'];
  return AGE_AVERAGE_TWO_STEP['80-'];
}

/**
 * 年代平均との比較結果を取得
 */
export function compareTwoStepWithAverage(age: number, score: number): {
  average: number;
  isBelowAverage: boolean;
  difference: number;
} {
  const average = getAgeAverageTwoStep(age);
  const difference = score - average;
  return {
    average,
    isBelowAverage: score < average,
    difference,
  };
}
