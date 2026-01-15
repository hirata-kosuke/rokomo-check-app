-- ユーザーテーブルに身長・所属情報を追加
ALTER TABLE users ADD COLUMN IF NOT EXISTS height NUMERIC;
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_name TEXT;

-- コメント追加
COMMENT ON COLUMN users.height IS '身長（cm）';
COMMENT ON COLUMN users.organization_type IS '所属タイプ（company: 企業, medical: 医療機関）';
COMMENT ON COLUMN users.organization_name IS '企業名/医療機関名';

-- ロコモチェックテーブルに2回測定データを追加
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS two_step_distance1 NUMERIC;
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS two_step_distance2 NUMERIC;
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS two_step_better_distance NUMERIC;

-- 既存のtwo_step_distanceカラムをdistance1として使用する場合の移行
-- （既存データがある場合）
UPDATE rokomo_checks
SET two_step_distance1 = two_step_distance
WHERE two_step_distance1 IS NULL AND two_step_distance IS NOT NULL;

-- コメント追加
COMMENT ON COLUMN rokomo_checks.two_step_distance1 IS '2ステップテスト 1回目の距離（cm）';
COMMENT ON COLUMN rokomo_checks.two_step_distance2 IS '2ステップテスト 2回目の距離（cm）';
COMMENT ON COLUMN rokomo_checks.two_step_better_distance IS '2ステップテスト 良値（cm）';
COMMENT ON COLUMN rokomo_checks.two_step_distance IS '【非推奨】旧フィールド - distance1に移行済み';

-- 集団解析用ビューの作成
CREATE OR REPLACE VIEW rokomo_analysis_view AS
SELECT
  u.id as user_id,
  u.name,
  u.age,
  u.gender,
  u.height,
  u.organization_type,
  u.organization_name,
  r.check_date,
  r.standing_both_legs_40cm,
  r.standing_both_legs_20cm,
  r.standing_both_legs_10cm,
  r.standing_one_leg_40cm,
  r.standing_one_leg_20cm,
  r.standing_one_leg_10cm,
  r.two_step_distance1,
  r.two_step_distance2,
  r.two_step_better_distance,
  r.two_step_height,
  r.two_step_score,
  r.locomo25_total,
  r.standing_risk_level,
  r.two_step_risk_level,
  r.locomo25_risk_level,
  r.total_risk,
  r.created_at
FROM users u
INNER JOIN rokomo_checks r ON u.id = r.user_id
ORDER BY r.check_date DESC;

-- ビューのコメント
COMMENT ON VIEW rokomo_analysis_view IS '集団解析用ビュー：ユーザー情報とロコモチェック結果を統合';

-- 集団解析用の統計サマリービュー
CREATE OR REPLACE VIEW rokomo_stats_summary AS
SELECT
  organization_type,
  organization_name,
  COUNT(*) as total_checks,
  AVG(age) as avg_age,
  AVG(height) as avg_height,
  AVG(two_step_score) as avg_two_step_score,
  AVG(locomo25_total) as avg_locomo25_total,
  SUM(CASE WHEN total_risk = 'なし' THEN 1 ELSE 0 END) as count_no_risk,
  SUM(CASE WHEN total_risk = 'ロコモ度1' THEN 1 ELSE 0 END) as count_level1,
  SUM(CASE WHEN total_risk = 'ロコモ度2' THEN 1 ELSE 0 END) as count_level2,
  SUM(CASE WHEN total_risk = 'ロコモ度3' THEN 1 ELSE 0 END) as count_level3
FROM rokomo_analysis_view
GROUP BY organization_type, organization_name;

-- ビューのコメント
COMMENT ON VIEW rokomo_stats_summary IS '集団解析用統計サマリー：組織ごとの集計データ';
