import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, CheckCircle, XCircle, Lightbulb } from "lucide-react";

export interface AuditIssue {
  id: string;
  title: string;
  severity: "error" | "warning" | "pass";
  description: string;
  suggestion?: string;
}

interface AuditCardProps {
  title: string;
  issues: AuditIssue[];
  icon: React.ReactNode;
  delay?: number;
}

const AuditCard = ({ title, issues, icon, delay = 0 }: AuditCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const passCount = issues.filter((i) => i.severity === "pass").length;

  const getSeverityStyles = (severity: AuditIssue["severity"]) => {
    switch (severity) {
      case "error":
        return "border-destructive bg-destructive/10";
      case "warning":
        return "border-warning bg-warning/10";
      case "pass":
        return "border-success bg-success/10";
    }
  };

  const getSeverityIcon = (severity: AuditIssue["severity"]) => {
    switch (severity) {
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "pass":
        return <CheckCircle className="h-5 w-5 text-success" />;
    }
  };

  return (
    <motion.div
      className="card-brutal overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-[2px] border-foreground bg-card">
            {icon}
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-wide">{title}</h3>
            <div className="flex gap-2 font-mono text-xs">
              {errorCount > 0 && (
                <span className="text-destructive">{errorCount} errors</span>
              )}
              {warningCount > 0 && (
                <span className="text-warning">{warningCount} warnings</span>
              )}
              {passCount > 0 && (
                <span className="text-success">{passCount} passed</span>
              )}
            </div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </button>

      {/* Issues list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t-[3px] border-foreground"
          >
            {issues.map((issue, index) => (
              <motion.div
                key={issue.id}
                className={`border-b-[2px] border-foreground p-4 last:border-b-0 ${getSeverityStyles(issue.severity)}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <h4 className="font-bold">{issue.title}</h4>
                    <p className="mt-1 font-mono text-sm text-muted-foreground">
                      {issue.description}
                    </p>

                    {issue.suggestion && (
                      <div className="mt-3 flex items-start gap-2 border-l-[3px] border-secondary bg-secondary/10 p-3">
                        <Lightbulb className="h-4 w-4 shrink-0 text-secondary" />
                        <p className="font-mono text-xs text-secondary">
                          {issue.suggestion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AuditCard;
