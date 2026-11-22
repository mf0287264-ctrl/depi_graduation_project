import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/HeroSlider';
import FilterBar from '../components/FilterBar';
import CarCard from '../components/CarCard';
import { carService } from '../services/carService';
import { Sparkles, Gauge, ShieldCheck, Flame, Compass, RefreshCw } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    make: 'All',
    model: 'All',
    priceRange: 'All',
    search: '',
    sort: 'featured'
  });

  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    modelsByMake: {},
    stats: {}
  });

  // Scroll reveal for header section
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal({ threshold: 0.1 });

  // Load filter options on mount
  useEffect(() => {
    carService.getFilters().then(data => {
      if (data) setFilterOptions(data);
    }).catch(console.error);
  }, []);

  // Fetch cars whenever filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      carService.searchCars(filters)
        .then(data => {
          if (isMounted) {
            setCars(data);
            setLoading(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            setError(err.message);
            setLoading(false);
          }
        });
    }, 200); // Debounce search typing

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      // Reset model if make changes
      if (key === 'make') {
        updated.model = 'All';
      }
      return updated;
    });
  };

  const handleReset = () => {
    setFilters({
      make: 'All',
      model: 'All',
      priceRange: 'All',
      search: '',
      sort: 'featured'
    });
  };

  // Quick brand shortcuts
  const popularBrands = ['All', 'Ferrari', 'Lamborghini', 'McLaren', 'Porsche', 'Audi', 'Bentley', 'Lexus'];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* Supercar Hero Slider */}
      <HeroSlider />

      {/* Main Container */}
      <div className="container-custom" style={{ paddingBottom: '5rem', position: 'relative' }}>
        {/* Filter Bar with negative top margin overlapping hero */}
        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Fleet Highlight Metric Badges (Scroll Reveal) */}
        <div
          ref={statsRef}
          className={`scroll-reveal ${statsVisible ? 'visible' : ''}`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginTop: '2.5rem',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'transform 0.3s ease'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(149, 0, 69, 0.15), rgba(149, 0, 69, 0.05))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-magenta)'
              }}
            >
              <Flame size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                949 HP
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Peak Fleet Horsepower
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'transform 0.3s ease'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                100%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Verified Mechanical Pedigree
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'transform 0.3s ease'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-gold)'
              }}
            >
              <Gauge size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                2.4 sec
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Fastest 0-60 Sprint
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'transform 0.3s ease'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}
            >
              <Compass size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                VIP
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Enclosed White-Glove Transport
              </div>
            </div>
          </div>
        </div>

        {/* Featured Collection Section */}
        <section id="inventory-section" style={{ marginTop: '3rem' }}>
          {/* Creative Section Header with Scroll Reveal */}
          <div
            ref={headerRef}
            className={`scroll-reveal ${headerVisible ? 'visible' : ''}`}
            style={{
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '1.25rem'
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(149, 0, 69, 0.1)',
                    border: '1px solid rgba(149, 0, 69, 0.25)',
                    color: 'var(--brand-magenta)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '8px'
                  }}
                >
                  <Sparkles size={14} />
                  Curated Supercar Showroom
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                    fontWeight: 900,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15
                  }}
                >
                  Featured <span className="text-gradient-magenta">Collection</span>
                </h2>
              </div>

              {/* Status and Active Count */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'inline-block',
                      boxShadow: '0 0 8px #10b981'
                    }}
                  />
                  Showing <strong style={{ color: 'var(--text-primary)' }}>{cars.length}</strong> rare exotics
                </div>
              </div>
            </div>

            {/* Quick Brand Filter Carousel Bar */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingTop: '1.25rem',
                paddingBottom: '0.5rem',
                scrollbarWidth: 'none'
              }}
            >
              {popularBrands.map(brand => {
                const isSelected = filters.make === brand;
                return (
                  <button
                    key={brand}
                    onClick={() => handleFilterChange('make', brand)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--brand-magenta)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--brand-magenta)' : 'var(--bg-card)',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      boxShadow: isSelected ? '0 4px 14px var(--brand-magenta-glow)' : 'var(--shadow-sm)',
                      transform: isSelected ? 'translateY(-2px)' : 'translateY(0)'
                    }}
                  >
                    {brand === 'All' ? '🌟 All Marques' : brand}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message with Diagnostics and Retry */}
          {error && (
            <div
              style={{
                padding: '2rem',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-lg)',
                color: '#ef4444',
                textAlign: 'center',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.1)'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Catalog Microservice Reconnecting
              </h3>
              <p style={{ maxWidth: '540px', margin: '0 auto 1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {error}
              </p>
              <button
                onClick={handleReset}
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.8rem',
                  fontSize: '0.95rem'
                }}
              >
                <RefreshCw size={16} />
                Reload Inventory
              </button>
            </div>
          )}

          {/* Fluid Loading Skeletons */}
          {loading && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem'
              }}
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  style={{
                    height: '420px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div className="shimmer" style={{ height: '240px', width: '100%' }} />
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1, backgroundColor: 'var(--bg-card)' }}>
                    <div className="shimmer" style={{ height: '16px', width: '35%', borderRadius: '4px' }} />
                    <div className="shimmer" style={{ height: '24px', width: '75%', borderRadius: '4px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                      <div className="shimmer" style={{ height: '32px', borderRadius: '20px' }} />
                      <div className="shimmer" style={{ height: '32px', borderRadius: '20px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Luxury Exotic Cars Grid with Staggered Scroll Animation */}
          {!loading && cars.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem'
              }}
            >
              {cars.map((car, idx) => (
                <CarCard key={car.id} car={car} index={idx} />
              ))}
            </div>
          )}

          {/* Creative Empty State */}
          {!loading && cars.length === 0 && !error && (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                maxWidth: '640px',
                margin: '2rem auto'
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(149, 0, 69, 0.1)',
                  color: 'var(--brand-magenta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}
              >
                <Compass size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                No Matching Exotic Vehicles Found
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                No vehicles match your active filter criteria. Try choosing a different manufacturer, clearing the search query, or resetting filters.
              </p>
              <button
                onClick={handleReset}
                className="btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
              >
                <RefreshCw size={16} />
                Reset Showroom Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}