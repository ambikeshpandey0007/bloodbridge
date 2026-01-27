import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, AlertCircle, ArrowLeft, CheckCircle, Copy, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function PublicLoginOTPPage() {
  const navigate = useNavigate();
  const { setUserType } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [displayedOtp, setDisplayedOtp] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);

  useEffect(() => {
    // Get mobile number from sessionStorage
    const storedMobile = sessionStorage.getItem('otpMobileNumber');
    if (!storedMobile) {
      navigate('/public-login');
      return;
    }
    setMobileNumber(storedMobile);

    // Get OTP and show popup
    const storedOtp = sessionStorage.getItem('otp');
    if (storedOtp) {
      setDisplayedOtp(storedOtp);
      setShowOtpPopup(true);
    }

    // Timer for OTP expiry
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const storedOtp = sessionStorage.getItem('otp');
      const userId = sessionStorage.getItem('otpUserId');

      if (timeLeft === 0) {
        setError('OTP की validity समाप्त हो गई है। फिर से login करें।');
        setIsLoading(false);
        return;
      }

      if (otp !== storedOtp) {
        setError('गलत OTP। कृपया फिर से कोशिश करें।');
        setIsLoading(false);
        return;
      }

      // OTP verified successfully
      setUserType('public', userId || undefined);
      
      // Clear OTP from sessionStorage
      sessionStorage.removeItem('otp');
      sessionStorage.removeItem('otpUserId');
      sessionStorage.removeItem('otpMobileNumber');

      // Navigate to dashboard
      navigate('/public-dashboard');
    } catch (err) {
      setError('कुछ गलती हुई। कृपया फिर से कोशिश करें।');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('otp', newOtp);
    setDisplayedOtp(newOtp);
    setShowOtpPopup(true);
    setCopiedOtp(false);
    console.log('New OTP for testing:', newOtp);
    setTimeLeft(300);
    setOtp('');
    setError('');
  };

  const copyOtpToClipboard = () => {
    navigator.clipboard.writeText(displayedOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* OTP Popup */}
      <AnimatePresence>
        {showOtpPopup && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 right-6 z-50 max-w-sm"
          >
            <div className="bg-white border-2 border-primary rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg text-secondary">OTP भेजा गया</h3>
                </div>
                <button
                  onClick={() => setShowOtpPopup(false)}
                  className="text-secondary/50 hover:text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="font-paragraph text-sm text-secondary/70 mb-4">
                आपके mobile number पर OTP भेजा गया है
              </p>
              
              <div className="bg-pastelbeige p-4 rounded-lg mb-4 flex items-center justify-between">
                <span className="font-heading text-3xl text-primary tracking-widest">
                  {displayedOtp}
                </span>
                <button
                  onClick={copyOtpToClipboard}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-lg transition-colors"
                  title="Copy OTP"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              
              {copiedOtp && (
                <p className="font-paragraph text-xs text-primary text-center">
                  ✓ OTP copied!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-[100rem] mx-auto px-8 py-16 min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              OTP Verification
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              {mobileNumber} पर भेजा गया OTP दर्ज करें
            </p>
          </div>

          <div className="bg-pastelbeige p-10 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="font-paragraph text-sm text-destructive">{error}</p>
                </motion.div>
              )}

              <div>
                <Label htmlFor="otp" className="font-paragraph text-base text-secondary mb-2 block">
                  6-Digit OTP *
                </Label>
                <Input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="font-paragraph text-base text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  disabled={isLoading || timeLeft === 0}
                />
                <p className="text-xs text-secondary/60 mt-2">
                  OTP की validity: {formatTime(timeLeft)}
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || timeLeft === 0 || otp.length !== 6}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            </form>

            <div className="mt-8 space-y-4 border-t border-secondary/20 pt-6">
              <div className="text-center">
                <p className="font-paragraph text-sm text-secondary/70 mb-3">
                  OTP नहीं मिला?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="w-full border-primary text-primary hover:bg-primary/10"
                >
                  OTP फिर से भेजें
                </Button>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/public-login')}
                className="w-full text-secondary/70 hover:text-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस जाएं
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="font-paragraph text-xs text-secondary/60">
                Demo के लिए: OTP console में दिखेगा (F12 खोलें)
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
