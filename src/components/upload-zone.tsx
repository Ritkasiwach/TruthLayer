"use client";

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  CloudUpload,
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function UploadZone({
  onFileAccepted,
  isUploading,
  uploadProgress,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items?.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files?.length > 0) {
        const file = files[0];
        if (file.type === "application/pdf") {
          setSelectedFile(file);
          onFileAccepted(file);
        }
      }
    },
    [onFileAccepted]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.length) {
        const file = files[0];
        if (file.type === "application/pdf") {
          setSelectedFile(file);
          onFileAccepted(file);
        }
      }
    },
    [onFileAccepted]
  );

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        id="pdf-upload-input"
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <label
              htmlFor="pdf-upload-input"
              className={`upload-zone block cursor-pointer p-12 ${
                isDragOver ? "drag-over" : ""
              }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-6 relative z-10">
                <motion.div
                  animate={isDragOver ? { scale: 1.1, y: -8 } : { scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 
                                  border border-blue-500/20 flex items-center justify-center">
                    <CloudUpload className="w-8 h-8 text-blue-500" />
                  </div>
                  {isDragOver && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full 
                                 bg-blue-500 flex items-center justify-center"
                    >
                      <Upload className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
                    {isDragOver ? "Drop your PDF here" : "Upload your document"}
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Drag & drop or{" "}
                    <span className="text-blue-500 font-medium">browse</span>{" "}
                    to upload a PDF
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] opacity-60">
                    Supports marketing reports, pitch decks, articles, and more
                  </p>
                </div>

                {/* Supported file types */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                                  bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                    <FileText className="w-3 h-3" />
                    <span className="text-xs font-medium">PDF</span>
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))] opacity-50">
                    up to 50 MB
                  </span>
                </div>
              </div>
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-8"
          >
            <div className="flex items-start gap-4">
              {/* File icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 
                              border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>

                  {!isUploading && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={clearFile}
                      className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      <X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                    </motion.button>
                  )}
                </div>

                {/* Progress bar */}
                {isUploading && (
                  <div className="mt-4 space-y-2">
                    <div className="confidence-bar">
                      <motion.div
                        className="confidence-bar-fill bg-gradient-to-r from-blue-500 to-violet-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                          {uploadProgress < 30
                            ? "Uploading document..."
                            : uploadProgress < 60
                            ? "Extracting text..."
                            : uploadProgress < 90
                            ? "Processing content..."
                            : "Almost done..."}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[hsl(var(--muted-foreground))]">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                )}

                {uploadProgress === 100 && !isUploading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">
                      Upload complete
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
