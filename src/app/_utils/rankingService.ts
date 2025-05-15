import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

interface User {
    id: string;
    username: string;
    games: number;
    atbat: number;
    fourBall: number;
    deadBall: number;
    sacrifice: number;
    sacrificeFly: number;
    stolenBase: number;
    caughtStealing: number;
    single: number;
    double: number;
    triple: number;
    homurun: number;
    k: number;
    rbi: number;
}

/**
 * Firestoreから打撃成績のランキングデータを取得
 * @param limitCount ランキングの上位何件を取得するか
 * @returns ランキングデータ
 */
export const fetchRanking = async (limitCount: number = 100, orderByField: keyof User = "rbi") => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy(orderByField, "desc"), limit(limitCount)); // 打点(rbi)で降順ソート
        const querySnapshot = await getDocs(q);

        // Firestoreから取得したデータをUser型にマッピング
        const ranking: User[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<User, "id">), // FirestoreのデータをUser型にキャスト
        }));

        return ranking;
    } catch (error) {
        console.error("ランキングデータの取得中にエラーが発生しました:", error);
        throw error;
    }
};