import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, ExternalLink, Printer, Sparkles, Check, QrCode, X } from 'lucide-react';
import { BusinessLocation } from '../lib/types';

interface QRCodeStudioProps {
  location: BusinessLocation;
}

export const QRCodeStudio: React.FC<QRCodeStudioProps> = ({ location }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const reviewUrl = `${window.location.origin}/review/${location.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    // Create high-resolution liquid glass styled canvas for download
    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    exportCanvas.width = 600;
    exportCanvas.height = 750;

    // Dark Mesh Background
    const grad = ctx.createLinearGradient(0, 0, 600, 750);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(0.5, '#1E1B4B');
    grad.addColorStop(1, '#311042');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 750);

    // Accent Glass Top Bar
    const topGrad = ctx.createLinearGradient(0, 0, 600, 0);
    topGrad.addColorStop(0, '#0284C7');
    topGrad.addColorStop(0.5, '#7E22CE');
    topGrad.addColorStop(1, '#EA580C');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, 600, 16);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(location.business_name, 300, 85);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '18px Plus Jakarta Sans, sans-serif';
    ctx.fillText('Scan for 5-Star Google Review', 300, 120);

    // QR Code Container Box
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(90, 150, 420, 420);

    // QR Image
    ctx.drawImage(canvas, 100, 160, 400, 400);

    // Footer CTA
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
    ctx.fillText('★ Touch & Share Your 5-Star Experience ★', 300, 615);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '14px Plus Jakarta Sans, sans-serif';
    ctx.fillText('Powered by NXS Business Support AI', 300, 665);

    const link = document.createElement('a');
    link.download = `NXS_QR_${location.business_name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="liquid-glass">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            <QrCode size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              QR Code Studio
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Dynamic review handoff pass for {location.business_name}
            </p>
          </div>
        </div>

        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill-secondary"
          style={{ textDecoration: 'none', fontSize: '0.82rem', padding: '0.5rem 1rem' }}
        >
          <span>Test Live Link</span>
          <ExternalLink size={15} />
        </a>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.75rem',
        alignItems: 'center'
      }}>
        {/* QR Canvas Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: 'var(--bg-input)',
          borderRadius: '24px',
          border: '1px dashed var(--border-input)',
          position: 'relative'
        }}>
          <div ref={qrRef} style={{
            backgroundColor: '#FFFFFF',
            padding: '1.25rem',
            borderRadius: '20px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
            marginBottom: '1rem'
          }}>
            <QRCodeCanvas
              value={reviewUrl}
              size={200}
              level="H"
              includeMargin={false}
              fgColor="#0F172A"
              bgColor="#FFFFFF"
            />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} color="var(--ios-green)" />
            Scan with phone camera
          </span>
        </div>

        {/* Action Controls */}
        <div>
          <div style={{ marginBottom: '1.35rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Customer Handoff URL
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '16px',
              padding: '0.55rem 0.85rem',
              border: '1px solid var(--border-input)'
            }}>
              <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {reviewUrl}
              </span>
              <button
                onClick={handleCopyLink}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: copied ? 'var(--ios-green)' : 'var(--text-primary)',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button
              onClick={handleDownloadPNG}
              className="btn-pill-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Download size={18} />
              Download High-Res PNG QR Code
            </button>

            <button
              onClick={() => setShowPrintModal(true)}
              className="btn-pill-secondary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <Printer size={18} />
              Preview Counter Standee Template
            </button>
          </div>
        </div>
      </div>

      {/* Print Standee Modal */}
      {showPrintModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div className="liquid-glass" style={{
            padding: '2.5rem',
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            <h4 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Counter Table Standee
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Print and place at your reception desk or dining tables
            </p>

            {/* Standee Graphic */}
            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '2rem 1.5rem',
              backgroundColor: 'var(--bg-input)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
              marginBottom: '1.5rem'
            }}>
              <h5 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {location.business_name}
              </h5>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '1.25rem' }}>
                How was your visit today?
              </p>
              
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '1rem',
                borderRadius: '18px',
                display: 'inline-block',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                marginBottom: '1rem'
              }}>
                <QRCodeCanvas value={reviewUrl} size={160} level="H" />
              </div>

              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Scan to leave a 5-Star Google Review
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Takes less than 10 seconds!
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => window.print()}
                className="btn-pill-primary"
                style={{ flex: 1 }}
              >
                <Printer size={16} />
                Print Now
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="btn-pill-secondary"
                style={{ flex: 1 }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
