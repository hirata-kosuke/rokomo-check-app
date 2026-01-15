export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      <div className="container">
        <h1>プライバシーポリシー</h1>

        <section>
          <h2>1. 事業者の名称</h2>
          <p>ロコモチェックアプリ運営事務局</p>
        </section>

        <section>
          <h2>2. 個人情報保護管理者</h2>
          <p>氏名: 管理責任者</p>
          <p>メールアドレス: privacy@example.com</p>
        </section>

        <section>
          <h2>3. 個人情報の利用目的</h2>
          <ul>
            <li>ロコモティブシンドロームの評価・診断のため</li>
            <li>統計データの作成（個人を特定できない形式）のため</li>
            <li>サービス改善のための分析のため</li>
          </ul>
        </section>

        <section>
          <h2>4. 取得する個人情報の項目</h2>
          <ul>
            <li>氏名</li>
            <li>年齢</li>
            <li>性別</li>
            <li>ロコモチェックの結果（立ち上がりテスト、2ステップテスト、ロコモ25質問票）</li>
            <li>チェック実施日時</li>
          </ul>
        </section>

        <section>
          <h2>5. 個人情報の第三者提供</h2>
          <p>
            ご本人の同意なく第三者に提供することはありません。
            ただし、以下の場合は除きます：
          </p>
          <ul>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要な場合</li>
          </ul>
        </section>

        <section>
          <h2>6. 個人情報の開示・訂正・削除</h2>
          <p>
            ご本人からの請求に応じて、開示・訂正・削除を行います。
            <br />
            請求方法: privacy@example.comまでメールでご連絡ください。
          </p>
        </section>

        <section>
          <h2>7. クッキー（Cookie）の使用</h2>
          <p>
            当サイトでは、サービス向上のためクッキーを使用しています。
            ブラウザ設定でクッキーを無効にすることも可能ですが、
            一部機能が利用できなくなる場合があります。
          </p>
        </section>

        <section>
          <h2>8. SSL/TLSによる暗号化</h2>
          <p>
            当サイトでは、個人情報を安全に送信するためSSL/TLS暗号化通信を使用しています。
          </p>
        </section>

        <section>
          <h2>9. データの保管</h2>
          <p>
            個人情報はSupabase（クラウドサービス）にて安全に保管されます。
            Supabaseは業界標準のセキュリティ対策を実施しています。
          </p>
        </section>

        <section>
          <h2>10. お問い合わせ窓口</h2>
          <p>メールアドレス: privacy@example.com</p>
          <p>電話番号: 03-xxxx-xxxx（平日10:00-17:00）</p>
        </section>

        <section>
          <h2>11. プライバシーポリシーの変更</h2>
          <p>
            本ポリシーの内容は、法令の変更等により予告なく変更することがあります。
            変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <p className="last-updated">最終更新日: 2026年1月13日</p>
      </div>
    </div>
  );
}
