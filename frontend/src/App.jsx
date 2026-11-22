import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home.html" element={<Navigate to="/" replace />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/cardetails.html" element={<CarDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/wishlist.html" element={<Navigate to="/wishlist" replace />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment.html" element={<Navigate to="/checkout" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin.html" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup.html" element={<Navigate to="/signup" replace />} />
          <Route path="/account" element={<Account />} />
          <Route path="/acountmangment.html" element={<Navigate to="/account" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contactUS.html" element={<Navigate to="/contact" replace />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacyandpolicy.html" element={<Navigate to="/privacy" replace />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/terms.html" element={<Navigate to="/terms" replace />} />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
