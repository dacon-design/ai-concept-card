"use client";

import { useRef, forwardRef } from "react";
import { Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface HistoryCardProps {
  data: any;
  isFallback?: boolean;
  fallbackText?: string;
  isActive?: boolean;
}

const HistoryCard = forwardRef<HTMLDivElement, HistoryCardProps>(({ data, isFallback = false, fallbackText, isActive = false }, ref) => {

  if (isFallback) {
    // 1. END OF HISTORY (Oldest) - "已是最后一张了！"
    if (fallbackText) {
      return (
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden shadow-xl w-full h-full flex flex-col items-center justify-center relative border border-zinc-200 dark:border-zinc-800 p-8 text-center group">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                  style={{ 
                      backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                      backgroundSize: '24px 24px' 
                  }}>
             </div>

             {/* Illustration: Stacked Archive */}
             <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                <div className="absolute w-24 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-700 transform -rotate-12 translate-x-[-20px] translate-y-[10px] transition-transform duration-500 group-hover:-rotate-[15deg] group-hover:translate-x-[-25px]"></div>
                <div className="absolute w-24 h-32 bg-zinc-100 dark:bg-zinc-700 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-600 transform -rotate-6 translate-x-[-10px] translate-y-[5px] transition-transform duration-500 group-hover:-rotate-[8deg] group-hover:translate-x-[-12px]"></div>
                <div className="absolute w-24 h-32 bg-white dark:bg-zinc-600 rounded-lg shadow-md border border-zinc-100 dark:border-zinc-500 flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-105">
                    <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-500 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-zinc-400 dark:text-zinc-300" />
                    </div>
                </div>
             </div>
             
             <div className="relative z-10 max-w-[200px]">
                 <h3 className="text-zinc-900 dark:text-zinc-100 font-bold text-lg mb-2">温故知新</h3>
                 <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{fallbackText}</p>
             </div>
        </div>
      );
    }
    
    // 2. FUTURE (Newest) - No text provided
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-xl w-full h-full flex flex-col items-center justify-center relative border border-zinc-200 dark:border-zinc-800 p-8 text-center overflow-hidden">
        {/* Abstract Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-indigo-50/30 dark:via-blue-900/10 dark:to-indigo-900/10"></div>
        
        {/* Animated Rings */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <div className="w-[500px] h-[500px] border border-indigo-100/50 dark:border-indigo-500/10 rounded-full absolute animate-[spin_20s_linear_infinite]"></div>
            <div className="w-[350px] h-[350px] border border-blue-100/50 dark:border-blue-500/10 rounded-full absolute animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="w-[200px] h-[200px] border border-violet-100/50 dark:border-violet-500/10 rounded-full absolute animate-[spin_10s_linear_infinite]"></div>
        </div>

        {/* Illustration: Floating Prism */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center perspective-[1000px]">
             <div className="relative w-20 h-20 animate-[float_4s_ease-in-out_infinite]">
                 {/* Glowing Core */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-violet-400 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
                 
                 {/* Glass Cube */}
                 <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl shadow-lg flex items-center justify-center transform rotate-45 transition-transform duration-700 hover:rotate-[225deg]">
                     <Sparkles className="w-8 h-8 text-indigo-500 dark:text-indigo-300" />
                 </div>
             </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-6">
            <div>
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 font-bold text-lg mb-2">
                    探索无界
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    新的灵感正在赶来...
                </p>
            </div>

            <Link href="/">
              <Button className="h-10 px-12 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-lg shadow-zinc-200 dark:shadow-zinc-900/20">
                生成一张
              </Button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
        <div ref={ref} className="bg-white text-black rounded-xl overflow-hidden shadow-2xl w-full h-full flex flex-col relative border border-gray-100">
            {/* Image Section */}
            <div className="h-[40%] w-full relative overflow-hidden bg-gray-100 shrink-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
                src={data.imageUrl} 
                alt={data.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3";
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Text Section */}
            <div className="flex-1 p-5 flex flex-col bg-white relative min-h-0">
                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none z-10"></div>
                
                <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-zinc-900 shrink-0">{data.title}</h1>
                <p className="text-xs text-zinc-400 uppercase tracking-[0.2em] font-medium mb-4 shrink-0">{data.subtitle}</p>
                
                <div className="w-8 h-1 bg-zinc-900 mb-4 rounded-full shrink-0"></div>
                
                <div className={`flex-1 ${isActive ? "overflow-y-auto" : "overflow-hidden pointer-events-none"} pr-0 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent z-0`}>
                    <p className="text-sm leading-relaxed text-zinc-600 font-sans text-justify whitespace-pre-wrap">
                        {data.description}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
});

HistoryCard.displayName = "HistoryCard";

export default HistoryCard;
