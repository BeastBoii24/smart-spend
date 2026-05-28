import { useEffect, useState } from "react";
import { LogOut, Menu, Wallet, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
        scrolled ? "bg-background/95 shadow-lg shadow-background/20" : "bg-background/80"
      } backdrop-blur-xl border-b border-border/50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
            <Wallet size={22} />
          </div>
          <div className="hidden sm:block min-w-0">
            <h1 className="text-xl font-bold">SmartSpend</h1>
            <p className="text-xs text-muted-foreground">Personal Finance Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-40">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-40">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 hover:bg-destructive/20 hover:border-destructive/50 transition-all duration-300 text-sm"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={onMenuToggle}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 hover:bg-primary hover:border-primary transition-all duration-300"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
