import { motion } from "framer-motion";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ANALYZE", path: "/dashboard" },
    { label: "DOCS", path: "#", external: true },
  ];

  const handleStartFree = () => {
    if (location.pathname === "/") {
      // Scroll to URL input if on home page
      const urlInput = document.getElementById("url-input-section");
      urlInput?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // Navigate to home page first
      navigate("/");
      // Wait for navigation then scroll
      setTimeout(() => {
        const urlInput = document.getElementById("url-input-section");
        urlInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
    setIsMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-40 border-b-[3px] border-foreground bg-background"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center border-[3px] border-foreground bg-primary transition-transform group-hover:rotate-12">
            <span className="font-mono text-lg font-bold">K</span>
          </div>
          <span className="font-mono text-xl font-bold tracking-tighter">KORAT</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            item.external ? (
              <a
                key={item.label}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-bold tracking-wide transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.path}
                className={`font-mono text-sm font-bold tracking-wide transition-colors hover:text-primary ${location.pathname === item.path ? "text-primary" : ""
                  }`}
              >
                {item.label}
              </Link>
            )
          ))}
          {!isAuthenticated && (
            <motion.button
              className="btn-brutal-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartFree}
            >
              START FREE
            </motion.button>
          )}
          <motion.button
            className={isAuthenticated ? "btn-brutal bg-card flex items-center gap-2" : "btn-brutal-accent flex items-center gap-2"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAuthAction}
          >
            {isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                <span>LOGOUT</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>LOGIN</span>
              </>
            )}
          </motion.button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="flex h-10 w-10 items-center justify-center border-[3px] border-foreground md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="border-t-[3px] border-foreground bg-background md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.label}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-[2px] border-foreground p-3 font-mono text-sm font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className="border-[2px] border-foreground p-3 font-mono text-sm font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            {!isAuthenticated && (
              <button className="btn-brutal-primary mt-2" onClick={handleStartFree}>
                START FREE
              </button>
            )}
            <button
              className={isAuthenticated ? "btn-brutal bg-card mt-2" : "btn-brutal-accent mt-2"}
              onClick={handleAuthAction}
            >
              {isAuthenticated ? "LOGOUT" : "LOGIN"}
            </button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
