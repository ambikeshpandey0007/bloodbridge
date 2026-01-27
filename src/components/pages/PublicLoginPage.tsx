import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BaseCrudService } from '@/integrations';
import { PublicUsers } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function PublicLoginPage() {
  const navigate = useNavigate();
  const { setUserType } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
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
    }
  }, [step, timeLeft]);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Search for user with this phone number
      const result = await BaseCrudService.getAll<PublicUsers>('publicusers');
      const user = result.items.find(u => u.mobileNumber === mobileNumber);

      if (!user) {
        setError('यह phone number registered नहीं है। पहले register करें।');
        setIsLoading(false);
        return;
      }

      // Generate OTP
      const generatedOtp = generateOtp();
      
      // Store OTP temporarily
      sessionStorage.setItem('loginOtp', generatedOtp);
      sessionStorage.setItem('loginUserId', user._id);
      sessionStorage.setItem('loginMobileNumber', mobileNumber);
      
      // For demo purposes, show OTP in console
      console.log('Login OTP for testing:', generatedOtp);
      
      // Move to OTP verification step
      setUserId(user._id);
      setStep('otp');
      setTimeLeft(300); // 5 minutes
    } catch (err) {
      setError('कुछ गलती हुई। कृपया फिर से कोशिश करें।');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const storedOtp = sessionStorage.getItem('loginOtp');

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
      setUserType('public', userId);
      
      // Clear session storage
      sessionStorage.removeItem('loginOtp');
      sessionStorage.removeItem('loginUserId');
      sessionStorage.removeItem('loginMobileNumber');

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
    const generatedOtp = generateOtp();
    sessionStorage.setItem('loginOtp', generatedOtp);
    console.log('New Login OTP for testing:', generatedOtp);
    setTimeLeft(300);
    setOtp('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-[100rem] mx-auto px-8 py-16 min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Public Login
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              {step === 'phone' ? 'अपने phone number से login करें' : 'अपने mobile number पर भेजा गया OTP दर्ज करें'}
            </p>
          </div>

          <div className="bg-pastelbeige p-10 rounded-2xl">
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
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
                  <Label htmlFor="mobileNumber" className="font-paragraph text-base text-secondary mb-2 block">
                    Mobile Number *
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="font-paragraph text-base"
                    placeholder="10 अंकों का mobile number"
                    pattern="[0-9]{10}"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-secondary/60 mt-2">
                    आपको एक OTP प्राप्त होगा इस number पर
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'OTP भेजें'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
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
            )}

            <div className="mt-8 space-y-4 border-t border-secondary/20 pt-6">
              {step === 'phone' ? (
                <>
                  <p className="font-paragraph text-sm text-secondary/70 text-center mb-4">
                    अभी registered नहीं हैं?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/public-registration')}
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    अभी Register करें
                  </Button>
                </>
              ) : (
                <>
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
                    onClick={() => {
                      setStep('phone');
                      setError('');
                      setOtp('');
                      setMobileNumber('');
                    }}
                    className="w-full text-secondary/70 hover:text-secondary"
                  >
                    वापस जाएं
                  </Button>
                </>
              )}
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
