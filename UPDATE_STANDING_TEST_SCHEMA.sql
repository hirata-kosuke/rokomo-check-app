-- 立ち上がりテストのスキーマ更新: 両足・片足の両方を記録

-- 古いカラムを削除
ALTER TABLE rokomo_checks DROP COLUMN IF EXISTS standing_test_40cm;
ALTER TABLE rokomo_checks DROP COLUMN IF EXISTS standing_test_20cm;
ALTER TABLE rokomo_checks DROP COLUMN IF EXISTS standing_test_10cm;

-- 新しいカラムを追加
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS standing_both_legs_40cm BOOLEAN;
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS standing_both_legs_20cm BOOLEAN;
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS standing_both_legs_10cm BOOLEAN;
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS standing_one_leg_40cm BOOLEAN;
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS standing_one_leg_20cm BOOLEAN;
ALTER TABLE rokomo_checks ADD COLUMN IF NOT EXISTS standing_one_leg_10cm BOOLEAN;
