import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Target, BarChart3, Bug, ArrowRight } from "lucide-react";
import { useURL } from "@/contexts/URLContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import URLInput from "@/components/URLInput";
import Marquee from "@/components/Marquee";
import LoadingScreen from "@/components/LoadingScreen";

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "LIGHTNING FAST",
    description: "Full site audit in under 30 seconds. No waiting, no BS.",
    color: "bg-primary",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "BRUTALLY HONEST",
    description: "We don't sugarcoat. You'll know exactly what's broken.",
    color: "bg-accent",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "ACTIONABLE DATA",
    description: "Every issue comes with a fix. No guessing games.",
    color: "bg-secondary",
  },
  {
    icon: <Bug className="h-6 w-6" />,
    title: "ZERO FLUFF",
    description: "Only metrics that matter. Cut through the noise.",
    color: "bg-success",
  },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setScannedURL } = useURL();

  const handleSubmit = (url: string) => {
    setIsLoading(true);
    setScannedURL(url);
    console.log("Analyzing:", url);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    navigate("/dashboard");
  };

  const handleCTAClick = () => {
    const urlInput = document.getElementById("url-input-section");
    urlInput?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} onComplete={handleLoadingComplete} />

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pb-16 pt-32 md:pb-24 md:pt-40">

          <div className="relative mx-auto max-w-5xl text-center">
            {/* Main headline */}
            <motion.h1
              className="mb-6 text-5xl font-bold uppercase leading-none tracking-tighter md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              PASTE A URL.
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">BREAK THE SEO.</span>
                <motion.span
                  className="absolute bottom-2 left-0 right-0 h-4 bg-primary md:h-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  style={{ originX: 0 }}
                />
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              className="mx-auto mb-12 max-w-2xl font-mono text-lg text-muted-foreground md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              The SEO tool that doesn't talk down to you. Get instant audits,{" "}
              <span className="border-b-2 border-accent">real insights</span>, and fixes that
              actually work.
            </motion.p>

            {/* URL Input */}
            <div id="url-input-section" className="flex justify-center">
              <URLInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Trust badges */}
            <motion.div
              className="mt-12 flex flex-wrap items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {["10K+ SITES SCANNED", "NO SIGNUP REQUIRED", "100% FREE TIER"].map(
                (badge) => (
                  <div
                    key={badge}
                    className="tag-brutal bg-card"
                  >
                    {badge}
                  </div>
                )
              )}
            </motion.div>
          </div>
        </section>

        {/* Marquee */}
        <Marquee text="SEO AUDITS • PERFORMANCE CHECKS • ACCESSIBILITY SCANS • TECHNICAL ANALYSIS" />

        {/* Features Grid */}
        <section className="px-4 py-20 md:py-32">
          <div className="mx-auto max-w-6xl">
            <motion.h2
              className="mb-16 text-center text-3xl font-bold uppercase tracking-tight md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              WHY DEVS{" "}
              <span className="relative inline-block">
                <span className="relative z-10">LOVE</span>
                <span className="absolute bottom-0 left-0 right-0 h-3 bg-accent" />
              </span>{" "}
              KORAT
            </motion.h2>

            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="card-brutal group p-6"
                  initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -1 : 1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center border-[3px] border-foreground ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-y-[3px] border-foreground bg-foreground px-4 py-20 text-background md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              className="sticker mb-8 inline-block border-background bg-primary text-primary-foreground"
              initial={{ opacity: 0, rotate: -5 }}
              whileInView={{ opacity: 1, rotate: 3 }}
              viewport={{ once: true }}
            >
              NO CREDIT CARD
            </motion.div>

            <motion.h2
              className="mb-6 text-4xl font-bold uppercase tracking-tight md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              READY TO BREAK
              <br />
              SOME{" "}
              <span className="glitch text-primary">SEO</span>?
            </motion.h2>

            <motion.p
              className="mx-auto mb-8 max-w-xl font-mono text-muted"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Join 10,000+ developers who stopped guessing and started fixing.
              Your first audit is completely free.
            </motion.p>

            <motion.button
              className="btn-brutal inline-flex items-center gap-2 border-background bg-primary text-primary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={handleCTAClick}
            >
              START YOUR FREE AUDIT
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Index;
