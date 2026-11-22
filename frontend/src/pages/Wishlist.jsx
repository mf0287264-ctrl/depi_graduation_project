import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatImageUrl } from '../services/api';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, loading, removeFromWishlist, removeMultiple } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(wishlist.map(c => Number(c.id)));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectItem = (carId) => {
    const id = Number(carId);
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Please select vehicles to remove first.");
      return;
    }
    if (confirm(`Are you sure you want to remove ${selectedIds.length} vehicle(s) from your Dream Garage?`)) {
      await removeMultiple(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleSingleRemove = async (carId) => {
    if (confirm("Are you sure you want to remove this vehicle from your Dream Garage?")) {
      await removeFromWishlist(carId);
      setSelectedIds(prev => prev.filter(id => id !== Number(carId)));
    }
  };

  // If user is not logged in
  if (!isAuthenticated) {
    return (
      <div className="container-custom" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '520px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          padding: '3rem 2rem'
        }}>
          <Heart size={48} color="var(--brand-magenta)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Access Your Dream Garage
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Please sign in to view, curate, and manage your private collection of the world's finest luxury automobiles.
          </p>
          <Link to="/login" className="btn-primary" style={{ width: '100%' }}>
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Dream Garage Hero */}
      <section style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '3.5rem 1.5rem 3rem'
      }}>
        <div className="container-custom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--brand-magenta)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px'
            }}>
              <Sparkles size={14} />
              Private Collection
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem'
            }}>
              Your Dream Garage Awaits
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Manage your curated selection of the world's most exclusive luxury automobiles. From hypercars to grand tourers, your wishlist reflects your ultimate automotive aspirations.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--brand-magenta)' }}>
              {wishlist.length}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Saved Vehicles
            </div>
          </div>
        </div>
      </section>

      {/* Main Garage Area */}
      <main className="container-custom" style={{ padding: '3rem 1.5rem 5rem' }}>
        {wishlist.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={selectedIds.length === wishlist.length && wishlist.length > 0}
                onChange={toggleSelectAll}
                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-magenta)' }}
              />
              Select All ({selectedIds.length}/{wishlist.length})
            </label>

            <button
              onClick={handleRemoveSelected}
              disabled={selectedIds.length === 0}
              className="btn-danger"
              style={{
                opacity: selectedIds.length === 0 ? 0.5 : 1,
                cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <Trash2 size={16} />
              Remove Selected
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading your dream garage...
          </div>
        )}

        {/* Empty Wishlist */}
        {!loading && wishlist.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Your Dream Garage is Empty
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Explore our exotic fleet and tap the heart icon on any vehicle to add it to your private showroom.
            </p>
            <Link to="/" className="btn-primary">
              Continue Browsing Exotics
            </Link>
          </div>
        )}

        {/* Garage Grid */}
        {!loading && wishlist.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>
            {wishlist.map(car => {
              const isSelected = selectedIds.includes(Number(car.id));
              const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(car.price || 0);

              return (
                <div
                  key={car.id}
                  className="card-luxury"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'var(--bg-card)',
                    border: isSelected ? '2px solid var(--brand-magenta)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Image with Checkbox */}
                  <div style={{
                    position: 'relative',
                    height: '200px',
                    backgroundColor: 'var(--bg-input)'
                  }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectItem(car.id)}
                      aria-label={`Select ${car.make} ${car.model}`}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 10,
                        width: '20px',
                        height: '20px',
                        accentColor: 'var(--brand-magenta)',
                        cursor: 'pointer'
                      }}
                    />

                    <img
                      src={formatImageUrl(car.image_url)}
                      alt={`${car.make} ${car.model}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/assets/hero2.jpg'; }}
                    />
                  </div>

                  {/* Details Body */}
                  <div style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-magenta)', textTransform: 'uppercase' }}>
                      {car.make}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      {car.model}
                    </h3>

                    {/* Specs list */}
                    <ul style={{
                      listStyle: 'none',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      marginBottom: '1rem'
                    }}>
                      <li>&bull; {car.horsepower || 'High Performance'}</li>
                      <li>&bull; 0-60: {car.zero_to_sixty || '3.0s'}</li>
                      <li>&bull; {car.engine || 'Exotic Powertrain'}</li>
                    </ul>

                    {/* Price */}
                    <div style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: 'var(--brand-magenta)',
                      marginBottom: '1.25rem'
                    }}>
                      {formattedPrice}
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: 'auto'
                    }}>
                      <Link
                        to={`/car/${car.id}`}
                        className="btn-primary"
                        style={{ flexGrow: 1, padding: '0.65rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/checkout?id=${car.id}`}
                        className="btn-secondary"
                        style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
                        title="Proceed to Buy"
                      >
                        <ShoppingCart size={16} />
                      </Link>

                      <button
                        onClick={() => handleSingleRemove(car.id)}
                        className="btn-danger"
                        style={{ padding: '0.65rem 0.85rem' }}
                        title="Remove from garage"
                        aria-label="Remove car"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Continue Action */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link to="/" className="btn-secondary" style={{ padding: '0.85rem 2rem' }}>
            Continue Browsing Exotics
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
