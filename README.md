# ロコモチェックアプリ

ロコモティブシンドローム（運動器の障害）の評価・診断を支援するWebアプリケーションです。

## 特徴

- ✅ **個人情報保護対応**: 同意取得機能（パターンA）実装済み
- ✅ **データ収集**: Supabaseによる安全なクラウドストレージ
- ✅ **印刷対応**: A4サイズ最適化された結果シート
- ✅ **評価ロジック**: 立ち上がりテスト、2ステップテスト、ロコモ25質問票
- ✅ **レスポンシブデザイン**: PC/タブレット/スマートフォン対応

## 技術スタック

- **フロントエンド**: React 19 + TypeScript + Vite
- **バックエンド**: Supabase (PostgreSQL + Row Level Security)
- **スタイリング**: CSS3 (カスタムスタイル)
- **アイコン**: lucide-react
- **ルーティング**: React Router v6

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseのセットアップ

詳細は [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) を参照してください。

1. https://supabase.com/ でプロジェクトを作成
2. SQL Editorでデータベーススキーマを作成
3. `.env` ファイルを作成して環境変数を設定

```.env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

### 4. プロダクションビルド

```bash
npm run build
```

## 使用方法

### 患者側フロー

1. **同意画面**: 個人情報の取扱いに同意
2. **基本情報入力**: 氏名、年齢、性別を入力
3. **ロコモチェック実施**:
   - 立ち上がりテスト
   - 2ステップテスト
   - ロコモ25質問票（25問）
4. **結果表示**: 総合判定と詳細結果を表示
5. **印刷**: A4サイズで印刷・PDF出力

## セキュリティ

- ✅ **Row Level Security (RLS)**: ユーザーは自分のデータのみ閲覧可能
- ✅ **HTTPS通信**: Vercel自動提供
- ✅ **環境変数**: `.env` ファイルで管理（Git除外）
- ✅ **同意取得**: GDPR/個人情報保護法準拠

## E2Eテスト

Playwrightによるエンドツーエンドテストを実装しています。

### テスト実行

```bash
npm test
```

### 動画エビデンス

テスト実行時の動画は `video-evidence/` フォルダに保存されます:

- `full-flow-test.webm`: 同意 → 基本情報 → ロコモチェック → 結果表示の完全なフロー
- `privacy-policy-test.webm`: プライバシーポリシーページの表示確認

## トラブルシューティング

### エラー: "Supabase環境変数が設定されていません"

→ `.env` ファイルを作成し、Supabase URLとAPIキーを設定してください。

### エラー: "relation 'users' does not exist"

→ SUPABASE_SETUP.mdの手順に従い、SQL Editorでスキーマを作成してください。

## プロジェクト構成

```text
rokomo-check-app/
├── src/
│   ├── pages/            # 画面コンポーネント
│   │   ├── ConsentScreen.tsx
│   │   ├── BasicInfoForm.tsx
│   │   ├── RokomoCheckForm.tsx
│   │   ├── ResultScreen.tsx
│   │   └── PrivacyPolicy.tsx
│   ├── lib/              # ライブラリ
│   │   └── supabase.ts
│   ├── utils/            # ユーティリティ
│   │   └── evaluation.ts
│   └── types/            # 型定義
│       └── rokomo.ts
├── tests/                # E2Eテスト
│   └── rokomo-check.spec.ts
├── video-evidence/       # 動画エビデンス
│   ├── full-flow-test.webm
│   └── privacy-policy-test.webm
└── SUPABASE_SETUP.md    # Supabaseセットアップ手順
```
