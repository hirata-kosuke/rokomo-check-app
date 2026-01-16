/**
 * ロコモチェックアプリ - Google Apps Script API
 *
 * このスクリプトをGoogle Apps Scriptにデプロイして、
 * Reactアプリからのデータを受信してスプレッドシートに保存します。
 */

/**
 * POSTリクエストを処理
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    saveToSheet(data);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'データを保存しました'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GETリクエストを処理（テスト用）
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'ロコモチェックAPI is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * スプレッドシートにデータを保存
 */
function saveToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('ロコモチェックデータ');

  // シートが存在しない場合は作成
  if (!sheet) {
    sheet = ss.insertSheet('ロコモチェックデータ');
    // ヘッダー行を追加
    sheet.appendRow([
      'タイムスタンプ',
      '名前',
      '年齢',
      '性別',
      // ロコモ25
      'Q1_首肩の痛み',
      'Q2_背中上部の痛み',
      'Q3_腰の痛み',
      'Q4_お尻太ももの痛み',
      'Q5_膝の痛み',
      'Q6_ふくらはぎ足首足の痛み',
      'Q7_ベッドからの起き上がり',
      'Q8_椅子からの立ち上がり',
      'Q9_家の中の移動',
      'Q10_シャツの着替え',
      'Q11_ズボンパンツの着替え',
      'Q12_トイレでの動作',
      'Q13_お風呂での洗い動作',
      'Q14_2km程度の歩行',
      'Q15_15分程度の歩行',
      'Q16_隣近所への外出',
      'Q17_階段の昇り降り',
      'Q18_急ぎ足での歩行',
      'Q19_外出時の不安',
      'Q20_自動車電車の利用',
      'Q21_布団の上げ下ろし',
      'Q22_掃除・ゴミ出し',
      'Q23_買い物袋の持ち運び',
      'Q24_スポーツ・レジャー',
      'Q25_親しい人との交流',
      'ロコモ25合計スコア',
      // 立ち上がりテスト
      '両脚40cm',
      '両脚30cm',
      '両脚20cm',
      '両脚10cm',
      '片脚40cm',
      '片脚30cm',
      '片脚20cm',
      '片脚10cm',
      '立ち上がりレベル',
      // 2ステップテスト
      '2ステップ値',
      '2ステップレベル',
      // 判定結果
      'ロコモ度',
      '判定詳細'
    ]);
  }

  // データ行を追加
  var row = [
    new Date(),
    data.basicInfo?.name || '',
    data.basicInfo?.age || '',
    getGenderText(data.basicInfo?.gender),
    // ロコモ25の各回答
    data.rokomoCheck?.q1 || 0,
    data.rokomoCheck?.q2 || 0,
    data.rokomoCheck?.q3 || 0,
    data.rokomoCheck?.q4 || 0,
    data.rokomoCheck?.q5 || 0,
    data.rokomoCheck?.q6 || 0,
    data.rokomoCheck?.q7 || 0,
    data.rokomoCheck?.q8 || 0,
    data.rokomoCheck?.q9 || 0,
    data.rokomoCheck?.q10 || 0,
    data.rokomoCheck?.q11 || 0,
    data.rokomoCheck?.q12 || 0,
    data.rokomoCheck?.q13 || 0,
    data.rokomoCheck?.q14 || 0,
    data.rokomoCheck?.q15 || 0,
    data.rokomoCheck?.q16 || 0,
    data.rokomoCheck?.q17 || 0,
    data.rokomoCheck?.q18 || 0,
    data.rokomoCheck?.q19 || 0,
    data.rokomoCheck?.q20 || 0,
    data.rokomoCheck?.q21 || 0,
    data.rokomoCheck?.q22 || 0,
    data.rokomoCheck?.q23 || 0,
    data.rokomoCheck?.q24 || 0,
    data.rokomoCheck?.q25 || 0,
    data.result?.locomo25Score || 0,
    // 立ち上がりテスト
    getBoolText(data.standingTest?.both40cm),
    getBoolText(data.standingTest?.both30cm),
    getBoolText(data.standingTest?.both20cm),
    getBoolText(data.standingTest?.both10cm),
    getBoolText(data.standingTest?.single40cm),
    getBoolText(data.standingTest?.single30cm),
    getBoolText(data.standingTest?.single20cm),
    getBoolText(data.standingTest?.single10cm),
    data.result?.standingLevel || '',
    // 2ステップテスト
    data.twoStepTest?.twoStepValue || '',
    data.result?.twoStepLevel || '',
    // 判定結果
    getRokomoLevelText(data.result?.rokomoLevel),
    data.result?.details || ''
  ];

  sheet.appendRow(row);
}

/**
 * 性別テキスト変換
 */
function getGenderText(gender) {
  if (gender === 'male') return '男性';
  if (gender === 'female') return '女性';
  return gender || '';
}

/**
 * Boolean テキスト変換
 */
function getBoolText(value) {
  if (value === true) return '○';
  if (value === false) return '×';
  return '';
}

/**
 * ロコモ度テキスト変換
 */
function getRokomoLevelText(level) {
  switch (level) {
    case 0: return 'ロコモなし';
    case 1: return 'ロコモ度1';
    case 2: return 'ロコモ度2';
    case 3: return 'ロコモ度3';
    default: return level || '';
  }
}

/**
 * テスト用関数
 */
function testSaveToSheet() {
  var testData = {
    basicInfo: {
      name: 'テスト太郎',
      age: 65,
      gender: 'male'
    },
    rokomoCheck: {
      q1: 2, q2: 1, q3: 3, q4: 0, q5: 2,
      q6: 1, q7: 0, q8: 1, q9: 0, q10: 0,
      q11: 0, q12: 0, q13: 1, q14: 2, q15: 1,
      q16: 0, q17: 2, q18: 1, q19: 0, q20: 0,
      q21: 1, q22: 0, q23: 1, q24: 2, q25: 0
    },
    standingTest: {
      both40cm: true,
      both30cm: true,
      both20cm: true,
      both10cm: false,
      single40cm: true,
      single30cm: false,
      single20cm: false,
      single10cm: false
    },
    twoStepTest: {
      twoStepValue: 1.25
    },
    result: {
      locomo25Score: 21,
      standingLevel: 'レベル5',
      twoStepLevel: 'レベル2',
      rokomoLevel: 1,
      details: 'ロコモ度1：運動器機能低下が始まっています'
    }
  };

  saveToSheet(testData);
  Logger.log('テストデータを保存しました');
}
