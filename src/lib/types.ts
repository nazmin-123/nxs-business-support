export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'past_due' | 'inactive';
export type TierId = 'starter' | 'pro' | 'enterprise';
export type Currency = 'INR' | 'USD';

export interface User {
  id: string;
  name: string;
  email: string;
  stripe_customer_id: string | null;
  subscription_status: SubscriptionStatus;
  currency_preference: Currency;
  created_at: string;
}

export interface BusinessLocation {
  id: string;
  user_id: string;
  business_name: string;
  google_place_id: string;
  ai_master_profile: string;
  is_active: boolean;
  address?: string;
  phone?: string;
  rating?: number;
  user_ratings_total?: number;
  created_at: string;
}

export interface ScanEvent {
  id: string;
  location_id: string;
  converted: boolean;
  timestamp: string;
  selected_review_index?: number | null;
  user_agent: string;
}

export interface GeneratedReview {
  index: number;
  tone: 'Detailed' | 'Concise' | 'Service-Oriented';
  review_text: string;
  suggested_tags: string[];
}

export interface ReviewGenerationResponse {
  business_name: string;
  reviews: GeneratedReview[];
}
