import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Heart, LogOut, Trash2, Camera, ChevronDown,
  AlertTriangle, CheckCircle2, Shield, Phone, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatImageUrl } from '../services/api';

export default function Account() {
  const navigate = useNavigate();
  const { user, userId, isAuthenticated, logout, updateProfile, updateAvatar, deleteAccount } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [communication, setCommunication] = useState('email');
  const [avatarPreview, setAvatarPreview] = useState('/assets/profile-photo.jpg');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      if (user.profile_image) {
        setAvatarPreview(formatImageUrl(user.profile_image));
      }
    }
  }, [user, isAuthenticated, navigate]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await updateAvatar(file);
      if (res && res.imageUrl) {
        setAvatarPreview(formatImageUrl(res.imageUrl));
        setStatusMessage({ type: 'success', text: 'Profile picture updated successfully!' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error uploading image: ' + err.message });
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      await updateProfile({ username, phone });
      setStatusMessage({ type: 'success', text: 'Changes saved successfully!' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to save changes: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure? This action cannot be undone! Your profile and Dream Garage will be permanently deleted.")) {
      try {
        await deleteAccount();
        alert("Account has been deleted.");
        navigate('/signup');
      } catch (err) {
        alert("Failed to delete account: " + err.message);
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container-custom" style={{ padding: '3rem 1.5rem 5rem' }}>
      <h1 style={{
        fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
        fontWeight: 900,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
        marginBottom: '2rem'
      }}>
        Account Management
      </h1>

      {statusMessage.text && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          backgroundColor: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${statusMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: statusMessage.type === 'success' ? '#10b981' : '#ef4444',
          fontSize: '0.9rem'
        }}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile Tab */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--brand-magenta)',
            fontWeight: 700,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <User size={20} />
            <span>Profile Dashboard</span>
          </div>

          {/* My Shopping Box */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              My Shopping
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Access your saved luxury vehicles and curated showcase.
            </p>
            <Link
              to="/wishlist"
              className="btn-secondary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', justifyContent: 'center' }}
            >
              <Heart size={16} />
              Open Dream Garage
            </Link>
          </div>

          {/* Account Actions Drawer */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)'
          }}>
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              style={{
                width: '100%',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderBottom: drawerOpen ? '1px solid var(--border-subtle)' : 'none'
              }}
            >
              <span>Account Actions</span>
              <ChevronDown
                size={18}
                style={{
                  transform: drawerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {drawerOpen && (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                    <AlertTriangle size={15} color="#eab308" />
                    <span>Log Out</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    You will need to sign back in to access saved items.
                  </p>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary"
                    style={{ width: '100%', padding: '0.65rem' }}
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem', color: '#ef4444', marginBottom: '2px' }}>
                    <Trash2 size={15} />
                    <span>Delete Account</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Permanently delete your profile and all wishlist data.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn-danger"
                    style={{ width: '100%', padding: '0.65rem' }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Main Content: Profile Information Form */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          padding: '2.5rem 2rem'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Profile Information
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Update your personal details and communication preferences.
          </p>

          {/* Avatar Upload Area */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '2rem',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--brand-magenta)',
              flexShrink: 0
            }}>
              <img
                src={avatarPreview}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = '/assets/profile-photo.jpg'; }}
              />
            </div>

            <div>
              <input
                type="file"
                id="avatar-input"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('avatar-input').click()}
                className="btn-secondary"
                style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
              >
                <Camera size={16} />
                Change Avatar
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                JPG, PNG, or WEBP up to 5MB.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveChanges}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Full Name / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Email Address (Permanent Account ID)
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="input-field"
                style={{ opacity: 0.75, cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter contact phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Preferred Communication Channel
              </label>
              <select
                value={communication}
                onChange={(e) => setCommunication(e.target.value)}
                className="input-field"
              >
                <option value="email">Email Concierge</option>
                <option value="phone">Direct Phone Calls</option>
                <option value="whatsapp">WhatsApp VIP Messenger</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setUsername(user?.username || '');
                  setPhone(user?.phone || '');
                }}
                className="btn-secondary"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
