import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="container-custom" style={{ padding: '3.5rem 1.5rem 5rem', maxWidth: '900px' }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        padding: '3rem 2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--brand-magenta)', marginBottom: '0.5rem' }}>
          <Shield size={24} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Client Privacy Assurance
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Last updated: January 2025 &bull; HEXA XOTICS Automotive Group
        </p>

        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              1. Information Collection
            </h2>
            <p>
              HEXA XOTICS collects personal information including name, email address, phone number, and acquisition preferences when you register, curate your Dream Garage, request private test drives, or submit an acquisition reservation.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              2. Use of Information
            </h2>
            <p>
              Your information is utilized solely to process vehicle acquisitions, manage concierge communications, transmit transactional order confirmations via Nodemailer, and personalize your luxury automotive experience. We never monetize or sell client data to third parties.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              3. Security & Financial Data Protection
            </h2>
            <p>
              Payment data and transaction credentials are strictly transmitted using encrypted, PCI-DSS compliant secure protocols. Sensitive credit card numbers are tokenized and never stored in plain text.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              4. Client Rights & Account Deletion
            </h2>
            <p>
              You maintain full authority over your data. You may update your profile, communication preferences, or execute permanent account deletion at any time through the Account Management dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
