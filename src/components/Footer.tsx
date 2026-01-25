import { Link } from 'react-router-dom';
import { Droplet, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="bg-primary p-2 rounded-full">
                <Droplet className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-heading text-2xl text-secondary-foreground group-hover:text-primary transition-colors">
                Blood Bridge
              </span>
            </Link>
            <p className="font-paragraph text-base text-secondary-foreground/80 leading-relaxed">
              जीवन बचाने का सबसे बड़ा माध्यम। हम donors और receivers को जोड़ते हैं।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl text-secondary-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="font-paragraph text-base text-secondary-foreground/80 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blood-availability" className="font-paragraph text-base text-secondary-foreground/80 hover:text-primary transition-colors">
                  Blood Availability
                </Link>
              </li>
              <li>
                <Link to="/public-registration" className="font-paragraph text-base text-secondary-foreground/80 hover:text-primary transition-colors">
                  Public Registration
                </Link>
              </li>
              <li>
                <Link to="/hospital-registration" className="font-paragraph text-base text-secondary-foreground/80 hover:text-primary transition-colors">
                  Hospital Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h3 className="font-heading text-xl text-secondary-foreground mb-6">Dashboards</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/public-dashboard" className="font-paragraph text-base text-secondary-foreground/80 hover:text-primary transition-colors">
                  Public Dashboard
                </Link>
              </li>
              <li>
                <Link to="/hospital-dashboard" className="font-paragraph text-base text-secondary-foreground/80 hover:text-primary transition-colors">
                  Hospital Dashboard
                </Link>
              </li>
              <li>
                <Link to="/sos-alert" className="font-paragraph text-base text-secondary-foreground/80 hover:text-primary transition-colors">
                  SOS Alert
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-xl text-secondary-foreground mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="font-paragraph text-base text-secondary-foreground/80">
                  info@bloodbridge.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="font-paragraph text-base text-secondary-foreground/80">
                  +91 1800-BLOOD-HELP
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="font-paragraph text-base text-secondary-foreground/80">
                  India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-secondary-foreground/70">
              © 2026 Blood Bridge. सर्वाधिकार सुरक्षित।
            </p>
            <p className="font-paragraph text-sm text-secondary-foreground/70">
              B.Tech Final Year Project
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
