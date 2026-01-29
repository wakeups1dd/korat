import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Gauge,
  Eye,
  Code,
  FileText,
  Link2,
  Image,
  Shield,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useURL } from "@/contexts/URLContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOScoreCard from "@/components/SEOScoreCard";
import AuditCard, { AuditIssue } from "@/components/AuditCard";
import Marquee from "@/components/Marquee";
import { getAuditById, AuditResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Mock data for the dashboard
const mockSiteData = {
  scannedAt: "2 minutes ago",
  scores: {
    overall: 67,
    performance: 72,
    accessibility: 85,
    seo: 54,
    technical: 58,
  },
};

const performanceIssues: AuditIssue[] = [
  {
    id: "perf-1",
    title: "Large Contentful Paint (LCP) is too slow",
    severity: "error",
    description: "LCP is 4.2s. Should be under 2.5s for a good user experience.",
    suggestion: "Optimize your largest image or text block. Consider lazy loading images below the fold.",
  },
  {
    id: "perf-2",
    title: "First Input Delay (FID) needs improvement",
    severity: "warning",
    description: "FID is 180ms. Should be under 100ms for optimal interactivity.",
    suggestion: "Break up long JavaScript tasks. Consider using web workers for heavy computations.",
  },
  {
    id: "perf-3",
    title: "Cumulative Layout Shift (CLS) is acceptable",
    severity: "pass",
    description: "CLS score of 0.05 is within the recommended threshold of 0.1.",
  },
];

const seoIssues: AuditIssue[] = [
  {
    id: "seo-1",
    title: "Missing meta description",
    severity: "error",
    description: "Your page is missing a meta description tag.",
    suggestion: "Add a compelling meta description under 160 characters that includes your target keyword.",
  },
  {
    id: "seo-2",
    title: "Multiple H1 tags detected",
    severity: "error",
    description: "Found 3 H1 tags on this page. You should have exactly one.",
    suggestion: "Keep only one H1 tag that clearly describes the page content. Convert others to H2 or H3.",
  },
  {
    id: "seo-3",
    title: "Title tag is too long",
    severity: "warning",
    description: "Title is 78 characters. Google typically displays 50-60 characters.",
    suggestion: "Shorten your title to under 60 characters while keeping the main keyword near the beginning.",
  },
  {
    id: "seo-4",
    title: "Image alt attributes present",
    severity: "pass",
    description: "All 12 images have descriptive alt attributes. Great for accessibility and SEO!",
  },
];

const accessibilityIssues: AuditIssue[] = [
  {
    id: "a11y-1",
    title: "Low contrast text detected",
    severity: "warning",
    description: "2 text elements have contrast ratios below 4.5:1.",
    suggestion: "Increase the color contrast between text and background to meet WCAG AA standards.",
  },
  {
    id: "a11y-2",
    title: "Form labels are properly associated",
    severity: "pass",
    description: "All form inputs have associated labels. Users with screen readers will thank you.",
  },
  {
    id: "a11y-3",
    title: "Skip navigation link present",
    severity: "pass",
    description: "Skip link found, allowing keyboard users to bypass navigation.",
  },
];

const technicalIssues: AuditIssue[] = [
  {
    id: "tech-1",
    title: "No robots.txt found",
    severity: "error",
    description: "Your site is missing a robots.txt file.",
    suggestion: "Create a robots.txt file in your root directory to guide search engine crawlers.",
  },
  {
    id: "tech-2",
    title: "Missing canonical URL",
    severity: "warning",
    description: "No canonical link element found on the page.",
    suggestion: "Add a canonical URL to prevent duplicate content issues.",
  },
  {
    id: "tech-3",
    title: "HTTPS enabled",
    severity: "pass",
    description: "Your site uses HTTPS. Secure connections are essential for SEO and user trust.",
  },
  {
    id: "tech-4",
    title: "Sitemap found",
    severity: "pass",
    description: "XML sitemap detected at /sitemap.xml with 47 URLs.",
  },
];

const Dashboard = () => {
  const { scannedURL } = useURL();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch audit data on mount
  useEffect(() => {
    const auditId = localStorage.getItem('lastAuditId');

    if (!auditId) {
      toast({
        title: "NO AUDIT FOUND",
        description: "Please scan a URL first",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    getAuditById(auditId)
      .then(data => {
        if (!data) {
          throw new Error('Audit not found');
        }
        setAuditData(data);
      })
      .catch(error => {
        console.error('Error loading audit:', error);
        toast({
          title: "LOAD FAILED",
          description: "Could not load audit data",
          variant: "destructive"
        });
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [navigate, toast]);

  const handleViewSite = () => {
    if (!auditData) return;

    let formattedURL = auditData.url;
    if (!formattedURL.startsWith('http://') && !formattedURL.startsWith('https://')) {
      formattedURL = `https://${formattedURL}`;
    }
    window.open(formattedURL, '_blank', 'noopener,noreferrer');
  };

  const handleRescan = () => {
    localStorage.removeItem('lastAuditId');
    navigate('/');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="font-mono text-lg">LOADING AUDIT DATA...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!auditData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-lg mb-4">NO AUDIT DATA FOUND</p>
          <button onClick={() => navigate('/')} className="btn-brutal-primary">
            GO HOME
          </button>
        </div>
      </div>
    );
  }

  // Calculate time ago
  const scannedAt = new Date(auditData.scanned_at);
  const minutesAgo = Math.floor((Date.now() - scannedAt.getTime()) / 60000);
  const timeAgo = minutesAgo < 1 ? 'just now' : minutesAgo < 60 ? `${minutesAgo} minutes ago` : `${Math.floor(minutesAgo / 60)} hours ago`;

  // Calculate issue counts
  const allIssues = [
    ...auditData.performance_issues,
    ...auditData.seo_issues,
    ...auditData.accessibility_issues,
    ...auditData.technical_issues
  ];
  const criticalCount = allIssues.filter(i => i.severity === 'error').length;
  const warningCount = allIssues.filter(i => i.severity === 'warning').length;
  const passCount = allIssues.filter(i => i.severity === 'pass').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Dashboard Header */}
      <section className="border-b-[3px] border-foreground px-4 pb-8 pt-28 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 font-mono text-sm font-bold transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO HOME
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <motion.div
                className="mb-4 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex h-12 w-12 items-center justify-center border-[3px] border-foreground bg-primary">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
                    {auditData.url}
                  </h1>
                  <p className="font-mono text-sm text-muted-foreground">
                    Scanned {timeAgo}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex gap-3">
              <motion.button
                className="btn-brutal flex items-center gap-2 bg-card"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewSite}
              >
                <ExternalLink className="h-4 w-4" />
                VIEW SITE
              </motion.button>
              <motion.button
                className="btn-brutal-primary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRescan}
              >
                <RefreshCw className="h-4 w-4" />
                RE-SCAN
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Score Hero */}
      <section className="border-b-[3px] border-foreground bg-foreground px-4 py-12 text-background">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            className="sticker mb-6 inline-block border-background bg-accent"
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: 1, rotate: 2 }}
          >
            OVERALL SCORE
          </motion.div>

          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <span className="font-mono text-[120px] font-bold leading-none text-primary md:text-[180px]">
              {auditData.overall_score}
            </span>
            <span className="absolute -right-8 top-4 font-mono text-3xl text-muted md:-right-12 md:text-4xl">
              /100
            </span>
          </motion.div>

          <motion.p
            className="mt-4 font-mono text-lg text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            NEEDS IMPROVEMENT — LET'S FIX THIS
          </motion.p>
        </div>
      </section>

      <Marquee text={`SCANNING COMPLETE • ${criticalCount} CRITICAL ISSUES • ${warningCount} WARNINGS • ${passCount} PASSED CHECKS`} />

      {/* Score Cards Grid */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold uppercase tracking-tight md:text-3xl">
            BREAKDOWN
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SEOScoreCard
              score={auditData.performance_score}
              label="PERFORMANCE"
              change={0}
              color="primary"
              delay={0}
            />
            <SEOScoreCard
              score={auditData.accessibility_score}
              label="A11Y"
              change={0}
              color="secondary"
              delay={0.1}
            />
            <SEOScoreCard
              score={auditData.seo_score}
              label="ON-PAGE SEO"
              change={0}
              color="accent"
              delay={0.2}
            />
            <SEOScoreCard
              score={auditData.technical_score}
              label="TECHNICAL"
              change={0}
              color="destructive"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Audit Details */}
      <section className="border-t-[3px] border-foreground px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold uppercase tracking-tight md:text-3xl">
            DETAILED AUDIT
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <AuditCard
              title="Performance"
              icon={<Gauge className="h-5 w-5" />}
              issues={auditData.performance_issues}
              delay={0}
            />
            <AuditCard
              title="On-Page SEO"
              icon={<FileText className="h-5 w-5" />}
              issues={auditData.seo_issues}
              delay={0.1}
            />
            <AuditCard
              title="Accessibility"
              icon={<Eye className="h-5 w-5" />}
              issues={auditData.accessibility_issues}
              delay={0.2}
            />
            <AuditCard
              title="Technical SEO"
              icon={<Code className="h-5 w-5" />}
              issues={auditData.technical_issues}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-t-[3px] border-foreground bg-card px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Link2 className="h-5 w-5" />, label: "Internal Links", value: auditData.internal_links_count.toString() },
              { icon: <Image className="h-5 w-5" />, label: "Images", value: auditData.images_count.toString() },
              { icon: <FileText className="h-5 w-5" />, label: "Words", value: auditData.word_count.toLocaleString() },
              { icon: <Shield className="h-5 w-5" />, label: "Security Score", value: auditData.security_grade },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-4 border-[3px] border-foreground bg-background p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex h-10 w-10 items-center justify-center border-[2px] border-foreground bg-primary">
                  {stat.icon}
                </div>
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
