import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
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
          <FileText size={24} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Legal Framework
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Effective: January 2025 &bull; HEXA XOTICS Exotic Vehicle Dealership
        </p>

        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              1. Dealership Representation & Inventory
            </h2>
            <p>
              All vehicles featured on HEXA XOTICS are subject to prior sale, lease, or deposit reservation. While we rigorously ensure specifications, options, and mechanical provenance are precisely represented, final vehicle configuration is verified upon contract execution.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              2. Acquisition & Reservation Deposits
            </h2>
            <p>
              Submitting a checkout reservation through our payment gateway initiates a legally binding vehicle acquisition request. Documentation fees ($299.00) and luxury tax estimates are calculated according to standard statutory rates and finalized during escrow closing.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              3. White-Glove Delivery & Inspection
            </h2>
            <p>
              Upon order confirmation, our logistics department coordinates enclosed transport to the client’s designated location. Full inspection and title assignment take place prior to vehicle handover.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              4. Governing Law
            </h2>
            <p>
              These terms are governed by and construed in accordance with applicable state and federal commercial automotive trade regulations.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
