import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Zap, Gauge, Heart, ShoppingCart,
  ChevronLeft, Award, CheckCircle2, Phone, Mail,
  Share2, Compass, Flame, Check, Sparkles
} from 'lucide-react';
import { carService } from '../services/carService';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatImageUrl } from '../services/api';
import useScrollReveal from '../hooks/useScrollReveal';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [testDriveSubmitted, setTestDriveSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll reveal hooks for fluid motion
  const { ref: specsRef, isVisible: specsVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: conciergeRef, isVisible: conciergeVisible } = useScrollReveal({ threshold: 0.1 });

  const inWishlist = car ? isInWishlist(car.id) : false;

  useEffect(() => {
    setLoading(true);
    carService.getCarById(id)
      .then(data => {
        setCar(data);
        const mainImg = formatImageUrl(data.image_url);
        setActiveImage(mainImg);

        // Parse gallery
        let imgs = [mainImg];
        if (data.gallery) {
          try {
            const parsed = typeof data.gallery === 'string' ? JSON.parse(data.gallery) : data.gallery;
            if (Array.isArray(parsed) && parsed.length > 0) {
              imgs = parsed.map(formatImageUrl);
              if (!imgs.includes(mainImg)) {
                imgs.unshift(mainImg);
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
        setGalleryImages(imgs);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!car) return;

    try {
      if (inWishlist) {
        await removeFromWishlist(car.id);
      } else {
        await addToWishlist(car);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  if (loading) {
    return (
      <div className="container-custom" style={{ padding: '5rem 1.5rem', minHeight: '70vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="shimmer" style={{ width: '100%', height: '460px', borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="shimmer" style={{ height: '260px', borderRadius: 'var(--radius-lg)' }} />
            <div className="shimmer" style={{ height: '260px', borderRadius: 'var(--radius-lg)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container-custom" style={{ padding: '6rem 1.5rem', textAlign: 'center', minHeight: '60vh' }}>
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            backgroundColor: 'var(--bg-card)',
            padding: '3rem 2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <Compass size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Vehicle Unavailable
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            The requested luxury vehicle is currently not listed in our live showroom inventory.
          </p>
          <Link to="/" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
            <ChevronLeft size={18} />
            Return to Exotic Fleet
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(car.price || 0);

  const isHypercar = (car.price && car.price >= 500000) || (car.horsepower && parseInt(car.horsepower) >= 700);

  const keyTelemetry = [
    {
      label: 'Horsepower',
      value: car.horsepower || 'N/A',
      desc: 'Peak dyno output',
      icon: <Zap size={20} color="var(--brand-magenta)" />
    },
    {
      label: '0-60 MPH',
      value: car.zero_to_sixty || 'N/A',
      desc: 'Sprint benchmark',
      icon: <Gauge size={20} color="var(--brand-magenta)" />
    },
    {
      label: 'Top Speed',
      value: car.top_speed || 'N/A',
      desc: 'Track terminal velocity',
      icon: <Flame size={20} color="var(--brand-gold)" />
    },
    {
      label: 'Year & Odometer',
      value: `${car.year} • ${car.mileage || 'Delivery Miles'}`,
      desc: 'Certified provenance',
      icon: <Calendar size={20} color="#10b981" />
    }
  ];

  const fullSpecs = [
    { label: 'Manufacturer / Make', value: car.make, icon: '🏎️' },
    { label: 'Model Series', value: car.model, icon: '🏷️' },
    { label: 'Model Year', value: car.year, icon: '📅' },
    { label: 'Powertrain Engine', value: car.engine || 'High-Output V8/V10/V12', icon: '⚙️' },
    { label: 'Output Rating', value: car.horsepower || 'Bespoke Tune', icon: '🐎' },
    { label: 'Acceleration (0-60)', value: car.zero_to_sixty || 'N/A', icon: '⏱️' },
    { label: 'Maximum Velocity', value: car.top_speed || 'N/A', icon: '🏁' },
    { label: 'Transmission', value: car.transmission || 'Dual-Clutch Automated', icon: '🕹️' },
    { label: 'Current Mileage', value: car.mileage || 'Certified Delivery Miles', icon: '🛣️' },
    { label: 'Exterior Finish', value: car.exterior_color || 'Factory Bespoke', icon: '🎨' },
    { label: 'Interior Upholstery', value: car.interior_color || 'Handcrafted Hide / Alcantara', icon: '🛋️' },
  ];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', paddingBottom: '6rem' }}>
      {/* Top Floating Navigation Bar */}
      <div className="container-custom" style={{ paddingTop: '1.5rem', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              transition: 'all 0.25s ease'
            }}
          >
            <ChevronLeft size={16} />
            Back to Showroom
          </Link>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Share vehicle listing"
            >
              {copiedLink ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handleWishlistToggle}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: inWishlist ? 'var(--brand-magenta)' : 'var(--bg-input)',
                border: inWishlist ? '1px solid var(--brand-magenta)' : '1px solid var(--border-subtle)',
                color: inWishlist ? '#ffffff' : 'var(--text-primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <Heart
                size={14}
                fill={inWishlist ? '#ffffff' : 'none'}
                color={inWishlist ? '#ffffff' : 'currentColor'}
              />
              <span>{inWishlist ? 'Saved in Garage' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Panoramic Supercar Showcase with Fluid Motion */}
      <div className="container-custom" style={{ marginTop: '0.5rem' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(380px, 55vh, 600px)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#090a0f',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Main Display Image */}
          <img
            src={activeImage}
            alt={`${car.make} ${car.model}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onError={(e) => { e.target.src = '/assets/hero2.jpg'; }}
          />

          {/* Vignette Gradients */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(9, 10, 15, 0.95) 0%, rgba(9, 10, 15, 0.3) 50%, rgba(0,0,0,0.5) 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* Hero Overlay Details (Brand, Model, Badge) */}
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '2rem',
              right: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1.5rem',
              zIndex: 5
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(149, 0, 69, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    padding: '5px 12px',
                    borderRadius: '20px'
                  }}
                >
                  {car.make}
                </span>

                {isHypercar && (
                  <span
                    className="glass-pill"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--brand-gold)'
                    }}
                  >
                    <Award size={13} />
                    Flagship Hypercar
                  </span>
                )}
              </div>

              <h1
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: 0,
                  textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                }}
              >
                {car.model}
              </h1>
            </div>

            {/* Price Badge on Hero */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem 1.75rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                textAlign: 'right'
              }}
            >
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                Verified Acquisition Price
              </div>
              <div style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {formattedPrice}
              </div>
            </div>
          </div>
        </div>

        {/* High-Definition Gallery Carousel Strip */}
        {galleryImages.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '1rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              scrollbarWidth: 'none'
            }}
          >
            {galleryImages.map((src, idx) => {
              const isActive = activeImage === src;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImage(src)}
                  style={{
                    position: 'relative',
                    width: '110px',
                    height: '75px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: isActive ? '2px solid var(--brand-magenta)' : '2px solid var(--border-subtle)',
                    opacity: isActive ? 1 : 0.7,
                    transform: isActive ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    flexShrink: 0,
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 14px var(--brand-magenta-glow)' : 'none'
                  }}
                >
                  <img
                    src={src}
                    alt={`Angle ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/assets/hero2.jpg'; }}
                  />
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-magenta)'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Core Details Grid (Two Columns: Telemetry & Acquisition) */}
      <div className="container-custom" style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Cockpit Telemetry & Specs */}
          <div>
            {/* 4 Performance Widgets */}
            <div
              ref={specsRef}
              className={`scroll-reveal ${specsVisible ? 'visible' : ''}`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '2rem'
              }}
            >
              {keyTelemetry.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.3s ease, border-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(149, 0, 69, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {item.icon}
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {item.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '4px' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Comprehensive Technical Specification Table */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={18} color="var(--brand-magenta)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Factory Mechanical & Cosmetic Specs
                </h3>
              </div>

              <div style={{ padding: '0.5rem 1.5rem 1.5rem' }}>
                {fullSpecs.map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: i === fullSpecs.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{spec.icon}</span>
                      <span>{spec.label}</span>
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Provenance & Inspection Guarantee Banner */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(149, 0, 69, 0.1)',
                  color: 'var(--brand-magenta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Award size={26} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  HEXA Certified Masterpiece Pedigree
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Subject to a comprehensive 150-point factory scan, laser chassis alignment, documented maintenance archives, and 12-month comprehensive powertrain warranty.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Concierge Acquisition Panel */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-magenta)', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  Private Showroom Allocation
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {car.year} {car.make} {car.model}
                </h2>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--brand-magenta)', marginTop: '8px' }}>
                  {formattedPrice}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link
                  to={`/checkout?id=${car.id}`}
                  className="btn-primary"
                  style={{
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    width: '100%',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <ShoppingCart size={18} />
                  Acquire / Secure Deposit Reservation
                </Link>

                <button
                  onClick={() => setTestDriveModalOpen(true)}
                  className="btn-secondary"
                  style={{
                    padding: '0.9rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    width: '100%',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  Request Private Test Session
                </button>

                <button
                  onClick={handleWishlistToggle}
                  style={{
                    padding: '0.85rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-strong)',
                    backgroundColor: inWishlist ? 'rgba(149, 0, 69, 0.1)' : 'transparent',
                    color: inWishlist ? 'var(--brand-magenta)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <Heart
                    size={16}
                    fill={inWishlist ? 'var(--brand-magenta)' : 'none'}
                    color={inWishlist ? 'var(--brand-magenta)' : 'currentColor'}
                  />
                  {inWishlist ? 'In Your Dream Garage' : 'Add to Dream Garage'}
                </button>
              </div>

              {/* VIP Benefits List */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Enclosed climate-controlled transport included</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Clean title guarantee & verified CARFAX history</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Trade-in appraisal & bespoke leasing available</span>
                </div>
              </div>

              {/* Concierge Contact Block */}
              <div
                ref={conciergeRef}
                className={`scroll-reveal ${conciergeVisible ? 'visible' : ''}`}
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      HEXA Dedicated Concierge
                    </h5>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      24/7 Supercar Acquisition Advisors
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href="tel:01157460613"
                      className="btn-secondary"
                      style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                      title="Call Dealership"
                    >
                      <Phone size={16} />
                    </a>
                    <a
                      href="mailto:hexaxotics@gmail.com"
                      className="btn-secondary"
                      style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                      title="Email Concierge"
                    >
                      <Mail size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fluid Test Drive Modal with Backdrop Blur */}
      {testDriveModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--modal-overlay)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setTestDriveModalOpen(false);
          }}
        >
          <div
            className="fade-in"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '500px',
              width: '100%',
              padding: '2.5rem',
              position: 'relative'
            }}
          >
            {!testDriveSubmitted ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-magenta)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  <Sparkles size={14} />
                  Exclusive Private Test Session
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                  Test Drive Experience
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                  Schedule a private, track or closed-circuit driving session for the <strong>{car.make} {car.model}</strong> with a certified factory pilot.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); setTestDriveSubmitted(true); }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Full Name
                    </label>
                    <input type="text" required placeholder="Alexander Vance" className="input-field" />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Email Address
                    </label>
                    <input type="email" required placeholder="alexander@luxury.com" className="input-field" />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Phone Number
                    </label>
                    <input type="tel" required placeholder="+1 (555) 019-2834" className="input-field" />
                  </div>

                  <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Preferred Date & Session Time
                    </label>
                    <input type="datetime-local" required className="input-field" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setTestDriveModalOpen(false)}
                      className="btn-secondary"
                      style={{ padding: '0.85rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '0.85rem' }}
                    >
                      Confirm Session
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: '#10b981'
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Private Session Scheduled!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Our VIP automotive concierge will reach out within 2 hours to confirm your private session with the <strong>{car.make} {car.model}</strong>.
                </p>
                <button
                  onClick={() => { setTestDriveModalOpen(false); setTestDriveSubmitted(false); }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}