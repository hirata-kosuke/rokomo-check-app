// ユーザー情報
export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // 身長（cm）
  organization_type: 'company' | 'medical'; // 企業 or 医療機関
  organization_name: string; // 企業名/医療機関名
  consent_date: string;
  consent_version: string;
  created_at: string;
}

// 立ち上がりテスト
export interface StandingTest {
  // 両足での立ち上がり
  bothLegs40cm: boolean | null;
  bothLegs20cm: boolean | null;
  bothLegs10cm: boolean | null;
  // 片足での立ち上がり
  oneLeg40cm: boolean | null;
  oneLeg20cm: boolean | null;
  oneLeg10cm: boolean | null;
}

// 2ステップテスト
export interface TwoStepTest {
  distance1: number; // 1回目の距離
  distance2: number; // 2回目の距離
  height: number;    // 身長
  score: number;     // スコア（良値を使用）
  betterDistance: number; // 良値の距離
}

// ロコモ25質問票
export interface Locomo25 {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  q13: number;
  q14: number;
  q15: number;
  q16: number;
  q17: number;
  q18: number;
  q19: number;
  q20: number;
  q21: number;
  q22: number;
  q23: number;
  q24: number;
  q25: number;
  total: number;
}

// 評価結果
export interface EvaluationResult {
  standing_risk_level: number; // 0-3
  two_step_risk_level: number; // 0-3
  locomo25_risk_level: number; // 0-3
  total_risk: 'なし' | 'ロコモ度1' | 'ロコモ度2' | 'ロコモ度3';
}

// ロコモチェック結果（完全版）
export interface RokomoCheckResult {
  id: string;
  user_id: string;
  check_date: string;

  // 立ち上がりテスト
  standing_test_40cm: boolean | null;
  standing_test_20cm: boolean | null;
  standing_test_10cm: boolean | null;

  // 2ステップテスト
  two_step_distance: number;
  two_step_height: number;
  two_step_score: number;

  // ロコモ25
  locomo25_q1: number;
  locomo25_q2: number;
  locomo25_q3: number;
  locomo25_q4: number;
  locomo25_q5: number;
  locomo25_q6: number;
  locomo25_q7: number;
  locomo25_q8: number;
  locomo25_q9: number;
  locomo25_q10: number;
  locomo25_q11: number;
  locomo25_q12: number;
  locomo25_q13: number;
  locomo25_q14: number;
  locomo25_q15: number;
  locomo25_q16: number;
  locomo25_q17: number;
  locomo25_q18: number;
  locomo25_q19: number;
  locomo25_q20: number;
  locomo25_q21: number;
  locomo25_q22: number;
  locomo25_q23: number;
  locomo25_q24: number;
  locomo25_q25: number;
  locomo25_total: number;

  // 評価結果
  standing_risk_level: number;
  two_step_risk_level: number;
  locomo25_risk_level: number;
  total_risk: string;

  created_at: string;
}

// テスト順序
export type TestOrder = 'standing' | 'two_step' | 'locomo25';

// フォーム入力データ
export interface RokomoCheckFormData {
  // 基本情報
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  organization_type: 'company' | 'medical';
  organization_name: string;

  // テスト実施順序（実技は固定、ロコモ25のみ選択可能）
  test_order: TestOrder[];

  // 立ち上がりテスト
  standing_test: StandingTest;

  // 2ステップテスト
  two_step_test: TwoStepTest;

  // ロコモ25
  locomo25: Locomo25;
}
