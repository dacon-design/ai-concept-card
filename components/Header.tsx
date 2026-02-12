"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  const [historyCount, setHistoryCount] = useState(0);

  const updateCount = () => {
    try {
      const history = JSON.parse(localStorage.getItem("concept-history") || "[]");
      setHistoryCount(history.length);
    } catch (e) {
      console.error("Failed to parse history", e);
      setHistoryCount(0);
    }
  };

  useEffect(() => {
    updateCount();

    // Listen for custom event to update count
    const handleHistoryUpdate = () => updateCount();
    window.addEventListener("history-updated", handleHistoryUpdate);

    return () => {
      window.removeEventListener("history-updated", handleHistoryUpdate);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-transparent">
      <div className="w-full md:max-w-6xl flex items-center justify-between pt-7 pb-2 px-6 md:px-12">
        <p className="text-zinc-800 dark:text-zinc-200 text-lg tracking-widest font-bold font-serif">
          Concept Generator
        </p>
        
        <Link href="/history">
          <Button variant="ghost" size="icon" className="relative text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 -mr-2 md:mr-0">
            <History className="h-5 w-5" />
            {historyCount > 0 && (
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-[9px] text-zinc-600 dark:text-zinc-400 font-bold ring-2 ring-white dark:ring-black">
                {historyCount > 99 ? "99" : historyCount}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
