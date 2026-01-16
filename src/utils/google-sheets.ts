/**
 * Google Sheets データ送信ユーティリティ
 */

const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

export interface RokomoSheetData {
  basicInfo: {
    name: string;
    age: number;
    gender: 'male' | 'female';
  };
  rokomoCheck: Record<string, number>;
  standingTest?: {
    both40cm?: boolean;
    both30cm?: boolean;
    both20cm?: boolean;
    both10cm?: boolean;
    single40cm?: boolean;
    single30cm?: boolean;
    single20cm?: boolean;
    single10cm?: boolean;
  };
  twoStepTest?: {
    twoStepValue?: number;
  };
  result: {
    locomo25Score: number;
    standingLevel?: string;
    twoStepLevel?: string;
    rokomoLevel: number;
    details?: string;
  };
}

/**
 * Google スプレッドシートにデータを送信
 */
export async function sendToGoogleSheets(data: RokomoSheetData): Promise<void> {
  // URLが設定されていない場合はスキップ
  if (!GOOGLE_APPS_SCRIPT_URL) {
    console.log('Google Sheets URL not configured. Skipping data export.');
    return;
  }

  try {
    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'no-cors', // Google Apps Script requires no-cors
    });

    console.log('Data sent to Google Sheets successfully');
  } catch (error) {
    console.error('Failed to send data to Google Sheets:', error);
    // エラーが発生してもアプリの動作は継続
  }
}
