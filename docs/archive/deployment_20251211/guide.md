# Webアプリ公開ガイド (GitHub + Vercel編)

ユーザー様の希望に合わせて、**GitHubとVercelを連携させて公開する方法** を案内します。
この方法のメリットは、手元のコードを修正してGitHubにプッシュするだけで、Webサイトも自動で更新されることです。

## 手順 1: GitHubリポジトリの作成

1. [GitHub](https://github.com/) にログインします（未登録の場合は登録してください）。
2. 右上の「+」アイコンから **「New repository」** をクリックします。
3. **Repository name** に好きな名前を入力します（例: `jstqb-cbt-simulator`）。
4. Public（公開）かPrivate（非公開）を選びます（どちらでもVercelで無料公開可能です）。
5. その他は何もチェックせず、**「Create repository」** をクリックします。

## 手順 2: コードのアップロード (プッシュ)

リポジトリを作成すると、GitHubの画面にコマンドが表示されます。
「**…or push an existing repository from the command line**」という部分を探し、そのURLをコピーしてください。
(例: `git remote add origin https://github.com/ユーザー名/リポジトリ名.git`)

次に、VSCodeのターミナルで以下のコマンドを順番に入力しますが、**最初の1行目はご自身のURLに置き換えてください**。

```bash
# 1. リモートリポジトリの登録 (URLはご自身のものに！)
git remote add origin https://github.com/YOUR_NAME/REPO_NAME.git

# 2. ブランチ名をmainに設定 (確認)
git branch -M main

# 3. GitHubへアップロード
git push -u origin main
```

※ 認証画面が出た場合は、画面の指示に従ってログインを許可してください。

## 手順 3: Vercelでインポート

1. [Vercel](https://vercel.com/) にアクセスし、GitHubアカウントでログインします。
2. ダッシュボードの **「Add New...」 -> 「Project」** を選択します。
3. 左側の「Import Git Repository」の一覧に、先ほど作った `jstqb-cbt-simulator` が表示されているはずです。**「Import」** を押します。
4. **Configure Project** 画面になります。
    - Framework Preset: `Vite` が自動選択されているはずです。
    - そのまま **「Deploy」** をクリックします。

数分待つと、花吹雪が舞って公開完了です！
発行されたドメイン（例: `jstqb-cbt-simulator.vercel.app`）にアクセスしてみましょう。
