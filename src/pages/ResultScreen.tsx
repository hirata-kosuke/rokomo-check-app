import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { compareTwoStepWithAverage } from '../utils/evaluation';

export default function ResultScreen() {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const resultStr = sessionStorage.getItem('checkResult');
    if (!resultStr) {
      navigate('/');
      return;
    }

    setResult(JSON.parse(resultStr));
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (!result) {
    return <div>読み込み中...</div>;
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'なし':
        return 'green';
      case 'ロコモ度1':
        return 'yellow';
      case 'ロコモ度2':
        return 'orange';
      case 'ロコモ度3':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getRiskLevelText = (level: number) => {
    const levels = ['問題なし', 'ロコモ度1', 'ロコモ度2', 'ロコモ度3'];
    return levels[level];
  };

  const getScoreColor = (level: number) => {
    if (level === 0) return '#10b981'; // green
    if (level === 1) return '#fbbf24'; // yellow
    if (level === 2) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className="result-screen">
      {/* 画面表示用 */}
      <div className="no-print">
        <div className="container">
          <div className="result-header">
            <h1>ロコモチェック結果</h1>
          </div>

          {/* 総合判定カード - 大きく目立つ表示 */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: `4px solid ${getScoreColor(
              Math.max(
                result.evaluation.standing_risk_level,
                result.evaluation.two_step_risk_level,
                result.evaluation.locomo25_risk_level
              )
            )}`
          }}>
            <div style={{textAlign: 'center'}}>
              <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937'}}>総合判定</h2>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: getScoreColor(
                  Math.max(
                    result.evaluation.standing_risk_level,
                    result.evaluation.two_step_risk_level,
                    result.evaluation.locomo25_risk_level
                  )
                ),
                marginBottom: '1rem'
              }}>
                {result.evaluation.total_risk}
              </div>
              {result.evaluation.total_risk === 'なし' ? (
                <p style={{fontSize: '1.2rem', color: '#10b981'}}>
                  ✅ 運動器の状態は良好です。この状態を維持しましょう。
                </p>
              ) : (
                <p style={{fontSize: '1.2rem', color: '#ef4444'}}>
                  ⚠️ 運動器機能の低下が見られます。適切な運動やケアを検討しましょう。
                </p>
              )}
            </div>
          </div>

          {/* 3つの評価をボックス形式で横並び表示 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* 立ち上がりテスト */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderTop: `6px solid ${getScoreColor(result.evaluation.standing_risk_level)}`
            }}>
              <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', color: '#4F46E5'}}>立ち上がりテスト</h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: getScoreColor(result.evaluation.standing_risk_level),
                marginBottom: '0.5rem'
              }}>
                {getRiskLevelText(result.evaluation.standing_risk_level)}
              </div>
              <div style={{fontSize: '0.9rem', color: '#6b7280'}}>
                リスクレベル: {result.evaluation.standing_risk_level}
              </div>
            </div>

            {/* 2ステップテスト */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderTop: `6px solid ${getScoreColor(result.evaluation.two_step_risk_level)}`
            }}>
              <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', color: '#7C3AED'}}>2ステップテスト</h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: getScoreColor(result.evaluation.two_step_risk_level),
                marginBottom: '0.5rem'
              }}>
                {getRiskLevelText(result.evaluation.two_step_risk_level)}
              </div>
              <div style={{fontSize: '0.9rem', color: '#6b7280'}}>
                スコア: {result.twoStepTest.score.toFixed(2)}
              </div>
              {(() => {
                const comparison = compareTwoStepWithAverage(result.basicInfo.age, result.twoStepTest.score);
                if (comparison.isBelowAverage) {
                  return (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.5rem',
                      backgroundColor: '#fef3c7',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      color: '#d97706'
                    }}>
                      ⚠️ 年代平均を下回っています
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* ロコモ25 */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderTop: `6px solid ${getScoreColor(result.evaluation.locomo25_risk_level)}`
            }}>
              <h3 style={{fontSize: '1.1rem', marginBottom: '1rem', color: '#059669'}}>ロコモ25</h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: getScoreColor(result.evaluation.locomo25_risk_level),
                marginBottom: '0.5rem'
              }}>
                {getRiskLevelText(result.evaluation.locomo25_risk_level)}
              </div>
              <div style={{fontSize: '0.9rem', color: '#6b7280'}}>
                合計スコア: {result.locomo25Total} 点
              </div>
            </div>
          </div>

          {/* 基本情報 - コンパクトに */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{fontSize: '1.2rem', marginBottom: '1rem', color: '#1f2937'}}>基本情報</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.95rem'}}>
              <div><strong>氏名:</strong> {result.basicInfo.name}</div>
              <div><strong>年齢:</strong> {result.basicInfo.age}歳</div>
              <div><strong>性別:</strong> {result.basicInfo.gender === 'male' ? '男性' : result.basicInfo.gender === 'female' ? '女性' : 'その他'}</div>
              <div><strong>身長:</strong> {result.basicInfo.height} cm</div>
              <div><strong>所属:</strong> {result.basicInfo.organization_type === 'company' ? '企業' : '医療機関'}</div>
              <div><strong>企業名:</strong> {result.basicInfo.organization_name}</div>
            </div>
            <div style={{marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280'}}>
              チェック日時: {new Date().toLocaleString('ja-JP')}
            </div>
          </div>

          {/* 詳細データ - 折りたたみ可能に */}
          <details style={{marginBottom: '2rem'}}>
            <summary style={{
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px'
            }}>
              詳細データを表示 ▼
            </summary>
            <div style={{padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', marginTop: '0.5rem'}}>
              <section style={{marginBottom: '1.5rem'}}>
                <h4 style={{color: '#4F46E5', marginBottom: '0.5rem'}}>立ち上がりテスト詳細</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div>
                    <strong>両脚:</strong>
                    <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem'}}>
                      <li>40cm: {result.standingTest.bothLegs40cm ? '✓ できる' : '✗ できない'}</li>
                      {result.standingTest.bothLegs40cm && <li>20cm: {result.standingTest.bothLegs20cm ? '✓ できる' : '✗ できない'}</li>}
                      {result.standingTest.bothLegs20cm && <li>10cm: {result.standingTest.bothLegs10cm ? '✓ できる' : '✗ できない'}</li>}
                    </ul>
                  </div>
                  <div>
                    <strong>片脚:</strong>
                    <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem'}}>
                      <li>40cm: {result.standingTest.oneLeg40cm ? '✓ できる' : '✗ できない'}</li>
                      {result.standingTest.oneLeg40cm && <li>20cm: {result.standingTest.oneLeg20cm ? '✓ できる' : '✗ できない'}</li>}
                      {result.standingTest.oneLeg20cm && <li>10cm: {result.standingTest.oneLeg10cm ? '✓ できる' : '✗ できない'}</li>}
                    </ul>
                  </div>
                </div>
              </section>

              <section style={{marginBottom: '1.5rem'}}>
                <h4 style={{color: '#7C3AED', marginBottom: '0.5rem'}}>2ステップテスト詳細</h4>
                <ul style={{marginLeft: '1.5rem'}}>
                  <li>1回目: {result.twoStepTest.distance1} cm</li>
                  <li>2回目: {result.twoStepTest.distance2} cm</li>
                  <li><strong>良値（採用）: {result.twoStepTest.betterDistance} cm</strong></li>
                  <li>身長: {result.twoStepTest.height} cm</li>
                  <li>スコア: {result.twoStepTest.score.toFixed(2)}</li>
                </ul>
                {(() => {
                  const comparison = compareTwoStepWithAverage(result.basicInfo.age, result.twoStepTest.score);
                  return (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: comparison.isBelowAverage ? '#fef3c7' : '#d1fae5',
                      borderRadius: '6px',
                      borderLeft: `4px solid ${comparison.isBelowAverage ? '#f59e0b' : '#10b981'}`
                    }}>
                      <div style={{fontSize: '0.95rem', marginBottom: '0.5rem'}}>
                        <strong>年代別平均値との比較</strong>
                      </div>
                      <ul style={{marginLeft: '1.5rem', fontSize: '0.9rem'}}>
                        <li>あなたの年代（{result.basicInfo.age}歳）の平均: {comparison.average.toFixed(2)}</li>
                        <li>差分: {comparison.difference >= 0 ? '+' : ''}{comparison.difference.toFixed(2)}</li>
                        {comparison.isBelowAverage && (
                          <li style={{color: '#d97706', fontWeight: 'bold', marginTop: '0.5rem'}}>
                            ⚠️ 年代平均を下回っています。適切な運動を心がけましょう。
                          </li>
                        )}
                        {!comparison.isBelowAverage && (
                          <li style={{color: '#059669', fontWeight: 'bold', marginTop: '0.5rem'}}>
                            ✓ 年代平均以上の良好な結果です。
                          </li>
                        )}
                      </ul>
                      <p style={{fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem'}}>
                        出典: 日本整形外科学会ロコモ度テスト（<a href="https://locomo-joa.jp/check/test/two-step" target="_blank" rel="noopener noreferrer" style={{color: '#2563eb'}}>https://locomo-joa.jp/check/test/two-step</a>）
                      </p>
                    </div>
                  );
                })()}
              </section>

              <section>
                <h4 style={{color: '#059669', marginBottom: '0.5rem'}}>ロコモ25質問票</h4>
                <p>合計スコア: <strong>{result.locomo25Total} 点</strong></p>
              </section>
            </div>
          </details>

          {/* アドバイスセクション */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderLeft: `6px solid ${getScoreColor(
              Math.max(
                result.evaluation.standing_risk_level,
                result.evaluation.two_step_risk_level,
                result.evaluation.locomo25_risk_level
              )
            )}`
          }}>
            <h3 style={{fontSize: '1.3rem', marginBottom: '1rem', color: '#1f2937'}}>
              📋 あなたへのアドバイス
            </h3>
            {result.evaluation.total_risk === 'なし' && (
              <div>
                <p style={{marginBottom: '1rem', lineHeight: '1.8'}}>
                  運動器の状態は良好です。この状態を維持するために、以下の運動を継続しましょう。
                </p>
                <h4 style={{fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#059669'}}>
                  推奨される運動（予防）
                </h4>
                <ul style={{lineHeight: '1.8', marginLeft: '1.5rem'}}>
                  <li><strong>片脚立ち</strong>: 左右各1分間×1日3回</li>
                  <li><strong>スクワット</strong>: 深呼吸をしながらゆっくり5～6回×1日3回</li>
                  <li><strong>ウォーキング</strong>: 1日20～30分程度</li>
                </ul>
                <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280'}}>
                  出典: 日本整形外科学会「ロコモティブシンドローム予防啓発公式サイト」<br />
                  <a href="https://locomo-joa.jp/assets/files/locotre.pdf" target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6'}}>
                    https://locomo-joa.jp/assets/files/locotre.pdf
                  </a>
                </p>
              </div>
            )}
            {result.evaluation.total_risk === 'ロコモ度1' && (
              <div>
                <p style={{marginBottom: '1rem', lineHeight: '1.8', color: '#f59e0b'}}>
                  <strong>ロコモ度1:</strong> 運動器機能がやや低下しています。運動習慣を見直し、ロコトレ（ロコモーショントレーニング）を開始しましょう。
                </p>
                <h4 style={{fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#059669'}}>
                  推奨されるロコトレ
                </h4>
                <ul style={{lineHeight: '1.8', marginLeft: '1.5rem'}}>
                  <li><strong>片脚立ち</strong>: 転倒しないように机や椅子につかまり、左右各1分間×1日3回</li>
                  <li><strong>スクワット</strong>: 深呼吸をしながらゆっくり5～6回×1日3回（膝がつま先より前に出ないよう注意）</li>
                  <li><strong>ヒールレイズ（かかと上げ）</strong>: 10～20回×1日2～3セット</li>
                  <li><strong>フロントランジ</strong>: 左右各5～10回×1日2セット</li>
                </ul>
                <h4 style={{fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#dc2626'}}>
                  注意点
                </h4>
                <p style={{lineHeight: '1.8'}}>
                  • 運動中に痛みが出た場合は中止してください<br />
                  • 膝や腰に不安がある方は、医師に相談してから実施してください<br />
                  • 定期的に（3～6ヶ月ごとに）ロコモチェックを行い、改善を確認しましょう
                </p>
                <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280'}}>
                  出典: 日本整形外科学会「ロコモティブシンドローム予防啓発公式サイト」<br />
                  <a href="https://locomo-joa.jp/assets/files/locotre.pdf" target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6'}}>
                    https://locomo-joa.jp/assets/files/locotre.pdf
                  </a>
                </p>
              </div>
            )}
            {result.evaluation.total_risk === 'ロコモ度2' && (
              <div>
                <p style={{marginBottom: '1rem', lineHeight: '1.8', color: '#f97316'}}>
                  <strong>ロコモ度2:</strong> 運動器機能が低下しています。転倒や骨折のリスクが高まっている可能性があります。自立した生活を送るために、積極的にロコトレを実施しましょう。
                </p>
                <h4 style={{fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#059669'}}>
                  推奨されるロコトレ（段階的に）
                </h4>
                <ul style={{lineHeight: '1.8', marginLeft: '1.5rem'}}>
                  <li><strong>片脚立ち（初級）</strong>: 机や椅子にしっかりつかまり、できる範囲で実施（左右各30秒～1分）</li>
                  <li><strong>スクワット（初級）</strong>: 椅子に座る・立つ動作を繰り返す（5～10回×1日2～3セット）</li>
                  <li><strong>座位での足の運動</strong>: 椅子に座って足首を動かす、膝を伸ばす運動</li>
                  <li><strong>歩行練習</strong>: 安全な場所で毎日10～15分程度のウォーキング</li>
                </ul>
                <h4 style={{fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#dc2626'}}>
                  重要な注意点
                </h4>
                <p style={{lineHeight: '1.8'}}>
                  • <strong>医療機関への相談を推奨します</strong>。整形外科やリハビリテーション科で専門的な指導を受けることが望ましいです<br />
                  • 無理な運動は避け、痛みが出たらすぐに中止してください<br />
                  • 転倒防止のため、自宅環境の見直しも重要です（段差の解消、手すりの設置など）<br />
                  • 栄養状態の改善も重要です（タンパク質、カルシウム、ビタミンDの摂取）
                </p>
                <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280'}}>
                  出典: 日本整形外科学会「ロコモティブシンドローム予防啓発公式サイト」<br />
                  <a href="https://locomo-joa.jp/assets/files/locotre.pdf" target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6'}}>
                    https://locomo-joa.jp/assets/files/locotre.pdf
                  </a>
                </p>
              </div>
            )}
            {result.evaluation.total_risk === 'ロコモ度3' && (
              <div>
                <p style={{marginBottom: '1rem', lineHeight: '1.8', color: '#dc2626'}}>
                  <strong>ロコモ度3:</strong> 運動器機能が著しく低下しています。社会参加や自立した生活に支障が出る可能性が高い状態です。<strong style={{fontSize: '1.1rem'}}>速やかに医療機関（整形外科）を受診してください。</strong>
                </p>
                <h4 style={{fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#dc2626'}}>
                  医療機関での相談が必要です
                </h4>
                <p style={{lineHeight: '1.8'}}>
                  整形外科やリハビリテーション科で以下を相談してください：
                </p>
                <ul style={{lineHeight: '1.8', marginLeft: '1.5rem'}}>
                  <li>現在の運動器の状態の詳細な評価</li>
                  <li>個別のリハビリテーションプログラムの作成</li>
                  <li>必要に応じた治療（薬物療法、装具療法など）</li>
                  <li>日常生活動作（ADL）の改善指導</li>
                  <li>転倒予防対策</li>
                </ul>
                <h4 style={{fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#059669'}}>
                  自宅でできる安全な運動（医師の指導下で）
                </h4>
                <ul style={{lineHeight: '1.8', marginLeft: '1.5rem'}}>
                  <li><strong>座位での運動</strong>: 椅子に座ったまま足首や膝を動かす</li>
                  <li><strong>ベッド上での運動</strong>: 寝た状態で足を動かす、膝を曲げ伸ばしする</li>
                  <li><strong>歩行器を使った歩行練習</strong>: 理学療法士の指導のもとで実施</li>
                </ul>
                <h4 style={{fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#dc2626'}}>
                  重要な注意事項
                </h4>
                <p style={{lineHeight: '1.8'}}>
                  • 自己判断での運動は危険です。必ず医師や理学療法士の指導を受けてください<br />
                  • 介護保険サービスの利用も検討しましょう（65歳以上または特定疾病該当者）<br />
                  • 転倒防止が最優先です。自宅環境の改善、見守りサービスの利用を検討してください<br />
                  • 栄養管理が重要です。必要に応じて管理栄養士の指導を受けましょう
                </p>
                <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280'}}>
                  出典: 日本整形外科学会「ロコモティブシンドローム予防啓発公式サイト」<br />
                  <a href="https://locomo-joa.jp/assets/files/locotre.pdf" target="_blank" rel="noopener noreferrer" style={{color: '#3b82f6'}}>
                    https://locomo-joa.jp/assets/files/locotre.pdf
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="result-actions">
            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={20} />
              印刷する
            </button>
            <button className="btn-secondary" onClick={() => navigate('/')}>
              ホームに戻る
            </button>
          </div>
        </div>
      </div>

      {/* 印刷用 */}
      <div className="print-only">
        <div className="print-header">
          <h1>ロコモチェック結果シート</h1>
          <p className="print-date">発行日: {new Date().toLocaleDateString('ja-JP')}</p>
        </div>

        <div className="print-section">
          <h2>基本情報</h2>
          <table className="print-table">
            <tbody>
              <tr>
                <th>氏名</th>
                <td>{result.basicInfo.name}</td>
                <th>年齢</th>
                <td>{result.basicInfo.age}歳</td>
              </tr>
              <tr>
                <th>性別</th>
                <td>
                  {result.basicInfo.gender === 'male'
                    ? '男性'
                    : result.basicInfo.gender === 'female'
                    ? '女性'
                    : 'その他'}
                </td>
                <th>チェック日時</th>
                <td>{new Date().toLocaleString('ja-JP')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="print-section">
          <h2>総合判定</h2>
          <div className={`print-risk risk-${getRiskColor(result.evaluation.total_risk)}`}>
            <strong>{result.evaluation.total_risk}</strong>
          </div>
        </div>

        <div className="print-section">
          <h2>立ち上がりテスト</h2>
          <p>リスクレベル: {result.evaluation.standing_risk_level}</p>
          <h3 style={{fontSize: '14px', marginTop: '0.5rem'}}>両脚</h3>
          <ul>
            <li>40cm: {result.standingTest.bothLegs40cm ? '○ できる' : '× できない'}</li>
            {result.standingTest.bothLegs40cm && (
              <li>20cm: {result.standingTest.bothLegs20cm ? '○ できる' : '× できない'}</li>
            )}
            {result.standingTest.bothLegs20cm && (
              <li>10cm: {result.standingTest.bothLegs10cm ? '○ できる' : '× できない'}</li>
            )}
          </ul>
          <h3 style={{fontSize: '14px', marginTop: '0.5rem'}}>片脚</h3>
          <ul>
            <li>40cm: {result.standingTest.oneLeg40cm ? '○ できる' : '× できない'}</li>
            {result.standingTest.oneLeg40cm && (
              <li>20cm: {result.standingTest.oneLeg20cm ? '○ できる' : '× できない'}</li>
            )}
            {result.standingTest.oneLeg20cm && (
              <li>10cm: {result.standingTest.oneLeg10cm ? '○ できる' : '× できない'}</li>
            )}
          </ul>
        </div>

        <div className="print-section">
          <h2>2ステップテスト</h2>
          <p>リスクレベル: {result.evaluation.two_step_risk_level}</p>
          <ul>
            <li>2歩の距離: {result.twoStepTest.distance} cm</li>
            <li>身長: {result.twoStepTest.height} cm</li>
            <li>スコア: {result.twoStepTest.score.toFixed(2)}</li>
          </ul>
        </div>

        <div className="print-section">
          <h2>ロコモ25質問票</h2>
          <p>リスクレベル: {result.evaluation.locomo25_risk_level}</p>
          <p>合計スコア: {result.locomo25Total} 点</p>
        </div>

        <div className="print-footer">
          <p>※ この結果は参考情報です。詳しくは医療機関にご相談ください。</p>
        </div>
      </div>
    </div>
  );
}
