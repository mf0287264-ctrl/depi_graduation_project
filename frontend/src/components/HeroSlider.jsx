import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Zap } from 'lucide-react';

const slides = [
  {
    src: '/assets/hero2.jpg',
    title: 'The Pinnacle of Exotic Engineering',
    subtitle: 'Hand-picked luxury supercars, hypercars & grand tourers reserved for the discerning collector.'
  },
  {
    src: '/assets/hero.png',
    title: 'Uncompromising Performance & Elegance',
    subtitle: 'From Maranello to Sant’Agata Bolognese — explore the apex of automotive artistry.'
  },
  {
    src: '/assets/car5.jpg',
    title: 'Exclusive Inventory. Seamless White-Glove Acquisition.',
    subtitle: 'Certified provenance, multi-point verified mechanical pedigree and bespoke delivery.'
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '65vh',
      minHeight: '480px',
      maxHeight: '680px',
      backgroundColor: '#090a0f',
      overflow: 'hidden'
    }}>
      {/* Background Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: idx === currentIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: 1
          }}
        >
          <img
            src={slide.src}
            alt={slide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.72) contrast(1.05)',
              transform: idx === currentIndex ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease'
            }}
          />
          {/* Gradients */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)'
          }} />
        </div>
      ))}

      {/* Hero Content Overlay */}
      <div className="container-custom" style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: '3rem'
      }}>
        <div style={{ maxWidth: '780px' }} className="fade-in">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(149, 0, 69, 0.4)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(149, 0, 69, 0.6)',
            padding: '6px 14px',
            borderRadius: '20px',
            color: '#f8fafc',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            <Zap size={14} color="#ff3385" />
            Curated Supercar Showroom
          </div>

          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            textShadow: '0 4px 18px rgba(0,0,0,0.8)'
          }}>
            {slides[currentIndex].title}
          </h1>

          <p style={{
            color: '#e2e8f0',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 400,
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '620px',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {slides[currentIndex].subtitle}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="#inventory-section"
              className="btn-primary"
              style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}
            >
              Explore Collection
            </a>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#cbd5e1',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              <ShieldCheck size={18} color="#10b981" />
              100% Verified Provenance
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(6px)',
          color: '#ffffff',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.15)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--brand-magenta)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)'; }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(6px)',
          color: '#ffffff',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.15)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--brand-magenta)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)'; }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicator Dots */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        gap: '8px'
      }}>
        {slides.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? '28px' : '10px',
              height: '10px',
              borderRadius: '5px',
              backgroundColor: idx === currentIndex ? 'var(--brand-magenta)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
