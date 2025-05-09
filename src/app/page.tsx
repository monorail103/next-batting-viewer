"use client";
import RankingList from "./_components/RankingList";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-teal-500 p-8">
      <div className="container mx-auto">
      {/* <div className="text-sm text-gray-300 bg-gray-900 bg-opacity-40 rounded px-3 py-2 mb-6">
        ブラウザのダークモードでは文字が見えにくいので、必ず標準モードで開いてください。
      </div> */}
        <div className="mb-12">
          <RankingList />
        </div>
      </div>
    </div>
  );
}
