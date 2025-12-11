# プロジェクト分析レポート / 実装詳細

## 概要

本プロジェクトは、JSTQB（ソフトウェアテスト技術者資格）のCBT（Computer Based Testing）形式の試験をシミュレートするWebアプリケーションです。
ReactとViteを使用して構築されており、CSVファイルから問題データを読み込み、模擬試験を実施する機能を持っています。

## 技術スタック

- **フレームワーク**: React 19
- **ビルドツール**: Vite
- **言語**: JavaScript (ESModules)
- **スタイリング**: Vanilla CSS (App.css, index.css, 各コンポーネントのCSS)
- **データ処理**: PapaParse (CSVパース用)
- **リンター**: ESLint

## アーキテクチャ

### データフロー

1. **データソース**: `public/questions.csv`
    - カラム: `question_text`, `option_a`...`option_d`, `correct_option`, `explanation`
2. **読み込み**: `StartScreen` コンポーネントでCSVをフェッチし、パースする。
3. **状態管理**: `App.jsx` が中心的なストアとして機能。
    - `questions`: 全問題データ
    - `userAnswers`: ユーザーの回答状況
    - `reviewFlags`: 「後で見直す」フラグ
    - `screen`: 画面遷移 (`start` -> `question` -> `result`)
    - `mode`: 試験モード (`practice` vs `exam`)

### ディレクトリ構成

- `src/components/`: UIコンポーネント（画面単位およびモーダル）
- `src/hooks/`: カスタムフック（`useExamTimer`など）
- `public/`: 静的アセット（`questions.csv`）

## コンポーネント構成

- **App**: ルーティングとグローバルステート管理。
- **StartScreen**: 開始画面。問題読み込みとモード選択。
- **QuestionScreen**: 問題表示画面。ページネーション、回答選択、フラグ機能、タイマー表示。
- **ResultScreen**: 結果画面。正答率表示、解説確認。
- **ConfirmModal / ExplanationModal**: 汎用および専用モーダル。

## 現在の機能

- **練習モード**: 時間無制限（または設定可能）で問題を解く。
- **本番モード**: タイマー付きで実際の試験をシミュレート。
  - 残り時間が1分を切ると、タイマーの文字色が黄色（`rgb(255, 255, 0)`）に変化し、警告を表示します。
  - 時間超過後は赤色で経過時間を表示します。
- **不正解・フラグ問題の復習**: 結果画面から確認可能。
- **CSVによる問題管理**: スプレッドシート等で管理しやすい形式。
