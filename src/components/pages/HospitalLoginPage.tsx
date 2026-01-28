import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BaseCrudService } from '@/integrations';
import { Hospitals } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore';

export default function HospitalLoginPage() {
  const navigate = useNavigate();
  const { setUserType } = useAuthStore();
  const [formData, setFormData] = useState({
    registrationNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Fetch all hospitals
      const result = await BaseCrudService.getAll<Hospitals>('hospitals');
      
      // Find hospital by registration number
      const hospital = result.items.find(
        h => h.registrationNumber === formData.registrationNumber
      );

      if (!hospital) {
        setError('Registration number नहीं मिला। कृपया सही number दर्ज करें।');
        setIsLoading(false);
        return;
      }

      // Check if hospital is verified
      if (!hospital.isVerified) {
        setError('आपका Hospital अभी सत्यापन के लिए लंबित है। कृपया सत्यापन के बाद login करें।');
        setIsLoading(false);
        return;
      }

      // Verify password - should be UPBB + registration number
      const expectedPassword = `UPBB${formData.registrationNumber}`;
      if (formData.password !== expectedPassword) {
        setError('गलत password। कृपया फिर से कोशिश करें।');
        setIsLoading(false);
        return;
      }

      // Login successful
      setUserType('hospital', hospital._id);
      navigate('/hospital-dashboard');
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
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-12">
            <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Hospital Login
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              अपने Hospital account में login करें
            </p>
          </div>

          <div className="bg-pastelgreen p-10 rounded-2xl">
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
                  placeholder="आपका registration number"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="font-paragraph text-base text-secondary mb-2 block">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="font-paragraph text-base pr-10"
                    placeholder="आपका password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60 hover:text-secondary"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-secondary/60 mt-2">
                  Password: UPBB + आपका registration number
                </p>
              </div>

              <Alert className="bg-pastelbeige border-none">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="font-paragraph text-sm text-secondary">
                  💡 आपका password है: <strong>UPBB</strong> + आपका <strong>Registration Number</strong>
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg py-6 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-paragraph text-sm text-secondary/70">
                अभी Hospital नहीं हैं?{' '}
                <button
                  onClick={() => navigate('/hospital-registration')}
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  Register करें
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
