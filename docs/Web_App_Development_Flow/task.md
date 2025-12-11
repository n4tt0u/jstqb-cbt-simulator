# Webアプリ開発タスク: JSTQB再現問題演習アプリ

- [x] **1. 企画・要件定義** <!-- id: 0 -->
  - [x] アプリコンセプト決定 (JSTQB CBT模試再現)
  - [x] 要件定義書 (`requirements.md`) 作成・整合

- [x] **2. 設計・環境構築** <!-- id: 4 -->
  - [x] React (Vite) + Node.js 環境セットアップ
  - [x] 技術スタック選定

- [x] **3. UI実装 & データ連携** <!-- id: 12 -->
  - [x] CSVデータ読み込み (StartScreenへ移動)
  - [x] JSTQB風 UIデザイン実装
  - [x] 「後で見直す」フラグ機能追加

- [x] **4. 機能実装** <!-- id: 50 -->
  - [x] **Step 4-0: スタート画面の実装** <!-- id: 55 -->
    - [x] CSV読み込み画面 (デフォルトロード/ファイルアップロード)
    - [x] モード選択画面 (一問一答/模試)
    - [x] 画面遷移制御 (スタート → 問題画面)
  - [x] **Step 4-1: 一問一答モード (解説機能)** <!-- id: 51 -->
    - [x] 解説表示用のステート管理 (`showFeedback`)
    - [x] 解説画面のUI実装 (正誤、解説文)
    - [x] 「次へ」ボタンの挙動変更 (回答 -> 解説 -> 次の問題)
    - [x] UI調整: フラグ・問題選択の無効化
  - [x] **Step 4-2: 本番模試モード (結果画面)** <!-- id: 52 -->
    - [x] 終了判定ロジックの実装（最後の問題で「終了」→ 結果画面）
    - [x] 結果画面コンポーネント (`ResultScreen`) の作成
    - [x] 解説ポップアップ（正誤ハイライト付き）の実装
    - [x] 経過時間・超過表示の実装
  - [x] **Step 4-3: 問題選択機能** <!-- id: 53 -->
    - [x] 問題一覧ポップアップのUI実装
    - [x] 各問題のステータス表示（未回答/回答済/フラグ）
    - [x] ジャンプ機能の実装
  - [x] **Step 4-4: タイマー機能** <!-- id: 54 -->
    - [x] タイマー状態管理 (残り時間, ポーズ状態)
    - [x] ヘッダーへの表示 (MM:SS)
    - [x] タイムアップ時の挙動 (ダイアログ, 継続/終了)
    - [x] 結果画面での経過時間表示
    - [x] 一問一答モードでの一時停止機能

## Phase 5: Refactoring & Maintenance

- [x] **Refactoring**
  - [x] `useExamTimer` フックの抽出
  - [x] `QuestionListModal`, `ExplanationModal` のコンポーネント化
  - [x] `theme.js` による定数管理
- [x] **Bug Fixes**
  - [x] リファクタリング後のホワイトスクリーン修正
  - [x] 結果画面でタイマーが止まらないバグ修正
  - [x] タイムアップ時のダイアログ競合による誤超過判定の修正
- [x] **UI Updates**
  - [x] 結果画面の「問題文」列の削除 (要望対応)
  - [x] 結果画面の「回答/正解」列の削除 (要望対応)
  - [x] 結果一覧のグリッド（タイル）表示化 (要望対応)
  - [x] ヘッダー・フッターのレイアウト調整
  - [x] 問題選択画面のリデザイン (3列リスト形式)
  - [x] 結果画面のリデザイン (3列リスト形式 + フラグ表示)
  - [x] 結果画面のリデザイン (3列リスト形式 + フラグ表示)
  - [x] 本番模試モード終了時の確認ダイアログ追加
  - [x] 終了確認をカスタムモーダル化 (タイマー継続のため)
  - [x] アプリタイトル変更 ("CBT 再現演習")
  - [x] モーダル共通化 (確認・警告・時間切れ)
  - [x] 時間切れ即終了時の超過判定回避
  - [x] 制限時間の上限を9999分に変更

- [ ] **5. 公開準備/品質向上** <!-- id: 16 -->
  - (Pending future tasks)

## Phase 6: Weakness Review Features

- [x] **Implementation Planning**
  - [x] Update Requirements (`requirements.md`)
  - [x] Create Implementation Plan (`implementation_plan.md`)

- [x] **Step 6-1: Flag Feature Expansion**
  - [x] Enable Flag icon in Single-Answer Mode (`App.jsx`, `InfoPanel.jsx`)
  - [x] Ensure flags persist correctly across modes

- [x] **Step 6-2: Result Screen Updates**
  - [x] Make flag icons clickable/toggable in `ResultScreen.jsx`
  - [x] Pass `toggleReviewFlag` function to `ResultScreen`

- [x] **Step 6-3: CSV Export Function**
  - [x] Implement CSV generation logic (filtering incorrect/flagged)
  - [x] Add "Export Review CSV" button in `ResultScreen`
  - [x] Verify exported CSV can be re-imported successfully

## Phase 7: Refinement

- [x] **Step 7-1: Remove ID column from CSV**
  - [x] Update `StartScreen.jsx` to auto-generate IDs on import
  - [x] Update `ResultScreen.jsx` to exclude ID from export
  - [x] Update `public/questions.csv` to remove ID column

- [x] **Step 7-2: Refactor Project Structure**
  - [x] Move `docs` directory into project root
  - [x] Create `.venv` for development scripts
