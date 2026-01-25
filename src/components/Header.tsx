import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-background border-b border-secondary/10 sticky top-0 z-50">
      <div className="max-w-[100rem] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-full">
              <Droplet className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl text-secondary group-hover:text-primary transition-colors">
              Blood Bridge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/blood-availability" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
              Blood Availability
            </Link>
            <Link to="/public-dashboard" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
              Public Dashboard
            </Link>
            <Link to="/hospital-dashboard" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
              Hospital Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/public-registration">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-paragraph">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
