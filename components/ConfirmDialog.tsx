"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "确定清空",
  cancelText = "继续消化",
}: ConfirmDialogProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "";
      }, 300); // Wait for animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        // onClick={onClose} // Removed to prevent closing on backdrop click
      />

      {/* Dialog Content */}
      <div
        className={`relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800 transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 mt-2">
          {/* Title removed as requested */}
          <p className="text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed text-center">
            {description}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 shadow-none bg-red-600 hover:bg-red-700 text-white border-transparent"
          >
            {confirmText}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 shadow-none border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
