// 打撃成績を編集するページ
"use client";
import { useState, useEffect, use } from "react";
import { auth } from "@/lib/firebaseConfig";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    username: string;
    games: number,   // 試合数
    atbat: number, // 打席数
    fourBall: number, // 四球
    deadBall: number, // 死球
    sacrifice: number, // 犠打
    sacrificeFly: number, // 犠飛
    stolenBase: number, // 盗塁
    caughtStealing: number, // 盗塁死
    single: number,  // 単打
    double: number,  // 二塁打
    triple: number,  // 三塁打
    homurun: number, // 本塁打
    k: number,     // 三振
    rbi: number; // 打点
}

export default function EditStats() {
    const [loading, setLoading] = useState(true);   // ローディング状態を管理するためのstate
    const [user, setUser] = useState<User | null>(null); // 打撃成績を管理するためのstate
    const [error, setError] = useState<string | null>(null); // エラーメッセージを管理するためのstate

    const router = useRouter();


    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUser(userDoc.data() as User);
                } else {
                    // ホームに返す
                    router.push("/login"); // Redirect to login page
                }
            } else {
                // ホームに返す
                router.push("/login"); // Redirect to login page
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    const handleChangeData = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (user) {
                const userDocRef = doc(db, "users", user.id);
                await setDoc(userDocRef, user);
                alert("成績が更新されました。");
                // ホームに返す
                router.push("/"); // Redirect to login page
            } else {
                setError("ユーザーが見つかりませんでした。");
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            setError("成績の更新に失敗しました。");
        }
    }

    return(
        <div className="min-h-screen bg-gray-100">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-2xl">Loading...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-2xl text-red-500">{error}</p>
                </div>
            ) : (
                <div className="container mx-auto px-6 py-4">
                    <h1 className="text-3xl font-bold mb-4 text-black">成績を編集する</h1>
                        <form onSubmit={handleChangeData} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
                                    <input
                                        type="text"
                                        value={user?.username ?? ""}
                                        onChange={(e) => user && setUser({ ...user, username: e.target.value })}
                                        placeholder="ユーザー名"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-500"
                                        style={{ colorScheme: "light" }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">試合数</label>
                                    <input
                                        type="number"
                                        value={user?.games ?? 0}
                                        onChange={(e) => user && setUser({ ...user, games: Number(e.target.value) })}
                                        placeholder="試合数"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">打席数</label>
                                    <input
                                        type="number"
                                        value={user?.atbat ?? 0}
                                        onChange={(e) => user && setUser({ ...user, atbat: Number(e.target.value) })}
                                        placeholder="打席数"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">四球</label>
                                    <input
                                        type="number"
                                        value={user?.fourBall ?? 0}
                                        onChange={(e) => user && setUser({ ...user, fourBall: Number(e.target.value) })}
                                        placeholder="四球"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">死球</label>
                                    <input
                                        type="number"
                                        value={user?.deadBall ?? 0}
                                        onChange={(e) => user && setUser({ ...user, deadBall: Number(e.target.value) })}
                                        placeholder="死球"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">犠打</label>
                                    <input
                                        type="number"
                                        value={user?.sacrifice ?? 0}
                                        onChange={(e) => user && setUser({ ...user, sacrifice: Number(e.target.value) })}
                                        placeholder="犠打"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">犠飛</label>
                                    <input
                                        type="number"
                                        value={user?.sacrificeFly ?? 0}
                                        onChange={(e) => user && setUser({ ...user, sacrificeFly: Number(e.target.value) })}
                                        placeholder="犠飛"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">盗塁</label>
                                    <input
                                        type="number"
                                        value={user?.stolenBase ?? 0}
                                        onChange={(e) => user && setUser({ ...user, stolenBase: Number(e.target.value) })}
                                        placeholder="盗塁"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">盗塁死</label>
                                    <input
                                        type="number"
                                        value={user?.caughtStealing ?? 0}
                                        onChange={(e) => user && setUser({ ...user, caughtStealing: Number(e.target.value) })}
                                        placeholder="盗塁死"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">単打</label>
                                    <input
                                        type="number"
                                        value={user?.single ?? 0}
                                        onChange={(e) => user && setUser({ ...user, single: Number(e.target.value) })}
                                        placeholder="単打"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">二塁打</label>
                                    <input
                                        type="number"
                                        value={user?.double ?? 0}
                                        onChange={(e) => user && setUser({ ...user, double: Number(e.target.value) })}
                                        placeholder="二塁打"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">三塁打</label>
                                    <input
                                        type="number"
                                        value={user?.triple ?? 0}
                                        onChange={(e) => user && setUser({ ...user, triple: Number(e.target.value) })}
                                        placeholder="三塁打"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">本塁打</label>
                                    <input
                                        type="number"
                                        value={user?.homurun ?? 0}
                                        onChange={(e) => user && setUser({ ...user, homurun: Number(e.target.value) })}
                                        placeholder="本塁打"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">三振</label>
                                    <input
                                        type="number"
                                        value={user?.k ?? 0}
                                        onChange={(e) => user && setUser({ ...user, k: Number(e.target.value) })}
                                        placeholder="三振"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">打点</label>
                                    <input
                                        type="number"
                                        value={user?.rbi ?? 0}
                                        onChange={(e) => user && setUser({ ...user, rbi: Number(e.target.value) })}
                                        placeholder="打点"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className="mt-6 w-full md:w-auto bg-indigo-600 text-white py-2 px-8 rounded shadow hover:bg-indigo-700 transition font-semibold"
                                    >
                                        保存
                                    </button>
                                </div>
                            </div>
                        </form>
                </div>
            )}
        </div>
    )
}