import { Link, useNavigate } from 'react-router-dom';
import { Droplet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const { userType, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            {userType === 'public' && (
              <Link to="/public-dashboard" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                Public Dashboard
              </Link>
            )}
            {userType === 'hospital' && (
              <Link to="/hospital-dashboard" className="font-paragraph text-base text-secondary hover:text-primary transition-colors">
                Hospital Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {userType ? (
              <Button
                onClick={handleLogout}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-paragraph flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <Link to="/public-registration">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-paragraph">
                  Register
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
