import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Gauge, Zap, Calendar, ArrowRight, ShieldCheck, Sparkles, Flame } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatImageUrl } from '../services/api';
import useScrollReveal from '../hooks/useScrollReveal';

export default function CarCard({ car, index = 0 }) {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Scroll reveal hook for fluid scroll-in motion
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const inWishlist = isInWishlist(car.id);

  // Stagger index (1 through 6)
  const staggerClass = `stagger-${(index % 6) + 1}`;

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(car.id);
      } else {
        await addToWishlist(car);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(car.price || 0);

  const isHypercar = (car.price && car.price >= 500000) || (car.horsepower && parseInt(car.horsepower) >= 700);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${staggerClass} ${isVisible ? 'visible' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: '100%' }}
    >
      <div
        className="card-exotic card-hover-lift"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Top Image Showcase */}
        <div
          className="img-zoom-container"
          style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            backgroundColor: 'var(--bg-input)',
            overflow: 'hidden'
          }}
        >
          <img
            src={formatImageUrl(car.image_url)}
            alt={`${car.make} ${car.model}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => { e.target.src = '/assets/hero2.jpg'; }}
          />

          {/* Cinematic Vignette Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(9, 10, 15, 0.85) 0%, rgba(9, 10, 15, 0.2) 45%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          {/* Top Left Badges: Year & Hypercar Status */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              zIndex: 3
            }}
          >
            <span
              className="glass-pill"
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 9px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Calendar size={12} />
              {car.year}
            </span>

            {isHypercar && (
              <span
                style={{
                  background: 'linear-gradient(135deg, #ff0055, #950045)',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '4px 8px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  boxShadow: '0 2px 8px rgba(225, 29, 72, 0.5)'
                }}
              >
                <Flame size={11} />
                Apex Tier
              </span>
            )}
          </div>

          {/* Wishlist Button with Interactive Bounce */}
          <button
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
            aria-label={inWishlist ? "Remove from Dream Garage" : "Add to Dream Garage"}
            className="glass-pill"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 3,
              backgroundColor: inWishlist ? 'var(--brand-magenta)' : 'rgba(15, 23, 42, 0.7)',
              borderColor: inWishlist ? 'var(--brand-magenta)' : 'rgba(255, 255, 255, 0.25)',
              transform: inWishlist ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <Heart
              size={18}
              fill={inWishlist ? '#ffffff' : 'none'}
              color={inWishlist ? '#ffffff' : '#f1f5f9'}
              style={{
                transition: 'transform 0.2s ease',
                transform: inWishlist ? 'scale(1.15)' : 'scale(1)'
              }}
            />
          </button>

          {/* Floating Price Pill in Image Bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              zIndex: 3
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.75)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '2px'
                }}
              >
                Acquisition Price
              </div>
              <div
                style={{
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
                }}
              >
                {formattedPrice}
              </div>
            </div>

            {car.mileage && (
              <span
                className="glass-pill"
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 8px',
                  borderRadius: '12px'
                }}
              >
                {car.mileage}
              </span>
            )}
          </div>
        </div>

        {/* Card Content & Details */}
        <div
          style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            zIndex: 2
          }}
        >
          {/* Make Badge & Model Name */}
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--brand-magenta)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '4px'
              }}
            >
              <span>{car.make}</span>
            </div>

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.25,
                margin: 0
              }}
            >
              {car.model}
            </h3>
          </div>

          {/* Performance Specs Grid (Micro-Chips) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '1.25rem'
            }}
          >
            {car.horsepower && (
              <div className="spec-pill" title="Horsepower">
                <Zap size={13} color="var(--brand-magenta)" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{car.horsepower}</span>
              </div>
            )}

            {car.zero_to_sixty && (
              <div className="spec-pill" title="0-60 Acceleration">
                <Gauge size={13} color="var(--brand-magenta)" style={{ flexShrink: 0 }} />
                <span>0-60: <strong style={{ color: 'var(--text-primary)' }}>{car.zero_to_sixty}</strong></span>
              </div>
            )}

            {car.top_speed && (
              <div className="spec-pill" title="Top Track Speed">
                <span style={{ fontSize: '11px', color: 'var(--brand-gold)' }}>⚡</span>
                <span>Max: <strong style={{ color: 'var(--text-primary)' }}>{car.top_speed}</strong></span>
              </div>
            )}

            {car.transmission && (
              <div className="spec-pill" title="Transmission">
                <span style={{ fontSize: '11px' }}>🕹️</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {car.transmission.split(' ')[0]}
                </span>
              </div>
            )}
          </div>

          {/* Engine Sub-bar if present */}
          {car.engine && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '1.25rem',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '12px' }}>⚙️</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {car.engine}
              </span>
            </div>
          )}

          {/* Action CTAs */}
          <div
            style={{
              marginTop: 'auto',
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '8px'
            }}
          >
            <Link
              to={`/car/${car.id}`}
              style={{
                padding: '0.7rem 0.6rem',
                textAlign: 'center',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 700,
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-magenta)';
                e.currentTarget.style.color = 'var(--brand-magenta)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              Specifications
              <ArrowRight
                size={14}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: isHovered ? 'translateX(3px)' : 'translateX(0)'
                }}
              />
            </Link>

            <Link
              to={`/checkout?id=${car.id}`}
              className="btn-primary"
              style={{
                padding: '0.7rem 0.6rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                boxShadow: isHovered ? '0 4px 16px var(--brand-magenta-glow)' : 'none'
              }}
            >
              Reserve
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}