import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BaseCrudService } from '@/integrations';
import { BloodStock } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, MapPin, Phone, Droplet, Lock } from 'lucide-react';

export default function BloodAvailabilityPage() {
  const [bloodStocks, setBloodStocks] = useState<BloodStock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<BloodStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    city: '',
  });

  useEffect(() => {
    loadBloodStocks();
  }, []);

  const loadBloodStocks = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<BloodStock>('bloodstock');
    setBloodStocks(result.items);
    setFilteredStocks(result.items);
    setIsLoading(false);
  };

  const handleSearch = () => {
    let filtered = bloodStocks;

    if (filters.bloodGroup) {
      filtered = filtered.filter(stock => stock.bloodGroup === filters.bloodGroup);
    }

    if (filters.city) {
      filtered = filtered.filter(stock => 
        stock.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredStocks(filtered);
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
          <div className="text-center mb-12">
            <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Blood Availability
            </h1>
            <p className="font-paragraph text-xl text-secondary/80">
              अपने area में available blood stock खोजें
            </p>
          </div>

          {/* Read-Only Notice */}
          <Alert className="mb-8 bg-pastellavender border-primary/30">
            <Lock className="h-4 w-4 text-primary" />
            <AlertDescription className="font-paragraph text-base text-secondary">
              यह page केवल blood availability देखने के लिए है। कोई भी edit या update नहीं कर सकते।
            </AlertDescription>
          </Alert>

          {/* Search Filters */}
          <div className="bg-pastellavender p-8 rounded-2xl mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="bloodGroup" className="font-paragraph text-base text-secondary mb-2 block">
                  Blood Group
                </Label>
                <Select
                  value={filters.bloodGroup}
                  onValueChange={(value) => setFilters({ ...filters, bloodGroup: value })}
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
                <Label htmlFor="city" className="font-paragraph text-base text-secondary mb-2 block">
                  City/Area
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="font-paragraph text-base"
                  placeholder="City या area का नाम"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-paragraph"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search करें
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? null : filteredStocks.length > 0 ? (
              filteredStocks.map((stock, index) => (
                <motion.div
                  key={stock._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="bg-pastelbeige border-none h-full">
                    <CardHeader>
                      <CardTitle className="font-heading text-2xl text-secondary flex items-center gap-3">
                        <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                          <Droplet className="w-6 h-6 text-primary-foreground" />
                        </div>
                        {stock.hospitalName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-paragraph text-base text-secondary/70">Blood Group:</span>
                        <span className="font-heading text-xl text-primary font-bold">{stock.bloodGroup}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-paragraph text-base text-secondary/70">Available Units:</span>
                        <span className="font-paragraph text-lg text-secondary font-semibold">{stock.availableUnits}</span>
                      </div>
                      <div className="flex items-start gap-2 pt-2">
                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div className="font-paragraph text-sm text-secondary/80">
                          {stock.address}, {stock.city}, {stock.state} - {stock.zipCode}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="font-paragraph text-base text-secondary">{stock.contactNumber}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="font-paragraph text-xl text-secondary/70">
                  कोई blood stock नहीं मिला। कृपया अलग filters try करें।
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
