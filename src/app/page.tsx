"use client";
import RankingList from "./_components/RankingList";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-teal-500 p-8">
      <div className="container mx-auto">
        <h1 className="text-5xl font-light text-center mb-12 text-gray-200/90 tracking-wider">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
            打撃成績
          </span>
        </h1>
        <div className="mb-12">
          <RankingList />
        </div>
      </div>
    </div>
  );
}
