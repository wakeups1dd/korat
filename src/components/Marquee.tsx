import { motion } from "framer-motion";

interface MarqueeProps {
  text: string;
  className?: string;
}

const Marquee = ({ text, className = "" }: MarqueeProps) => {
  return (
    <div className={`overflow-hidden border-y-[3px] border-foreground bg-primary ${className}`}>
      <motion.div
        className="flex whitespace-nowrap py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="mx-4 font-mono text-sm font-bold uppercase text-primary-foreground md:text-base"
          >
            {text} ★ {text} ◆ {text} ● {text} ▲
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
