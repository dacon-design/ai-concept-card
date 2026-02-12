import Generator from "../components/Generator";
import Header from "../components/Header";
import ConceptInput from "../components/ConceptInput";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center pt-44 px-4 pb-4 md:pt-52 md:px-24 md:pb-24 bg-white dark:bg-black overflow-hidden selection:bg-violet-200 dark:selection:bg-violet-900">
      
      {/* 动态背景流体层 */}
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-violet-200 to-pink-200 blur-[100px] animate-[blob_20s_infinite]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 blur-[100px] animate-[blob_25s_infinite_reverse]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-fuchsia-200 to-purple-200 blur-[100px] animate-[blob_30s_infinite]"></div>
      </div>

      <Header />

      {/* Shared Backdrop Blur Layer for Header and Input */}
      <div className="fixed top-0 left-0 right-0 h-[140px] z-30 bg-gradient-to-b from-white/90 via-white/70 to-transparent dark:from-black/90 dark:via-black/70 backdrop-blur-md pointer-events-none mask-image:linear-gradient(to_bottom,black_80%,transparent)" />

      {/* Fixed Input Bar */}
      <div className="fixed top-[72px] left-0 right-0 z-40 flex justify-center py-2 bg-transparent transition-all">
        <ConceptInput />
      </div>

      <div className="w-full max-w-md z-10 relative mb-auto -mt-[44px]">
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
