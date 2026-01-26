import { useState } from 'react';
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
import { Building2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function HospitalRegistrationPage() {
  const navigate = useNavigate();
  const { setUserType } = useAuthStore();
  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationNumber: '',
    mobileNumber: '',
    email: '',
    address: '',
    contactPerson: '',
    isBloodBank: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newHospital: Hospitals = {
      _id: crypto.randomUUID(),
      hospitalName: formData.hospitalName,
      registrationNumber: formData.registrationNumber,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      address: formData.address,
      contactPerson: formData.contactPerson,
      isBloodBank: formData.isBloodBank,
      isVerified: false,
      verificationDetails: 'Pending government approval verification',
    };

    await BaseCrudService.create('hospitals', newHospital);
    setUserType('hospital', newHospital._id);
    navigate('/hospital-dashboard');
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
              Hospital या Blood Bank के रूप में register करें
            </p>
          </div>

          <div className="bg-pastelgreen p-10 rounded-2xl">
            <Alert className="mb-6 border-destructive bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive font-paragraph">
                केवल सरकार द्वारा अनुमोदित Hospital और Blood Bank ही register कर सकते हैं। आपका registration सत्यापन के लिए जमा किया जाएगा।
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                />
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
                />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="isBloodBank"
                  checked={formData.isBloodBank}
                  onCheckedChange={(checked) => setFormData({ ...formData, isBloodBank: checked as boolean })}
                />
                <Label htmlFor="isBloodBank" className="font-paragraph text-base text-secondary cursor-pointer">
                  यह एक Blood Bank है
                </Label>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg"
                >
                  Register करें
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="font-paragraph text-sm text-secondary/70">
                * सभी fields अनिवार्य हैं
              </p>
              <p className="font-paragraph text-xs text-secondary/60 mt-2">
                आपका registration सत्यापन के बाद ही सक्रिय होगा
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
