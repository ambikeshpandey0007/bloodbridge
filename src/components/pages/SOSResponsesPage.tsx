import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { SOSAlerts, AlertResponses, PublicUsers, Hospitals } from '@/entities';
import Header from '@/components/Header'
import Footer from '@/components/Footer';
import { ArrowLeft, Heart, Phone, Droplet, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';

export default function SOSResponsesPage() {
  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<SOSAlerts | null>(null);
  const [responses, setResponses] = useState<AlertResponses[]>([]);
  const [donors, setDonors] = useState<Map<string, PublicUsers>>(new Map());
  const [hospitals, setHospitals] = useState<Map<string, Hospitals>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [alertId]);

  const loadData = async () => {
    setIsLoading(true);
    
    if (alertId) {
      // Get the SOS alert
      const alertData = await BaseCrudService.getById<SOSAlerts>('sosalerts', alertId);
      setAlert(alertData);

      // Get all responses for this alert
      const allResponses = await BaseCrudService.getAll<AlertResponses>('alertresponses');
      const alertResponses = allResponses.items.filter(r => r.sosAlertId === alertId && r.isAvailableToDonate);
      setResponses(alertResponses);

      // Get donor/hospital details for each response
      const donorMap = new Map<string, PublicUsers>();
      const hospitalMap = new Map<string, Hospitals>();
      
      for (const response of alertResponses) {
        if (response.responderId) {
          if (response.responderType === 'Donor') {
            const donor = await BaseCrudService.getById<PublicUsers>('publicusers', response.responderId);
            if (donor) {
              donorMap.set(response.responderId, donor);
            }
          } else if (response.responderType === 'Hospital') {
            const hospital = await BaseCrudService.getById<Hospitals>('hospitals', response.responderId);
            if (hospital) {
              hospitalMap.set(response.responderId, hospital);
            }
          }
        }
      }
      setDonors(donorMap);
      setHospitals(hospitalMap);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[100rem] mx-auto px-8 py-16 min-h-[70vh] flex items-center justify-center">
          <p className="font-paragraph text-lg text-secondary/70">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[100rem] mx-auto px-8 py-16 min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Alert Not Found
            </h1>
            <Button
              onClick={() => navigate('/public-dashboard')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg px-8 py-6 mt-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-[100rem] mx-auto px-8 py-16 min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/public-dashboard')}
            variant="outline"
            className="mb-8 border-secondary text-secondary hover:bg-secondary/10 font-paragraph"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Alert Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-pastelpeach border-none">
              <CardHeader>
                <CardTitle className="font-heading text-3xl text-secondary">
                  {alert.patientName} - {alert.patientAge} years
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="font-paragraph text-sm text-secondary/70 mb-1">Blood Group</p>
                    <p className="font-heading text-2xl text-destructive font-bold">{alert.bloodGroupRequired}</p>
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-secondary/70 mb-1">Units Needed</p>
                    <p className="font-heading text-2xl text-secondary font-bold">{alert.unitsNeeded}</p>
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-secondary/70 mb-1">Status</p>
                    <p className="font-paragraph text-base text-secondary font-semibold">
                      <span className={`px-3 py-1 rounded-full ${alert.requestStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {alert.requestStatus}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-secondary/70 mb-1">Contact</p>
                    <p className="font-paragraph text-base text-secondary font-semibold">{alert.contactMobile}</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-secondary/10">
                  <p className="font-paragraph text-sm text-secondary/70 mb-1">Location</p>
                  <p className="font-paragraph text-base text-secondary">{alert.location}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Donor Responses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="font-heading text-3xl text-secondary mb-6 flex items-center gap-3">
              <Heart className="w-8 h-8 text-destructive" />
              Donors Ready to Help ({responses.length})
            </h2>

            {responses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {responses.map((response, index) => {
                  const donor = donors.get(response.responderId || '');
                  const hospital = hospitals.get(response.responderId || '');
                  const isDonor = response.responderType === 'Donor';
                  
                  return (
                    <motion.div
                      key={response._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <Card className="bg-pastelgreen border-none">
                        <CardHeader>
                          <CardTitle className="font-heading text-2xl text-secondary flex items-center gap-2">
                            <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
                              {isDonor ? (
                                <User className="w-5 h-5 text-primary-foreground" />
                              ) : (
                                <Building2 className="w-5 h-5 text-primary-foreground" />
                              )}
                            </div>
                            {isDonor ? donor?.fullName : hospital?.hospitalName || 'Unknown'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {isDonor && donor && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="font-paragraph text-sm text-secondary/70">Blood Group:</span>
                                <span className="font-heading text-lg text-primary font-bold">{donor.bloodGroup}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-paragraph text-sm text-secondary/70">Age:</span>
                                <span className="font-paragraph text-base text-secondary">{donor.age} years</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-paragraph text-sm text-secondary/70">Total Donations:</span>
                                <span className="font-heading text-lg text-secondary font-bold">{donor.totalDonations || 0}</span>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-secondary/10">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="font-paragraph text-base text-secondary font-semibold">{donor.mobileNumber}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Droplet className="w-4 h-4 text-destructive" />
                                <span className="font-paragraph text-sm text-secondary/70">
                                  Last Donation: {donor.lastDonationDate ? format(new Date(donor.lastDonationDate), 'dd MMM yyyy') : 'Never'}
                                </span>
                              </div>
                            </>
                          )}
                          {!isDonor && hospital && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="font-paragraph text-sm text-secondary/70">Registration:</span>
                                <span className="font-paragraph text-base text-secondary font-semibold">{hospital.registrationNumber}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-paragraph text-sm text-secondary/70">Type:</span>
                                <span className="font-paragraph text-base text-secondary font-semibold">
                                  {hospital.isBloodBank ? 'Blood Bank' : 'Hospital'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-secondary/10">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="font-paragraph text-base text-secondary font-semibold">{hospital.mobileNumber}</span>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/70 mb-1">Email:</p>
                                <p className="font-paragraph text-base text-secondary">{hospital.email}</p>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/70 mb-1">Address:</p>
                                <p className="font-paragraph text-base text-secondary">{hospital.address}</p>
                              </div>
                            </>
                          )}
                          <div className="pt-4 border-t border-secondary/10">
                            <p className="font-paragraph text-sm text-secondary/70 mb-2">Response:</p>
                            <p className="font-paragraph text-base text-secondary italic">
                              "{response.responseMessage}"
                            </p>
                            <p className="font-paragraph text-xs text-secondary/50 mt-2">
                              {format(new Date(response.responseDate || ''), 'dd MMM yyyy, HH:mm')}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-pastelbeige border-none">
                <CardContent className="p-8 text-center">
                  <p className="font-paragraph text-lg text-secondary/70">
                    अभी कोई donor response नहीं आया है
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
