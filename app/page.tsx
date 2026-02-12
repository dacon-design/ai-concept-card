import Generator from "../components/Generator";
import Header from "../components/Header";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24 px-4 pb-4 md:pt-32 md:px-24 md:pb-24 bg-white dark:bg-black overflow-hidden selection:bg-violet-200 dark:selection:bg-violet-900">
      
      {/* 动态背景流体层 */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-violet-200 to-pink-200 blur-[100px] animate-[blob_20s_infinite]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 blur-[100px] animate-[blob_25s_infinite_reverse]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-fuchsia-200 to-purple-200 blur-[100px] animate-[blob_30s_infinite]"></div>
      </div>

      <Header />

      <div className="w-full max-w-md z-10 relative mb-auto">
        <Generator />
      </div>

      <div className="w-full flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-widest pointer-events-none animate-in fade-in duration-1000 delay-500 fill-mode-both py-8">
          <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <span>Deep Analysis</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <span>Visual Generation</span>
          </div>
      </div>
    </main>
  );
}
