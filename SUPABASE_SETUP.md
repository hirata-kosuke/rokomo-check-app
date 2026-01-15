# Supabase セットアップ手順

## 1. Supabaseプロジェクト作成

1. https://supabase.com/ にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインイン
4. 「New Project」をクリック
5. プロジェクト情報を入力:
   - **Name**: rokomo-check-app
   - **Database Password**: 強力なパスワードを設定（メモしておく）
   - **Region**: Northeast Asia (Tokyo)
6. 「Create new project」をクリック（2-3分待機）

---

## 2. データベーススキーマ作成

### 2-1. SQL Editorを開く

1. 左メニューから「SQL Editor」をクリック
2. 「New query」をクリック

### 2-2. 以下のSQLを実行

```sql
-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  consent_date TIMESTAMP NOT NULL DEFAULT NOW(),
  consent_version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ロコモチェック結果テーブル
CREATE TABLE rokomo_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- 基本情報
  check_date TIMESTAMP NOT NULL DEFAULT NOW(),

  -- 立ち上がりテスト
  standing_test_40cm BOOLEAN,
  standing_test_20cm BOOLEAN,
  standing_test_10cm BOOLEAN,

  -- 2ステップテスト
  two_step_distance NUMERIC,
  two_step_height NUMERIC,
  two_step_score NUMERIC,

  -- ロコモ25（質問票）
  locomo25_q1 INTEGER,
  locomo25_q2 INTEGER,
  locomo25_q3 INTEGER,
  locomo25_q4 INTEGER,
  locomo25_q5 INTEGER,
  locomo25_q6 INTEGER,
  locomo25_q7 INTEGER,
  locomo25_q8 INTEGER,
  locomo25_q9 INTEGER,
  locomo25_q10 INTEGER,
  locomo25_q11 INTEGER,
  locomo25_q12 INTEGER,
  locomo25_q13 INTEGER,
  locomo25_q14 INTEGER,
  locomo25_q15 INTEGER,
  locomo25_q16 INTEGER,
  locomo25_q17 INTEGER,
  locomo25_q18 INTEGER,
  locomo25_q19 INTEGER,
  locomo25_q20 INTEGER,
  locomo25_q21 INTEGER,
  locomo25_q22 INTEGER,
  locomo25_q23 INTEGER,
  locomo25_q24 INTEGER,
  locomo25_q25 INTEGER,
  locomo25_total INTEGER,

  -- 評価結果
  standing_risk_level INTEGER, -- 0-3
  two_step_risk_level INTEGER, -- 0-3
  locomo25_risk_level INTEGER, -- 0-3
  total_risk TEXT, -- "なし", "ロコモ度1", "ロコモ度2", "ロコモ度3"

  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS) 有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rokomo_checks ENABLE ROW LEVEL SECURITY;

-- ポリシー設定: ユーザーは自分のデータのみ閲覧可能
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view own checks"
  ON rokomo_checks
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own checks"
  ON rokomo_checks
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 管理者用ポリシー（将来の拡張用）
-- 注: 管理者ロールは別途実装が必要
```

3. 「Run」をクリックして実行

---

## 3. API キー取得

1. 左メニューから「Settings」→「API」をクリック
2. 以下の情報をコピー:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (長いトークン)

---

## 4. 環境変数ファイル作成

プロジェクトルートに `.env` ファイルを作成:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**重要**: `.env` ファイルは Git にコミットしないでください（`.gitignore` に追加済み）

---

## 5. 認証設定（オプション）

### メール認証を無効化（開発用）

1. 左メニューから「Authentication」→「Providers」をクリック
2. 「Email」をクリック
3. 「Enable email confirmations」を **OFF** に設定
4. 「Save」をクリック

**本番環境では必ず ON に戻してください**

---

## 6. セットアップ完了確認

以下のコマンドを実行して、接続テスト:

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開き、アプリが起動すればOK。

---

## トラブルシューティング

### エラー: "Invalid API key"
- `.env` ファイルの `VITE_SUPABASE_ANON_KEY` が正しいか確認
- 開発サーバーを再起動（Ctrl+C → `npm run dev`）

### エラー: "relation 'users' does not exist"
- SQL Editorでスキーマ作成SQLを実行したか確認
- テーブルが作成されているか確認（左メニュー「Table Editor」）

### エラー: "Row Level Security policy violation"
- RLSポリシーが正しく設定されているか確認
- SQL Editorで再度ポリシー作成SQLを実行

---

セットアップ完了後、`SUPABASE_SETUP_COMPLETE.txt` ファイルを作成してください。
