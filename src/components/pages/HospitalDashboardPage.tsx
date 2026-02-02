import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BaseCrudService } from '@/integrations';
import { Hospitals, BloodStock, SOSAlerts, AlertResponses, DonationHistory, PublicUsers } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, Droplet, AlertCircle, Calendar, Plus, Lock, Edit2, Save, X, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';

export default function HospitalDashboardPage() {
  const navigate = useNavigate();
  const { userType, userId } = useAuthStore();
  const [hospital, setHospital] = useState<Hospitals | null>(null);
  const [bloodStocks, setBloodStocks] = useState<BloodStock[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SOSAlerts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<BloodStock | null>(null);

  const [donationForm, setDonationForm] = useState({
    aadharNumber: '',
    mobileNumber: '',
    bloodGroup: '',
    age: '',
    unitsDonated: '',
  });

  useEffect(() => {
    // Redirect if user is not logged in as hospital user
    if (userType !== 'hospital') {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [userType, navigate]);

  // Restrict access for unverified hospitals
  if (!isLoading && hospital && !hospital.isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[100rem] mx-auto px-8 py-16 min-h-[70vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md text-center"
          >
            <div className="bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="font-heading text-3xl text-secondary mb-4">
              Verification Pending
            </h1>
            <p className="font-paragraph text-lg text-secondary/80 mb-6">
              आपका Hospital अभी सत्यापन के लिए लंबित है। Developer द्वारा CMS dashboard से सत्यापन के बाद ही आप dashboard access कर सकेंगे।
            </p>
            <Alert className="border-destructive bg-destructive/10 mb-6">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive font-paragraph">
                ⏳ कृपया सत्यापन के लिए प्रतीक्षा करें। यह प्रक्रिया 24-48 घंटे में पूरी हो सकती है।
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg py-6"
            >
              Home पर जाएं
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Fetch the logged-in hospital's data using their userId
    if (userId) {
      const hospitalData = await BaseCrudService.getById<Hospitals>('hospitals', userId);
      setHospital(hospitalData);
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

  const handleEditStock = (stock: BloodStock) => {
    setEditingStock({ ...stock });
    setEditingStockId(stock._id);
  };

  const handleSaveStock = async () => {
    if (!editingStock) return;

    await BaseCrudService.update('bloodstock', {
      _id: editingStock._id,
      availableUnits: editingStock.availableUnits,
    });

    setEditingStockId(null);
    setEditingStock(null);
    loadDashboardData();
    alert('Blood stock successfully updated!');
  };

  const handleCancelEdit = () => {
    setEditingStockId(null);
    setEditingStock(null);
  };

  const handleProcessDonation = async () => {
    if (!donationForm.aadharNumber || !donationForm.mobileNumber || !donationForm.bloodGroup || !donationForm.age || !donationForm.unitsDonated) {
      alert('कृपया सभी fields भरें');
      return;
    }

    // Find donor by Aadhar, Mobile, Blood Group, and Age
    const usersResult = await BaseCrudService.getAll<PublicUsers>('publicusers');
    const donor = usersResult.items.find(
      u => u.aadharNumber === donationForm.aadharNumber &&
           u.mobileNumber === donationForm.mobileNumber &&
           u.bloodGroup === donationForm.bloodGroup &&
           u.age === parseInt(donationForm.age)
    );

    if (!donor) {
      alert('Donor profile नहीं मिला। कृपया details सही से भरें।');
      return;
    }

    const units = parseInt(donationForm.unitsDonated);

    // Update blood stock - add donated units
    const stockResult = await BaseCrudService.getAll<BloodStock>('bloodstock');
    const bloodStockForGroup = stockResult.items.find(
      s => s.bloodGroup === donationForm.bloodGroup && s.hospitalName === hospital?.hospitalName
    );

    if (bloodStockForGroup) {
      await BaseCrudService.update('bloodstock', {
        _id: bloodStockForGroup._id,
        availableUnits: (bloodStockForGroup.availableUnits || 0) + units,
      });
    }

    // Create donation history record
    const donationRecord: DonationHistory = {
      _id: crypto.randomUUID(),
      donorName: donor.fullName,
      hospitalName: hospital?.hospitalName,
      donationDate: new Date().toISOString(),
      unitsDonated: units,
      donationType: donationForm.bloodGroup,
      isSuccessful: true,
    };
    await BaseCrudService.create('donationhistory', donationRecord);

    // Update donor's profile
    await BaseCrudService.update('publicusers', {
      _id: donor._id,
      totalDonations: (donor.totalDonations || 0) + units,
      lastDonationDate: new Date().toISOString(),
    });

    alert(`✅ Donation successfully recorded!\n\n📋 Donor: ${donor.fullName}\nBlood Group: ${donationForm.bloodGroup}\nUnits: ${units}\n\n🩸 Blood stock updated!`);
    
    setDonationForm({
      aadharNumber: '',
      mobileNumber: '',
      bloodGroup: '',
      age: '',
      unitsDonated: '',
    });
    
    loadDashboardData();
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
              Blood stock को manage करें और donations process करें
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
                      {!hospital.isVerified && (
                        <Alert className="mb-6 border-destructive bg-destructive/10">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <AlertDescription className="text-destructive font-paragraph">
                            ⚠️ आपका Hospital अभी सत्यापन के लिए लंबित है। सत्यापन के बाद ही आप सभी features का उपयोग कर सकेंगे।
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {hospital.isVerified && (
                        <Alert className="mb-6 border-primary bg-primary/10">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <AlertDescription className="text-primary font-paragraph">
                            ✅ आपका Hospital सत्यापित है और सभी features सक्रिय हैं।
                          </AlertDescription>
                        </Alert>
                      )}

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
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Verification Status</p>
                          <p className="font-paragraph text-base font-semibold">
                            {hospital.isVerified ? (
                              <span className="text-primary flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Verified
                              </span>
                            ) : (
                              <span className="text-destructive flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> Pending
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Tabs for different sections */}
              <Tabs defaultValue="stock" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="stock" className="font-paragraph text-base">
                    Blood Stock
                  </TabsTrigger>
                  <TabsTrigger value="donation" className="font-paragraph text-base">
                    Process Donation
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="font-paragraph text-base">
                    SOS Alerts
                  </TabsTrigger>
                </TabsList>

                {/* Blood Stock Tab */}
                <TabsContent value="stock">
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
                                {editingStockId === stock._id && editingStock ? (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-heading text-xl text-primary font-bold">
                                        {editingStock.bloodGroup}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          value={editingStock.availableUnits || ''}
                                          onChange={(e) => setEditingStock({
                                            ...editingStock,
                                            availableUnits: parseInt(e.target.value) || 0
                                          })}
                                          className="w-24 font-paragraph"
                                          placeholder="Units"
                                        />
                                        <span className="font-paragraph text-sm text-secondary/70">units</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                      <Button
                                        onClick={handleSaveStock}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-sm"
                                      >
                                        <Save className="w-4 h-4 mr-1" />
                                        Save
                                      </Button>
                                      <Button
                                        onClick={handleCancelEdit}
                                        variant="outline"
                                        className="flex-1 border-secondary text-secondary hover:bg-secondary/10 font-paragraph text-sm"
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
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
                                    <Button
                                      onClick={() => handleEditStock(stock)}
                                      className="mt-3 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-sm"
                                    >
                                      <Edit2 className="w-4 h-4 mr-2" />
                                      Edit Stock
                                    </Button>
                                  </>
                                )}
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

                {/* Process Donation Tab */}
                <TabsContent value="donation">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-pastelbeige border-none">
                      <CardHeader>
                        <CardTitle className="font-heading text-2xl text-secondary flex items-center gap-3">
                          <Plus className="w-6 h-6 text-primary" />
                          Process Donor Donation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <Alert className="bg-pastelgreen border-none">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <AlertDescription className="font-paragraph text-base text-secondary">
                              Donor की details से match करके blood stock automatically update होगा और donor का profile भी update होगा।
                            </AlertDescription>
                          </Alert>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Label className="font-paragraph text-base text-secondary mb-2 block">
                                Aadhar Number
                              </Label>
                              <Input
                                type="text"
                                value={donationForm.aadharNumber}
                                onChange={(e) => setDonationForm({ ...donationForm, aadharNumber: e.target.value })}
                                placeholder="Donor का Aadhar Number"
                                className="font-paragraph"
                              />
                            </div>

                            <div>
                              <Label className="font-paragraph text-base text-secondary mb-2 block">
                                Mobile Number
                              </Label>
                              <Input
                                type="text"
                                value={donationForm.mobileNumber}
                                onChange={(e) => setDonationForm({ ...donationForm, mobileNumber: e.target.value })}
                                placeholder="Donor का Mobile Number"
                                className="font-paragraph"
                              />
                            </div>

                            <div>
                              <Label className="font-paragraph text-base text-secondary mb-2 block">
                                Blood Group
                              </Label>
                              <Select value={donationForm.bloodGroup} onValueChange={(value) => setDonationForm({ ...donationForm, bloodGroup: value })}>
                                <SelectTrigger className="font-paragraph">
                                  <SelectValue placeholder="Blood Group चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="O+">O+</SelectItem>
                                  <SelectItem value="O-">O-</SelectItem>
                                  <SelectItem value="A+">A+</SelectItem>
                                  <SelectItem value="A-">A-</SelectItem>
                                  <SelectItem value="B+">B+</SelectItem>
                                  <SelectItem value="B-">B-</SelectItem>
                                  <SelectItem value="AB+">AB+</SelectItem>
                                  <SelectItem value="AB-">AB-</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="font-paragraph text-base text-secondary mb-2 block">
                                Age
                              </Label>
                              <Input
                                type="number"
                                value={donationForm.age}
                                onChange={(e) => setDonationForm({ ...donationForm, age: e.target.value })}
                                placeholder="Donor की Age"
                                className="font-paragraph"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <Label className="font-paragraph text-base text-secondary mb-2 block">
                                Units Donated
                              </Label>
                              <Input
                                type="number"
                                value={donationForm.unitsDonated}
                                onChange={(e) => setDonationForm({ ...donationForm, unitsDonated: e.target.value })}
                                placeholder="कितने units donate किए"
                                className="font-paragraph"
                              />
                            </div>
                          </div>

                          <Button
                            onClick={handleProcessDonation}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg py-6"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Process Donation
                          </Button>
                        </div>
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
