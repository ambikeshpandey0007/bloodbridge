import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BaseCrudService } from '@/integrations';
import { Hospitals, BloodStock, SOSAlerts, AlertResponses, DonationHistory } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, Droplet, AlertCircle, Calendar, Plus, Lock } from 'lucide-react';
import { format } from 'date-fns';

export default function HospitalDashboardPage() {
  const [hospital, setHospital] = useState<Hospitals | null>(null);
  const [bloodStocks, setBloodStocks] = useState<BloodStock[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SOSAlerts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [stockForm, setStockForm] = useState({
    bloodGroup: '',
    availableUnits: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactNumber: '',
  });

  const [donationForm, setDonationForm] = useState({
    donorName: '',
    donationDate: '',
    unitsDonated: '',
    donationType: '',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    const hospitalsResult = await BaseCrudService.getAll<Hospitals>('hospitals');
    if (hospitalsResult.items.length > 0) {
      setHospital(hospitalsResult.items[0]);
    }

    const stocksResult = await BaseCrudService.getAll<BloodStock>('bloodstock');
    setBloodStocks(stocksResult.items);

    const alertsResult = await BaseCrudService.getAll<SOSAlerts>('sosalerts');
    setSosAlerts(alertsResult.items.filter(alert => alert.requestStatus === 'Active'));

    setIsLoading(false);
  };

  const handleRespondToAlert = async (alertId: string, canProvide: boolean) => {
    const response: AlertResponses = {
      _id: crypto.randomUUID(),
      sosAlertId: alertId,
      responderType: 'Hospital',
      responderId: hospital?._id || '',
      responseMessage: canProvide ? 'Blood available है' : 'Blood available नहीं है',
      isAvailableToDonate: canProvide,
      responseDate: new Date().toISOString(),
    };

    await BaseCrudService.create('alertresponses', response);
    alert('Response successfully भेजा गया!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-[100rem] mx-auto px-8 py-16 min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Hospital Dashboard
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              Blood stock और requests देखें
            </p>
          </div>

          {isLoading ? null : (
            <>
              {/* Hospital Profile Card */}
              {hospital && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <Card className="bg-pastelgreen border-none">
                    <CardHeader>
                      <CardTitle className="font-heading text-3xl text-secondary flex items-center gap-3">
                        <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-primary-foreground" />
                        </div>
                        {hospital.hospitalName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Registration Number</p>
                          <p className="font-paragraph text-base text-secondary font-semibold">
                            {hospital.registrationNumber}
                          </p>
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Mobile Number</p>
                          <p className="font-paragraph text-base text-secondary">{hospital.mobileNumber}</p>
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Email</p>
                          <p className="font-paragraph text-base text-secondary">{hospital.email}</p>
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Contact Person</p>
                          <p className="font-paragraph text-base text-secondary">{hospital.contactPerson}</p>
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Address</p>
                          <p className="font-paragraph text-base text-secondary">{hospital.address}</p>
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Type</p>
                          <p className="font-paragraph text-base text-secondary font-semibold">
                            {hospital.isBloodBank ? 'Blood Bank' : 'Hospital'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Tabs for different sections */}
              <Tabs defaultValue="stock" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="stock" className="font-paragraph text-base">
                    Blood Stock
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="font-paragraph text-base">
                    SOS Alerts
                  </TabsTrigger>
                </TabsList>

                {/* Blood Stock Tab */}
                <TabsContent value="stock">
                  <Alert className="mb-8 bg-pastelpeach border-destructive/30">
                    <Lock className="h-4 w-4 text-destructive" />
                    <AlertDescription className="font-paragraph text-base text-secondary">
                      Blood stock को edit या update नहीं कर सकते। केवल view कर सकते हैं।
                    </AlertDescription>
                  </Alert>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-pastellavender border-none">
                      <CardHeader>
                        <CardTitle className="font-heading text-2xl text-secondary flex items-center gap-3">
                          <Droplet className="w-6 h-6 text-primary" />
                          Current Stock
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {bloodStocks.length > 0 ? (
                          <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            {bloodStocks.map((stock) => (
                              <div
                                key={stock._id}
                                className="bg-background p-4 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-heading text-xl text-primary font-bold">
                                    {stock.bloodGroup}
                                  </span>
                                  <span className="font-paragraph text-base text-secondary font-semibold">
                                    {stock.availableUnits} units
                                  </span>
                                </div>
                                <p className="font-paragraph text-sm text-secondary/70">
                                  {stock.address}
                                </p>
                                <p className="font-paragraph text-sm text-secondary/70">
                                  {stock.city}, {stock.state} - {stock.zipCode}
                                </p>
                                <p className="font-paragraph text-sm text-secondary/70 mt-1">
                                  Contact: {stock.contactNumber}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="font-paragraph text-base text-secondary/70 text-center py-8">
                            कोई blood stock नहीं है
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* SOS Alerts Tab */}
                <TabsContent value="alerts">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="font-heading text-3xl text-secondary mb-6 flex items-center gap-3">
                      <AlertCircle className="w-8 h-8 text-destructive" />
                      Active SOS Alerts
                    </h2>
                    {sosAlerts.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {sosAlerts.map((alert) => (
                          <Card key={alert._id} className="bg-pastelpeach border-none">
                            <CardHeader>
                              <CardTitle className="font-heading text-xl text-secondary">
                                {alert.patientName} - {alert.patientAge} years
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-paragraph text-sm text-secondary/70">Blood Group:</span>
                                <span className="font-heading text-xl text-destructive font-bold">
                                  {alert.bloodGroupRequired}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-paragraph text-sm text-secondary/70">Units Needed:</span>
                                <span className="font-paragraph text-base text-secondary font-semibold">
                                  {alert.unitsNeeded}
                                </span>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/70 mb-1">Location:</p>
                                <p className="font-paragraph text-sm text-secondary">{alert.location}</p>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/70 mb-1">Contact:</p>
                                <p className="font-paragraph text-base text-secondary font-semibold">
                                  {alert.contactMobile}
                                </p>
                              </div>
                              <div className="flex gap-3 pt-4">
                                <Button
                                  onClick={() => handleRespondToAlert(alert._id, true)}
                                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph"
                                >
                                  Available है
                                </Button>
                                <Button
                                  onClick={() => handleRespondToAlert(alert._id, false)}
                                  variant="outline"
                                  className="flex-1 border-secondary text-secondary hover:bg-secondary/10 font-paragraph"
                                >
                                  Available नहीं
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-pastelgreen border-none">
                        <CardContent className="p-8 text-center">
                          <p className="font-paragraph text-lg text-secondary/70">
                            कोई active SOS alert नहीं है
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
