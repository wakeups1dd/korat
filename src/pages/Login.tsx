import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Zap, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                toast({
                    title: "LOGIN SUCCESSFUL",
                    description: "Welcome back to KORAT!",
                });
                navigate("/");
            } else {
                toast({
                    title: "LOGIN FAILED",
                    description: "Invalid credentials. Try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "ERROR",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Main login card */}
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo/Branding */}
                <Link to="/" className="group mb-8 flex items-center justify-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center border-[3px] border-foreground bg-primary transition-transform group-hover:rotate-12">
                        <span className="font-mono text-3xl font-bold">K</span>
                    </div>
                    <span className="font-mono text-4xl font-bold tracking-tighter">KORAT</span>
                </Link>

                {/* Glitch title */}
                <motion.div
                    className="mb-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="sticker mb-4 bg-accent text-accent-foreground">
                        SECURE ACCESS
                    </div>
                    <h1 className="glitch text-4xl font-bold uppercase tracking-tight md:text-5xl">
                        WELCOME BACK
                    </h1>
                    <p className="mt-2 font-mono text-sm text-muted-foreground">
                        Enter your credentials to break some SEO
                    </p>
                </motion.div>

                {/* Login form */}
                <motion.div
                    className="card-brutal p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email input */}
                        <div>
                            <label className="mb-2 block font-mono text-sm font-bold uppercase">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="input-brutal w-full pl-12"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password input */}
                        <div>
                            <label className="mb-2 block font-mono text-sm font-bold uppercase">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-brutal w-full pl-12 pr-12"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password link */}
                        <div className="flex justify-end">
                            <a
                                href="#"
                                className="font-mono text-sm font-bold text-accent hover:underline"
                            >
                                FORGOT PASSWORD?
                            </a>
                        </div>

                        {/* Submit button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="btn-brutal-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                <>
                                    <Zap className="h-5 w-5 animate-pulse" />
                                    <span>LOGGING IN...</span>
                                </>
                            ) : (
                                <>
                                    <span>LOGIN</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-foreground"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-card px-4 font-mono text-xs font-bold uppercase">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Social login buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            className="btn-brutal w-full bg-card hover:bg-muted"
                            onClick={() => toast({ title: "Coming Soon", description: "Google login will be available soon!" })}
                        >
                            CONTINUE WITH GOOGLE
                        </button>
                        <button
                            type="button"
                            className="btn-brutal w-full bg-card hover:bg-muted"
                            onClick={() => toast({ title: "Coming Soon", description: "GitHub login will be available soon!" })}
                        >
                            CONTINUE WITH GITHUB
                        </button>
                    </div>
                </motion.div>

                {/* Sign up link */}
                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="font-mono text-sm">
                        DON'T HAVE AN ACCOUNT?{" "}
                        <Link to="/signup" className="font-bold text-accent hover:underline">
                            SIGN UP
                        </Link>
                    </p>
                </motion.div>

                {/* Footer badge */}
                <motion.div
                    className="mt-8 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="tag-brutal bg-primary text-primary-foreground">
                        SECURED BY KORAT
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
