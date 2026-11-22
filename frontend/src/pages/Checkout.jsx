import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, ShieldCheck, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { carService } from '../services/carService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import { formatImageUrl } from '../services/api';

const TAX_RATE = 0.08;
const DOC_FEE = 299.00;

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, userId, isAuthenticated } = useAuth();

  const carId = searchParams.get('id');

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // CC fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(user?.username || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Processing & Modal state
  const [submitting, setSubmitting] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (carId) {
      setLoading(true);
      carService.getCarById(carId)
        .then(data => {
          setCar(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      // If no ID passed in query, fallback to the first car in catalog
      carService.getAllCars()
        .then(cars => {
          if (cars && cars.length > 0) {
            setCar(cars[0]);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [carId]);

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setCardExpiry(val);
  };

  const handleCvcChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardCvc(val);
  };

  // Calculations
  const basePrice = car ? parseFloat(car.price) : 0;
  const luxuryTax = basePrice * TAX_RATE;
  const totalAmount = basePrice + luxuryTax + DOC_FEE;

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!termsAgreed) {
      setErrorMessage("Please accept the Terms and Conditions to proceed.");
      return;
    }

    if (paymentMethod === 'credit') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setErrorMessage("Please enter a valid 16-digit credit card number.");
        return;
      }
      if (!cardName.trim()) {
        setErrorMessage("Please enter the cardholder's name.");
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setErrorMessage("Please enter a valid expiration date (MM/YY).");
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        setErrorMessage("Please enter a valid 3 or 4-digit CVC code.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const carTitle = car ? `${car.make} ${car.model}` : 'Exotic Supercar';
      const carImage = car ? formatImageUrl(car.image_url) : '/assets/hero2.jpg';
      const formattedTotal = currencyFormatter.format(totalAmount);

      // 1. Record Order in Payment Microservice
      const orderRes = await paymentService.checkout({
        userId: userId || null,
        userEmail: user?.email || 'guest@hexaxotics.com',
        carId: car?.id || null,
        carModel: carTitle,
        basePrice,
        luxuryTax,
        docFee: DOC_FEE,
        totalPrice: totalAmount,
        paymentMethod: paymentMethod === 'credit' ? 'Credit Card' : 'PayPal',
        cardNumber,
        cardholderName: cardName
      });

      // 2. Dispatch Order Confirmation Email via Nodemailer (if email available)
      const recipientEmail = user?.email;
      if (recipientEmail) {
        paymentService.sendOrderEmail({
          userEmail: recipientEmail,
          carModel: carTitle,
          totalPrice: formattedTotal,
          image: carImage
        }).catch(err => console.log("Email dispatch background notice:", err));
      }

      setConfirmedOrder({
        orderId: orderRes.orderId || Math.floor(100000 + Math.random() * 900000),
        carTitle,
        carImage,
        basePrice,
        luxuryTax,
        totalAmount
      });

      setOrderModalOpen(true);
    } catch (err) {
      setErrorMessage("Payment transaction error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Preparing secure checkout session...</p>
      </div>
    );
  }

  return (
    <div className="container-custom" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Back Link */}
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} />
        Return to Showroom
      </Link>

      <h1 style={{
        fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
        fontWeight: 900,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
        marginBottom: '2rem'
      }}>
        Payment & Secure Acquisition
      </h1>

      {errorMessage && (
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: 'var(--radius-md)',
          color: '#ef4444',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Order Summary Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          padding: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: 'var(--brand-magenta)',
            marginBottom: '0.25rem'
          }}>
            Order Summary
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Review vehicle specifications and itemized fees before confirming your transaction.
          </p>

          {/* Car Image Preview */}
          <div style={{
            width: '100%',
            height: '200px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-input)',
            marginBottom: '1.25rem'
          }}>
            <img
              src={car ? formatImageUrl(car.image_url) : '/assets/hero2.jpg'}
              alt={car ? `${car.make} ${car.model}` : 'Car'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = '/assets/hero2.jpg'; }}
            />
          </div>

          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '1.25rem'
          }}>
            {car ? `${car.make} ${car.model}` : 'No Car Selected'}
          </h3>

          {/* Breakdown */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.25rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.95rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Base Vehicle Price</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {currencyFormatter.format(basePrice)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Luxury Vehicle Tax (8%)</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                + {currencyFormatter.format(luxuryTax)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Documentation & Title Fee</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {currencyFormatter.format(DOC_FEE)}
              </span>
            </div>
          </div>

          {/* Total Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: '1.25rem'
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Total Due
            </span>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--brand-magenta)' }}>
              {currencyFormatter.format(totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Method Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          padding: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '0.25rem'
          }}>
            Payment Method
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            All transactions are encrypted with 256-bit bank-grade SSL security.
          </p>

          {/* Credit Card Box */}
          <div style={{
            border: paymentMethod === 'credit' ? '2px solid var(--brand-magenta)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1rem',
            backgroundColor: paymentMethod === 'credit' ? 'var(--bg-input-focus)' : 'var(--bg-input)',
            transition: 'var(--transition-smooth)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'credit'}
                  onChange={() => setPaymentMethod('credit')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--brand-magenta)' }}
                />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Credit / Debit Card</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <CreditCard size={22} color="var(--brand-magenta)" />
              </div>
            </label>

            {paymentMethod === 'credit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="input-field"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Exp Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="input-field"
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      CVC Code
                    </label>
                    <input
                      type="text"
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={handleCvcChange}
                      className="input-field"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PayPal Box */}
          <div style={{
            border: paymentMethod === 'paypal' ? '2px solid var(--brand-magenta)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            backgroundColor: paymentMethod === 'paypal' ? 'var(--bg-input-focus)' : 'var(--bg-input)',
            transition: 'var(--transition-smooth)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="radio"
                  name="payment_choice"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--brand-magenta)' }}
                />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>PayPal Express</span>
              </div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                style={{ height: '22px' }}
              />
            </label>
          </div>

          {/* Terms Agreement */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--brand-magenta)' }}
              />
              <span>
                I agree to the <Link to="/terms" style={{ color: 'var(--brand-magenta)', textDecoration: 'underline' }}>Terms and Conditions</Link> and understand this initiates a verified dealership acquisition contract.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={submitting}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.05rem',
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'wait' : 'pointer'
            }}
          >
            <Lock size={18} />
            {submitting ? 'Processing Transaction...' : 'Confirm Payment & Secure Car'}
          </button>
        </div>
      </div>

      {/* Order Confirmed Modal */}
      {orderModalOpen && confirmedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--modal-overlay)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            maxWidth: '520px',
            width: '100%',
            padding: '2.5rem 2rem',
            textAlign: 'center'
          }} className="fade-in">
            <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem' }} />

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-magenta)', marginBottom: '0.25rem' }}>
              Order Confirmed!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Order ID #{confirmedOrder.orderId} &bull; Confirmation email dispatched
            </p>

            <div style={{
              width: '100%',
              height: '160px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '1rem',
              backgroundColor: 'var(--bg-input)'
            }}>
              <img
                src={confirmedOrder.carImage}
                alt={confirmedOrder.carTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = '/assets/hero2.jpg'; }}
              />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              {confirmedOrder.carTitle}
            </h3>

            <div style={{
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Base Price</span>
                <span>{currencyFormatter.format(confirmedOrder.basePrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Luxury Tax (8%)</span>
                <span>{currencyFormatter.format(confirmedOrder.luxuryTax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Doc Fee</span>
                <span>{currencyFormatter.format(DOC_FEE)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span style={{ color: 'var(--text-primary)' }}>Total Paid</span>
                <span style={{ color: 'var(--brand-magenta)' }}>{currencyFormatter.format(confirmedOrder.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => { setOrderModalOpen(false); navigate('/'); }}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              Return to Showroom
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
