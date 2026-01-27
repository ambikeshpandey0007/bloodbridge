import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { PublicUsers } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserPlus, AlertCircle, CheckCircle, Copy, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function PublicRegistrationPage() {
  const navigate = useNavigate();
  const { setUserType } = useAuthStore();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    aadharNumber: '',
    bloodGroup: '',
    age: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const copyOtpToClipboard = () => {
    navigator.clipboard.writeText(generatedOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if mobile number already exists
      const result = await BaseCrudService.getAll<PublicUsers>('publicusers');
      const existingUserByMobile = result.items.find(u => u.mobileNumber === formData.mobileNumber);
      
      if (existingUserByMobile) {
        setError('यह mobile number पहले से registered है।');
        setIsLoading(false);
        return;
      }

      // Check if Aadhar number already exists
      const existingUserByAadhar = result.items.find(u => u.aadharNumber === formData.aadharNumber);
      
      if (existingUserByAadhar) {
        setError('यह Aadhar number पहले से registered है।');
        setIsLoading(false);
        return;
      }

      // Generate OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      
      // Store registration data and OTP temporarily
      sessionStorage.setItem('registrationOtp', newOtp);
      sessionStorage.setItem('registrationData', JSON.stringify(formData));
      sessionStorage.setItem('registrationOtpTime', Date.now().toString());
      
      // For demo: show OTP in console
      console.log('Registration OTP for testing:', newOtp);
      
      // Show OTP popup
      setShowOtpPopup(true);
      
      // Move to OTP verification step
      setStep('otp');
      setTimeLeft(300); // 5 minutes
      
      // Start timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
      const storedOtp = sessionStorage.getItem('registrationOtp');
      const registrationDataStr = sessionStorage.getItem('registrationData');

      if (timeLeft === 0) {
        setError('OTP की validity समाप्त हो गई है। फिर से registration करें।');
        setIsLoading(false);
        return;
      }

      if (otp !== storedOtp) {
        setError('गलत OTP। कृपया फिर से कोशिश करें।');
        setIsLoading(false);
        return;
      }

      if (!registrationDataStr) {
        setError('Registration data खो गया। फिर से कोशिश करें।');
        setIsLoading(false);
        return;
      }

      // OTP verified - create user
      const registrationData = JSON.parse(registrationDataStr);
      const newUser: PublicUsers = {
        _id: crypto.randomUUID(),
        fullName: registrationData.fullName,
        mobileNumber: registrationData.mobileNumber,
        aadharNumber: registrationData.aadharNumber,
        bloodGroup: registrationData.bloodGroup,
        age: parseInt(registrationData.age),
        totalDonations: 0,
      };

      await BaseCrudService.create('publicusers', newUser);
      
      // Clear session storage
      sessionStorage.removeItem('registrationOtp');
      sessionStorage.removeItem('registrationData');
      sessionStorage.removeItem('registrationOtpTime');

      setUserType('public', newUser._id);
      navigate('/public-dashboard');
    } catch (err) {
      setError('कुछ गलती हुई। कृपया फिर से कोशिश करें।');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    sessionStorage.setItem('registrationOtp', newOtp);
    sessionStorage.setItem('registrationOtpTime', Date.now().toString());
    console.log('New Registration OTP for testing:', newOtp);
    setShowOtpPopup(true);
    setCopiedOtp(false);
    setTimeLeft(300);
    setOtp('');
    setError('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                  {generatedOtp}
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
              <UserPlus className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Public Registration
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              {step === 'form' ? 'Donor या Receiver के रूप में register करें' : 'अपने mobile number पर भेजा गया OTP दर्ज करें'}
            </p>
          </div>

          <div className="bg-pastelbeige p-10 rounded-2xl">
            {step === 'form' ? (
              <form onSubmit={handleFormSubmit} className="space-y-6">
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
                  <Label htmlFor="fullName" className="font-paragraph text-base text-secondary mb-2 block">
                    पूरा नाम *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="font-paragraph text-base"
                    placeholder="अपना पूरा नाम दर्ज करें"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="mobileNumber" className="font-paragraph text-base text-secondary mb-2 block">
                    Mobile Number *
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="font-paragraph text-base"
                    placeholder="10 अंकों का mobile number"
                    pattern="[0-9]{10}"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-secondary/60 mt-2">
                    आपको एक OTP प्राप्त होगा इस number पर
                  </p>
                </div>

                <div>
                  <Label htmlFor="aadharNumber" className="font-paragraph text-base text-secondary mb-2 block">
                    Aadhar Number *
                  </Label>
                  <Input
                    id="aadharNumber"
                    type="text"
                    required
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                    className="font-paragraph text-base"
                    placeholder="12 अंकों का Aadhar number"
                    pattern="[0-9]{12}"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="bloodGroup" className="font-paragraph text-base text-secondary mb-2 block">
                    Blood Group *
                  </Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="font-paragraph text-base">
                      <SelectValue placeholder="अपना blood group चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="age" className="font-paragraph text-base text-secondary mb-2 block">
                    उम्र *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    required
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="font-paragraph text-base"
                    placeholder="आपकी उम्र"
                    disabled={isLoading}
                  />
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
              {step === 'otp' && (
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
                      setStep('form');
                      setError('');
                      setOtp('');
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
