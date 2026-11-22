import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container-custom" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem'
        }}>
          Get in Touch with Us
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          We're here to assist with exotic automobile inquiries, bespoke acquisitions, and private showroom viewings.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Message Form */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          padding: '2.5rem 2rem'
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Send us a Message
          </h2>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Message Dispatched!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Thank you for reaching out. A dedicated HEXA XOTICS client advisor will respond within 4 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ fullName: '', email: '', message: '' });
                }}
                className="btn-secondary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="hexaxotics"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="hexaxotics@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Your Message
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Inquire about vehicle availability, trade-in valuations, or scheduling a private viewing..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                <Send size={16} />
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Details Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          padding: '2.5rem 2rem'
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.75rem' }}>
            Our Details
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(149, 0, 69, 0.1)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--brand-magenta)'
              }}>
                <MapPin size={22} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  Dealership & Showroom
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                  HEXA XOTICS Prime Supercar Gallery
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(149, 0, 69, 0.1)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--brand-magenta)'
              }}>
                <Phone size={22} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  Direct Concierge
                </p>
                <a
                  href="tel:01157460613"
                  style={{ color: 'var(--brand-magenta)', fontSize: '0.9rem', fontWeight: 600, display: 'block', marginTop: '2px' }}
                >
                  01157460613
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(149, 0, 69, 0.1)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--brand-magenta)'
              }}>
                <Mail size={22} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  Official Email
                </p>
                <a
                  href="mailto:hexaxotics@gmail.com"
                  style={{ color: 'var(--brand-magenta)', fontSize: '0.9rem', fontWeight: 600, display: 'block', marginTop: '2px' }}
                >
                  hexaxotics@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
