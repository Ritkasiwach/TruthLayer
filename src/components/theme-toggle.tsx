"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";

  return (
    <motion.button
      id="theme-toggle"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl 
                 bg-[hsl(var(--muted))] hover:bg-[hsla(var(--muted-foreground),0.1)]
                 transition-colors duration-200 focus-ring"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        ) : (
          <Sun className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        )}
      </motion.div>
    </motion.button>
  );
}
