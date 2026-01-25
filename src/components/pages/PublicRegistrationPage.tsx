import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { PublicUsers } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserPlus } from 'lucide-react';

export default function PublicRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    aadharNumber: '',
    bloodGroup: '',
    age: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: PublicUsers = {
      _id: crypto.randomUUID(),
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      aadharNumber: formData.aadharNumber,
      bloodGroup: formData.bloodGroup,
      age: parseInt(formData.age),
      totalDonations: 0,
    };

    await BaseCrudService.create('publicusers', newUser);
    navigate('/public-dashboard');
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
              <UserPlus className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Public Registration
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              Donor या Receiver के रूप में register करें
            </p>
          </div>

          <div className="bg-pastelbeige p-10 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                />
              </div>

              <div>
                <Label htmlFor="bloodGroup" className="font-paragraph text-base text-secondary mb-2 block">
                  Blood Group *
                </Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                  required
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
                />
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
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
