"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Firebase Authenticationを使用してユーザーを登録

            // ユーザー名、メールアドレス、パスワードを使用してユーザーを作成
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // ユーザー名を取得
            const user = userCredential.user;
            /*
            username: ユーザー名
            email: メールアドレス
            point: ゲーム内で使うポイント
            */
            // Firestoreにユーザー情報を保存
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                games: 0,   // 試合数
                atbat: 0, // 打席数
                fourBall: 0, // 四球
                deadBall: 0, // 死球
                sacrifice: 0, // 犠打
                sacrificeFly: 0, // 犠飛
                stolenBase: 0, // 盗塁
                caughtStealing: 0, // 盗塁死
                single: 0,  // 単打
                double: 0,  // 二塁打
                triple: 0,  // 三塁打
                homurun: 0, // 本塁打
                k: 0,     // 三振
                rbi: 0,   // 打点
            });
            router.push("/");
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h1>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">登録名（公開されます。本名非推奨）</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}