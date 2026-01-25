import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BaseCrudService } from '@/integrations';
import { SOSAlerts } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AlertCircle } from 'lucide-react';

export default function SOSAlertPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    bloodGroupRequired: '',
    unitsNeeded: '',
    contactMobile: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAlert: SOSAlerts = {
      _id: crypto.randomUUID(),
      patientName: formData.patientName,
      patientAge: parseInt(formData.patientAge),
      bloodGroupRequired: formData.bloodGroupRequired,
      unitsNeeded: parseInt(formData.unitsNeeded),
      contactMobile: formData.contactMobile,
      location: formData.location,
      requestStatus: 'Active',
      requestDateTime: new Date().toISOString(),
    };

    await BaseCrudService.create('sosalerts', newAlert);
    alert('SOS Alert successfully भेजा गया! सभी eligible donors और hospitals को notify किया जाएगा।');
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
            <div className="bg-destructive w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <AlertCircle className="w-10 h-10 text-destructive-foreground" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              SOS Blood Alert
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              Emergency में तुरंत blood की request भेजें
            </p>
          </div>

          <div className="bg-pastelpeach p-10 rounded-2xl">
            <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-8 rounded">
              <p className="font-paragraph text-base text-secondary">
                <strong>ध्यान दें:</strong> यह alert सभी registered donors और hospitals को भेजा जाएगा। 
                कृपया सही जानकारी दें।
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="patientName" className="font-paragraph text-base text-secondary mb-2 block">
                  Patient का नाम *
                </Label>
                <Input
                  id="patientName"
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="font-paragraph text-base"
                  placeholder="Patient का पूरा नाम"
                />
              </div>

              <div>
                <Label htmlFor="patientAge" className="font-paragraph text-base text-secondary mb-2 block">
                  Patient की उम्र *
                </Label>
                <Input
                  id="patientAge"
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  className="font-paragraph text-base"
                  placeholder="उम्र"
                />
              </div>

              <div>
                <Label htmlFor="bloodGroupRequired" className="font-paragraph text-base text-secondary mb-2 block">
                  Blood Group Required *
                </Label>
                <Select
                  value={formData.bloodGroupRequired}
                  onValueChange={(value) => setFormData({ ...formData, bloodGroupRequired: value })}
                  required
                >
                  <SelectTrigger className="font-paragraph text-base">
                    <SelectValue placeholder="Blood group चुनें" />
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
                <Label htmlFor="unitsNeeded" className="font-paragraph text-base text-secondary mb-2 block">
                  Units Needed *
                </Label>
                <Input
                  id="unitsNeeded"
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.unitsNeeded}
                  onChange={(e) => setFormData({ ...formData, unitsNeeded: e.target.value })}
                  className="font-paragraph text-base"
                  placeholder="कितनी units चाहिए"
                />
              </div>

              <div>
                <Label htmlFor="contactMobile" className="font-paragraph text-base text-secondary mb-2 block">
                  Contact Mobile Number *
                </Label>
                <Input
                  id="contactMobile"
                  type="tel"
                  required
                  value={formData.contactMobile}
                  onChange={(e) => setFormData({ ...formData, contactMobile: e.target.value })}
                  className="font-paragraph text-base"
                  placeholder="10 अंकों का mobile number"
                  pattern="[0-9]{10}"
                />
              </div>

              <div>
                <Label htmlFor="location" className="font-paragraph text-base text-secondary mb-2 block">
                  Location/Hospital Address *
                </Label>
                <Textarea
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="font-paragraph text-base min-h-[100px]"
                  placeholder="पूरा पता जहाँ blood की ज़रूरत है"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-paragraph text-lg"
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  SOS Alert भेजें
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
