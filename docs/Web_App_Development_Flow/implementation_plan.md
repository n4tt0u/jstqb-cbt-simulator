# 実装計画書: 弱点克服機能 (Phase 6)

## 目的

ユーザーが間違えた問題や、重要だと思った（フラグを立てた）問題だけを抽出し、再利用可能なCSVとしてエクスポートできるようにする。
また、その選定プロセスを最適化するために、一問一答モードでのフラグ利用と、結果画面でのフラグ編集を可能にする。

## User Review Required

> [!IMPORTANT]
> **CSVフォーマットの互換性**
> エクスポートされるCSVは、インポート用のパーサーが期待するカラム構成（`id`, `question_text`, `option_1`... `explanation`）と完全に一致させる必要があります。

## Proposed Changes

### 1. Enable Flags in Single-Answer Mode

#### [MODIFY] [src/App.jsx](file:///src/App.jsx)

- **変更点**:
  - `headerInfo` オブジェクト生成時、`showSubHeader` (フラグ表示エリア) の判定ロジックを変更。
  - 従来: `isExamMode` (本番模試) の場合のみ `true`。
  - 変更後: モードに関わらず `true` (問題画面 `step === 'question'` であれば表示)。

### 2. Result Screen Improvements (Edit Flags & Export)

#### [MODIFY] [src/App.jsx](file:///src/App.jsx)

- **変更点**:
  - `ResultScreen` コンポーネントに `toggleReviewFlag` 関数を props として渡す。

#### [MODIFY] [src/components/ResultScreen.jsx](file:///src/components/ResultScreen.jsx)

- **変更点**:
  - **Props追加**: `toggleReviewFlag` を受け取る。
  - **フラグ編集**: グリッド内のフラグアイコンの `onClick` イベントを実装。
    - アイコンクリック時は行全体のクリック（解説ポップアップ表示）が発火しないよう `e.stopPropagation()` する。
  - **CSVエクスポート機能**:
    - **State追加**:
      - `exportIncorrect` (初期値: `true`)
      - `exportFlagged` (初期値: `false`)
    - **UI追加**: フッターエリア（「タイトルに戻る」ボタンの上部など）にエクスポート設定UIを配置。
      - チェックボックス x 2：「不正解問題」「フラグ付き問題」
      - エクスポートボタン：`!exportIncorrect && !exportFlagged` の時は `disabled`。
    - **ロジック変更 (`handleExportCSV`)**:
      - 選択状態に基づいてフィルタリングを行う。
      - 条件: `(exportIncorrect && !isCorrect) || (exportFlagged && hasFlag)`。
      - **例外処理**: 該当する問題が0件の場合は `alert('出力対象の問題がありません')` を表示して終了。
      - **文字コード対応**: 日本語Excelでの文字化けを防ぐため、CSV文字列の先頭に **BOM (`\uFEFF`)** を付与する。
      - `Papaparse.unparse` を使用してCSV生成。

### 3. CSV Utility (Optional)

もしCSV生成ロジックが複雑になる場合は `src/utils/csvHelper.js` 等を作成するが、今回は `ResultScreen.jsx` 内に収める方針とする（Papaparseが使えるなら使う、なければ単純な文字列結合で実装）。
※現状 `Papaparse` はインポート用に入っているはずなので、それを利用する。

## Verification Plan

### Manual Verification

1. **一問一答モードでのフラグ確認**:
   - 一問一答モードで開始し、フラグアイコンが表示されているか。
   - フラグをON/OFFできるか。

2. **結果画面でのフラグ編集**:
   - 結果画面でリスト上のフラグをクリックしてON/OFFが切り替わるか。
   - 切り替え後、エクスポート対象に反映されるか。

3. **CSVエクスポート**:
   - 「復習用CSVエクスポート」を押してファイルがダウンロードされるか。
   - CSVの中身を確認し、不正解およびフラグ付き問題のみが含まれているか。
   - 文字コード（UTF-8）やカラムヘッダーが正しいか。

4. **CSV再ロード（重要）**:
   - ダウンロードしたCSVをアプリのトップ画面で読み込ませ、エラーなく問題が開始されるか。
