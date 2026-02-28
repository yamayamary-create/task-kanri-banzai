# Task kanri banzai

スターバックス風デザインの階層的タスク管理アプリ

## Vercelへのデプロイ手順

### 1. GitHubアカウントを作成
https://github.com にアクセスしてアカウントを作成（すでにお持ちの場合はスキップ）

### 2. 新しいリポジトリを作成
1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: task-kanri-banzai）
4. 「Public」を選択
5. 「Create repository」をクリック

### 3. ファイルをアップロード
1. 作成したリポジトリのページで「uploading an existing file」をクリック
2. 以下の3つのファイルをドラッグ&ドロップ:
   - index.html
   - task-manager.jsx
   - vercel.json
3. 「Commit changes」をクリック

### 4. Vercelにデプロイ
1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択してGitHubアカウントで登録
4. 「Import Project」をクリック
5. 先ほど作成したGitHubリポジトリを選択
6. 「Deploy」をクリック

完了！数分でデプロイが完了し、URLが発行されます。

## 機能
- ✅ 3階層タスク管理（大項目→中項目→小項目）
- 📅 期限設定
- 📝 メモ機能
- 👤 アカウント機能（ログイン/ログアウト）
- 💾 ブラウザローカルストレージでデータ保存
- ☕ スターバックス風デザイン
