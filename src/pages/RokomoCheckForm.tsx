import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  evaluateStandingTest,
  evaluateTwoStepTest,
  evaluateLocomo25,
  evaluateOverall,
} from '../utils/evaluation';

export default function RokomoCheckForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0=順序選択, 1~3=テスト実施
  const [isSubmitting, setIsSubmitting] = useState(false);

  // テスト順序（実技は固定、ロコモ25の順番のみ選択可能）
  const [testOrder, setTestOrder] = useState<'before' | 'after'>('before'); // before=実技前, after=実技後

  // 立ち上がりテスト
  const [standingTest, setStandingTest] = useState({
    bothLegs40cm: null as boolean | null,
    bothLegs20cm: null as boolean | null,
    bothLegs10cm: null as boolean | null,
    oneLeg40cm: null as boolean | null,
    oneLeg20cm: null as boolean | null,
    oneLeg10cm: null as boolean | null,
  });

  // 2ステップテスト（2回測定）
  const [twoStepTest, setTwoStepTest] = useState({
    distance1: '',
    distance2: '',
    height: '',
  });

  // ロコモ25（質問票）
  const [locomo25, setLocomo25] = useState<number[]>(Array(25).fill(0));

  // 基本情報から身長を自動入力
  useEffect(() => {
    const basicInfoStr = sessionStorage.getItem('basicInfo');
    if (basicInfoStr) {
      const basicInfo = JSON.parse(basicInfoStr);
      if (basicInfo.height) {
        setTwoStepTest(prev => ({ ...prev, height: basicInfo.height.toString() }));
      }
    }
  }, []);

  const handleSubmit = async () => {
    // バリデーション
    if (standingTest.bothLegs40cm === null) {
      alert('立ち上がりテストをすべて入力してください');
      return;
    }

    if (!twoStepTest.distance1 || !twoStepTest.distance2 || !twoStepTest.height) {
      alert('2ステップテストをすべて入力してください');
      return;
    }

    const distance1 = parseFloat(twoStepTest.distance1);
    const distance2 = parseFloat(twoStepTest.distance2);
    const height = parseFloat(twoStepTest.height);

    if (distance1 <= 0 || distance2 <= 0 || height <= 0) {
      alert('2ステップテストの値は正の数を入力してください');
      return;
    }

    // 良値（大きい方）を選択
    const betterDistance = Math.max(distance1, distance2);

    setIsSubmitting(true);

    try {
      // 基本情報を取得
      const basicInfoStr = sessionStorage.getItem('basicInfo');
      if (!basicInfoStr) {
        alert('基本情報が見つかりません。最初からやり直してください。');
        navigate('/basic-info');
        return;
      }

      const basicInfo = JSON.parse(basicInfoStr);

      // 評価実行（良値を使用）
      const standingRisk = evaluateStandingTest(standingTest);
      const twoStepScore = betterDistance / height;
      const twoStepRisk = evaluateTwoStepTest({
        distance1,
        distance2,
        height,
        score: twoStepScore,
        betterDistance
      });
      const locomo25Total = locomo25.reduce((sum, score) => sum + score, 0);
      const locomo25Risk = evaluateLocomo25({
        q1: locomo25[0],
        q2: locomo25[1],
        q3: locomo25[2],
        q4: locomo25[3],
        q5: locomo25[4],
        q6: locomo25[5],
        q7: locomo25[6],
        q8: locomo25[7],
        q9: locomo25[8],
        q10: locomo25[9],
        q11: locomo25[10],
        q12: locomo25[11],
        q13: locomo25[12],
        q14: locomo25[13],
        q15: locomo25[14],
        q16: locomo25[15],
        q17: locomo25[16],
        q18: locomo25[17],
        q19: locomo25[18],
        q20: locomo25[19],
        q21: locomo25[20],
        q22: locomo25[21],
        q23: locomo25[22],
        q24: locomo25[23],
        q25: locomo25[24],
        total: locomo25Total,
      });

      const overallResult = evaluateOverall(standingRisk, twoStepRisk, locomo25Risk);

      // ユーザー登録
      const { data: userData, error: userError} = await supabase
        .from('users')
        .insert([
          {
            name: basicInfo.name,
            age: basicInfo.age,
            gender: basicInfo.gender,
            height: basicInfo.height,
            organization_type: basicInfo.organization_type,
            organization_name: basicInfo.organization_name,
            consent_date: localStorage.getItem('consent_date') || new Date().toISOString(),
            consent_version: '1.0',
          },
        ])
        .select()
        .single();

      if (userError) throw userError;

      // ロコモチェック結果を保存
      const { error: checkError } = await supabase.from('rokomo_checks').insert([
        {
          user_id: userData.id,
          standing_both_legs_40cm: standingTest.bothLegs40cm,
          standing_both_legs_20cm: standingTest.bothLegs20cm,
          standing_both_legs_10cm: standingTest.bothLegs10cm,
          standing_one_leg_40cm: standingTest.oneLeg40cm,
          standing_one_leg_20cm: standingTest.oneLeg20cm,
          standing_one_leg_10cm: standingTest.oneLeg10cm,
          two_step_distance1: distance1,
          two_step_distance2: distance2,
          two_step_better_distance: betterDistance,
          two_step_height: height,
          two_step_score: twoStepScore,
          locomo25_q1: locomo25[0],
          locomo25_q2: locomo25[1],
          locomo25_q3: locomo25[2],
          locomo25_q4: locomo25[3],
          locomo25_q5: locomo25[4],
          locomo25_q6: locomo25[5],
          locomo25_q7: locomo25[6],
          locomo25_q8: locomo25[7],
          locomo25_q9: locomo25[8],
          locomo25_q10: locomo25[9],
          locomo25_q11: locomo25[10],
          locomo25_q12: locomo25[11],
          locomo25_q13: locomo25[12],
          locomo25_q14: locomo25[13],
          locomo25_q15: locomo25[14],
          locomo25_q16: locomo25[15],
          locomo25_q17: locomo25[16],
          locomo25_q18: locomo25[17],
          locomo25_q19: locomo25[18],
          locomo25_q20: locomo25[19],
          locomo25_q21: locomo25[20],
          locomo25_q22: locomo25[21],
          locomo25_q23: locomo25[22],
          locomo25_q24: locomo25[23],
          locomo25_q25: locomo25[24],
          locomo25_total: locomo25Total,
          standing_risk_level: overallResult.standing_risk_level,
          two_step_risk_level: overallResult.two_step_risk_level,
          locomo25_risk_level: overallResult.locomo25_risk_level,
          total_risk: overallResult.total_risk,
        },
      ]);

      if (checkError) throw checkError;

      // 結果画面へ遷移
      sessionStorage.setItem(
        'checkResult',
        JSON.stringify({
          basicInfo,
          standingTest,
          twoStepTest: {
            distance1,
            distance2,
            betterDistance,
            height,
            score: twoStepScore
          },
          locomo25,
          locomo25Total,
          evaluation: overallResult,
        })
      );

      navigate('/result');
    } catch (error) {
      console.error('Error saving check:', error);
      alert('データの保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rokomo-check-form">
      <div className="container">
        <div className="form-header">
          <ClipboardCheck size={48} className="icon" />
          <h1>ロコモチェック</h1>
          <p>各項目を順番に入力してください。</p>
        </div>

        {/* ステップ表示 */}
        {currentStep > 0 && (
          <div className="steps">
            <div className={`step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              {testOrder === 'before' ? '1' : '2'}. 立ち上がりテスト
            </div>
            <div className={`step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              {testOrder === 'before' ? '2' : '3'}. 2ステップテスト
            </div>
            <div className={`step ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              {testOrder === 'before' ? '3' : '1'}. ロコモ25質問票
            </div>
          </div>
        )}

        {/* Step 0: テスト順序選択 */}
        {currentStep === 0 && (
          <div className="step-content">
            <h2>テスト実施順序の選択</h2>
            <p>ロコモ25質問票を実技テストの前後どちらで実施するか選択してください。</p>
            <p className="note">※ 立ち上がりテストと2ステップテストの順序は固定です。</p>

            <div className="form-group">
              <label>テスト実施の流れ</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="testOrder"
                    value="after"
                    checked={testOrder === 'after'}
                    onChange={() => setTestOrder('after')}
                  />
                  <span>①ロコモ25質問票 → 実技テスト（立ち上がり、2ステップ）</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="testOrder"
                    value="before"
                    checked={testOrder === 'before'}
                    onChange={() => setTestOrder('before')}
                  />
                  <span>②実技テスト（立ち上がり、2ステップ） → ロコモ25質問票（推奨）</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={() => setCurrentStep(testOrder === 'after' ? 3 : 1)}>
                テスト開始
              </button>
            </div>
          </div>
        )}

        {/* Step 1: 立ち上がりテスト */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>立ち上がりテスト</h2>
            <p>両脚・片脚で、座った状態から立ち上がることができるかチェックします。できる場合は次の高さに進みます。</p>

            {/* 両足テスト */}
            <div className="test-section">
              <h3 style={{color: '#4F46E5', marginTop: '1.5rem'}}>両脚でのテスト</h3>

              <div className="test-item">
                <h4>【両脚】40cmの高さから立ち上がれますか？</h4>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      checked={standingTest.bothLegs40cm === true}
                      onChange={() => setStandingTest({ ...standingTest, bothLegs40cm: true })}
                    />
                    <span>できる</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      checked={standingTest.bothLegs40cm === false}
                      onChange={() => setStandingTest({ ...standingTest, bothLegs40cm: false })}
                    />
                    <span>できない</span>
                  </label>
                </div>
              </div>

              {standingTest.bothLegs40cm === true && (
                <div className="test-item">
                  <h4>【両脚】20cmの高さから立ち上がれますか？</h4>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={standingTest.bothLegs20cm === true}
                        onChange={() => setStandingTest({ ...standingTest, bothLegs20cm: true })}
                      />
                      <span>できる</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={standingTest.bothLegs20cm === false}
                        onChange={() => setStandingTest({ ...standingTest, bothLegs20cm: false })}
                      />
                      <span>できない</span>
                    </label>
                  </div>
                </div>
              )}

              {standingTest.bothLegs20cm === true && (
                <div className="test-item">
                  <h4>【両脚】10cmの高さから立ち上がれますか？</h4>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={standingTest.bothLegs10cm === true}
                        onChange={() => setStandingTest({ ...standingTest, bothLegs10cm: true })}
                      />
                      <span>できる</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={standingTest.bothLegs10cm === false}
                        onChange={() => setStandingTest({ ...standingTest, bothLegs10cm: false })}
                      />
                      <span>できない</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* 片足テスト */}
            {standingTest.bothLegs40cm !== null && (
              <div className="test-section">
                <h3 style={{color: '#7C3AED', marginTop: '1.5rem'}}>片脚でのテスト</h3>

                <div className="test-item">
                  <h4>【片脚】40cmの高さから立ち上がれますか？</h4>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={standingTest.oneLeg40cm === true}
                        onChange={() => setStandingTest({ ...standingTest, oneLeg40cm: true })}
                      />
                      <span>できる</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={standingTest.oneLeg40cm === false}
                        onChange={() => setStandingTest({ ...standingTest, oneLeg40cm: false })}
                      />
                      <span>できない</span>
                    </label>
                  </div>
                </div>

                {standingTest.oneLeg40cm === true && (
                  <div className="test-item">
                    <h4>【片脚】20cmの高さから立ち上がれますか？</h4>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          checked={standingTest.oneLeg20cm === true}
                          onChange={() => setStandingTest({ ...standingTest, oneLeg20cm: true })}
                        />
                        <span>できる</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          checked={standingTest.oneLeg20cm === false}
                          onChange={() => setStandingTest({ ...standingTest, oneLeg20cm: false })}
                        />
                        <span>できない</span>
                      </label>
                    </div>
                  </div>
                )}

                {standingTest.oneLeg20cm === true && (
                  <div className="test-item">
                    <h4>【片脚】10cmの高さから立ち上がれますか？</h4>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          checked={standingTest.oneLeg10cm === true}
                          onChange={() => setStandingTest({ ...standingTest, oneLeg10cm: true })}
                        />
                        <span>できる</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          checked={standingTest.oneLeg10cm === false}
                          onChange={() => setStandingTest({ ...standingTest, oneLeg10cm: false })}
                        />
                        <span>できない</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="form-actions">
              {testOrder === 'after' && (
                <button className="btn-secondary" onClick={() => setCurrentStep(3)}>
                  戻る
                </button>
              )}
              <button
                className="btn-primary"
                onClick={() => setCurrentStep(2)}
                disabled={standingTest.bothLegs40cm === null || standingTest.oneLeg40cm === null}
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 2ステップテスト */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>2ステップテスト</h2>
            <p>できるだけ大股で2歩歩いた距離を2回測定します。</p>

            <div className="form-group">
              <label htmlFor="distance1">1回目の距離（cm）*</label>
              <input
                id="distance1"
                type="number"
                value={twoStepTest.distance1}
                onChange={(e) => setTwoStepTest({ ...twoStepTest, distance1: e.target.value })}
                placeholder="180"
                min="0"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="distance2">2回目の距離（cm）*</label>
              <input
                id="distance2"
                type="number"
                value={twoStepTest.distance2}
                onChange={(e) => setTwoStepTest({ ...twoStepTest, distance2: e.target.value })}
                placeholder="185"
                min="0"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">身長（cm）*</label>
              <input
                id="height"
                type="number"
                value={twoStepTest.height}
                onChange={(e) => setTwoStepTest({ ...twoStepTest, height: e.target.value })}
                placeholder="165"
                min="0"
                step="0.1"
                required
              />
              <small style={{color: '#666'}}>※ 基本情報で入力した身長が自動入力されます</small>
            </div>

            {twoStepTest.distance1 && twoStepTest.distance2 && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                marginTop: '1rem'
              }}>
                <strong>良値（採用値）:</strong> {Math.max(
                  parseFloat(twoStepTest.distance1) || 0,
                  parseFloat(twoStepTest.distance2) || 0
                ).toFixed(1)} cm
              </div>
            )}

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setCurrentStep(1)}>
                戻る
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (testOrder === 'before') {
                    setCurrentStep(3); // 実技後 → ロコモ25質問票へ
                  } else {
                    handleSubmit(); // 実技前 → 結果画面へ
                  }
                }}
                disabled={!twoStepTest.distance1 || !twoStepTest.distance2 || !twoStepTest.height}
              >
                {testOrder === 'before' ? '次へ' : '結果を見る'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: ロコモ25質問票 */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>ロコモ25質問票</h2>
            <p>過去1週間の状態について、最も当てはまるものを選んでください。</p>
            <p className="note">
              各質問に対して、0点（まったくない）から4点（非常にある）で回答してください。
            </p>

            {locomo25Questions.map((question, index) => (
              <div key={index} className="question-item">
                <label>{question}</label>
                <div className="scale-group">
                  {[
                    { value: 0, label: 'まったくない' },
                    { value: 1, label: '少しある' },
                    { value: 2, label: 'ある程度ある' },
                    { value: 3, label: 'かなりある' },
                    { value: 4, label: '非常にある' }
                  ].map(({ value, label }) => (
                    <label key={value} className="scale-label">
                      <input
                        type="radio"
                        name={`q${index + 1}`}
                        value={value}
                        checked={locomo25[index] === value}
                        onChange={() => {
                          const newLocomo25 = [...locomo25];
                          newLocomo25[index] = value;
                          setLocomo25(newLocomo25);
                        }}
                      />
                      <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.9rem'}}>
                        <strong style={{fontSize: '1.2rem', marginBottom: '0.25rem'}}>{value}</strong>
                        <small style={{fontSize: '0.75rem', whiteSpace: 'nowrap'}}>{label}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setCurrentStep(testOrder === 'after' ? 0 : 2)}>
                戻る
              </button>
              <button className="btn-primary" onClick={() => {
                if (testOrder === 'after') {
                  setCurrentStep(1); // 実技テストへ
                } else {
                  handleSubmit(); // 結果画面へ
                }
              }} disabled={isSubmitting}>
                {testOrder === 'after' ? '次へ（実技テスト）' : (isSubmitting ? '送信中...' : '結果を見る')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const locomo25Questions = [
  '1. 立ち上がるのにどこかにつかまるようになった',
  '2. 階段を上がるのに手すりが必要である',
  '3. 15分くらい続けて歩くことができない',
  '4. 横断歩道を青信号で渡りきれない',
  '5. 2kg程度(1Lの牛乳パック2個程度)の買い物をして持ち帰るのが困難である',
  '6. 家の中でつまずいたり滑ったりする',
  '7. 階段を上がるのに時間がかかるようになった',
  '8. 布団の上げ下ろしなど重いものを持ち上げたり運んだりすることが困難である',
  '9. 掃除機の使用、布団の上げ下ろしなどのやや重い仕事が困難である',
  '10. 洗濯物を干す動作(しゃがむ・洗濯物を取り上げる・手を伸ばす)が困難である',
  '11. バスや電車を利用して外出するのが困難である',
  '12. 階段の下りが困難である',
  '13. 短い距離を歩くだけで疲れる',
  '14. 片足で立っていることができない',
  '15. 正座ができない',
  '16. 椅子から立ち上がるのに両手をつかないと立ち上がれない',
  '17. 階段を一段ずつではなく、足を揃えて上がるようになった',
  '18. 靴下を立ったままでははけない',
  '19. ベッドや布団から起き上がるのが困難である',
  '20. 背中や腰が曲がってきた',
  '21. ベッドや布団の中で寝返りをうつことが困難である',
  '22. 家の中を歩くのに時間がかかるようになった',
  '23. 家の中で転ぶことがある',
  '24. 家のちょっとした仕事が困難である',
  '25. 家や外出先で転ぶのではないかと心配である',
];
