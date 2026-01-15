# 拡張機能実装完了

## 実装内容

### 1. ✅ 利用者登録画面の拡張
- **身長入力**: 基本情報入力時に身長（cm）を入力
- **所属選択**: 企業 or 医療機関を選択
- **企業名/医療機関名**: 選択後に名称を入力

### 2. ✅ テスト順序選択機能
- **ロコモ25質問票の実施タイミング選択**:
  - 実技テストの後（推奨）
  - 実技テストの前
- **実技テストの順序は固定**: 立ち上がりテスト → 2ステップテスト

### 3. ✅ 2ステップテストの2回測定
- 1回目と2回目の距離を入力
- 良値（大きい方）を自動選択して判定に使用
- 結果画面に両方の値と良値を表示

### 4. ✅ 結果表示の改善
- 総合判定に説明文を追加:
  - 「なし」: 運動器の状態は良好です
  - それ以外: 運動器機能の低下が見られます
- 基本情報に身長・所属を表示
- 2ステップテストの2回の測定値と良値を表示

### 5. ✅ データベーススキーマ更新
- `users` テーブルに追加:
  - `height`: 身長（cm）
  - `organization_type`: 企業 or 医療機関
  - `organization_name`: 企業名/医療機関名
- `rokomo_checks` テーブルに追加:
  - `two_step_distance1`: 1回目の距離
  - `two_step_distance2`: 2回目の距離
  - `two_step_better_distance`: 良値

### 6. ✅ 集団解析用ビュー作成
- **`rokomo_analysis_view`**: ユーザー情報とロコモチェック結果を統合
- **`rokomo_stats_summary`**: 組織ごとの統計サマリー

---

## データベース更新手順

### ⚠️ 重要: 以下のSQLをSupabase SQL Editorで実行してください

1. Supabaseダッシュボードにログイン
2. SQL Editor を開く
3. `UPDATE_SCHEMA_ENHANCED.sql` の内容を実行

```sql
-- ユーザーテーブルに身長・所属情報を追加
ALTER TABLE users ADD COLUMN IF NOT EXISTS height NUMERIC;
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_name TEXT;

-- ロコモチェックテーブルに2回測定データを追加
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS two_step_distance1 NUMERIC;
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS two_step_distance2 NUMERIC;
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS two_step_better_distance NUMERIC;

-- 既存データの移行（既存のtwo_step_distanceをdistance1として使用）
UPDATE rokomo_checks
SET two_step_distance1 = two_step_distance
WHERE two_step_distance1 IS NULL AND two_step_distance IS NOT NULL;

-- 集団解析用ビュー
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

-- 統計サマリービュー
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
```

---

## 集団解析データの取得方法

### 1. 全データの取得（CSV出力用）

Supabase SQL Editorで実行:
```sql
SELECT * FROM rokomo_analysis_view;
```

結果を CSV でエクスポート可能。

### 2. 組織ごとの統計サマリー

```sql
SELECT * FROM rokomo_stats_summary;
```

出力例:
| organization_type | organization_name | total_checks | avg_age | count_no_risk | count_level1 | count_level2 | count_level3 |
|-------------------|-------------------|--------------|---------|---------------|--------------|--------------|--------------|
| company           | 株式会社〇〇      | 50           | 45.2    | 30            | 15           | 3            | 2            |
| medical           | △△病院          | 120          | 68.5    | 40            | 50           | 20           | 10           |

---

## 今後の実装が必要な項目

### 🔲 FBシートPDF出力機能
写真のようなフィードバックシート（PDFレポート）の生成機能。
- 個別スコア表示
- 合計スコアのランク付け
- ロコモ度の視覚的表現
- 推奨される対策の記載

### 🔲 管理者用データ閲覧画面
- 組織ごとのデータ一覧
- 統計グラフの表示
- CSVエクスポート機能

---

## 動作確認方法

1. 開発サーバー起動:
```bash
npm run dev
```

2. http://localhost:5173 にアクセス

3. フローを確認:
   - 同意画面
   - 基本情報入力（身長・所属を含む）
   - テスト順序選択
   - 実技テスト（立ち上がり・2ステップ）
   - ロコモ25質問票
   - 結果表示

---

## ビルド

```bash
npm run build
```

ビルド結果: **435KB** (gzip: 128KB)

---

**更新日**: 2026年1月14日
