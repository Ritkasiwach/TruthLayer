"use client";

import { motion } from "framer-motion";
import { Shield, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[hsla(var(--border),0.5)]"
    >
      <div className="glass-panel !rounded-none !border-x-0 !border-t-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 
                              flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[hsl(var(--foreground))]">
                TruthLayer
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-gradient opacity-80">
                AI
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] 
                         hover:text-[hsl(var(--foreground))] transition-colors duration-200"
            >
              Upload
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] 
                         hover:text-[hsl(var(--foreground))] transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] 
                         hover:text-[hsl(var(--foreground))] transition-colors duration-200"
            >
              How It Works
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-9 h-9 rounded-xl 
                         bg-[hsl(var(--muted))] hover:bg-[hsla(var(--muted-foreground),0.1)]
                         transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
