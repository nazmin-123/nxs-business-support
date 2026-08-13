import { Currency, TierId } from './types';
import { demoStore } from './demoStore';

export interface PricingPlan {
  id: TierId;
  name: string;
  usd: { display: string; amount: number };
  inr: { display: string; amount: number };
  badge?: string;
  highlighted?: boolean;
  features: string[];
  maxLocations: number; // -1 for unlimited
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    usd: { display: '$19', amount: 1900 },
    inr: { display: '₹1,499', amount: 149900 },
    features: [
      '1 Business Location',
      'Google Places Autocomplete Setup',
      'QR Code Studio with PNG Export',
      'Standard Gemini AI 5-Star Reviews',
      '500 Monthly AI Review Queries',
      'Basic Conversion Analytics',
    ],
    maxLocations: 1,
  },
  {
    id: 'pro',
    name: 'Pro Growth Plan',
    usd: { display: '$49', amount: 4900 },
    inr: { display: '₹3,999', amount: 399900 },
    badge: 'Most Popular',
    highlighted: true,
    features: [
      'Unlimited Business Locations',
      'Google Places Autocomplete Setup',
      'High-Res QR Code Studio + Print Templates',
      'Advanced Custom AI Master Profiles',
      '5,000 Monthly AI Review Queries',
      'Real-Time Conversion Tracking & Analytics',
      'Priority Customer Support',
    ],
    maxLocations: -1,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    usd: { display: '$99', amount: 9900 },
    inr: { display: '₹7,999', amount: 799900 },
    features: [
      'Unlimited Business Locations & Staff Seats',
      'Custom Fine-Tuned AI Prompt Persona',
      'Unlimited AI Review Queries',
      'Dedicated 24/7 Account Specialist',
      'Multi-Location Aggregated Insights',
      'Custom Branding & White-Label Option',
    ],
    maxLocations: -1,
  },
];

/**
 * Execute Stripe Checkout Session or Mock Sandbox Activation
 */
export async function triggerStripeCheckout(tierId: TierId, currency: Currency): Promise<{ success: boolean; message: string }> {
  console.log(`💳 Triggering checkout for ${tierId} in ${currency}...`);
  
  // Simulate network processing delay (700ms)
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Update demo user subscription status instantly
  demoStore.updateUserSubscription('active', tierId, currency);

  return {
    success: true,
    message: `Successfully subscribed to the ${tierId.toUpperCase()} plan in ${currency}!`,
  };
}
