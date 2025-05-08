// パスワード再設定ページ
"use client";
import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // パスワード再設定メール送信処理
  // Firebase AuthenticationのsendPasswordResetEmailを使用して、指定したメールアドレスにパスワード再設定用のメールを送信します。
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("パスワード再設定用のメールを送信しました。");
    } catch (error) {
      setError("メール送信に失敗しました。正しいメールアドレスを入力してください。");
      console.error("Password reset error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">パスワード再設定</h1>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              パスワード再設定メールを送信
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
            ログイン画面に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}