// components/Loader.tsx
"use client";
import { motion } from "framer-motion";

export const Dots_v2 = () => (
  <div className="flex items-center justify-center h-full">
    <div className="flex space-x-2 text-orange-500"> {/* Adjust color if needed */}
      <motion.div
        className="size-3.5 rounded-full bg-current"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="size-3.5 rounded-full bg-current"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
      />
      <motion.div
        className="size-3.5 rounded-full bg-current"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity, delay: 0.6 }}
      />
    </div>
  </div>
);
