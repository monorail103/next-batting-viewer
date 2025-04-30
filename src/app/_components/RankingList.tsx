import React, { useEffect, useState } from "react";
import { fetchRanking } from "@/lib/rankingService";

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

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await fetchRanking(10); // 上位10件を取得
        setRanking(data);
      } catch (error) {
        console.error("ランキングの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-200">ランキングを読み込んでいます...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">ランキング</h2>
      <ul className="space-y-4">
        {ranking.map((user, index) => (
          <li key={user.id} className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">
              {index + 1}. {user.username}
            </span>
            <span className="text-lg font-bold text-indigo-600">{user.rbi} 打点</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingList;