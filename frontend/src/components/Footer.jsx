import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-footer)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3rem 1.5rem 2rem',
      marginTop: 'auto',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.5rem'
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/assets/logo.png"
            alt="HEXA XOTICS"
            style={{ height: '32px', width: 'auto' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span style={{
            fontWeight: 900,
            fontSize: '1.2rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)'
          }}>
            HEXA XOTICS
          </span>
        </div>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          maxWidth: '560px',
          lineHeight: 1.6
        }}>
          The ultimate destination for exotic automobile procurement, private acquisitions, and track-ready performance icons.
        </p>

        {/* Footer Navigation Links */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'var(--text-secondary)'
        }}>
          <Link
            to="/privacy"
            style={{ transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--brand-magenta)'; }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}
          >
            Privacy Policy
          </Link>

          <span style={{ color: 'var(--border-strong)' }}>&bull;</span>

          <Link
            to="/terms"
            style={{ transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--brand-magenta)'; }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}
          >
            Terms of Service
          </Link>

          <span style={{ color: 'var(--border-strong)' }}>&bull;</span>

          <Link
            to="/contact"
            style={{ transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--brand-magenta)'; }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}
          >
            Contact Us
          </Link>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          width: '100%',
          paddingTop: '1.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.8rem'
        }}>
          &copy; 2025 HEXA XOTICS. All rights reserved. Precision-engineered luxury dealership platform.
        </div>
      </div>
    </footer>
  );
}
