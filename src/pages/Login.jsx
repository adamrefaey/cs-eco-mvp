import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { auth } from '@/api/auth';
import GoogleSignIn from '@/components/GoogleSignIn';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleGoogleSuccess = (userData) => {
    setSuccess('Google login successful! Redirecting...');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleGoogleError = (error) => {
    setError('Google sign-in failed. Please try again.');
    console.error('Google Sign-In Error:', error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await auth.login(formData.email, formData.password);
      setSuccess('Login successful! Redirecting...');
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Use real authentication with demo credentials
      const result = await auth.login('admin@lumanagi.com', 'demo123');
      setSuccess('Demo login successful! Redirecting...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#0f0520] to-[#1a0b2e] flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#3B82F6]/40 mx-auto mb-4"
          >
            <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Lumanagi</h1>
          <p className="text-white/60 text-sm">Intelligence Agent Login</p>
        </div>

        {/* Login Form */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl">Welcome Back</CardTitle>
            <CardDescription className="text-white/60">
              Sign in to access the Intelligence Agent system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#3B82F6]/50 focus:bg-white/10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#3B82F6]/50 focus:bg-white/10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:from-[#2563EB] hover:to-[#4F46E5] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-white/60">Or continue with</span>
              </div>
            </div>

            <GoogleSignIn 
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-white/60">Or try demo</span>
              </div>
            </div>

            <Button
              onClick={handleDemoLogin}
              disabled={loading}
              variant="outline"
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Demo Login
              </div>
            </Button>

            <div className="text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/register')}
                  className="text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-xs">
            Protected by enterprise-grade security • ISO 27001 Compliant
          </p>
        </div>
      </motion.div>
    </div>
  );
}