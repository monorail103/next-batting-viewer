# Next-Batting-Viewer
打撃成績を保存し、ランキング形式で保存し表示するアプリケーションです。
## 技術スタック
- Next.js
- TypeScript
- Firebase
  - Firestore
  - Authentication
- Tailwind CSS
# 機能
- ユーザー登録・ログイン
Firebase Authenticationを使用して、ユーザー登録・ログインを行います。ユーザー登録と同時に、Firebase Firestoreにユーザー情報を保存します。
- 打撃成績の保存
Firestore上に打撃成績を保存します。わかりやすいUIで、その日ごとに打撃成績を保存することができます。
- 打撃成績の表示
保存した打撃成績を表示します。
各ユーザーの個人ページで表示できる他、ランキング形式で表示することもできます。
