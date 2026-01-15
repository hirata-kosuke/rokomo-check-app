import { test, expect } from '@playwright/test';

test.describe('ロコモチェックアプリ フルフロー', () => {
  test('同意画面 → 基本情報 → ロコモチェック → 結果表示の完全なフロー', async ({ page }) => {
    // ダイアログイベントをリスニング
    page.on('dialog', async dialog => {
      console.log('Dialog detected:', dialog.message());
      await dialog.accept();
    });

    // コンソールログをキャプチャ
    page.on('console', msg => {
      console.log('Browser console:', msg.type(), msg.text());
    });

    // ステップ1: 同意画面
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('個人情報の取扱いについて');
    await page.screenshot({ path: 'test-results/01_同意画面.png', fullPage: true });

    // 同意チェックボックスをクリック
    const consentCheckbox = page.locator('input[type="checkbox"]');
    await consentCheckbox.check();
    await expect(consentCheckbox).toBeChecked();

    // 同意して始めるボタンをクリック
    await page.click('button:has-text("同意して始める")');

    // ステップ2: 基本情報の入力画面
    await expect(page).toHaveURL('/basic-info');
    await expect(page.locator('h1')).toContainText('基本情報の入力');
    await page.screenshot({ path: 'test-results/02_基本情報入力画面.png', fullPage: true });

    // 基本情報を入力
    await page.fill('input[type="text"]', 'テスト太郎');
    await page.fill('input[type="number"]', '65');
    await page.click('input[value="male"]');

    await page.screenshot({ path: 'test-results/03_基本情報入力完了.png', fullPage: true });

    // 次へボタンをクリック
    await page.click('button:has-text("次へ進む")');

    // ステップ3: ロコモチェック - 立ち上がりテスト
    await expect(page).toHaveURL('/rokomo-check');
    await expect(page.locator('h2')).toContainText('立ち上がりテスト');
    await page.screenshot({ path: 'test-results/04_立ち上がりテスト.png', fullPage: true });

    // 40cm: できない を選択
    await page.click('label:has-text("できない") >> nth=0');
    await page.screenshot({ path: 'test-results/04-1_40cm選択後.png', fullPage: true });

    // 20cm: できない を選択
    await page.click('label:has-text("できない") >> nth=1');
    await page.screenshot({ path: 'test-results/04-2_20cm選択後.png', fullPage: true });

    // 10cm: できる を選択
    await page.click('label:has-text("できる") >> nth=2');
    await page.screenshot({ path: 'test-results/05_立ち上がりテスト完了.png', fullPage: true });

    // 次へボタン
    await page.click('button:has-text("次へ")');

    // ステップ4: 2ステップテスト
    await expect(page.locator('h2')).toContainText('2ステップテスト');
    await page.screenshot({ path: 'test-results/06_2ステップテスト.png', fullPage: true });

    // 2ステップの値を入力
    await page.fill('#distance', '180'); // 歩幅180cm
    await page.fill('#height', '160'); // 身長160cm

    await page.screenshot({ path: 'test-results/07_2ステップテスト完了.png', fullPage: true });

    // 次へボタン
    await page.click('button:has-text("次へ")');

    // ステップ5: ロコモ25質問票
    await expect(page.locator('h2')).toContainText('ロコモ25');
    await page.screenshot({ path: 'test-results/08_ロコモ25質問票.png', fullPage: true });

    // 質問1-25にそれぞれ回答（0-4の値）
    const questionItems = page.locator('.question-item');
    const count = await questionItems.count();

    for (let i = 0; i < count; i++) {
      const score = i % 5; // 0, 1, 2, 3, 4をローテーション
      const questionItem = questionItems.nth(i);
      const scaleLabel = questionItem.locator(`.scale-label:has-text("${score}") >> nth=0`);
      await scaleLabel.click();

      // 5問ごとにスクリーンショットを撮影
      if ((i + 1) % 5 === 0) {
        await page.screenshot({ path: `test-results/08-${Math.floor(i / 5)}_ロコモ25_Q${i - 4}-${i + 1}.png`, fullPage: true });
      }
    }

    await page.screenshot({ path: 'test-results/09_ロコモ25完了.png', fullPage: true });

    // 結果を見るボタン
    await page.click('button:has-text("結果を見る")');

    // 画面遷移を待機（最大10秒）
    try {
      await expect(page).toHaveURL('/result', { timeout: 10000 });
    } catch (error) {
      console.log('Failed to navigate to result page');
      await page.screenshot({ path: 'test-results/09-error_navigation_failed.png', fullPage: true });
      throw error;
    }

    // ステップ6: 結果画面
    await expect(page.locator('h1').first()).toContainText('ロコモチェック結果');
    await page.screenshot({ path: 'test-results/10_結果画面.png', fullPage: true });

    // 結果の詳細を確認
    await expect(page.locator('text=テスト太郎').first()).toBeVisible();
    await expect(page.locator('text=65歳').first()).toBeVisible();

    // 印刷ボタンの存在確認
    await expect(page.locator('button:has-text("印刷する")')).toBeVisible();

    // ホームに戻るボタンの存在確認
    await expect(page.locator('button:has-text("ホームに戻る")')).toBeVisible();

    await page.screenshot({ path: 'test-results/11_結果画面_最終.png', fullPage: true });

    console.log('✅ ロコモチェックアプリの全フローが正常に動作しました');
  });

  test('プライバシーポリシーページの表示確認', async ({ page }) => {
    await page.goto('/privacy-policy');
    await expect(page.locator('h1')).toContainText('プライバシーポリシー');
    await page.screenshot({ path: 'test-results/12_プライバシーポリシー.png', fullPage: true });

    // 内容の確認
    await expect(page.locator('text=個人情報保護管理者')).toBeVisible();
    await expect(page.locator('text=個人情報の利用目的')).toBeVisible();
  });
});
