import Generator from "../components/Generator";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center p-4 md:p-24 bg-white dark:bg-black overflow-hidden selection:bg-violet-200 dark:selection:bg-violet-900">
      
      {/* 动态背景流体层 */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-violet-200 to-pink-200 blur-[100px] animate-[blob_20s_infinite]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 blur-[100px] animate-[blob_25s_infinite_reverse]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-fuchsia-200 to-purple-200 blur-[100px] animate-[blob_30s_infinite]"></div>
      </div>

      <div className="z-10 w-full max-w-md items-center justify-center font-mono text-sm flex mt-8 mb-12">
        <p className="text-center text-zinc-800 dark:text-zinc-200 text-lg tracking-widest font-bold">
          AI Concept Card Generator
        </p>
      </div>

      <div className="w-full max-w-md z-10 relative mb-auto">
        <Generator />
      </div>

      <div className="w-full h-16 shrink-0"></div>
    </main>
  );
}
