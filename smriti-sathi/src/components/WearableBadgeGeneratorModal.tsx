/**
 * SMRITI SATHI — Physical Wearable Emergency ID Badge Generator
 * 
 * Allows caregivers to create, customize, and print a laminated wallet card,
 * necklace pendant, or wristband QR for dementia patients who may wander outside.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  CreditCard,
  Heart,
  Phone,
  QrCode,
  Shield,
  Sparkles,
  Check,
} from 'lucide-react';
import { QRCodeSvg } from './QRCodeSvg';
import { usePatient } from '../contexts/PatientContext';

interface WearableBadgeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WearableBadgeGeneratorModal: React.FC<WearableBadgeGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { patient } = usePatient();

  const [elderName, setElderName] = useState(patient?.name || 'Kamala Baa');
  const [elderAge, setElderAge] = useState(String(patient?.age || 72));
  const [guardianName, setGuardianName] = useState('Bhavya (Son)');
  const [guardianPhone, setGuardianPhone] = useState('+91 98765 43210');
  const [secondaryPhone, setSecondaryPhone] = useState('+91 94350 12345 (ASHA)');
  const [bloodGroup, setBloodGroup] = useState('O+ Positive');
  const [address, setAddress] = useState('Beltola Tiniali, Guwahati, Assam - 781028');
  const [conditions, setConditions] = useState('Mild Dementia, Insulin-Dependent');
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [printSuccess, setPrintSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('smriti_linked_caregiver_name');
      const savedPhone = localStorage.getItem('smriti_linked_caregiver_phone');
      if (savedName) setGuardianName(savedName);
      if (savedPhone) setGuardianPhone(savedPhone);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => {
      window.print();
      setPrintSuccess(false);
    }, 300);
  };

  const rescueUrl = `https://smriti-sathi.onrender.com/rescue?name=${encodeURIComponent(
    elderName
  )}&phone=${encodeURIComponent(guardianPhone)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-generator-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shadow-xs">
              <CreditCard size={22} />
            </div>
            <div>
              <h2 id="badge-generator-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Wearable Emergency ID Card Generator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate a physical wallet ID, lanyard badge, or keychain QR for elder safety
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Card Preview Area */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setCardSide('front')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cardSide === 'front'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Front Side
              </button>
              <button
                type="button"
                onClick={() => setCardSide('back')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cardSide === 'back'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Back Side
              </button>
            </div>

            {/* The Physical Card Template (Formatted for Standard 85mm x 54mm Laminated ID) */}
            <div
              id="printable-emergency-badge"
              className="w-full max-w-[380px] aspect-[85/54] rounded-2xl shadow-xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-white text-slate-900 p-4 flex flex-col justify-between relative select-none"
            >
              {cardSide === 'front' ? (
                <>
                  {/* Card Front Top Banner */}
                  <div className="flex items-center justify-between border-b-2 border-red-600 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌸</span>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-red-600">
                          Emergency Medical ID • স্মৃতি সাথী
                        </div>
                        <div className="text-xs font-extrabold text-slate-800">
                          Dementia Safe Return Card
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                      CRITICAL
                    </span>
                  </div>

                  {/* Card Front Mid Body */}
                  <div className="flex items-center gap-3 my-auto">
                    <div className="w-14 h-14 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl flex-shrink-0">
                      👵
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-base text-slate-900 leading-tight">
                        {elderName}
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        Age: {elderAge} • Blood: {bloodGroup}
                      </div>
                      <div className="text-[10px] text-red-700 font-bold mt-0.5 leading-snug">
                        ⚠️ I have Memory Loss. Please help me return home.
                      </div>
                    </div>
                    <div className="flex-shrink-0 bg-white p-1 rounded-lg border border-slate-300">
                      <QRCodeSvg value={rescueUrl} size={64} includeMargin={false} />
                    </div>
                  </div>

                  {/* Card Front Footer Call Guardian */}
                  <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">
                        Guardian ({guardianName}):
                      </span>
                      <strong className="text-emerald-700 font-mono text-xs">{guardianPhone}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Helpline:</span>
                      <strong className="text-red-700 font-mono text-xs">14567 / 112</strong>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Card Back Header */}
                  <div className="border-b border-slate-200 pb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Secondary Emergency Directives
                  </div>

                  <div className="space-y-1.5 text-[11px] my-auto">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Home Address:</span>
                      <span className="text-slate-800 font-medium text-xs leading-snug block">
                        {address}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-[8px] uppercase font-bold text-slate-400 block">Medical Notes:</span>
                        <span className="text-slate-800 font-semibold">{conditions}</span>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-bold text-slate-400 block">ASHA Worker / Doctor:</span>
                        <span className="text-slate-800 font-semibold">{secondaryPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-1 text-[9px] text-slate-500 text-center">
                    Smriti Sathi Patient Care System • Govt. of India SIH Prototype
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form Fields to Customize Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Patient Name
              </label>
              <input
                type="text"
                value={elderName}
                onChange={(e) => setElderName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Guardian Phone Number
              </label>
              <input
                type="tel"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Blood Group
              </label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Secondary / ASHA Contact
              </label>
              <input
                type="text"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Home Address for Safe Return
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Print 2 copies: one for wallet, one for lanyard badge
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Printer size={16} />
              <span>{printSuccess ? 'Printing...' : 'Print Wearable ID Card'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WearableBadgeGeneratorModal;
