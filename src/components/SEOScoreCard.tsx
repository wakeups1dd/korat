import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SEOScoreCardProps {
  score: number;
  label: string;
  change?: number;
  color?: "primary" | "secondary" | "accent" | "destructive" | "success";
  delay?: number;
}

const SEOScoreCard = ({
  score,
  label,
  change = 0,
  color = "primary",
  delay = 0,
}: SEOScoreCardProps) => {
  const colorClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    success: "bg-success text-success-foreground",
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <motion.div
      className="card-brutal relative overflow-hidden p-6"
      initial={{ opacity: 0, y: 20, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ rotate: 1 }}
    >
      {/* Label tag */}
      <div
        className={`tag-brutal absolute -right-2 top-4 ${colorClasses[color]}`}
        style={{ transform: "rotate(3deg)" }}
      >
        {label}
      </div>

      {/* Score display */}
      <div className="mb-4 mt-6">
        <span
          className={`font-mono text-7xl font-bold tracking-tighter ${getScoreColor(score)}`}
        >
          {score}
        </span>
        <span className="font-mono text-2xl text-muted-foreground">/100</span>
      </div>

      {/* Change indicator */}
      {change !== 0 && (
        <div
          className={`flex items-center gap-1 font-mono text-sm font-bold ${
            change > 0 ? "text-success" : "text-destructive"
          }`}
        >
          {change > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : change < 0 ? (
            <TrendingDown className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
          <span>
            {change > 0 ? "+" : ""}
            {change} from last scan
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="progress-brutal mt-4">
        <motion.div
          className={`progress-brutal-fill ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: delay + 0.3 }}
        />
      </div>

      {/* Decorative corner */}
      <div
        className={`absolute -bottom-2 -left-2 h-8 w-8 border-[3px] border-foreground ${colorClasses[color]}`}
        style={{ transform: "rotate(45deg)" }}
      />
    </motion.div>
  );
};

export default SEOScoreCard;
