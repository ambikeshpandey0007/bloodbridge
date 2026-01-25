import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BaseCrudService } from '@/integrations';
import { PublicUsers, DonationHistory, SOSAlerts, DonorBadges, AlertResponses } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Heart, AlertCircle, Award, Calendar, Droplet, Lock } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { format } from 'date-fns';

export default function PublicDashboardPage() {
  const [user, setUser] = useState<PublicUsers | null>(null);
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SOSAlerts[]>([]);
  const [badges, setBadges] = useState<DonorBadges[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    const usersResult = await BaseCrudService.getAll<PublicUsers>('publicusers');
    if (usersResult.items.length > 0) {
      setUser(usersResult.items[0]);
    }

    const historyResult = await BaseCrudService.getAll<DonationHistory>('donationhistory');
    setDonationHistory(historyResult.items);

    const alertsResult = await BaseCrudService.getAll<SOSAlerts>('sosalerts');
    setSosAlerts(alertsResult.items.filter(alert => alert.requestStatus === 'Active'));

    const badgesResult = await BaseCrudService.getAll<DonorBadges>('donorbadges');
    setBadges(badgesResult.items);

    setIsLoading(false);
  };

  // Check if user profile exists
  if (!isLoading && !user) {
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
            <div className="bg-destructive w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-destructive-foreground" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Dashboard Access Restricted
            </h1>
            <p className="font-paragraph text-xl text-secondary/80 mb-8">
              Dashboard देखने के लिए पहले अपनी profile बनानी होगी।
            </p>
            <Link to="/public-registration">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph text-lg px-8 py-6">
                Profile बनाएं
              </Button>
            </Link>
          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

  const handleRespondToAlert = async (alertId: string, canDonate: boolean) => {
    const response: AlertResponses = {
      _id: crypto.randomUUID(),
      sosAlertId: alertId,
      responderType: 'Donor',
      responderId: user?._id || '',
      responseMessage: canDonate ? 'मैं donate करने के लिए तैयार हूँ' : 'अभी donate नहीं कर सकता',
      isAvailableToDonate: canDonate,
      responseDate: new Date().toISOString(),
    };

    await BaseCrudService.create('alertresponses', response);
    alert('Response successfully भेजा गया!');
    loadDashboardData();
  };

  const getUserBadge = () => {
    if (!user || !user.totalDonations) return null;
    
    const sortedBadges = [...badges].sort((a, b) => (b.minDonationCount || 0) - (a.minDonationCount || 0));
    
    for (const badge of sortedBadges) {
      if (user.totalDonations >= (badge.minDonationCount || 0)) {
        return badge;
      }
    }
    return null;
  };

  const currentBadge = getUserBadge();

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
              Public Dashboard
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              अपनी profile और donation history देखें
            </p>
          </div>

          {isLoading ? null : (
            <>
              {/* User Profile Card */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <Card className="bg-pastelbeige border-none">
                    <CardHeader>
                      <CardTitle className="font-heading text-3xl text-secondary flex items-center gap-3">
                        <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-foreground" />
                        </div>
                        {user.fullName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Blood Group</p>
                          <p className="font-heading text-2xl text-primary font-bold">{user.bloodGroup}</p>
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Mobile Number</p>
                          <p className="font-paragraph text-lg text-secondary">{user.mobileNumber}</p>
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Total Donations</p>
                          <p className="font-heading text-2xl text-secondary font-bold">{user.totalDonations || 0}</p>
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Age</p>
                          <p className="font-paragraph text-lg text-secondary">{user.age} years</p>
                        </div>
                      </div>
                      {user.lastDonationDate && (
                        <div className="mt-6 pt-6 border-t border-secondary/10">
                          <p className="font-paragraph text-sm text-secondary/70 mb-1">Last Donation Date</p>
                          <p className="font-paragraph text-base text-secondary">
                            {format(new Date(user.lastDonationDate), 'dd MMMM yyyy')}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Donor Badge */}
              {currentBadge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mb-8"
                >
                  <Card className="bg-pastelgreen border-none">
                    <CardHeader>
                      <CardTitle className="font-heading text-2xl text-secondary flex items-center gap-3">
                        <Award className="w-8 h-8 text-primary" />
                        आपका Badge
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6">
                        {currentBadge.badgeImage && (
                          <Image
                            src={currentBadge.badgeImage}
                            alt={currentBadge.badgeName || 'Badge'}
                            className="w-24 h-24 object-contain"
                            width={96}
                          />
                        )}
                        <div>
                          <h3 className="font-heading text-2xl text-secondary mb-2">{currentBadge.badgeName}</h3>
                          <p className="font-paragraph text-base text-secondary/80 mb-2">{currentBadge.description}</p>
                          <p className="font-paragraph text-sm text-primary font-semibold">
                            Reward Points: {currentBadge.rewardPoints}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="font-heading text-3xl text-secondary mb-6">Quick Actions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link to="/sos-alert">
                    <Card className="bg-pastelpeach border-none hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-8 flex items-center gap-4">
                        <div className="bg-destructive w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-8 h-8 text-destructive-foreground" />
                        </div>
                        <div>
                          <h3 className="font-heading text-2xl text-secondary mb-2">Send SOS Alert</h3>
                          <p className="font-paragraph text-base text-secondary/80">
                            Emergency में blood की request भेजें
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link to="/blood-availability">
                    <Card className="bg-pastellavender border-none hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-8 flex items-center gap-4">
                        <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                          <Droplet className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-heading text-2xl text-secondary mb-2">Search Blood</h3>
                          <p className="font-paragraph text-base text-secondary/80">
                            Local blood availability देखें
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </motion.div>

              {/* Active SOS Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mb-12"
              >
                <h2 className="font-heading text-3xl text-secondary mb-6 flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                  Active SOS Alerts
                </h2>
                {sosAlerts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {sosAlerts.map((alert, index) => (
                      <motion.div
                        key={alert._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                      >
                        <Card className="bg-pastelpeach border-none">
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
                                <Heart className="w-4 h-4 mr-2" />
                                Donate करूँगा
                              </Button>
                              <Button
                                onClick={() => handleRespondToAlert(alert._id, false)}
                                variant="outline"
                                className="flex-1 border-secondary text-secondary hover:bg-secondary/10 font-paragraph"
                              >
                                नहीं कर सकता
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
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

              {/* Donation History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <h2 className="font-heading text-3xl text-secondary mb-6 flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-primary" />
                  Donation History
                </h2>
                {donationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {donationHistory.map((donation, index) => (
                      <motion.div
                        key={donation._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                      >
                        <Card className="bg-pastellavender border-none">
                          <CardContent className="p-6">
                            <div className="grid md:grid-cols-4 gap-4">
                              <div>
                                <p className="font-paragraph text-sm text-secondary/70 mb-1">Hospital</p>
                                <p className="font-paragraph text-base text-secondary font-semibold">
                                  {donation.hospitalName}
                                </p>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/70 mb-1">Date</p>
                                <p className="font-paragraph text-base text-secondary">
                                  {donation.donationDate && format(new Date(donation.donationDate), 'dd MMM yyyy')}
                                </p>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/70 mb-1">Units</p>
                                <p className="font-paragraph text-base text-secondary font-semibold">
                                  {donation.unitsDonated}
                                </p>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/70 mb-1">Type</p>
                                <p className="font-paragraph text-base text-secondary">
                                  {donation.donationType}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-pastelbeige border-none">
                    <CardContent className="p-8 text-center">
                      <p className="font-paragraph text-lg text-secondary/70">
                        अभी तक कोई donation record नहीं है
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
