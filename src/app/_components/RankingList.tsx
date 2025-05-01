import React, { useEffect, useState } from "react";
import { fetchRanking } from "@/app/_utils/rankingService";

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
            <div className="flex gap-4 text-sm text-gray-600">
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
              <span>
              打率: {(() => {
                const ab = user.atbat - user.sacrifice - user.sacrificeFly;
                const hits = user.single + user.double + user.triple + user.homurun;
                return ab > 0 ? (hits / ab).toFixed(3) : "-";
              })()}
              </span>
              <span>
              出塁率: {(() => {
                const hits = user.single + user.double + user.triple + user.homurun;
                const pa = user.atbat + user.fourBall + user.deadBall + user.sacrificeFly;
                const obp = pa > 0
                ? ((hits + user.fourBall + user.deadBall) / pa).toFixed(3)
                : "-";
                return obp;
              })()}
              </span>
              <span>
              長打率: {(() => {
                const ab = user.atbat - user.sacrifice - user.sacrificeFly;
                const tb =
                user.single +
                user.double * 2 +
                user.triple * 3 +
                user.homurun * 4;
                return ab > 0 ? (tb / ab).toFixed(3) : "-";
              })()}
              </span>
              <span>
              OPS: {(() => {
                const ab = user.atbat - user.sacrifice - user.sacrificeFly;
                const hits = user.single + user.double + user.triple + user.homurun;
                const pa = user.atbat + user.fourBall + user.deadBall + user.sacrificeFly;
                const obp =
                pa > 0
                  ? (hits + user.fourBall + user.deadBall) / pa
                  : 0;
                const slg =
                ab > 0
                  ? (
                    (user.single +
                    user.double * 2 +
                    user.triple * 3 +
                    user.homurun * 4) /
                    ab
                  )
                  : 0;
                return (obp + slg).toFixed(3);
              })()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingList;