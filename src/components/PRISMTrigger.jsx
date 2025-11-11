import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import PRISMCommandCenter from "./PRISMCommandCenter";

export default function PRISMTrigger({ currentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Listen for Cmd+K / Ctrl+K
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Pulse animation every 5 seconds
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 15 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-14 w-14 rounded-full bg-gradient-to-br from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-white/20"
        >
          <motion.div
            animate={pulse ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-200" />
          </motion.div>

          {/* Subtle pulse ring - contained within button area */}
          <motion.div
            className="absolute inset-0 rounded-full border border-[#3B82F6]/50"
            animate={{
              scale: [1, 1.15, 1.15],
              opacity: [0.6, 0, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />

          {/* Keyboard hint - cleaner positioning */}
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-[#0F111A]/95 backdrop-blur-sm border border-white/20 rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/70 font-medium">Press</span>
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[10px] text-white font-mono">⌘K</kbd>
              </div>
            </div>
          </div>
        </Button>
      </motion.div>

      {isOpen && (
        <PRISMCommandCenter
          currentPage={currentPage}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}