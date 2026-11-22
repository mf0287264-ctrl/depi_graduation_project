import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

export default function FilterBar({
  filters,
  filterOptions,
  onFilterChange,
  onReset
}) {
  const availableModels = (filters.make && filterOptions?.modelsByMake?.[filters.make])
    ? filterOptions.modelsByMake[filters.make]
    : [];

  const hasActiveFilters =
    filters.make !== 'All' ||
    filters.model !== 'All' ||
    filters.priceRange !== 'All' ||
    Boolean(filters.search) ||
    filters.sort !== 'featured';

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginTop: '-3.5rem',
        position: 'relative',
        zIndex: 25,
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.25)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Top Header of Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-magenta)' }}>
          <SlidersHorizontal size={16} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Precision Fleet Search
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--brand-magenta)',
              cursor: 'pointer',
              backgroundColor: 'rgba(149, 0, 69, 0.1)',
              padding: '4px 10px',
              borderRadius: '20px',
              border: 'none',
              transition: 'background-color 0.2s ease'
            }}
          >
            <X size={12} />
            Clear Active Filters
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        {/* Make Dropdown */}
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
            Marque / Make
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={filters.make}
              onChange={(e) => onFilterChange('make', e.target.value)}
              className="input-field"
              style={{
                paddingRight: '2.5rem',
                appearance: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                height: '46px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <option value="All">All Marques</option>
              {filterOptions?.makes?.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}
            />
          </div>
        </div>

        {/* Model Dropdown */}
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
            Model Line
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={filters.model}
              onChange={(e) => onFilterChange('model', e.target.value)}
              className="input-field"
              style={{
                paddingRight: '2.5rem',
                appearance: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                height: '46px',
                borderRadius: 'var(--radius-md)'
              }}
              disabled={filters.make === 'All' && availableModels.length === 0}
            >
              <option value="All">All Models</option>
              {availableModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}
            />
          </div>
        </div>

        {/* Price Range Dropdown */}
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
            Price Range
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={filters.priceRange}
              onChange={(e) => onFilterChange('priceRange', e.target.value)}
              className="input-field"
              style={{
                paddingRight: '2.5rem',
                appearance: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                height: '46px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <option value="All">All Price Tiers</option>
              <option value="$100k - $200k">$100k - $200k</option>
              <option value="$200k - $500k">$200k - $500k</option>
              <option value="$500k+">$500,000+ (Apex Tier)</option>
            </select>
            <ChevronDown
              size={16}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
            Sort Ordering
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="input-field"
              style={{
                paddingRight: '2.5rem',
                appearance: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                height: '46px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_desc">Year: Newest First</option>
              <option value="year_asc">Year: Oldest First</option>
            </select>
            <ChevronDown
              size={16}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}
            />
          </div>
        </div>
      </div>

      {/* Search Input & Reset Button */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search by model, horsepower, engine specs, finish, year..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="input-field"
            style={{
              paddingLeft: '2.75rem',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.92rem'
            }}
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={onReset}
          className="btn-secondary"
          style={{
            height: '48px',
            padding: '0 1.5rem',
            whiteSpace: 'nowrap',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.88rem'
          }}
          title="Reset all filters"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}