"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useGeneration } from "@/context/GenerationContext";

export default function ConceptInput() {
  const {
    concept, setConcept,
    isLoading,
    generateImage
  } = useGeneration();

  const handleGenerate = () => generateImage(concept);

  return (
    <div className="flex gap-2 w-full max-w-md mx-auto px-4 md:px-0">
        <div className="relative w-full group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <Input
            placeholder="输入一个概念 (例如: 黑天鹅)"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            className="relative bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-transparent transition-all text-base md:text-sm"
            />
        </div>
        <Button onClick={handleGenerate} disabled={isLoading} variant="outline" className="bg-transparent border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 active:bg-zinc-100 dark:active:bg-zinc-700 shadow-none transition-all">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          生成
        </Button>
    </div>
  );
}
