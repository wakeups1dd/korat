import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  "Crawling the web...",
  "Judging your meta tags...",
  "Counting your keywords...",
  "Analyzing page speed...",
  "Checking mobile friendliness...",
  "Scanning for broken links...",
  "Evaluating content quality...",
  "Almost there...",
];

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const LoadingScreen = ({ isLoading, onComplete }: LoadingScreenProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          onComplete?.();
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Scanlines overlay */}
          <div className="scanlines absolute inset-0" />

          <div className="relative z-10 p-8 text-center">
            {/* Glitch logo */}
            <motion.div
              className="glitch mb-8 font-mono text-6xl font-bold text-primary md:text-8xl"
              animate={{
                textShadow: [
                  "2px 2px hsl(330 100% 60%), -2px -2px hsl(210 100% 55%)",
                  "-2px 2px hsl(210 100% 55%), 2px -2px hsl(330 100% 60%)",
                  "2px -2px hsl(330 100% 60%), -2px 2px hsl(210 100% 55%)",
                ],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              KORAT
            </motion.div>

            {/* Loading message */}
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                className="mb-8 font-mono text-xl text-background md:text-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {loadingMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="mx-auto w-full max-w-md">
              <div className="mb-2 flex justify-between font-mono text-sm text-muted">
                <span>ANALYZING</span>
                <span>{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="h-4 w-full border-[2px] border-background bg-transparent">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            {/* Decorative blocks */}
            <div className="mt-12 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-4 w-4 border-[2px] border-background"
                  animate={{
                    backgroundColor: ["hsl(72 100% 50%)", "hsl(330 100% 60%)", "hsl(210 100% 55%)"],
                    rotate: [0, 90, 180, 270, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
