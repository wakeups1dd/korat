import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

const URLInput = ({ onSubmit, isLoading = false }: URLInputProps) => {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative">
        {/* Decorative elements */}
        <motion.div
          className="absolute -top-3 -left-3 h-6 w-6 border-[3px] border-foreground bg-primary"
          animate={{ rotate: isFocused ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute -bottom-3 -right-3 h-6 w-6 border-[3px] border-foreground bg-accent"
          animate={{ rotate: isFocused ? -45 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Main input container */}
        <div
          className={`flex flex-col gap-4 border-[3px] border-foreground bg-card p-4 transition-all sm:flex-row sm:items-center ${
            isFocused ? "translate-x-[-4px] translate-y-[-4px] shadow-brutal" : "shadow-brutal-sm"
          }`}
        >
          {/* Protocol indicator */}
          <div className="hidden border-[2px] border-foreground bg-muted px-3 py-2 font-mono text-sm font-bold sm:block">
            HTTPS://
          </div>

          {/* Input field */}
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="yoursite.com"
              className="w-full bg-transparent font-mono text-xl font-bold tracking-tight placeholder:text-muted-foreground focus:outline-none md:text-2xl"
              disabled={isLoading}
            />
            
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="btn-brutal-primary flex items-center justify-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Zap className="h-5 w-5 animate-pulse" />
                <span>SCANNING...</span>
              </>
            ) : (
              <>
                <span>ANALYZE</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Helper text */}
      <motion.p
        className="mt-4 font-mono text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ⚡ Paste any URL and we'll tear it apart (the SEO way)
      </motion.p>
    </motion.form>
  );
};

export default URLInput;
