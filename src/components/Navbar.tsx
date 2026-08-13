import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  QrCode, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { demoStore } from '../lib/demoStore';
import { Currency, User } from '../lib/types';
import { signInWithGoogle, logoutUser } from '../lib/firebase';

interface NavbarProps {
  onOpenPaywall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPaywall }) => {
  const [user, setUser] = useState<User>(demoStore.getUser());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    // Default to dark mode given the Liquid Glass aesthetic
    return true; 
  });

  useEffect(() => {
    const unsubscribe = demoStore.subscribe(() => {
      setUser(demoStore.getUser());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('theme-light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleCurrencyChange = (currency: Currency) => {
    demoStore.setCurrencyPreference(currency);
  };

  const handleLogin = async () => {
    await signInWithGoogle();
    setUser(demoStore.getUser());
  };

  const handleLogout = async () => {
    await logoutUser();
    setShowUserDropdown(false);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'var(--bg-card)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.8) 0%, rgba(126, 34, 206, 0.8) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                NXS
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Support
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, margin: 0, letterSpacing: '0.04em' }}>
              LIQUID GLASS AI STUDIO
            </p>
          </div>
        </Link>

        {/* Navigation Pills */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'var(--bg-input)',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid var(--border-input)'
        }}>
          <Link
            to="/"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: isActiveRoute('/') ? 'var(--text-primary)' : 'transparent',
              color: isActiveRoute('/') ? 'var(--bg-card)' : 'var(--text-secondary)',
              boxShadow: isActiveRoute('/') ? '0 4px 15px rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Building2 size={16} />
            Dashboard
          </Link>

          <Link
            to="/review/loc_artisanal_cafe"
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: isActiveRoute('/review/loc_artisanal_cafe') ? 'var(--text-primary)' : 'transparent',
              color: isActiveRoute('/review/loc_artisanal_cafe') ? 'var(--bg-card)' : 'var(--text-secondary)',
              boxShadow: isActiveRoute('/review/loc_artisanal_cafe') ? '0 4px 15px rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <QrCode size={16} />
            Public Handoff Demo
          </Link>
        </nav>

        {/* Tools: Theme + Currency Switcher + Paywall + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-input)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Currency Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '9999px',
            padding: '3px',
            border: '1px solid var(--border-input)'
          }}>
            <button
              onClick={() => handleCurrencyChange('INR')}
              style={{
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: user.currency_preference === 'INR' ? 'var(--text-primary)' : 'transparent',
                color: user.currency_preference === 'INR' ? 'var(--bg-card)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              🇮🇳 INR (₹)
            </button>
            <button
              onClick={() => handleCurrencyChange('USD')}
              style={{
                border: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: user.currency_preference === 'USD' ? 'var(--text-primary)' : 'transparent',
                color: user.currency_preference === 'USD' ? 'var(--bg-card)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              🇺🇸 USD ($)
            </button>
          </div>

          {/* Paywall Tier Button */}
          <button
            onClick={onOpenPaywall}
            className="btn-pill-primary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            <CreditCard size={15} />
            <span>Paywall Plans</span>
            <span style={{
              backgroundColor: 'var(--text-inverse)',
              color: 'var(--bg-card)',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              textTransform: 'uppercase'
            }}>
              {user.subscription_status}
            </span>
          </button>

          {/* User Profile */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-card)',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {user.name.charAt(0)}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown size={14} color="var(--text-secondary)" />
            </button>

            {showUserDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                width: '240px',
                backgroundColor: 'var(--bg-card)',
                backdropFilter: 'blur(28px)',
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid var(--border-color)',
                padding: '0.85rem',
                zIndex: 2000
              }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, wordBreak: 'break-all' }}>
                    {user.email}
                  </p>
                  <div style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    color: '#30D158',
                    fontWeight: 700
                  }}>
                    <ShieldCheck size={14} />
                    Google SSO Authenticated
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                >
                  <UserIcon size={16} />
                  Switch Google Account
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--ios-red)',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
