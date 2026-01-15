-- テスト用: RLSを一時的に無効化
-- 警告: 本番環境では絶対に使用しないでください

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE rokomo_checks DISABLE ROW LEVEL SECURITY;

-- テスト完了後、以下のSQLで再度有効化してください:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rokomo_checks ENABLE ROW LEVEL SECURITY;
