# JSTQB CBT Simulator

JSTQB（ソフトウェアテスト技術者資格）のCBT（Computer Based Testing）試験を模擬するためのWebアプリケーションです。
React + Vite で構築されており、CSVファイルを編集するだけで独自の問題セットを作成・練習できます。

![License](https://img.shields.io/github/license/n4tt0u/jstqb-cbt-simulator)

## ✨ 主な機能

- **本番モード**: 実際の試験と同じように、制限時間付きで問題を解くモード。
  - ⏳ **タイマー機能**: 残り時間が表示され、**残り1分を切ると黄色**、0秒になると赤色で警告します。
  - 🚩 **後で見直す**: 迷った問題にフラグを立てて、後で一覧から確認・ジャンプできます。
- **練習モード**: 時間を気にせず、一問一答形式で学習できるモード。即座に正誤判定と解説が表示されます。
- **結果分析**: 試験終了後、正答率や合否判定、各問題の解説を確認できます。
- **完全ローカル / 静的動作**: サーバーサイドの複雑な構成は不要。`questions.csv` を読み込むだけで動作します。

## 🚀 使い方

### 1. 起動方法

```bash
# 依存関係のインストール
npm install

# ローカルサーバーの起動
npm run dev
```

ブラウザで `http://localhost:5173` (または表示されるURL) にアクセスしてください。

### 2. 問題の追加・編集

`public/questions.csv` ファイルをExcelやテキストエディタで編集してください。

**フォーマット:**

```csv
question_text,option_a,option_b,option_c,option_d,correct_option,explanation
"ここに問題文", "選択肢A", "選択肢B", "選択肢C", "選択肢D", "a", "ここに解説文"
```

- `correct_option`: 正解の記号 (`a`, `b`, `c`, `d`) を小文字で入力します。

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
