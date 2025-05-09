# Next-Batting-Viewer

**Next-Batting-Viewer**は、打撃成績を保存し、ランキング形式で表示するためのアプリケーションです。直感的なUIを通じて、個人の打撃データを簡単に管理・閲覧できます。

## 技術スタック

このプロジェクトは以下の技術を使用しています：

- **Next.js**
- **TypeScript**
- **Firebase**:
  - **Firestore**
  - **Authentication**
- **Tailwind CSS**

## 主な機能

### 1. ユーザー登録・ログイン
- Firebase Authenticationを使用して、ユーザー登録とログインを簡単に行えます。
- ユーザー登録時に、Firebase Firestoreにユーザー情報を保存します。

### 2. 打撃成績の保存
- その日の打撃成績をFirestoreに保存できます。
- わかりやすいUIで、打席ごとの詳細なデータを入力可能です。

### 3. 打撃成績の表示
- 保存した打撃成績を個人ページで確認できます。
- 打率、出塁率、OPSなどの詳細なスタッツを計算して表示します。

### 4. ランキング表示
- 全ユーザーの打撃成績をランキング形式で表示します。
- 詳細な成績を展開して確認することも可能です。

## インストール方法
1. リポジトリをクローンします。
   ```bash
   git clone
    cd next-batting-viewer
    ```
2. 依存関係をインストールします。
    ```bash
    npm install
    ```
3. Firebaseの設定を行います。

4. 開発サーバーを起動します。
    ```bash
    npm run dev
    ```
5. ブラウザで `http://localhost:3000` にアクセスします。

## Vercelデプロイ
`https://next-batting-viewer.vercel.app/` でデプロイされたアプリケーションを確認できます。