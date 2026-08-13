import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Sparkles, Copy, ExternalLink, Check, MapPin, ShieldCheck, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { demoStore } from '../lib/demoStore';
import { generateCustomerReviews } from '../lib/gemini';
import { BusinessLocation, GeneratedReview } from '../lib/types';

export const PublicReviewPage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [location, setLocation] = useState<BusinessLocation | null>(null);
  const [reviews, setReviews] = useState<GeneratedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    let currentLoc = demoStore.getLocationById(locationId || '');
    if (!currentLoc) {
      currentLoc = demoStore.getLocations()[0];
    }
    setLocation(currentLoc);

    if (currentLoc) {
      demoStore.recordScanEvent(currentLoc.id, false);
      setLoading(true);
      generateCustomerReviews(currentLoc.business_name, currentLoc.ai_master_profile)
        .then((res) => {
          setReviews(res.reviews);
        })
        .catch((err) => {
          console.error('Error generating reviews:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [locationId]);

  const handleSelectAndRedirect = async (review: GeneratedReview) => {
    if (!location) return;

    setCopiedIdx(review.index);

    try {
      await navigator.clipboard.writeText(review.review_text);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setToastMessage(`Review #${review.index + 1} Copied! Redirecting to Google...`);
    demoStore.recordScanEvent(location.id, true, review.index);

    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${location.google_place_id}`;

    setTimeout(() => {
      window.location.href = googleReviewUrl;
    }, 1200);
  };

  if (!location) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Location Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Please verify the QR code link.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2.5rem 1rem 5rem',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      <div style={{ maxWidth: '540px', margin: '0 auto', position: 'relative' }}>
        {/* Back to Dashboard Button */}
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease'
        }}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Header Liquid Glass Card */}
        <div className="liquid-glass" style={{
          textAlign: 'center',
          marginBottom: '1.75rem',
          padding: '2.25rem 1.5rem',
          position: 'relative'
        }}>
          {/* 5-Star Rating Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(255, 214, 10, 0.15)',
            border: '1px solid rgba(255, 214, 10, 0.3)',
            color: 'var(--ios-amber)',
            padding: '0.35rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '0.95rem'
          }}>
            <div style={{ display: 'flex', gap: '0.15rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="var(--ios-amber)" color="var(--ios-amber)" />
              ))}
            </div>
            <span style={{ marginLeft: '0.25rem', color: 'var(--text-primary)', fontWeight: 800 }}>5.0 Rating</span>
          </div>

          <h1 style={{ fontSize: '2.1rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.03em' }}>
            {location.business_name}
          </h1>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', margin: 0 }}>
            <MapPin size={16} color="var(--ios-blue)" />
            {location.address || 'Google Maps Verified Location'}
          </p>

          <div style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontSize: '0.88rem',
            color: 'var(--text-primary)',
            fontWeight: 700
          }}>
            <Sparkles size={16} color="var(--ios-blue)" />
            AI-Tailored 5-Star Reviews Ready Below
          </div>
        </div>

        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Touch any card to copy review & open Google
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Takes less than 5 seconds to support us!
          </p>
        </div>

        {/* Reviews Container */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '3.5px solid var(--border-color)',
              borderTopColor: 'var(--text-primary)',
              animation: 'liquidSpin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite',
              margin: '0 auto 1.25rem'
            }} />
            <style>{`@keyframes liquidSpin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Crafting 5-Star Reviews with Gemini AI...
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Matching location profile: "{location.ai_master_profile.substring(0, 42)}..."
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            {reviews.map((rev) => {
              const isCopied = copiedIdx === rev.index;

              return (
                <div
                  key={rev.index}
                  onClick={() => handleSelectAndRedirect(rev)}
                  className="liquid-glass liquid-glass-interactive"
                  style={{
                    borderColor: isCopied ? 'var(--ios-green)' : 'var(--border-color)',
                    boxShadow: isCopied ? '0 20px 50px rgba(48, 209, 88, 0.2)' : undefined
                  }}
                >
                  {/* Card Tone Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <span style={{
                      backgroundColor: rev.tone === 'Detailed' ? 'rgba(10, 132, 255, 0.15)' : rev.tone === 'Concise' ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 214, 10, 0.15)',
                      color: rev.tone === 'Detailed' ? 'var(--ios-blue)' : rev.tone === 'Concise' ? 'var(--ios-green)' : 'var(--ios-amber)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '0.3rem 0.85rem',
                      borderRadius: '9999px',
                      border: `1px solid ${rev.tone === 'Detailed' ? 'rgba(10, 132, 255, 0.3)' : rev.tone === 'Concise' ? 'rgba(48, 209, 88, 0.3)' : 'rgba(255, 214, 10, 0.3)'}`,
                      letterSpacing: '0.04em'
                    }}>
                      {rev.tone} Review Option
                    </span>

                    <div style={{ display: 'flex', gap: '0.15rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="var(--ios-amber)" color="var(--ios-amber)" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p style={{
                    fontSize: '1.05rem',
                    color: 'var(--text-primary)',
                    lineHeight: '1.65',
                    marginBottom: '1.25rem',
                    fontWeight: 600
                  }}>
                    "{rev.review_text}"
                  </p>

                  {/* Hashtags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.35rem' }}>
                    {rev.suggested_tags.map((tag, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-input)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-input)',
                        fontWeight: 600
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Pill CTA Button */}
                  <button
                    className="btn-pill-primary"
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      backgroundColor: isCopied ? 'var(--ios-green)' : 'var(--text-primary)',
                      color: isCopied ? '#FFFFFF' : 'var(--bg-card)',
                      fontWeight: 800
                    }}
                  >
                    {isCopied ? (
                      <>
                        <Check size={18} />
                        Copied! Opening Google Reviews...
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Touch to Copy & Open Google
                        <ExternalLink size={16} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={16} color="var(--ios-green)" />
            Verified Google Review Handoff • NXS Business Support
          </p>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-liquid">
          <Check size={20} color="var(--ios-green)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
