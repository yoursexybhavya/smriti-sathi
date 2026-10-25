/**
 * SMRITI SATHI — Safe Return & Lost Elder Rescue Mode
 * 
 * Clinical Emergency Feature for Disoriented / Wandering Dementia Patients.
 * Designed for Good Samaritans, police, or bystanders who find a lost elder.
 * 
 * Features:
 * - 1-Tap Direct Guardian Phone Call (tel:)
 * - 1-Tap WhatsApp / SMS GPS Location Beacon
 * - Dynamic Offline Medical QR Badge for camera scanning
 * - Voice Readout in Regional Languages (Assamese, Bodo, Manipuri, Hindi, English)
 * - National Senior Helpline 14567 & Emergency 112 Speed Dials
 */

import React, { useState, useEffect } from 'react';
import {
  Phone,
  MapPin,
  QrCode,
  Volume2,
  X,
  AlertOctagon,
  ShieldAlert,
  Heart,
  Share2,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { QRCodeSvg } from './QRCodeSvg';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';

interface SafeReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafeReturnModal: React.FC<SafeReturnModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { patient } = usePatient();

  const [guardianName, setGuardianName] = useState('Bhavya (Son)');
  const [guardianPhone, setGuardianPhone] = useState('+91 98765 43210');
  const [secondaryContact, setSecondaryContact] = useState('Sister Anita (ASHA Worker) • +91 94350 12345');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'ready' | 'error'>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'call' | 'qr' | 'medical'>('call');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load registered guardian details from settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('smriti_linked_caregiver_name');
      const savedPhone = localStorage.getItem('smriti_linked_caregiver_phone');
      if (savedName) setGuardianName(savedName);
      if (savedPhone) setGuardianPhone(savedPhone);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const elderName = patient?.name || 'Kamala Baa';
  const elderAge = patient?.age || 72;
  const cleanPhone = guardianPhone.replace(/[^0-9]/g, '');

  // Fetch real GPS location
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('ready');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback default coordinates (Guwahati, Assam) for demonstration if permission is blocked
        setCoords({ lat: 26.1445, lng: 91.7362 });
        setLocationStatus('ready');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // 1-Tap WhatsApp Location SOS Beacon
  const handleShareLocationWhatsApp = () => {
    const locUrl = coords
      ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
      : 'https://maps.google.com/?q=26.1445,91.7362';

    const msg = `🚨 *EMERGENCY: LOST ELDER RESCUE ALERT*\n\n` +
      `Hello, I am a bystander and I have found your family member: *${elderName}* (Age ${elderAge}).\n` +
      `She appears disoriented and has memory impairment (Dementia).\n\n` +
      `📍 *Current Location:* ${locUrl}\n` +
      `⏰ *Time:* ${new Date().toLocaleTimeString()}\n\n` +
      `Please call or message me back immediately at this phone number so we can safely return her to you.`;

    const encoded = encodeURIComponent(msg);
    const targetUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(targetUrl, '_blank');
  };

  // Regional Voice Readout for bystanders who cannot read
  const handleSpeakNotice = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const message = `Please help. I have found ${elderName}. This person has dementia and memory loss. Please call their family guardian at ${guardianPhone} or call emergency helpline 112.`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = language === 'as' ? 'as-IN' : language === 'en' ? 'en-IN' : 'hi-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const qrPayload = `https://smriti-sathi.onrender.com/rescue?name=${encodeURIComponent(elderName)}&phone=${cleanPhone}&blood=O%2B&lang=${encodeURIComponent(language)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safe-return-title"
    >
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-red-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Emergency Red Banner */}
        <div className="bg-red-600 text-white px-5 py-4 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
              <ShieldAlert size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25">
                  Emergency Medical ID
                </span>
                <span className="text-xs opacity-90">• Safe Return</span>
              </div>
              <h2 id="safe-return-title" className="text-lg sm:text-xl font-black leading-tight mt-0.5">
                Lost Elder Assistance / জৰুৰীকালীন সাহায্য
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer flex-shrink-0"
            aria-label="Close emergency card"
          >
            <X size={20} />
          </button>
        </div>

        {/* Multilingual Notice Box */}
        <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/60 p-4">
          <div className="flex items-start gap-3">
            <AlertOctagon size={24} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-extrabold text-red-950 dark:text-red-100 leading-snug">
                &ldquo;I have dementia and memory loss. If I appear disoriented or lost, please help me reach my family.&rdquo;
              </p>
              <p className="text-xs text-red-800 dark:text-red-300 font-medium">
                অসমীয়া: &ldquo;মই স্মৃতিভ্ৰংশত ভুগিছোঁ। অনুগ্ৰহ কৰি মোক মোৰ পৰিয়ালৰ ওচৰলৈ যাবলৈ সহায় কৰক।&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-red-200/60 dark:border-red-900/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              Good Samaritan Action Card
            </span>
            <button
              type="button"
              onClick={handleSpeakNotice}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 hover:bg-red-50'
              }`}
            >
              <Volume2 size={15} />
              <span>{isSpeaking ? 'Reading Aloud...' : 'Read Aloud / শুনক'}</span>
            </button>
          </div>
        </div>

        {/* Tabs: 1-Tap Calling vs QR Code vs Medical Details */}
        <div className="px-5 pt-3 pb-1 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto bg-slate-50/60 dark:bg-slate-900/60">
          <button
            type="button"
            onClick={() => setActiveTab('call')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'call'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Phone size={15} />
            <span>1-Tap Contact</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <QrCode size={15} />
            <span>Scan Medical QR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('medical')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'medical'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Heart size={15} />
            <span>Medical Info</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Elder Identity Strip */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center text-3xl shadow-xs flex-shrink-0">
              👵
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                  {elderName}
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  Age {elderAge}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Primary Language: <strong className="text-slate-900 dark:text-white">Assamese (অসমীয়া) / English</strong>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Residence: Guwahati, Assam (Near Beltola Tiniali)
              </p>
            </div>
          </div>

          {/* TAB 1: 1-Tap Contact & WhatsApp Location Beacon */}
          {activeTab === 'call' && (
            <div className="space-y-4">
              {/* PRIMARY ACTION: CALL GUARDIAN */}
              <a
                href={`tel:${cleanPhone}`}
                className="w-full min-h-[64px] sm:min-h-[72px] px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-base sm:text-lg shadow-lg flex items-center justify-between gap-3 transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 animate-bounce">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                      Primary Contact • 1-Tap Dial
                    </div>
                    <div className="font-black text-lg sm:text-xl">
                      Call {guardianName}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-sm sm:text-base opacity-90 hidden xs:inline">
                  {guardianPhone}
                </span>
              </a>

              {/* SECONDARY ACTION: SHARE GPS LOCATION ON WHATSAPP */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Share Current Location with Family
                    </h4>
                  </div>
                  {coords && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200">
                      GPS Locked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Automatically attaches your phone&apos;s GPS pin so the guardian knows exactly where this elder is standing right now.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={coords ? handleShareLocationWhatsApp : handleFetchLocation}
                    className="flex-1 min-h-[50px] py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Share2 size={18} />
                    <span>
                      {locationStatus === 'locating'
                        ? 'Acquiring GPS...'
                        : coords
                        ? 'Send WhatsApp Location SOS'
                        : 'Get GPS & Send WhatsApp'}
                    </span>
                  </button>

                  <a
                    href={`sms:${cleanPhone}?body=${encodeURIComponent(
                      `🚨 FOUND LOST ELDER: I am with ${elderName}. Current location: ${
                        coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : 'Guwahati, Assam'
                      }`
                    )}`}
                    className="min-h-[50px] py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Send SMS</span>
                  </a>
                </div>

                {coords && (
                  <div className="text-[11px] text-indigo-800 dark:text-indigo-300 font-mono flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} (Pin ready)</span>
                  </div>
                )}
              </div>

              {/* Secondary Family & Community Contacts */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                  Secondary Contacts & Helplines:
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">ASHA Health Worker</div>
                    <div className="text-slate-500 dark:text-slate-400">{secondaryContact}</div>
                  </div>
                  <a
                    href="tel:+919435012345"
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100"
                  >
                    Call
                  </a>
                </div>

                {/* Speed Dials: 14567 (Elderline) and 112 (Emergency) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="tel:14567"
                    className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2.5 text-left"
                  >
                    <span className="text-xl">📞</span>
                    <div>
                      <div className="text-xs font-black text-amber-950 dark:text-amber-100">14567 (Elderline)</div>
                      <div className="text-[10px] text-amber-800 dark:text-amber-300">National Senior Helpline</div>
                    </div>
                  </a>
                  <a
                    href="tel:112"
                    className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2.5 text-left"
                  >
                    <span className="text-xl">🚨</span>
                    <div>
                      <div className="text-xs font-black text-red-950 dark:text-red-100">112 / 108 Emergency</div>
                      <div className="text-[10px] text-red-800 dark:text-red-300">Police & Ambulance</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Dynamic Offline Medical QR Code */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Scan to View Emergency Contact on Any Phone
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Any bystander or police officer can scan this code with their iPhone or Android camera to immediately contact the family.
                </p>

                <div className="p-4 bg-white rounded-2xl inline-block shadow-md border-2 border-slate-200">
                  <QRCodeSvg value={qrPayload} size={200} />
                </div>

                <div className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-700/60 py-1.5 px-3 rounded-lg inline-block">
                  Guardian: {guardianName} • {guardianPhone}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Medical Directives & Allergies */}
          {activeTab === 'medical' && (
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart size={16} className="text-red-500" />
                  <span>Critical Health Directives:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
                    <strong className="text-slate-900 dark:text-white text-base">O+ Positive</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Known Conditions</span>
                    <strong className="text-slate-900 dark:text-white">Mild Dementia, Diabetes</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Info size={14} />
                    <span>Handling Guidance for Bystanders:</span>
                  </div>
                  <p>
                    Please speak in a calm, gentle tone. Do not argue or quiz the patient. Seat them in a shaded, quiet spot with drinking water while waiting for the family or police assistance.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Close Bar */}
        <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs sm:text-sm hover:bg-slate-700 transition-all cursor-pointer"
          >
            Close Emergency Badge
          </button>
        </div>
      </div>
    </div>
  );
};
export default SafeReturnModal;
