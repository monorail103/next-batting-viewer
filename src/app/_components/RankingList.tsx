import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

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

const RankingList: React.FC = () => {
  const [ranking, setRanking] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  // ランキングデータを取得するためのuseEffect
  // コンポーネントがマウントされたときにランキングデータを取得
  useEffect(() => {
    const loadRanking = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("rbi", "desc")); // 打点(rbi)で降順ソート
        const querySnapshot = await getDocs(q);
        // Firestoreから取得したデータをUser型にマッピング
        const ranking: User[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<User, "id">), // FirestoreのデータをUser型にキャスト
        }));
        setRanking(ranking);
      } catch (error) {
        console.error("ランキングの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, []);

  // 詳しい打撃結果を表示するための関数
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 打率を計算する関数
  const calculateBattingAverage = (user: User) => {
    const ab = user.atbat - user.sacrifice - user.sacrificeFly;
    const hits = user.single + user.double + user.triple + user.homurun;
    return ab > 0 ? hits / ab : 0;
  };

  // 出塁率を計算する関数
  const calculateOnBasePercentage = (user: User) => {
    const hits = user.single + user.double + user.triple + user.homurun;
    const pa = user.atbat + user.fourBall + user.deadBall + user.sacrificeFly;
    const obp = pa > 0 ? (hits + user.fourBall + user.deadBall) / pa : 0;
    return obp;
  };

  // 長打率を計算する関数
  const calculateSluggingPercentage = (user: User) => {
    const ab = user.atbat - user.sacrifice - user.sacrificeFly;
    const slg = ab > 0 ? (user.single + user.double * 2 + user.triple * 3 + user.homurun * 4) / ab : 0;
    return slg;
  }

  // OPSを計算する関数
  const calculateOPS = (user: User) => {
    const obp = calculateOnBasePercentage(user);
    const slg = calculateSluggingPercentage(user);
    return obp + slg;
  }


  if (loading) {
    return <p className="text-center text-gray-200">ランキングを読み込んでいます...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">ランキング</h2>
      <ul className="space-y-4">
        {ranking.map((user, index) => (
          <li key={user.id} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">
                {index + 1}. {user.username}
              </span>
              <button
                onClick={() => toggleExpand(user.id)}
                className="text-blue-500 text-sm"
              >
                {expanded[user.id] ? "詳細を隠す" : "詳細を見る"}
              </button>
            </div>
            <div className="mt-2">
              <div className="flex gap-4 text-sm text-gray-800 font-semibold">
                <span>打率: {(() => {
                  return calculateBattingAverage(user);
                })()}</span>
                <span>出塁率: {(() => {
                  return calculateOnBasePercentage(user);
                })()}</span>
                <span>OPS: {(() => {
                  return calculateOPS(user);
                })()}</span>
              </div>
              {expanded[user.id] && (
                <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                  <span>試合: {user.games}</span>
                  <span>打席: {user.atbat}</span>
                  <span>安打: {user.single + user.double + user.triple + user.homurun}</span>
                  <span>二塁打: {user.double}</span>
                  <span>三塁打: {user.triple}</span>
                  <span>本塁打: {user.homurun}</span>
                  <span>打点: {user.rbi}</span>
                  <span>四球: {user.fourBall}</span>
                  <span>死球: {user.deadBall}</span>
                  <span>犠打: {user.sacrifice}</span>
                  <span>犠飛: {user.sacrificeFly}</span>
                  <span>盗塁: {user.stolenBase}</span>
                  <span>盗塁死: {user.caughtStealing}</span>
                  <span>三振: {user.k}</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingList;