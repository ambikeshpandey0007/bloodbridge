import { useState } from 'react';
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
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Generate OTP (in real app, this would be sent via SMS)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP temporarily in sessionStorage
      sessionStorage.setItem('otp', otp);
      sessionStorage.setItem('otpUserId', user._id);
      sessionStorage.setItem('otpMobileNumber', mobileNumber);
      
      // For demo purposes, show OTP in console
      console.log('OTP for testing:', otp);
      
      // Navigate to OTP verification page
      navigate('/public-login-otp');
    } catch (err) {
      setError('कुछ गलती हुई। कृपया फिर से कोशिश करें।');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
              अपने phone number से login करें
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

            <div className="mt-8 text-center border-t border-secondary/20 pt-6">
              <p className="font-paragraph text-sm text-secondary/70 mb-4">
                अभी registered नहीं हैं?
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/public-registration')}
                className="w-full border-primary text-primary hover:bg-primary/10"
              >
                अभी Register करें
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
