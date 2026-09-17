import { useState } from 'react';
import { Lock, X, Delete } from 'lucide-react';
import { usePatient } from '../contexts/PatientContext';
import { useLanguage } from '../contexts/LanguageContext';

interface CaregiverPinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function CaregiverPinModal({ isOpen, onSuccess, onClose }: CaregiverPinModalProps) {
  const { verifyCaregiverPin } = usePatient();
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        verifyCaregiverPin(nextPin).then((isValid) => {
          if (isValid) {
            setPin('');
            onSuccess();
          } else {
            setError(true);
            setPin('');
          }
        });
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 20, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0E1C2D',
          border: '1px solid #284469',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 24px',
          maxWidth: '380px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 114, 71, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF7247',
              }}
            >
              <Lock size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Caregiver & ASHA Access
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A9C4',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={22} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#94A9C4', marginBottom: '20px' }}>
          Enter 4-digit security PIN to access longitudinal cognitive analytics & ASHA sync.
        </p>

        {/* PIN Indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '14px',
            marginBottom: '24px',
          }}
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: error ? '2px solid #EF4444' : isFilled ? '2px solid #38BDF8' : '2px solid #284469',
                  backgroundColor: error ? '#EF4444' : isFilled ? '#38BDF8' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              />
            );
          })}
        </div>

        {error && (
          <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
            Incorrect PIN. (Default PIN is 1234)
          </p>
        )}

        {/* Numpad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              style={{
                height: '56px',
                borderRadius: '12px',
                backgroundColor: '#15253B',
                border: '1px solid #223A57',
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.1s ease',
              }}
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress('0')}
            style={{
              height: '56px',
              borderRadius: '12px',
              backgroundColor: '#15253B',
              border: '1px solid #223A57',
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            0
          </button>
          <button
            onClick={handleDelete}
            style={{
              height: '56px',
              borderRadius: '12px',
              backgroundColor: '#1C2E46',
              border: '1px solid #2B466B',
              color: '#94A9C4',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Delete"
          >
            <Delete size={22} />
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#647B99',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          {t.cancel || 'Cancel'}
        </button>
      </div>
    </div>
  );
}
