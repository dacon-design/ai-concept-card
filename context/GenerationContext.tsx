"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface GenerationContextType {
  concept: string;
  setConcept: (c: string) => void;
  lastConcept: string;
  setLastConcept: (c: string) => void;
  isLoading: boolean;
  data: any;
  setData: (d: any) => void;
  generateImage: (prompt: string) => Promise<void>;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [concept, setConcept] = useState("");
  const [lastConcept, setLastConcept] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  // Sync data with history
  useEffect(() => {
    const handleHistoryUpdate = () => {
        try {
            const history = JSON.parse(localStorage.getItem("concept-history") || "[]");
            // If history is empty, clear current data to show home illustration
            if (history.length === 0) {
                setData(null);
            }
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    };

    window.addEventListener("history-updated", handleHistoryUpdate);
    return () => window.removeEventListener("history-updated", handleHistoryUpdate);
  }, []);

  const generateImage = async (prompt: string) => {
    if (!prompt) return;
    setIsLoading(true);
    setData(null);
    setLastConcept(prompt);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: prompt }),
      });
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.details || result.error || "Failed to generate");
      }

      setData(result);
      setConcept("");

      // Save to history
      try {
        const history = JSON.parse(localStorage.getItem("concept-history") || "[]");
        const newEntry = {
          ...result,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        localStorage.setItem("concept-history", JSON.stringify([newEntry, ...history]));
        window.dispatchEvent(new Event("history-updated"));
      } catch (e) {
        console.error("Failed to save history", e);
      }
    } catch (error: any) {
      console.error(error);
      alert(`生成失败: ${error.message || "请检查网络或 API Key 设置"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenerationContext.Provider value={{
      concept, setConcept,
      lastConcept, setLastConcept,
      isLoading,
      data, setData,
      generateImage
    }}>
      {children}
    </GenerationContext.Provider>
  );
}

export function useGeneration() {
  const context = useContext(GenerationContext);
  if (context === undefined) {
    throw new Error("useGeneration must be used within a GenerationProvider");
  }
  return context;
}
