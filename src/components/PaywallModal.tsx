import React, { useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { PRICING_PLANS, triggerStripeCheckout } from '../lib/stripe';
import { Currency, TierId, User } from '../lib/types';
import { demoStore } from '../lib/demoStore';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<User>(demoStore.getUser());
  const [currency, setCurrency] = useState<Currency>(user.currency_preference || 'INR');
  const [loadingTier, setLoadingTier] = useState<TierId | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = async (tierId: TierId) => {
    setLoadingTier(tierId);
    await triggerStripeCheckout(tierId, currency);
    setUser(demoStore.getUser());
    setLoadingTier(null);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      <div className="liquid-glass" style={{
        maxWidth: '1050px',
        width: '100%',
        padding: '2.5rem',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1.5rem',
            top: '1.5rem',
            border: 'none',
            background: 'var(--bg-input)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)'
          }}
        >
          <X size={20} />
        </button>

        {/* Sandbox Notice */}
        <div style={{
          backgroundColor: 'rgba(255, 214, 10, 0.15)',
          border: '1px solid rgba(255, 214, 10, 0.35)',
          borderRadius: '18px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.75rem',
          fontSize: '0.85rem',
          color: 'var(--ios-amber)',
          fontWeight: 600
        }}>
          <Sparkles size={18} color="var(--ios-amber)" />
          Zero-Key Stripe Sandbox Active: Selecting a plan will instantly update your subscription in Firestore & unlock all Pro features.
        </div>

        {/* Header & Currency Switcher */}
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.25rem' }}>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
            Choose Your B2B Review Growth Plan
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Scale 5-star customer reviews across all your business locations with AI automation
          </p>

          {/* Currency Pill Switcher */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '9999px',
            padding: '4px',
            marginTop: '1.35rem',
            border: '1px solid var(--border-input)'
          }}>
            <button
              onClick={() => setCurrency('INR')}
              style={{
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: currency === 'INR' ? 'var(--text-primary)' : 'transparent',
                color: currency === 'INR' ? 'var(--bg-card)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              🇮🇳 INR Pricing (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: currency === 'USD' ? 'var(--text-primary)' : 'transparent',
                color: currency === 'USD' ? 'var(--bg-card)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              🇺🇸 USD Pricing ($)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {PRICING_PLANS.map((plan) => {
            const priceDisplay = currency === 'INR' ? plan.inr.display : plan.usd.display;
            const isLoading = loadingTier === plan.id;

            return (
              <div
                key={plan.id}
                className="liquid-glass liquid-glass-interactive"
                style={{
                  backgroundColor: plan.highlighted ? 'var(--bg-input)' : 'var(--bg-card)',
                  borderColor: plan.highlighted ? 'var(--text-primary)' : 'var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {plan.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--ios-amber)',
                    color: '#0F172A',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.85rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 15px rgba(255, 214, 10, 0.4)'
                  }}>
                    {plan.badge}
                  </span>
                )}

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {plan.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                    {priceDisplay}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    / month
                  </span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', flex: 1 }}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.88rem',
                      marginBottom: '0.65rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <Check size={16} color="var(--ios-green)" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isLoading}
                  className="btn-pill-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  {isLoading ? 'Processing Payment...' : `Subscribe (${priceDisplay}/mo)`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
