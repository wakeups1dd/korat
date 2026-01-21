import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { label: "X", icon: Twitter, href: "https://twitter.com" },
    { label: "GH", icon: Github, href: "https://github.com" },
    { label: "LI", icon: Linkedin, href: "https://linkedin.com" },
  ];

  return (
    <footer className="border-t-[3px] border-foreground bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo section */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center border-[3px] border-background bg-primary text-primary-foreground">
                <span className="font-mono text-xl font-bold">K</span>
              </div>
              <span className="font-mono text-2xl font-bold tracking-tighter">KORAT</span>
            </div>
            <p className="max-w-sm font-mono text-sm text-muted">
              The SEO tool for people who hate SEO tools. Raw. Fast. Brutally honest.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-mono text-sm font-bold uppercase">Product</h4>
            <ul className="space-y-2 font-mono text-sm text-muted">
              <li><a href="#features" className="transition-colors hover:text-primary">Features</a></li>
              <li><a href="#pricing" className="transition-colors hover:text-primary">Pricing</a></li>
              <li><a href="#api" className="transition-colors hover:text-primary">API</a></li>
              <li><a href="#changelog" className="transition-colors hover:text-primary">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-sm font-bold uppercase">Company</h4>
            <ul className="space-y-2 font-mono text-sm text-muted">
              <li><a href="#about" className="transition-colors hover:text-primary">About</a></li>
              <li><a href="#blog" className="transition-colors hover:text-primary">Blog</a></li>
              <li><a href="#contact" className="transition-colors hover:text-primary">Contact</a></li>
              <li><a href="#privacy" className="transition-colors hover:text-primary">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t-[2px] border-muted/30 pt-8 md:flex-row">
          <p className="font-mono text-xs text-muted">
            © 2025 KORAT. Built with rage against bad SEO.
          </p>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center border-[2px] border-muted font-mono text-xs font-bold transition-colors hover:border-primary hover:text-primary"
                aria-label={social.label}
              >
                {social.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
