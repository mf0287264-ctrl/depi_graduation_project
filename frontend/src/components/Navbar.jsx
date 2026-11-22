import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User, Heart, Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ThemeToggle from './ThemeToggle';
import { formatImageUrl } from '../services/api';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--bg-header)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/assets/logo.png"
            alt="HEXA XOTICS"
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span style={{
            fontFamily: 'Arial, sans-serif',
            fontWeight: 900,
            fontSize: '1.4rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--brand-magenta) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            HEXA XOTICS
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/') ? 'var(--brand-magenta)' : 'var(--text-secondary)',
              transition: 'var(--transition-smooth)'
            }}
          >
            <ShoppingBag size={18} />
            Shop
          </Link>

          <Link
            to="/checkout"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/checkout') ? 'var(--brand-magenta)' : 'var(--text-secondary)',
              transition: 'var(--transition-smooth)'
            }}
          >
            <ShoppingCart size={18} />
            Buy
          </Link>

          <Link
            to="/wishlist"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/wishlist') ? 'var(--brand-magenta)' : 'var(--text-secondary)',
              transition: 'var(--transition-smooth)',
              position: 'relative'
            }}
          >
            <Heart size={18} />
            Dream Garage
            {wishlistCount > 0 && (
              <span style={{
                backgroundColor: 'var(--brand-magenta)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '10px',
                marginLeft: '4px'
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link
              to="/account"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/account') ? 'var(--brand-magenta)' : 'var(--text-secondary)',
                transition: 'var(--transition-smooth)'
              }}
            >
              {user?.profile_image ? (
                <img
                  src={formatImageUrl(user.profile_image)}
                  alt="Avatar"
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid var(--brand-magenta)'
                  }}
                  onError={(e) => { e.target.src = '/assets/profile-photo.jpg'; }}
                />
              ) : (
                <User size={18} />
              )}
              <span>{user?.username || 'Account'}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/login') ? 'var(--brand-magenta)' : 'var(--text-secondary)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <LogIn size={18} />
              Sign In
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-btn"
            style={{
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-input)'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.6rem 0',
              fontWeight: 600,
              color: isActive('/') ? 'var(--brand-magenta)' : 'var(--text-primary)',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <ShoppingBag size={18} />
            Shop Inventory
          </Link>

          <Link
            to="/checkout"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.6rem 0',
              fontWeight: 600,
              color: isActive('/checkout') ? 'var(--brand-magenta)' : 'var(--text-primary)',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <ShoppingCart size={18} />
            Buy & Checkout
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.6rem 0',
              fontWeight: 600,
              color: isActive('/wishlist') ? 'var(--brand-magenta)' : 'var(--text-primary)',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <Heart size={18} />
            Dream Garage ({wishlistCount})
          </Link>

          {isAuthenticated ? (
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.6rem 0',
                fontWeight: 600,
                color: isActive('/account') ? 'var(--brand-magenta)' : 'var(--text-primary)',
              }}
            >
              <User size={18} />
              Account Management ({user?.username})
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.6rem 0',
                fontWeight: 600,
                color: 'var(--brand-magenta)',
              }}
            >
              <LogIn size={18} />
              Sign In / Register
            </Link>
          )}
        </div>
      )}

      {/* Responsive Inline CSS for desktop nav display */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
