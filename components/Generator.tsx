"use client";

import { useRef, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Download, RotateCcw } from "lucide-react";
import html2canvas from "html2canvas";
import { useGeneration } from "@/context/GenerationContext";

export default function Generator() {
  const {
    concept, setConcept,
    lastConcept,
    isLoading,
    data,
    generateImage
  } = useGeneration();
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  const handleGenerate = () => generateImage(concept);
  const handleRegenerate = () => generateImage(lastConcept);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
        // Clone the card to modify styles for download without affecting the UI
        const clone = cardRef.current.cloneNode(true) as HTMLElement;
        
        // Fix image section height in the clone because percentage height won't work with h-auto parent
        // The image section is the first child
        const imageSection = clone.children[0] as HTMLElement;
        if (imageSection) {
            // Calculate 40% of the standard card height (375 * 16 / 9 = 666.66)
            // 666.66 * 0.4 = 266.66px
            imageSection.classList.remove('h-[40%]');
            imageSection.style.height = '268px'; 
        }

        // Find the scrollable container in the clone
        // It's the div inside the text section that has overflow-y-auto class
        // Structure: Card -> ImageDiv -> TextDiv -> Title/Subtitle... -> ScrollableDiv
        // We can find it by class name or structure. Let's look for the one with 'overflow-y-auto'
        const scrollableDiv = clone.querySelector('.overflow-y-auto');
        
        if (scrollableDiv) {
            // Remove overflow constraints and height limits to show full content
            scrollableDiv.classList.remove('overflow-y-auto', 'flex-1');
            scrollableDiv.classList.add('h-auto', 'overflow-visible');
        }
        
        // Also ensure the parent text container expands
        // The text section is the second child of the card
        const textSection = clone.children[1] as HTMLElement;
        if (textSection) {
             textSection.classList.remove('flex-1'); // Remove flex-1 so it can grow
             textSection.classList.add('h-auto', 'min-h-0'); // Allow height to adjust to content
        }
        
        // Remove aspect ratio constraint from the card clone itself
        clone.classList.remove('aspect-[9/16]', 'max-w-[375px]');
        clone.style.width = '375px'; // Keep fixed width
        clone.style.height = 'auto'; // Auto height
        clone.style.position = 'absolute';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        
        document.body.appendChild(clone);
        
        // Wait a moment for layout/images
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(clone, {
            useCORS: true,
            scale: 2,
            backgroundColor: null,
            logging: false, // Turn off logging for cleaner console
            allowTaint: true,
        });
        
        document.body.removeChild(clone); // Clean up
        
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        const fileName = data?.title || "concept";
        link.download = `${fileName.replace(/\s+/g, "-")}-card.png`;
        link.href = url;
        link.click();
    } catch (err) {
        console.error("Download failed:", err);
        alert("Failed to download image. This might be due to CORS restrictions on the image source.");
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center mt-[10px] md:mt-[10px]">
      <div className="flex gap-2 w-full">
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

      {!data && !isLoading && (
        <div className="w-full mt-4 md:mt-16 flex flex-col items-center text-center space-y-8">
            <div className="relative group cursor-default animate-in fade-in slide-in-from-bottom-8 duration-1000">
                 {/* 1. 多彩背景光晕 - 增强色彩与层次 */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl mix-blend-screen animate-pulse delay-700"></div>
                 <div className="absolute -bottom-4 right-8 w-24 h-24 bg-pink-500/30 rounded-full blur-3xl mix-blend-screen animate-pulse delay-1000"></div>
                 
                 {/* 2. 抽象图形容器 */}
                 <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                    {/* 装饰轨道 */}
                    <div className="absolute inset-0 border border-white/20 dark:border-white/10 rounded-full opacity-50 scale-90"></div>
                    <div className="absolute inset-0 border-t-2 border-r-2 border-transparent border-t-violet-400/50 border-r-pink-400/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    
                    {/* 3. 核心卡片 - 玻璃拟态 + 渐变流光 */}
                    <div className="relative w-20 h-28 backdrop-blur-md bg-white/40 dark:bg-black/40 rounded-xl shadow-2xl border border-white/60 dark:border-white/10 transform -rotate-6 transition-all duration-700 group-hover:-rotate-12 group-hover:scale-110 group-hover:shadow-violet-500/20 flex flex-col p-2 gap-2 z-10 overflow-hidden">
                        {/* 卡片内部环境光 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-pink-500/10 opacity-60"></div>
                        
                        {/* 图片占位区 - 炫彩渐变 */}
                        <div className="w-full h-1/2 rounded-lg bg-gradient-to-br from-violet-200 via-fuchsia-100 to-indigo-200 dark:from-violet-900/60 dark:via-fuchsia-900/40 dark:to-indigo-900/60 relative overflow-hidden group-hover:brightness-110 transition-all">
                             {/* 扫光动画 */}
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] skew-x-12"></div>
                        </div>
                        
                        {/* 文本占位区 */}
                        <div className="space-y-1.5 relative">
                            <div className="w-3/4 h-1.5 bg-gradient-to-r from-violet-300 to-indigo-300 dark:from-violet-700 dark:to-indigo-700 rounded-full opacity-80"></div>
                            <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full opacity-60"></div>
                            <div className="w-5/6 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full opacity-60"></div>
                        </div>
                    </div>
                    
                    {/* 4. 漂浮元素 - 增加生动感 */}
                    <div className="absolute top-6 -right-2 w-6 h-6 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full blur-[2px] animate-bounce delay-100 opacity-90 shadow-lg shadow-orange-500/20"></div>
                    <div className="absolute bottom-4 -left-2 w-5 h-5 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-[1px] animate-pulse shadow-lg shadow-blue-500/20"></div>
                 </div>
            </div>

            <div className="max-w-lg space-y-4 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
                <h2 className="text-2xl md:text-3xl font-serif tracking-wide text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    将抽象概念 <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 font-bold">具象化为艺术</span>
                </h2>
                <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 leading-relaxed whitespace-nowrap opacity-80">
                    深度解析词汇内涵，生成独一无二的视觉概念卡片。
                </p>
            </div>

            {/* Removed bottom text from here to move it to page.tsx for better positioning */}
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center gap-4 w-full animate-in fade-in duration-500">
           <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-2xl w-full max-w-[375px] aspect-[9/16] flex flex-col relative border border-gray-100 dark:border-zinc-800">
             {/* Shimmer Effect Overlay */}
             <div className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] skew-x-12 pointer-events-none"></div>
             
             {/* Image Skeleton */}
             <div className="h-[40%] w-full bg-gradient-to-br from-violet-100 via-purple-100 to-cyan-100 dark:from-violet-900/50 dark:via-purple-900/50 dark:to-cyan-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] skew-x-12 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center text-violet-400/30 dark:text-violet-300/20">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
             </div>
             
             {/* Text Skeleton */}
             <div className="flex-1 p-6 md:p-8 space-y-6 bg-white dark:bg-zinc-900 relative">
                {/* Title */}
                <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-md w-3/4 animate-pulse"></div>
                
                {/* Divider */}
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full my-4 opacity-50"></div>
                
                {/* Paragraphs */}
                <div className="space-y-3">
                    <div key="p1" className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full animate-pulse"></div>
                    <div key="p2" className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-5/6 animate-pulse"></div>
                    <div key="p3" className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-4/6 animate-pulse"></div>
                </div>
                
                {/* More content */}
                <div className="pt-4 space-y-3">
                    <div key="p4" className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-11/12 animate-pulse"></div>
                    <div key="p5" className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                </div>

                {/* Loading Text */}
                <div className="absolute bottom-6 left-0 w-full text-center text-zinc-300 dark:text-zinc-600 text-xs animate-pulse font-mono tracking-widest uppercase">
                    Generating...
                </div>
             </div>
           </div>
        </div>
      )}

      {data && (
        <div className="flex flex-col items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Preview Area */}
          <div ref={cardRef} className="bg-white text-black rounded-xl overflow-hidden shadow-2xl w-full max-w-[375px] aspect-[9/16] flex flex-col relative border border-gray-100">
             {/* Image Section */}
             <div className="h-[40%] w-full relative overflow-hidden bg-gray-100 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={data.imageUrl} 
                    alt={data.title}
                    className="w-full h-full object-cover"
                    // crossOrigin="anonymous" // Not needed for Base64 Data URLs
                    onError={(e) => {
                        console.error("Image failed to load:", data.imageUrl);
                        // Fallback to avoid broken image icon
                        e.currentTarget.src = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3";
                    }}
                />
             </div>
             
             {/* Text Section */}
             <div className="flex-1 p-8 flex flex-col bg-white relative min-h-0">
                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none z-10"></div>
                
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 shrink-0">{data.title}</h1>
                <p className="text-xs text-zinc-400 uppercase tracking-[0.2em] font-medium mb-6 shrink-0">{data.subtitle}</p>
                
                <div className="w-8 h-1 bg-zinc-900 mb-6 rounded-full shrink-0"></div>
                
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent z-0">
                    <p className="text-sm leading-relaxed text-zinc-600 font-sans text-justify whitespace-pre-wrap">
                        {data.description}
                    </p>
                </div>
             </div>
             
             {/* Footer */}
             <div className="absolute bottom-4 right-6 text-[10px] text-zinc-300 font-mono tracking-widest">
                AI CONCEPT
             </div>
          </div>

          <div className="flex gap-4 w-full max-w-[375px]">
            <Button variant="outline" onClick={handleDownload} className="flex-1 shadow-none bg-transparent border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 active:bg-zinc-100 dark:active:bg-zinc-700 transition-colors">
              <Download className="mr-2 h-4 w-4" /> 下载卡片
            </Button>
            <Button variant="outline" onClick={handleRegenerate} className="flex-1 shadow-none bg-transparent border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 active:bg-zinc-100 dark:active:bg-zinc-700 transition-colors">
              <RotateCcw className="mr-2 h-4 w-4" /> 重新生成
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
