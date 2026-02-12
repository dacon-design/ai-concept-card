"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import HistoryCard from "./HistoryCard";
import ConfirmDialog from "./ConfirmDialog";
import ThanosSnap from "./ThanosSnap";
import { motion, PanInfo } from "framer-motion";

interface HistoryCarouselProps {
  history: any[];
  onDelete?: (index: number) => void;
  onDeleteStart?: () => void;
}

// ThanosSnap component will handle the disintegration effect

export default function HistoryCarousel({ history, onDelete, onDeleteStart }: HistoryCarouselProps) {
  // currentIndex 0 = Newest card.
  // Increasing index = Older history.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const lastWheelTime = useRef(0);

  const [isDeleting, setIsDeleting] = useState(false);
  const prevHistoryLength = useRef(history.length);

  // Determine if we are effectively deleting based on history update
  // If history length changed, the deletion is done data-wise, so we shouldn't hide the current card anymore.
  const isHistoryUpdated = history.length !== prevHistoryLength.current;
  const effectiveIsDeleting = isDeleting && !isHistoryUpdated;

  // Check if we are truly deleting the last item (1 -> 0).
  // We must ensure we are not in the transient state where index is out of bounds (e.g. deleted oldest of 2 cards).
  const isDeletingLastItem = effectiveIsDeleting && 
                             history.length === 1 && 
                             currentIndex < history.length;

  // Reset index when history changes, but try to keep position if valid
  useEffect(() => {
    prevHistoryLength.current = history.length;

    if (currentIndex >= history.length && history.length > 0) {
        setCurrentIndex(history.length - 1);
    } else if (history.length === 0) {
        setCurrentIndex(0);
    }
    
    // Reset deleting state when history updates (deletion complete)
    if (isDeleting) {
        setIsDeleting(false);
    }
  }, [history, currentIndex]);

  const handleDownload = async () => {
    const currentCard = cardRefs.current.get(currentIndex);
    if (!currentCard) return;

    try {
        const clone = currentCard.cloneNode(true) as HTMLElement;
        
        // Add footer signature
        const footer = document.createElement('div');
        footer.className = "absolute bottom-4 right-6 text-[10px] text-zinc-300 font-mono tracking-widest";
        footer.innerText = "AI CONCEPT";
        clone.appendChild(footer);

        // Fix layout for capture
        const imageSection = clone.children[0] as HTMLElement;
        if (imageSection) {
            imageSection.classList.remove('h-[40%]');
            imageSection.style.height = '268px'; 
        }

        const scrollableDiv = clone.querySelector('.overflow-y-auto');
        if (scrollableDiv) {
            scrollableDiv.classList.remove('overflow-y-auto', 'flex-1');
            scrollableDiv.classList.add('h-auto', 'overflow-visible');
        }
        
        const textSection = clone.children[1] as HTMLElement;
        if (textSection) {
             textSection.classList.remove('flex-1');
             textSection.classList.add('h-auto', 'min-h-0');
        }
        
        // Reset transform/scale for the clone to ensure clean capture
        clone.style.transform = 'none';
        clone.classList.remove('aspect-[9/16]', 'max-w-[320px]', 'shadow-2xl');
        clone.style.width = '375px';
        clone.style.height = 'auto';
        clone.style.position = 'absolute';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        
        document.body.appendChild(clone);
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(clone, {
            useCORS: true,
            scale: 2,
            backgroundColor: null,
            logging: false,
            allowTaint: true,
        });
        
        document.body.removeChild(clone);
        
        const data = history[currentIndex];
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        const fileName = data?.title || "concept";
        link.download = `${fileName.replace(/\s+/g, "-")}-card.png`;
        link.href = url;
        link.click();
    } catch (err) {
        console.error("Download failed:", err);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleteDialogOpen(false);
    
    // Start ThanosSnap animation
    setIsDeleting(true);

    // Notify parent if deleting the last item
    if (history.length === 1) {
        onDeleteStart?.();
    }
  };

  const handleAnimationComplete = () => {
    onDelete?.(currentIndex);
    
    // We rely on the useEffect hook to reset isDeleting once the history prop updates.
    // This ensures no flash/jump occurs between animation end and data update.
  };

  const goToNewer = () => {
    // Allow going to -1 (Future Fallback)
    if (currentIndex > -1) { 
       setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToOlder = () => {
    // Allow going to history.length (End Fallback)
    if (currentIndex < history.length) { 
       setCurrentIndex((prev) => prev + 1);
    }
  };

  // Wheel/Trackpad Handler
  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return; // 400ms cooldown
    
    // Threshold
    if (Math.abs(e.deltaX) > 20) {
        if (e.deltaX > 0) {
            // Scroll Right (deltaX > 0) -> Should go to Newer (Right)
            // Previously: goToOlder()
            goToNewer();
        } else {
            // Scroll Left (deltaX < 0) -> Should go to Older (Left)
            // Previously: goToNewer()
            goToOlder();
        }
        lastWheelTime.current = now;
    }
  };

  // Drag Handler
  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipeThreshold = 50; // px
    const velocityThreshold = 500; // px/s
    
    // Swipe Right (offset.x > 0) -> Move card to Right -> Reveal Left (Older)
    // ... logic ...
    
    // Check bounds before switching
    // If current is -1 (Future), can't go newer
    // If current is length (End), can't go older
    
    if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
        if (currentIndex < history.length) {
             goToOlder();
        }
    } 
    else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
        if (currentIndex > -1) {
             goToNewer();
        }
    }
  };

  if (history.length === 0) {
    return null;
  }

  // Animation Variants
  const getCardVariants = (offset: number) => {
    const isCurrent = offset === 0;
    
    // Layout Config
    // Mobile optimized: reduced width to show more side cards
    // PC remains larger
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const cardWidth = isMobile ? 300 : 340; 
    const spacing = isMobile ? 220 : 260; // Tighter spacing on mobile

    const xOffset = spacing; // Horizontal spacing
    const scaleStep = 0.1;
    const rotateStep = 8; // Degrees
    
    // Calculation
    // We want:
    // Offset > 0 (Older/Left): x = -spacing, rotate = 8deg
    // Offset < 0 (Newer/Right): x = spacing, rotate = -8deg
    
    // When deleting, make the adjacent cards slide in smoothly
    // If offset is 1 (next older card), it should move to 0 (center)
    // If offset is -1 (next newer card), it usually stays put until index updates, 
    // but here we are animating the current card out.
    // The "snap" effect happens, then we update index.
    
    let x = -offset * xOffset;
    
    // Deletion Animation Logic
    if (effectiveIsDeleting) {
        const isLastItem = currentIndex === history.length - 1;

        if (isLastItem) {
             // Deleting the oldest card (End of list).
             // Newer cards (Right side, offset < 0) should slide Left towards center.
             if (offset < 0) {
                 x = -(offset + 1) * xOffset;
             }
             // Older/Fallback cards (Left side, offset > 0) stay in place (x = -offset * xOffset).
             // This prevents the "jump" because relative to the viewport, they don't move,
             // while the Newer card slides left to take the empty spot.
        } else {
             // Standard Delete (Middle or Newest).
             // Older cards (Left side, offset > 0) should slide Right into the gap.
             if (offset > 0) {
                 x = -(offset - 1) * xOffset;
             }
             // Newer cards (Right side, offset < 0) stay in place.
        }
    }

    // Add vertical offset to move cards up within container without moving container
    const y = -20; 
    const scale = 1 - Math.abs(offset) * scaleStep;
    // Fix zIndex: Current card must be highest.
    // If isDeleting, it stays on top until it disappears.
    // Otherwise, zIndex decreases with offset.
    // We use a high base (100) to ensure it sits above other UI elements if needed.
    const zIndex = effectiveIsDeleting && isCurrent ? 100 : 50 - Math.abs(offset);
    
    const rotateY = offset * rotateStep; 
    
    // During deletion, card should fade out as it dissolves
    let opacity = Math.abs(offset) > 2 ? 0 : (isCurrent ? (effectiveIsDeleting ? 0 : 1) : 0.6);

    // If deleting the last item, hide all other cards immediately
    if (isDeletingLastItem && !isCurrent) {
        opacity = 0;
    }

    // Add explicit translateZ to fix Android z-index jitter
    // We use a small z offset to physically separate the cards in 3D space
    const z = effectiveIsDeleting && isCurrent ? 100 : -Math.abs(offset) * 100;

    return {
        x,
        y, // Apply vertical offset
        z, // Explicit Z-depth for Android
        scale: effectiveIsDeleting && offset === 1 ? 1 : scale, // Also scale up the incoming card
        zIndex,
        rotateY: effectiveIsDeleting && offset === 1 ? 0 : rotateY, // Reset rotation for incoming card
        opacity: effectiveIsDeleting && offset === 1 ? 1 : opacity, // Fade in the incoming card
        transition: { 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            mass: 1,
            // If deleting, make the card disappear instantly so particles take over
            ...(effectiveIsDeleting && isCurrent ? { duration: 0.1 } : {}),
            // If deleting last item, make other cards disappear instantly
            ...(isDeletingLastItem && !isCurrent ? { duration: 0 } : {}),
            // Slower transition for the incoming card to fill the gap gracefully
            ...(effectiveIsDeleting && offset === 1 && !isDeletingLastItem ? { duration: 0.8, delay: 0.2 } : {})
        }
    } as any;
  };

  // Render Range
  const renderRange = [];
  // Render wider range when deleting to prevent pop-in of incoming cards
  // But if effectiveIsDeleting is false (data updated), use normal range to avoid rendering unnecessary cards
  
  const rangeBuffer = effectiveIsDeleting ? 2 : 1;
  for (let i = currentIndex - rangeBuffer; i <= currentIndex + rangeBuffer; i++) {
      if (i >= -1 && i <= history.length) {
          renderRange.push(i);
      }
  }

  return (
    <div 
      className="relative w-full h-[720px] flex items-center justify-center overflow-hidden perspective-1200 -translate-y-[20px]"
      onWheel={onWheel}
    >
      {/* Cards Container */}
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center perspective-1200">
        <style jsx global>{`
          .perspective-1200 { perspective: 1200px; }
          .preserve-3d { transform-style: preserve-3d; }
        `}</style>

        {renderRange.map((index) => {
            const offset = index - currentIndex;
            let content;
            let isFallback = false;
            let key;

            // If we are deleting the last item, do NOT render any fallback cards.
            // This prevents them from appearing during the deletion animation.
            if (isDeletingLastItem && (index === -1 || index === history.length)) {
                return null;
            }

            if (index === -1) {
                // Future Fallback (Newest Limit)
                content = <HistoryCard data={null} isFallback={true} />;
                isFallback = true;
                key = "fallback-future";
            } else if (index === history.length) {
                // End Fallback (Oldest Limit)
                content = <HistoryCard data={null} isFallback={true} fallbackText="已是最后一张了！" />;
                isFallback = true;
                key = "fallback-end";
            } else {
                // History Card
                const item = history[index];
                content = <HistoryCard 
                    ref={(el) => {
                        if (el) cardRefs.current.set(index, el);
                        else cardRefs.current.delete(index);
                    }}
                    data={item} 
                    isActive={offset === 0}
                />;
                // Use ID if available, otherwise fallback to index (but we try to ensure IDs exist)
                key = item?.id || `history-${index}`;
            }

            // Determine Drag Elasticity based on Boundary
            let dragElastic: any = 0.2;
            
            // 1. Future Fallback (index -1, Newest end, "Explore Limitless")
            if (index === -1) {
                // Allow dragging Left (negative x) -> go to Older (index 0)
                // Allow dragging Right (positive x) BUT with strong resistance -> bounce back
                dragElastic = { left: 0.2, right: 0.05 }; 
            } 
            // 2. End Fallback (index history.length, Oldest end, "End of History")
            else if (index === history.length) {
                // Allow dragging Right (positive x) -> go to Newer (index length-1)
                // Allow dragging Left (negative x) BUT with strong resistance -> bounce back
                dragElastic = { right: 0.2, left: 0.05 };
            }

            return (
                <motion.div
                    key={key}
                    className={`absolute rounded-3xl ${offset === 0 ? 'shadow-2xl' : 'shadow-xl'}`}
                    style={{ 
                        width: 'clamp(280px, 77vw, 340px)', // Dynamic width: min 280, max 340, responsive 77vw
                        aspectRatio: '9/14', // Keep aspect ratio, so height increases with width
                        transformStyle: "preserve-3d",
                        cursor: offset === 0 ? "grab" : "pointer",
                        overflow: isDeleting && offset === 0 ? "visible" : "hidden", // Allow debris to fly out
                    }}
                    initial={false} // No initial animation on mount to avoid layout shift
                    animate={getCardVariants(offset)}
                    drag={offset === 0 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={dragElastic}
                    onDragEnd={offset === 0 ? handleDragEnd : undefined}
                    whileTap={offset === 0 ? { cursor: "grabbing" } : undefined}
                    onClick={(e) => {
                        e.stopPropagation();
                        // If clicking the current card, do nothing (or show details)
                        // But clicking delete/download buttons should work.
                        // The issue is that the card itself captures clicks to center it.
                        // But we are in the main card now.
                        
                        if (offset !== 0) setCurrentIndex(index);
                    }}
                    // Remove pointer-events-none from the card wrapper, 
                    // but we might need to be careful about dragging.
                    // The drag handler is on the motion.div.
                >
                    {/* Render ThanosSnap overlay if deleting */}
                    {content}
                    {effectiveIsDeleting && offset === 0 && cardRefs.current.get(currentIndex) && (
                         <ThanosSnap
                             targetRef={{ current: cardRefs.current.get(currentIndex)! }}
                             isActive={true}
                             onComplete={handleAnimationComplete}
                         />
                     )}
                    
                    {/* Darken overlay for depth */}
                    <motion.div 
                        className="absolute inset-0 bg-black/10 rounded-3xl pointer-events-none"
                        animate={{ opacity: offset === 0 ? 0 : 0.3 }}
                    />
                </motion.div>
            );
        })}
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title=""
        description="你确定已经消化当前概念并执行删除吗"
        confirmText="确定删除"
        cancelText="继续消化"
      />

      {/* Action Buttons (Fixed) - Hide when deleting the last item */}
      {!(isDeleting && history.length === 1 && currentIndex < history.length && history.length === prevHistoryLength.current) && (
        <>
            <div className="absolute bottom-10 left-0 w-full flex items-center justify-center gap-3 z-[110] pointer-events-auto px-4 pb-4 translate-y-[14px]">
                <Button 
                    variant="outline" 
                    disabled={currentIndex === -1 || currentIndex === history.length} // Disable on fallbacks
                    className="flex-1 max-w-[140px] gap-2 h-10 bg-transparent border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 active:bg-zinc-100 dark:active:bg-zinc-700 shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed z-[110] relative"
                    onClick={handleDownload}
                >
                    <Download className="h-4 w-4" />
                    下载
                </Button>
                
                <Button 
                    variant="outline" 
                    disabled={currentIndex === -1 || currentIndex === history.length} // Disable on fallbacks
                    className="flex-1 max-w-[140px] gap-2 h-10 bg-transparent border-zinc-300 dark:border-zinc-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 active:bg-red-100 dark:active:bg-red-900/40 shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed z-[110] relative"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteDialogOpen(true);
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                    删除
                </Button>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-50">
                    <button 
                        className={`p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all md:flex hidden pointer-events-auto ${
                            currentIndex <= -1 ? 'opacity-0 cursor-default' : 'opacity-100'
                        }`}
                        onClick={goToNewer}
                    >
                        <ChevronLeft className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
                    </button>

                    <button 
                        className={`p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all md:flex hidden pointer-events-auto ${
                            currentIndex >= history.length ? 'opacity-0 cursor-default' : 'opacity-100'
                        }`}
                        onClick={goToOlder}
                    >
                        <ChevronRight className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
                    </button>
            </div>
        </>
      )}
    </div>
  );
}
