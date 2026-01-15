-- 現在のRLSポリシーを確認するSQL

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('users', 'rokomo_checks')
ORDER BY tablename, policyname;
