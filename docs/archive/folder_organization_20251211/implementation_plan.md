# ドキュメント整理計画

## 現状

`docs` フォルダ内に、タスクごとのフォルダ (`project_understanding`, `timer_color_change`) が散在しています。

## 変更後の構成案

```
docs/
├── architecture/          # 現在のシステム設計・仕様（Living Documentation）
│   ├── system_design.md   # 元: project_understanding/implementation_plan.md
│   └── walkthrough.md     # 元: project_understanding/walkthrough.md
├── archive/               # 過去のタスク履歴（Locked/Historic）
│   ├── 20251211_project_analysis/   # 元: project_understanding (task.md等)
│   └── 20251211_timer_color/        # 元: timer_color_change
└── folder_organization/   # 今回のタスク
```

## 手順

1. `docs/architecture` と `docs/archive` を作成。
2. `project_understanding/implementation_plan.md` を最新化して `docs/architecture/system_design.md` に移動（リネーム）。
3. `project_understanding/walkthrough.md` を `docs/architecture/walkthrough.md` に移動。
4. `timer_color_change` フォルダ全体を `docs/archive/timer_color` に移動。
5. `project_understanding` の残りを `docs/archive/project_analysis` に移動。
