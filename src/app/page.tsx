"use client";
import RankingList from "./_components/RankingList";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-teal-500 p-8">
      <div className="container mx-auto">
        <div className="mb-12">
          <RankingList />
        </div>
      </div>
    </div>
  );
}
