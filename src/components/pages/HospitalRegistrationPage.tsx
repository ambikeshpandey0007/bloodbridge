import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BaseCrudService } from '@/integrations';
import { Hospitals } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, AlertCircle, Copy, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function HospitalRegistrationPage() {
  const navigate = useNavigate();
  const { setUserType } = useAuthStore();
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationNumber: '',
    mobileNumber: '',
    email: '',
    address: '',
    contactPerson: '',
    isBloodBank: false,
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if mobile number already exists
      const result = await BaseCrudService.getAll<Hospitals>('hospitals');
      const existingHospital = result.items.find(h => h.mobileNumber === formData.mobileNumber);
      
      if (existingHospital) {
        setError('यह mobile number पहले से registered है।');
        setIsLoading(false);
        return;
      }

      // Generate OTP
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      
      // Store registration data and OTP temporarily
      sessionStorage.setItem('hospitalRegistrationOtp', newOtp);
      sessionStorage.setItem('hospitalRegistrationData', JSON.stringify(formData));
      sessionStorage.setItem('hospitalRegistrationOtpTime', Date.now().toString());
      
      // Move to OTP verification step
      setStep('otp');
      setTimeLeft(300); // 5 minutes
      setShowOtpModal(true);
      
      // Start timer
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
      otpTimerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (otpTimerRef.current) clearInterval(otpTimerRef.current);
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
      const storedOtp = sessionStorage.getItem('hospitalRegistrationOtp');
      const registrationDataStr = sessionStorage.getItem('hospitalRegistrationData');

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

      // OTP verified - create hospital with pending verification status
      const registrationData = JSON.parse(registrationDataStr);
      const newHospital: Hospitals = {
        _id: crypto.randomUUID(),
        hospitalName: registrationData.hospitalName,
        registrationNumber: registrationData.registrationNumber,
        mobileNumber: registrationData.mobileNumber,
        email: registrationData.email,
        address: registrationData.address,
        contactPerson: registrationData.contactPerson,
        isBloodBank: registrationData.isBloodBank,
        isVerified: false,
        verificationDetails: 'Pending government approval verification',
      };

      await BaseCrudService.create('hospitals', newHospital);
      
      // Clear session storage
      sessionStorage.removeItem('hospitalRegistrationOtp');
      sessionStorage.removeItem('hospitalRegistrationData');
      sessionStorage.removeItem('hospitalRegistrationOtpTime');
      
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);

      // Show success screen
      setStep('success');
      setShowOtpModal(false);
    } catch (err) {
      setError('कुछ गलती हुई। कृपया फिर से कोशिश करें।');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    sessionStorage.setItem('hospitalRegistrationOtp', newOtp);
    sessionStorage.setItem('hospitalRegistrationOtpTime', Date.now().toString());
    setTimeLeft(300);
    setOtp('');
    setError('');
    setCopiedOtp(false);
  };

  const copyOtpToClipboard = () => {
    navigator.clipboard.writeText(generatedOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <Building2 className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Hospital Registration
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              {step === 'form' ? 'Hospital या Blood Bank के रूप में register करें' : step === 'otp' ? 'अपने mobile number पर भेजा गया OTP दर्ज करें' : 'Registration सफल!'}
            </p>
          </div>

          <div className="bg-pastelgreen p-10 rounded-2xl">
            {step === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-6"
              >
                <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <div>
                  <h2 className="font-heading text-3xl text-secondary mb-3">
                    Registration सफल!
                  </h2>
                  <p className="font-paragraph text-lg text-secondary/80 mb-6">
                    आपका Hospital registration सफलतापूर्वक submit हो गया है।
                  </p>
                </div>

                <Alert className="border-primary bg-primary/10">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-primary font-paragraph text-base">
                    ⏳ आपका Hospital अभी सत्यापन के लिए लंबित है। Developer द्वारा CMS dashboard से सत्यापन के बाद ही आप login कर सकेंगे।
                  </AlertDescription>
                </Alert>

                <div className="bg-background p-6 rounded-lg space-y-3">
                  <p className="font-paragraph text-sm text-secondary/70">
                    सत्यापन के बाद आपको निम्नलिखित मिलेगा:
                  </p>
                  <ul className="space-y-2 text-left">
                    <li className="font-paragraph text-sm text-secondary flex items-start gap-2">
                      <span className="text-primary font-bold">✓</span>
                      <span>Hospital Login ID</span>
                    </li>
                    <li className="font-paragraph text-sm text-secondary flex items-start gap-2">
                      <span className="text-primary font-bold">✓</span>
                      <span>Temporary Password</span>
                    </li>
                    <li className="font-paragraph text-sm text-secondary flex items-start gap-2">
                      <span className="text-primary font-bold">✓</span>
                      <span>Dashboard तक पूरी पहुंच</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => navigate('/')}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg py-6"
                >
                  Home पर जाएं
                </Button>
              </motion.div>
            ) : (
              <>
                <Alert className="mb-6 border-destructive bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive font-paragraph">
                    केवल सरकार द्वारा अनुमोदित Hospital और Blood Bank ही register कर सकते हैं। आपका registration सत्यापन के लिए जमा किया जाएगा।
                  </AlertDescription>
                </Alert>

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
                      <Label htmlFor="hospitalName" className="font-paragraph text-base text-secondary mb-2 block">
                        Hospital/Blood Bank का नाम *
                      </Label>
                      <Input
                        id="hospitalName"
                        type="text"
                        required
                        value={formData.hospitalName}
                        onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                        className="font-paragraph text-base"
                        placeholder="Hospital या Blood Bank का नाम"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="registrationNumber" className="font-paragraph text-base text-secondary mb-2 block">
                        Government Registration Number *
                      </Label>
                      <Input
                        id="registrationNumber"
                        type="text"
                        required
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        className="font-paragraph text-base"
                        placeholder="सरकार द्वारा जारी registration number"
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
                      <Label htmlFor="email" className="font-paragraph text-base text-secondary mb-2 block">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="font-paragraph text-base"
                        placeholder="hospital@example.com"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="font-paragraph text-base text-secondary mb-2 block">
                        पता *
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="font-paragraph text-base"
                        placeholder="पूरा पता"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPerson" className="font-paragraph text-base text-secondary mb-2 block">
                        Contact Person का नाम *
                      </Label>
                      <Input
                        id="contactPerson"
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="font-paragraph text-base"
                        placeholder="संपर्क व्यक्ति का नाम"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="isBloodBank"
                        checked={formData.isBloodBank}
                        onCheckedChange={(checked) => setFormData({ ...formData, isBloodBank: checked as boolean })}
                        disabled={isLoading}
                      />
                      <Label htmlFor="isBloodBank" className="font-paragraph text-base text-secondary cursor-pointer">
                        यह एक Blood Bank है
                      </Label>
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
                ) : null}
              </>
            )}

            {step === 'form' && (
              <div className="mt-6 text-center">
                <p className="font-paragraph text-sm text-secondary/70">
                  * सभी fields अनिवार्य हैं
                </p>
                <p className="font-paragraph text-xs text-secondary/60 mt-2">
                  आपका registration सत्यापन के बाद ही सक्रिय होगा
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* OTP Modal Dialog */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-secondary">
              OTP Verification
            </DialogTitle>
            <DialogDescription className="font-paragraph text-base text-secondary/70">
              अपने mobile number पर भेजा गया 6-digit OTP दर्ज करें
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive rounded-lg p-3 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="font-paragraph text-xs text-destructive">{error}</p>
              </motion.div>
            )}

            {/* OTP Display Box - Secure, not in DOM */}
            <div className="bg-background p-4 rounded-lg border-2 border-primary/20">
              <p className="font-paragraph text-xs text-secondary/60 mb-2">
                आपका OTP:
              </p>
              <div className="flex items-center justify-between gap-3">
                <div className="font-heading text-3xl text-primary tracking-widest font-bold">
                  {generatedOtp}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyOtpToClipboard}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  {copiedOtp ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="otp" className="font-paragraph text-base text-secondary mb-2 block">
                6-Digit OTP दर्ज करें *
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

            <div className="space-y-3">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || timeLeft === 0 || otp.length !== 6}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="w-full border-primary text-primary hover:bg-primary/10"
              >
                OTP फिर से भेजें
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep('form');
                  setError('');
                  setOtp('');
                  setShowOtpModal(false);
                  if (otpTimerRef.current) clearInterval(otpTimerRef.current);
                }}
                className="w-full text-secondary/70 hover:text-secondary"
              >
                वापस जाएं
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
