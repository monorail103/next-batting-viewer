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

interface AtBatResult {
    result: number; // 結果 (0: 選択なし, 1: 凡打, 2: 単打, 3: 二塁打, 4: 三塁打, 5: 本塁打, 6: 四球, 7: 死球, 8: 犠打, 9: 犠飛, 10: 三振)
    notes?: string; // 備考 (オプション)
}

interface TodayResult {
    date: string; // 日付
    atbatList: AtBatResult[]; // 各打席の結果リスト
    rbi: number; // 打点
    stolenBase: number; // 盗塁
    caughtStealing: number; // 盗塁死
}

export default function Page() {
    const [result, setResult] = useState<User>();   // 打撃結果を格納するためのstate
    const [loading, setLoading] = useState(true);   // ローディング状態を管理するためのstate
    const [todayResult, setTodayResult] = useState<TodayResult>({
        date: new Date().toISOString().split("T")[0], // 今日の日付をISO形式で取得
        atbatList: [], // 各打席の結果リスト
        rbi: 0, // 打点
        stolenBase: 0, // 盗塁
        caughtStealing: 0, // 盗塁死
    }); // 本日分の各打席の結果を格納するためのstate

    const router = useRouter(); // ルーターを取得
    // ユーザー情報を表示
    useEffect(() => {
        // Firebaseからユーザー情報を取得する関数
        const fetchUserData = async () => {
            try {
                // Check if user is authenticated
                const user = auth.currentUser;
                if (!user) {
                    console.log("User not authenticated");
                    router.push("/login"); // Redirect to login page
                    return;
                }

                const userDocRef = doc(db, "users", user.uid); // ユーザーのドキュメントを参照
                const userDoc = await getDoc(userDocRef); // ユーザードキュメントを取得

                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    setResult(userData);
                } else {
                    console.log("No such document!");
                }

            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData(); // ユーザーデータを取得する関数を呼び出す
    }, [result, router]); // resultとrouterが変更されたら再実行

    // フォームの送信を処理する関数
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveTodayResult(todayResult);
    };

    // 本日分の打撃結果を保存する関数
    const saveTodayResult = async (todayResult: TodayResult) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.log("User not authenticated");
                router.push("/login"); // Redirect to login page
                return;
            }

            // TodayResultの中身を参照し、User型に落とし込む
            if (!result) {
                console.log("No user data to update");
                return;
            }

            // 集計用変数
            let single = 0, double = 0, triple = 0, homurun = 0, k = 0, fourBall = 0, deadBall = 0, sacrifice = 0, sacrificeFly = 0, atbat = 0;

            // atbatListの各打席を集計
            todayResult.atbatList.forEach((atbatResult) => {
                switch (atbatResult.result) {
                    case 1: // 凡打
                        atbat++;
                        break;
                    case 2: // 単打
                        single++;
                        atbat++;
                        break;
                    case 3: // 二塁打
                        double++;
                        atbat++;
                        break;
                    case 4: // 三塁打
                        triple++;
                        atbat++;
                        break;
                    case 5: // 本塁打
                        homurun++;
                        atbat++;
                        break;
                    case 6: // 四球
                        fourBall++;
                        break;
                    case 7: // 死球
                        deadBall++;
                        break;
                    case 8: // 犠打
                        sacrifice++;
                        break;
                    case 9: // 犠飛
                        sacrificeFly++;
                        break;
                    case 10: // 三振
                        k++;
                        atbat++;
                        break;
                    default:
                        break;
                }
            });

            // 新しいUserデータを作成
            const updatedUser: User = {
                id: user.uid,
                username: result.username,
                games: result.games + 1,
                atbat: result.atbat + atbat,
                fourBall: result.fourBall + fourBall,
                deadBall: result.deadBall + deadBall,
                sacrifice: result.sacrifice + sacrifice,
                sacrificeFly: result.sacrificeFly + sacrificeFly,
                stolenBase: result.stolenBase + todayResult.stolenBase,
                caughtStealing: result.caughtStealing + todayResult.caughtStealing,
                single: result.single + single,
                double: result.double + double,
                triple: result.triple + triple,
                homurun: result.homurun + homurun,
                k: result.k + k,
                rbi: result.rbi + todayResult.rbi,
            };

            const userDocRef = doc(db, "users", user.uid); // ユーザーのドキュメントを参照
            // Firestoreに保存
            await setDoc(userDocRef, updatedUser, { merge: true });
            console.log("Today's result saved successfully!");
        } catch (error) {
            console.error("Error saving today's result:", error);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!result) {
        return <div>No user data found</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4">
            <div className="bg-white/80 rounded-3xl shadow-2xl p-10 w-full max-w-xl mb-10">
                <h1 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
                    {result.username}さんのデータ
                </h1>
                <div className="grid grid-cols-2 gap-4 text-lg text-gray-700 mb-6">
                    <div>
                        <span className="font-semibold">試合数:</span> {result.games}
                    </div>
                    <div>
                        <span className="font-semibold">打席数:</span> {result.atbat}
                    </div>
                    <div>
                        <span className="font-semibold">四球:</span> {result.fourBall}
                    </div>
                    <div>
                        <span className="font-semibold">死球:</span> {result.deadBall}
                    </div>
                    <div>
                        <span className="font-semibold">犠打:</span> {result.sacrifice}
                    </div>
                    <div>
                        <span className="font-semibold">犠飛:</span> {result.sacrificeFly}
                    </div>
                    <div>
                        <span className="font-semibold">盗塁:</span> {result.stolenBase}
                    </div>
                    <div>
                        <span className="font-semibold">盗塁死:</span> {result.caughtStealing}
                    </div>
                    <div>
                        <span className="font-semibold">単打:</span> {result.single}
                    </div>
                    <div>
                        <span className="font-semibold">二塁打:</span> {result.double}
                    </div>
                    <div>
                        <span className="font-semibold">三塁打:</span> {result.triple}
                    </div>
                    <div>
                        <span className="font-semibold">本塁打:</span> {result.homurun}
                    </div>
                    <div>
                        <span className="font-semibold">三振:</span> {result.k}
                    </div>
                    <div>
                        <span className="font-semibold">打点:</span> {result.rbi}
                    </div>
                    {/* 詳細スタッツ */}
                    <div>
                        <span className="font-semibold">安打:</span> {result.single + result.double + result.triple + result.homurun}
                    </div>
                    <div>
                        <span className="font-semibold">打率:</span> {
                            result.atbat > 0
                                ? ((result.single + result.double + result.triple + result.homurun) / result.atbat).toFixed(3)
                                : "-"
                        }
                    </div>
                    <div>
                        <span className="font-semibold">出塁率(OBP):</span> {
                            (() => {
                                const numerator = result.single + result.double + result.triple + result.homurun + result.fourBall + result.deadBall;
                                const denominator = result.atbat + result.fourBall + result.deadBall + result.sacrificeFly;
                                return denominator > 0 ? (numerator / denominator).toFixed(3) : "-";
                            })()
                        }
                    </div>
                    <div>
                        <span className="font-semibold">長打率(SLG):</span> {
                            (() => {
                                const totalBases =
                                    result.single +
                                    result.double * 2 +
                                    result.triple * 3 +
                                    result.homurun * 4;
                                return result.atbat > 0 ? (totalBases / result.atbat).toFixed(3) : "-";
                            })()
                        }
                    </div>
                    <div>
                        <span className="font-semibold">OPS:</span> {
                            (() => {
                                const numerator = result.single + result.double + result.triple + result.homurun + result.fourBall + result.deadBall;
                                const denominator = result.atbat + result.fourBall + result.deadBall + result.sacrificeFly;
                                const obp = denominator > 0 ? numerator / denominator : 0;
                                const slg = result.atbat > 0
                                    ? (
                                        result.single +
                                        result.double * 2 +
                                        result.triple * 3 +
                                        result.homurun * 4
                                    ) / result.atbat
                                    : 0;
                                return (obp + slg).toFixed(3);
                            })()
                        }
                    </div>
                </div>
            </div>
            <div className="bg-white/90 rounded-3xl shadow-xl p-8 w-full max-w-xl">
                <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
                    今日の結果を保存
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 打席ごとの入力欄を動的に追加・削除 */}
                    {todayResult.atbatList?.map((atbat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <label className="mb-1 text-gray-600 font-medium">
                                第{idx + 1}打席
                            </label>
                            <select
                                name={`atbatList-${idx}`}
                                value={atbat.result}
                                onChange={(e) => {
                                    const newList = [...todayResult.atbatList];
                                    newList[idx] = { ...newList[idx], result: Number(e.target.value) };
                                    setTodayResult({ ...todayResult, atbatList: newList });
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                            >
                                <option value={0}>選択してください</option>
                                <option value={1}>凡打</option>
                                <option value={2}>単打</option>
                                <option value={3}>二塁打</option>
                                <option value={4}>三塁打</option>
                                <option value={5}>本塁打</option>
                                <option value={6}>四球</option>
                                <option value={7}>死球</option>
                                <option value={8}>犠打</option>
                                <option value={9}>犠飛</option>
                                <option value={10}>三振</option>
                            </select>
                            <input
                                type="text"
                                placeholder="備考"
                                value={atbat.notes || ""}
                                onChange={(e) => {
                                    const newList = [...todayResult.atbatList];
                                    newList[idx] = { ...newList[idx], notes: e.target.value };
                                    setTodayResult({ ...todayResult, atbatList: newList });
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                            />
                            <button
                                type="button"
                                className="text-red-500 px-2 py-1"
                                onClick={() => {
                                    const newList = [...todayResult.atbatList];
                                    newList.splice(idx, 1);
                                    setTodayResult({ ...todayResult, atbatList: newList });
                                }}
                            >
                                削除
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="mt-2 mb-4 px-4 py-2 bg-blue-200 rounded-lg text-blue-700 font-semibold hover:bg-blue-300 transition"
                        onClick={() => {
                            setTodayResult({
                                ...todayResult,
                                atbatList: [...(todayResult.atbatList || []), { result: 0 }],
                            });
                        }}
                    >
                        打席を追加
                    </button>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                    >
                        保存
                    </button>
                </form>
            </div>
        </div>
    );
}