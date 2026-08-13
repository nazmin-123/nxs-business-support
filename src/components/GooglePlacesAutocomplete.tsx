import React, { useState } from 'react';
import { MapPin, Search, Check, Sparkles, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { BusinessLocation } from '../lib/types';
import { demoStore } from '../lib/demoStore';

interface GooglePlacesAutocompleteProps {
  onLocationAdded: (location: BusinessLocation) => void;
}

interface PlaceSuggestion {
  google_place_id: string;
  business_name: string;
  address: string;
  category: string;
  rating: number;
  user_ratings_total: number;
  suggested_ai_profile: string;
}

const DEMO_PLACES_SUGGESTIONS: PlaceSuggestion[] = [
  {
    google_place_id: 'ChIJ_nxs_cafe_indiranagar_01',
    business_name: 'NXS Brew & Bistro',
    address: '402 100ft Road, Indiranagar, Bengaluru, Karnataka 560038',
    category: 'Specialty Cafe & Eatery',
    rating: 4.9,
    user_ratings_total: 412,
    suggested_ai_profile: 'Cold brew specialty coffee, artisanal sourdough pizza, pet-friendly outdoor seating, fast Wi-Fi, friendly baristas',
  },
  {
    google_place_id: 'ChIJ_nxs_auto_hsr_02',
    business_name: 'NXS Auto Care & Ceramic Lab',
    address: '77 27th Main, HSR Layout, Bengaluru, Karnataka 560102',
    category: 'Auto Repair & Detailing',
    rating: 4.8,
    user_ratings_total: 256,
    suggested_ai_profile: 'German auto repair specialist, 9H ceramic coating, rapid oil change, digital video inspection, free pickup & drop',
  },
  {
    google_place_id: 'ChIJ_nxs_dental_koramangala_03',
    business_name: 'NXS Smile Dental & Orthodontics',
    address: '15 80ft Road, Koramangala 4th Block, Bengaluru, Karnataka 560034',
    category: 'Dental Clinic',
    rating: 5.0,
    user_ratings_total: 180,
    suggested_ai_profile: 'Painless laser dentistry, invisible aligners, gentle pediatric care, state-of-the-art 3D imaging, zero waiting time',
  },
  {
    google_place_id: 'ChIJ_nxs_fitness_mgroad_04',
    business_name: 'NXS Performance Gym & Wellness',
    address: '99 Church Street, Off MG Road, Bengaluru, Karnataka 560001',
    category: 'Fitness Center',
    rating: 4.9,
    user_ratings_total: 520,
    suggested_ai_profile: '24/7 access, elite personal trainers, sauna & ice bath, high-end Eleiko barbells, organic smoothie lounge',
  },
];

export const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({ onLocationAdded }) => {
  const [query, setQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const [aiProfile, setAiProfile] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSuggestions = DEMO_PLACES_SUGGESTIONS.filter((place) =>
    place.business_name.toLowerCase().includes(query.toLowerCase()) ||
    place.address.toLowerCase().includes(query.toLowerCase()) ||
    place.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectPlace = (place: PlaceSuggestion) => {
    setSelectedPlace(place);
    setQuery(place.business_name);
    setAiProfile(place.suggested_ai_profile);
    setShowDropdown(false);
  };

  const handleSaveLocation = () => {
    if (!selectedPlace) return;

    const newLoc = demoStore.addLocation({
      business_name: selectedPlace.business_name,
      google_place_id: selectedPlace.google_place_id,
      ai_master_profile: aiProfile || selectedPlace.suggested_ai_profile,
      is_active: true,
      address: selectedPlace.address,
      rating: selectedPlace.rating,
      user_ratings_total: selectedPlace.user_ratings_total,
    });

    setIsSaved(true);
    onLocationAdded(newLoc);

    setTimeout(() => {
      setIsSaved(false);
      setSelectedPlace(null);
      setQuery('');
      setAiProfile('');
    }, 1500);
  };

  return (
    <div className="liquid-glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '14px',
          background: 'var(--bg-input)',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-input)'
        }}>
          <MapPin size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 800 }}>
            Google Places Setup
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Search your Google Maps business profile to auto-extract your Place ID
          </p>
        </div>
      </div>

      {/* Places Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '0.02em' }}>
          Search Google Business Name or Address
        </label>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Type your business name (e.g. NXS Brew & Bistro)..."
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 2.8rem',
              borderRadius: '16px',
              border: '1px solid var(--border-input)',
              background: 'var(--bg-input)',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          />
        </div>

        {/* Autocomplete Dropdown List */}
        {showDropdown && (
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            marginTop: '0.4rem',
            backgroundColor: 'var(--bg-card)',
            backdropFilter: 'blur(28px)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
            zIndex: 100,
            maxHeight: '280px',
            overflowY: 'auto'
          }}>
            {filteredSuggestions.map((place) => (
              <div
                key={place.google_place_id}
                onClick={() => handleSelectPlace(place)}
                style={{
                  padding: '0.85rem 1.15rem',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-input)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {place.business_name}
                  </span>
                  <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.65rem', borderRadius: '9999px', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontWeight: 800 }}>
                    {place.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
                  {place.address}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--ios-amber)', fontWeight: 800 }}>
                  <Star size={13} fill="var(--ios-amber)" />
                  {place.rating} ({place.user_ratings_total} reviews)
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem', fontFamily: 'monospace' }}>ID: {place.google_place_id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Location Summary */}
      {selectedPlace && (
        <div style={{
          backgroundColor: 'var(--bg-input)',
          borderRadius: '20px',
          padding: '1.25rem',
          border: '1px solid var(--border-input)',
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                {selectedPlace.business_name}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedPlace.address}</p>
            </div>
            <div style={{
              backgroundColor: 'rgba(48, 209, 88, 0.15)',
              color: 'var(--ios-green)',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              border: '1px solid rgba(48, 209, 88, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <CheckCircle size={14} />
              Place ID Verified
            </div>
          </div>

          <div style={{
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            backgroundColor: 'var(--bg-card)',
            padding: '0.5rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            fontWeight: 700
          }}>
            google_place_id: "{selectedPlace.google_place_id}"
          </div>

          {/* AI Master Profile Input */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              <Sparkles size={16} color="var(--ios-amber)" />
              Configure AI Master Profile Context
            </label>
            <textarea
              rows={3}
              value={aiProfile}
              onChange={(e) => setAiProfile(e.target.value)}
              placeholder="Describe your core offerings, key strengths, and staff vibe..."
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '14px',
                border: '1px solid var(--border-input)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={handleSaveLocation}
            className="btn-pill-primary"
            disabled={isSaved}
            style={{ width: '100%', padding: '0.85rem', backgroundColor: isSaved ? 'var(--ios-green)' : 'var(--text-primary)', color: isSaved ? '#FFFFFF' : 'var(--bg-card)' }}
          >
            {isSaved ? (
              <>
                <Check size={18} />
                Location Saved to Firestore!
              </>
            ) : (
              <>
                <ArrowRight size={18} />
                Save Business Location & Enable QR Studio
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
