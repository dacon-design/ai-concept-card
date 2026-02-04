"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Download } from "lucide-react";
import html2canvas from "html2canvas";

export default function Generator() {
  const [concept, setConcept] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenerate = async () => {
    if (!concept) return;
    setIsLoading(true);
    setData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept }),
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
      alert("生成失败，请检查网络或 API Key 设置。详情请查看控制台日志。");
    } finally {
      setIsLoading(false);
    }
  };

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
            imageSection.style.height = '267px'; 
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
        link.download = `${concept.replace(/\s+/g, "-")}-card.png`;
        link.href = url;
        link.click();
    } catch (err) {
        console.error("Download failed:", err);
        alert("Failed to download image. This might be due to CORS restrictions on the image source.");
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center">
      <div className="flex gap-2 w-full">
        <Input
          placeholder="输入一个概念 (例如: 黑天鹅)"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          className="bg-white dark:bg-zinc-900"
        />
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          生成
        </Button>
      </div>

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

          <Button variant="secondary" onClick={handleDownload} className="w-full max-w-[375px] shadow-sm">
            <Download className="mr-2 h-4 w-4" /> 下载卡片
          </Button>
        </div>
      )}
    </div>
  );
}
