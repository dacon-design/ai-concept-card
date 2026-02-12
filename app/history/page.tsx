"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import HistoryCarousel from "@/components/HistoryCarousel";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isDeletingLast, setIsDeletingLast] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("concept-history") || "[]");
      
      // Ensure all items have an ID (for legacy data)
      let hasUpdates = false;
      const sanitizedData = data.map((item: any) => {
        if (!item.id) {
           hasUpdates = true;
           return { ...item, id: crypto.randomUUID() };
        }
        return item;
      });

      if (hasUpdates) {
          localStorage.setItem("concept-history", JSON.stringify(sanitizedData));
      }

      setHistory(sanitizedData);
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    localStorage.setItem("concept-history", JSON.stringify(newHistory));
    window.dispatchEvent(new Event("history-updated"));
  };

  const handleClearAll = () => {
    setIsClearDialogOpen(true);
  };

  const confirmClear = () => {
    setHistory([]);
    localStorage.setItem("concept-history", "[]");
    window.dispatchEvent(new Event("history-updated"));
    setIsClearDialogOpen(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-zinc-500">加载中...</div>;
  }

  // Extract Empty State Content for reuse/overlay
  const EmptyStateContent = (
    <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-300 -translate-y-32">
        {/* Empty State Illustration */}
        <div className="relative w-56 h-56 flex items-center justify-center scale-90">
            {/* Background Circles */}
            <div className="absolute inset-0 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-full animate-[spin_60s_linear_infinite]">
                {/* Orbiting Dots - Attached to the rotating ring */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-3 h-3 bg-violet-400 rounded-full blur-[1px] shadow-[0_0_10px_rgba(167,139,250,0.5)]"></div>
                <div className="absolute bottom-[15%] right-[15%] w-2 h-2 bg-pink-400 rounded-full blur-[1px] shadow-[0_0_10px_rgba(244,114,182,0.5)]"></div>
                <div className="absolute bottom-[15%] left-[15%] w-2 h-2 bg-blue-400 rounded-full blur-[1px] shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
            </div>
            <div className="absolute inset-8 border border-zinc-100 dark:border-zinc-800 rounded-full"></div>

            {/* Central Icon */}
            <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-black rounded-2xl shadow-xl flex items-center justify-center border border-white/50 dark:border-zinc-800 transform rotate-12 transition-transform hover:rotate-0 duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5 rounded-2xl"></div>
                <div className="flex flex-col items-center gap-2 opacity-40 scale-75">
                    <div className="w-12 h-16 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg border-dashed"></div>
                    <div className="w-8 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                </div>
            </div>
        </div>

        <div className="text-center space-y-2 -translate-y-3">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 font-serif">暂无记录</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[240px]">
                每天了解新概念，摇身成为知识达人！
            </p>
        </div>

        <Link href="/">
            <Button className="h-10 px-12 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all shadow-lg shadow-zinc-200 dark:shadow-zinc-900/20 translate-y-0">
            生成一张
            </Button>
        </Link>
    </div>
  );

  return (
    <main className="relative min-h-screen flex flex-col bg-white dark:bg-black overflow-hidden selection:bg-violet-200 dark:selection:bg-violet-900">
      
      {/* 动态背景流体层 (复用首页样式) */}
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-violet-200 to-pink-200 blur-[100px] animate-[blob_20s_infinite]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 blur-[100px] animate-[blob_25s_infinite_reverse]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-fuchsia-200 to-purple-200 blur-[100px] animate-[blob_30s_infinite]"></div>
      </div>

      {/* Shared Backdrop Blur Layer */}
      <div className="fixed top-0 left-0 right-0 h-[140px] z-30 bg-gradient-to-b from-white/90 via-white/70 to-transparent dark:from-black/90 dark:via-black/70 backdrop-blur-md pointer-events-none mask-image:linear-gradient(to_bottom,black_80%,transparent)" />

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-transparent">
        <div className="w-full md:max-w-6xl flex items-center justify-between h-24 px-6 md:px-12">
          <div className="flex items-center gap-2">
            <Link href="/">
                <Button variant="ghost" size="icon" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                <ArrowLeft className="h-5 w-5" />
                </Button>
            </Link>
            <h1 className="text-lg tracking-widest font-bold font-serif text-zinc-800 dark:text-zinc-200">历史概念卡</h1>
          </div>
          
          {history.length > 0 && (
             <Button 
                variant="ghost" 
                onClick={handleClearAll}
                className="bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 text-zinc-600 dark:text-zinc-400 text-xs h-8 px-3 rounded-full transition-colors shadow-none"
             >
                一键清空
             </Button>
          )}
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col h-screen pt-24 md:pt-32 md:px-8 md:pb-8">

        <div className="relative flex-1 flex items-center justify-center w-full min-h-0">
            {/* Empty State - Always render if length is 0 OR deleting last */}
            {(history.length === 0 || isDeletingLast) && (
                <div className={`absolute inset-0 flex items-center justify-center z-0`}>
                    {EmptyStateContent}
                </div>
            )}

            {history.length > 0 && (
                <div className="relative z-10 w-full">
                    <HistoryCarousel 
                        history={history} 
                        onDelete={handleDelete}
                        onDeleteStart={() => setIsDeletingLast(true)}
                    />
                </div>
            )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={confirmClear}
        title=""
        description="确定已经消化掉这些概念并执行清空吗？"
        confirmText="确定清空"
        cancelText="继续消化"
      />
    </main>
  );
}
