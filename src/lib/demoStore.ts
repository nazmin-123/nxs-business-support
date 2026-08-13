import { User, BusinessLocation, ScanEvent, SubscriptionStatus, TierId, Currency } from './types';

export const IS_DEMO_MODE = true; // Auto-enabled for instant zero-key client testing

const STORAGE_KEYS = {
  USER: 'nxs_user_profile',
  LOCATIONS: 'nxs_locations',
  SCANS: 'nxs_scan_events',
  CURRENCY: 'nxs_currency_pref',
};

const DEFAULT_USER: User = {
  id: 'usr_demo_88',
  name: 'Alexander Wright',
  email: 'alex.wright@nxs-business.com',
  stripe_customer_id: 'cus_demo_77123',
  subscription_status: 'active',
  currency_preference: 'INR',
  created_at: new Date().toISOString(),
};

const DEFAULT_LOCATIONS: BusinessLocation[] = [
  {
    id: 'loc_artisanal_cafe',
    user_id: 'usr_demo_88',
    business_name: 'NXS Artisanal Coffee & Bakery',
    google_place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    ai_master_profile: 'Specialty double-shot espresso, artisanal sourdough pastries, organic avocado toast, cozy minimalist vibe, warm baristas',
    is_active: true,
    address: '142 MG Road, Indiranagar, Bengaluru, Karnataka 560038',
    phone: '+91 98765 43210',
    rating: 4.9,
    user_ratings_total: 342,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'loc_auto_care',
    user_id: 'usr_demo_88',
    business_name: 'NXS Premier Auto Care & Detailing',
    google_place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY5',
    ai_master_profile: 'Honest mechanics, ceramic coating, rapid 60-minute oil change, transparent digital inspection, complimentary espresso lounge',
    is_active: true,
    address: '88 Outer Ring Road, HSR Layout, Bengaluru, Karnataka 560102',
    phone: '+91 98765 11223',
    rating: 4.8,
    user_ratings_total: 189,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DEFAULT_SCANS: ScanEvent[] = [
  {
    id: 'evt_1',
    location_id: 'loc_artisanal_cafe',
    converted: true,
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    selected_review_index: 0,
    user_agent: 'iPhone iOS 17.4 Safari',
  },
  {
    id: 'evt_2',
    location_id: 'loc_artisanal_cafe',
    converted: true,
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    selected_review_index: 1,
    user_agent: 'Android Chrome 124',
  },
  {
    id: 'evt_3',
    location_id: 'loc_artisanal_cafe',
    converted: false,
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    selected_review_index: null,
    user_agent: 'iPhone iOS 17.3 Mobile Safari',
  },
  {
    id: 'evt_4',
    location_id: 'loc_auto_care',
    converted: true,
    timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    selected_review_index: 2,
    user_agent: 'Android Chrome 123',
  },
];

class DemoStore {
  private user: User;
  private locations: BusinessLocation[];
  private scanEvents: ScanEvent[];
  private listeners: Array<() => void> = [];

  constructor() {
    // Load from LocalStorage or initialize default values
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    this.user = storedUser ? JSON.parse(storedUser) : DEFAULT_USER;

    const storedLocations = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    this.locations = storedLocations ? JSON.parse(storedLocations) : DEFAULT_LOCATIONS;

    const storedScans = localStorage.getItem(STORAGE_KEYS.SCANS);
    this.scanEvents = storedScans ? JSON.parse(storedScans) : DEFAULT_SCANS;
  }

  private save() {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(this.locations));
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(this.scanEvents));
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // User Actions
  public getUser(): User {
    return { ...this.user };
  }

  public updateUserSubscription(status: SubscriptionStatus, tierId?: TierId, currency?: Currency) {
    this.user.subscription_status = status;
    if (currency) {
      this.user.currency_preference = currency;
    }
    this.save();
  }

  public setCurrencyPreference(currency: Currency) {
    this.user.currency_preference = currency;
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    this.save();
  }

  // Location Actions
  public getLocations(): BusinessLocation[] {
    return [...this.locations];
  }

  public getLocationById(id: string): BusinessLocation | undefined {
    return this.locations.find((l) => l.id === id);
  }

  public addLocation(location: Omit<BusinessLocation, 'id' | 'created_at' | 'user_id'>): BusinessLocation {
    const newLoc: BusinessLocation = {
      ...location,
      id: `loc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: this.user.id,
      created_at: new Date().toISOString(),
    };
    this.locations.unshift(newLoc);
    this.save();
    return newLoc;
  }

  public updateLocation(id: string, updates: Partial<BusinessLocation>): BusinessLocation | null {
    const idx = this.locations.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    this.locations[idx] = { ...this.locations[idx], ...updates };
    this.save();
    return this.locations[idx];
  }

  public deleteLocation(id: string) {
    this.locations = this.locations.filter((l) => l.id !== id);
    this.save();
  }

  // Analytics & Scan Events
  public getScanEvents(locationId?: string): ScanEvent[] {
    if (locationId) {
      return this.scanEvents.filter((e) => e.location_id === locationId);
    }
    return [...this.scanEvents];
  }

  public recordScanEvent(locationId: string, converted: boolean, selectedReviewIndex?: number): ScanEvent {
    const event: ScanEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      location_id: locationId,
      converted,
      selected_review_index: selectedReviewIndex ?? null,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    };
    this.scanEvents.unshift(event);
    this.save();
    return event;
  }

  public resetDemoData() {
    this.user = DEFAULT_USER;
    this.locations = DEFAULT_LOCATIONS;
    this.scanEvents = DEFAULT_SCANS;
    this.save();
  }
}

export const demoStore = new DemoStore();
