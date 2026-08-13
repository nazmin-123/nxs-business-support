import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  QrCode, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Edit3, 
  Plus, 
  Trash2,
  Star
} from 'lucide-react';
import { demoStore } from '../lib/demoStore';
import { BusinessLocation, ScanEvent, User } from '../lib/types';
import { GooglePlacesAutocomplete } from '../components/GooglePlacesAutocomplete';
import { QRCodeStudio } from '../components/QRCodeStudio';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User>(demoStore.getUser());
  const [locations, setLocations] = useState<BusinessLocation[]>(demoStore.getLocations());
  const [selectedLocationId, setSelectedLocationId] = useState<string>(locations[0]?.id || '');
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>(demoStore.getScanEvents());
  
  const [editingProfile, setEditingProfile] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPlacesModal, setShowAddPlacesModal] = useState(false);

  useEffect(() => {
    const unsubscribe = demoStore.subscribe(() => {
      setUser(demoStore.getUser());
      const locs = demoStore.getLocations();
      setLocations(locs);
      if (!selectedLocationId && locs.length > 0) {
        setSelectedLocationId(locs[0].id);
      }
      setScanEvents(demoStore.getScanEvents());
    });
    return unsubscribe;
  }, [selectedLocationId]);

  const activeLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];

  useEffect(() => {
    if (activeLocation) {
      setEditingProfile(activeLocation.ai_master_profile);
    }
  }, [activeLocation]);

  const handleSaveProfile = () => {
    if (!activeLocation) return;
    demoStore.updateLocation(activeLocation.id, { ai_master_profile: editingProfile });
    setIsEditing(false);
  };

  const handleDeleteLocation = (id: string) => {
    if (confirm('Are you sure you want to delete this business location?')) {
      demoStore.deleteLocation(id);
      const remaining = demoStore.getLocations();
      if (remaining.length > 0) {
        setSelectedLocationId(remaining[0].id);
      }
    }
  };

  // Metrics
  const locationScans = scanEvents.filter((e) => !activeLocation || e.location_id === activeLocation.id);
  const totalScansCount = locationScans.length;
  const convertedCount = locationScans.filter((e) => e.converted).length;
  const conversionRate = totalScansCount > 0 ? Math.round((convertedCount / totalScansCount) * 100) : 0;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
      {/* Welcome Banner */}
      <div className="liquid-glass" style={{
        padding: '2.5rem',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-input)',
              color: 'var(--text-primary)',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '0.85rem'
            }}>
              <Sparkles size={14} color="var(--ios-amber)" />
              AI Review Growth Engine
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '620px', fontWeight: 500 }}>
              Manage your Google Places setup, tune your location's AI Master Profile, and capture 5-star customer reviews with your QR Studio.
            </p>
          </div>

          <button
            onClick={() => setShowAddPlacesModal(true)}
            className="btn-pill-primary"
          >
            <Plus size={18} />
            Add Google Places Location
          </button>
        </div>
      </div>

      {/* Analytical Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="liquid-glass">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Active Locations</span>
            <Building2 size={18} color="var(--text-primary)" />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {locations.length}
          </p>
          <span style={{ fontSize: '0.8rem', color: 'var(--ios-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <CheckCircle2 size={13} />
            Google Places Verified
          </span>
        </div>

        <div className="liquid-glass">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Total QR Scans</span>
            <QrCode size={18} color="var(--text-primary)" />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalScansCount}
          </p>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Customer touchpoints
          </span>
        </div>

        <div className="liquid-glass">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Reviews Converted</span>
            <Star size={18} color="var(--ios-amber)" fill="var(--ios-amber)" />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--ios-green)' }}>
            {convertedCount}
          </p>
          <span style={{ fontSize: '0.8rem', color: 'var(--ios-green)', fontWeight: 700 }}>
            5-Star Google Reviews
          </span>
        </div>

        <div className="liquid-glass">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Conversion Rate</span>
            <TrendingUp size={18} color="var(--ios-green)" />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {conversionRate}%
          </p>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Scan to Review Copy
          </span>
        </div>
      </div>

      {/* Business Location Selector Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', fontWeight: 800 }}>
            Your Business Locations ({locations.length})
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {locations.map((loc) => {
            const isSelected = activeLocation && loc.id === activeLocation.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocationId(loc.id)}
                style={{
                  padding: '0.75rem 1.35rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--text-primary)' : 'var(--bg-input)',
                  backdropFilter: 'blur(16px)',
                  color: isSelected ? 'var(--bg-card)' : 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 8px 25px rgba(0, 0, 0, 0.15)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <Building2 size={18} color={isSelected ? 'var(--bg-card)' : 'var(--text-primary)'} />
                {loc.business_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddPlacesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{ maxWidth: '650px', width: '100%', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              right: '1rem',
              top: '1rem',
              zIndex: 10
            }}>
              <button
                onClick={() => setShowAddPlacesModal(false)}
                style={{ border: 'none', background: 'var(--bg-input)', color: 'var(--text-primary)', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>
            <GooglePlacesAutocomplete onLocationAdded={(newLoc) => {
              setSelectedLocationId(newLoc.id);
              setShowAddPlacesModal(false);
            }} />
          </div>
        </div>
      )}

      {/* Active Location Workspace */}
      {activeLocation && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Active Location Card */}
          <div className="liquid-glass">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                    {activeLocation.business_name}
                  </h3>
                  <span style={{ backgroundColor: 'rgba(48, 209, 88, 0.15)', border: '1px solid rgba(48, 209, 88, 0.3)', color: 'var(--ios-green)', fontSize: '0.78rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
                    Google Place Verified
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontWeight: 500 }}>
                  {activeLocation.address || 'Verified Google Maps Business Location'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-pill-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.55rem 1.15rem' }}
                >
                  <Edit3 size={16} />
                  {isEditing ? 'Cancel Editing' : 'Edit AI Profile'}
                </button>
                <button
                  onClick={() => handleDeleteLocation(activeLocation.id)}
                  style={{ border: 'none', background: 'rgba(255, 69, 58, 0.15)', color: 'var(--ios-red)', padding: '0.6rem', borderRadius: '50%', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Place ID Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-input)',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              color: 'var(--text-primary)',
              marginBottom: '1.35rem',
              fontWeight: 600
            }}>
              <MapPin size={14} color="var(--ios-blue)" />
              google_place_id: "{activeLocation.google_place_id}"
            </div>

            {/* AI Master Profile Prompt Card */}
            <div style={{
              backgroundColor: 'var(--bg-input)',
              borderRadius: '20px',
              padding: '1.35rem',
              border: '1px solid var(--border-input)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} color="var(--ios-amber)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  AI Master Profile Context
                </h4>
              </div>

              {isEditing ? (
                <div>
                  <textarea
                    rows={4}
                    value={editingProfile}
                    onChange={(e) => setEditingProfile(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '14px',
                      border: '1px solid var(--border-input)',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      outline: 'none',
                      marginBottom: '0.85rem'
                    }}
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="btn-pill-primary"
                    style={{ padding: '0.55rem 1.35rem', fontSize: '0.85rem' }}
                  >
                    Save AI Master Profile
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.65', margin: 0, fontWeight: 500 }}>
                  "{activeLocation.ai_master_profile}"
                </p>
              )}
            </div>
          </div>

          {/* QR Code Studio */}
          <QRCodeStudio location={activeLocation} />

          {/* Scan Events Table */}
          <div className="liquid-glass">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BarChart3 size={20} color="var(--text-primary)" />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                  Recent Scan & Conversion Events
                </h3>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                {locationScans.length} Total Events Logged
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.85rem 0.5rem', fontWeight: 800 }}>Status</th>
                    <th style={{ padding: '0.85rem 0.5rem', fontWeight: 800 }}>Timestamp</th>
                    <th style={{ padding: '0.85rem 0.5rem', fontWeight: 800 }}>Review Variant Chosen</th>
                    <th style={{ padding: '0.85rem 0.5rem', fontWeight: 800 }}>Device User-Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {locationScans.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No scan events recorded yet for this location. Scan the QR code above to trigger your first conversion!
                      </td>
                    </tr>
                  ) : (
                    locationScans.map((evt) => (
                      <tr key={evt.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          {evt.converted ? (
                            <span style={{ backgroundColor: 'rgba(48, 209, 88, 0.15)', border: '1px solid rgba(48, 209, 88, 0.3)', color: 'var(--ios-green)', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <CheckCircle2 size={12} />
                              Review Converted
                            </span>
                          ) : (
                            <span style={{ backgroundColor: 'rgba(255, 214, 10, 0.15)', border: '1px solid rgba(255, 214, 10, 0.3)', color: 'var(--ios-amber)', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem' }}>
                              Scanned
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {new Date(evt.timestamp).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {evt.selected_review_index !== null && evt.selected_review_index !== undefined
                            ? `Card #${evt.selected_review_index + 1}`
                            : 'Pending Selection'}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                          {evt.user_agent}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
