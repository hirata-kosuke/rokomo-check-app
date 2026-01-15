import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function ConsentScreen() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (agreed) {
      // 同意状態をlocalStorageに保存
      localStorage.setItem('consent_agreed', 'true');
      localStorage.setItem('consent_date', new Date().toISOString());
      navigate('/basic-info');
    }
  };

  return (
    <div className="consent-screen">
      <div className="container">
        <div className="consent-header">
          <FileText size={48} className="icon" />
          <h1>個人情報の取扱いについて</h1>
        </div>

        <div className="consent-content">
          <section>
            <h2>ロコモチェックアプリをご利用いただくにあたって</h2>
            <p>
              本アプリは、ロコモティブシンドローム（運動器の障害）の評価・診断を支援するためのツールです。
              ご利用にあたり、以下の個人情報の取扱いについてご確認ください。
            </p>
          </section>

          <section>
            <h3>1. 収集する情報</h3>
            <ul>
              <li>氏名、年齢、性別</li>
              <li>ロコモチェックの結果（立ち上がりテスト、2ステップテスト、ロコモ25質問票）</li>
              <li>チェック実施日時</li>
            </ul>
          </section>

          <section>
            <h3>2. 利用目的</h3>
            <ul>
              <li>ロコモティブシンドロームの評価・診断のため</li>
              <li>統計データの作成（個人を特定できない形式）のため</li>
              <li>サービス改善のための分析のため</li>
            </ul>
          </section>

          <section>
            <h3>3. 第三者提供について</h3>
            <p>ご本人の同意なく第三者に提供することはありません。</p>
          </section>

          <section>
            <h3>4. データの保管</h3>
            <p>
              Supabase（クラウドサービス）にて安全に保管します。
              業界標準のセキュリティ対策（SSL/TLS暗号化、Row Level Security）を実施しています。
            </p>
          </section>

          <section>
            <h3>5. データの削除</h3>
            <p>
              ご本人からの請求により、いつでもデータを削除いたします。
              お問い合わせ先: privacy@example.com
            </p>
          </section>

          <div className="privacy-policy-link">
            <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
              プライバシーポリシー全文を読む
            </Link>
          </div>
        </div>

        <div className="consent-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>上記の個人情報の取扱いについて同意します</span>
          </label>
        </div>

        <div className="consent-actions">
          <button
            className="btn-primary"
            disabled={!agreed}
            onClick={handleSubmit}
          >
            同意して始める
          </button>
        </div>
      </div>
    </div>
  );
}
