import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Zap, ArrowRight, Eye, EyeOff, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "PASSWORD MISMATCH",
                description: "Passwords don't match. Try again.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // In a real app, you'd call your signup API here
            // For now, we'll just log them in directly
            const success = await login(email, password);
            if (success) {
                toast({
                    title: "ACCOUNT CREATED",
                    description: "Welcome to KORAT!",
                });
                navigate("/");
            }
        } catch (error) {
            toast({
                title: "SIGNUP FAILED",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Decorative elements */}
            <motion.div
                className="fixed top-10 right-10 h-20 w-20 border-[3px] border-foreground bg-secondary rotate-12"
                animate={{ rotate: [12, -12, 12] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="fixed bottom-10 left-10 h-16 w-16 border-[3px] border-foreground bg-primary -rotate-12"
                animate={{ rotate: [-12, 12, -12] }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Main signup card */}
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

                {/* Title */}
                <motion.div
                    className="mb-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="sticker mb-4 bg-secondary text-secondary-foreground">
                        JOIN THE SQUAD
                    </div>
                    <h1 className="glitch text-4xl font-bold uppercase tracking-tight md:text-5xl">
                        CREATE ACCOUNT
                    </h1>
                    <p className="mt-2 font-mono text-sm text-muted-foreground">
                        Start breaking SEO in under 60 seconds
                    </p>
                </motion.div>

                {/* Signup form */}
                <motion.div
                    className="card-brutal p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name input */}
                        <div>
                            <label className="mb-2 block font-mono text-sm font-bold uppercase">
                                Your Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="input-brutal w-full pl-12"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

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
                                    minLength={6}
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

                        {/* Confirm Password input */}
                        <div>
                            <label className="mb-2 block font-mono text-sm font-bold uppercase">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-brutal w-full pl-12"
                                    required
                                    disabled={isLoading}
                                    minLength={6}
                                />
                            </div>
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
                                    <span>CREATING ACCOUNT...</span>
                                </>
                            ) : (
                                <>
                                    <span>CREATE ACCOUNT</span>
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

                    {/* Social signup buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            className="btn-brutal w-full bg-card hover:bg-muted"
                            onClick={() => toast({ title: "Coming Soon", description: "Google signup will be available soon!" })}
                        >
                            SIGN UP WITH GOOGLE
                        </button>
                        <button
                            type="button"
                            className="btn-brutal w-full bg-card hover:bg-muted"
                            onClick={() => toast({ title: "Coming Soon", description: "GitHub signup will be available soon!" })}
                        >
                            SIGN UP WITH GITHUB
                        </button>
                    </div>
                </motion.div>

                {/* Login link */}
                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="font-mono text-sm">
                        ALREADY HAVE AN ACCOUNT?{" "}
                        <Link to="/login" className="font-bold text-accent hover:underline">
                            LOGIN
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
                    <div className="tag-brutal bg-secondary text-secondary-foreground">
                        FREE FOREVER
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Signup;
