# JSTQB CBT Simulator

JSTQB（ソフトウェアテスト技術者資格）のCBT（Computer Based Testing）試験を模擬するためのWebアプリケーションです。
React + Vite で構築されており、CSVファイルを編集するだけで独自の問題セットを作成・練習できます。

![License](https://img.shields.io/github/license/n4tt0u/jstqb-cbt-simulator)

## ✨ 主な機能

- **本番モード**: 制限時間を設定して演習可能。（デフォルトは無制限）
  - ⏳ **タイマー機能**: 残り1分を切ると黄色、0秒で赤色に変化。
  - 🚩 **後で見直す**: 迷った問題にフラグを立てて、後で一覧から確認・ジャンプできます。
- **練習モード**: 一問一答形式で、即座に解説を確認できます。
- **結果分析**: 正答率や各問題の解説、経過時間を確認可能。
- **CSV連携**:
  - **デフォルト問題**: `public/questions.csv` を編集してカスタマイズ可能。
  - **持ち込み問題**: 画面上から任意のCSVファイルをアップロードして演習可能。

## 🚀 使い方

### 1. 起動方法

```bash
# 依存関係のインストール
npm install

# ローカルサーバーの起動
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスします。

### 2. 問題データの形式

`public/questions.csv` を編集するか、画面からアップロードするCSVは以下の形式にします。

```csv
question_text,option_a,option_b,option_c,option_d,correct_option,explanation
"問題文", "選択肢A", "選択肢B", "選択肢C", "選択肢D", "a", "解説文"
```

- `question_text`: 問題文
- `option_a` ～ `option_d`: 選択肢（4択）
- `correct_option`: 正解の記号 (`a`, `b`, `c`, `d`) ※小文字
- `explanation`: 解説文

## 🛠️ 技術スタック

- **Frontend**: React 19, Vite
- **Styling**: Pure CSS (No CSS frameworks)
- **Data**: PapaParse (CSV Parsing)
- **Linting**: ESLint

## 📦 デプロイ (公開)

ビルドコマンドを実行すると `dist` フォルダが生成されます。
このフォルダを Vercel や Netlify にアップロードするだけで公開可能です。

```bash
npm run build
```

## 📜 License

[MIT License](./LICENSE)
