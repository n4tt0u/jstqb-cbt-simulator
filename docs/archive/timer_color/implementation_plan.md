# 実装計画: タイマー残り時間の警告色表示

## 概要

残り時間が1分未満になった際、タイマーの文字色を黄色に変更し、ユーザーに注意を促します。

## 変更内容

### 1. テーマ定義の更新 (`src/constants/theme.js`)

- `COLORS` オブジェクトに `WARNING` カラーを追加します。
- カラーコード: `gold` または `#FFD700` (視認性を考慮し、背景色とコントラストが取れる黄色を採用)

### 2. タイマー表示ロジックの変更 (`src/components/QuestionScreen.jsx`)

- 現在の「マイナスなら赤」のロジックに、「残り1分未満なら黄色」の条件を追加します。
- **条件**: `timeLimit > 0` (試験モード) かつ `timerSeconds < 60` かつ `timerSeconds >= 0`

```javascript
// 変更前
color: timerSeconds < 0 ? COLORS.ERROR : 'inherit'

// 変更後
color: timerSeconds < 0 ? COLORS.ERROR : 
       (timeLimit > 0 && timerSeconds < 60) ? COLORS.WARNING : 
       'inherit'
```

## 検証方法

1. コード変更後、試験モードで開始。
2. 残り時間が1分を切るまで待機（またはタイマー初期値を調整して確認）。
3. 文字色が黄色に変わることを確認。
4. 0秒を過ぎた場合（マイナス）に赤色になる既存機能が維持されているか確認。
