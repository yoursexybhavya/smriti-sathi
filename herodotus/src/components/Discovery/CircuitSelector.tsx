import React from 'react';
import { X, BookOpen, Clock, MapPin, ArrowRight, Check } from 'lucide-react';
import { Circuit } from '../../types/monument';
import { CIRCUITS } from '../../data/circuits';

export interface CircuitSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCircuit: (circuit: Circuit) => void;
  onClearCircuit: () => void;
  activeCircuitId: string | null;
}

export const CircuitSelector: React.FC<CircuitSelectorProps> = ({
  isOpen,
  onClose,
  onSelectCircuit,
  onClearCircuit,
  activeCircuitId,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="circuits-modal-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#161310] border border-[#2E2A25] rounded-3xl shadow-2xl p-5 sm:p-6 z-10 overflow-hidden space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2E2A25] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C69214]/15 border border-[#C69214]/40 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#C69214]" />
            </div>
            <div>
              <h2
                id="circuits-modal-title"
                className="font-serif text-lg sm:text-xl font-bold text-[#FFFFFF] tracking-wide"
              >
                Curated Heritage Circuits
              </h2>
              <p className="text-xs text-[#8A8279]">
                Thematic journeys through 4,000 years of living history
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1A1714] text-[#8A8279] hover:text-[#FFFFFF] border border-[#2E2A25] transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Circuits List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[62vh] overflow-y-auto pr-1">
          {CIRCUITS.map((circuit) => {
            const isActive = activeCircuitId === circuit.id;
            return (
              <div
                key={circuit.id}
                onClick={() => {
                  if (isActive) {
                    onClearCircuit();
                  } else {
                    onSelectCircuit(circuit);
                  }
                  onClose();
                }}
                className={`cursor-pointer rounded-2xl p-4 border transition flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-[#25201A] border-[#C69214] shadow-lg shadow-[#C69214]/25 ring-1 ring-[#C69214]'
                    : 'bg-[#1A1714] hover:bg-[#201C18] border-[#2E2A25] hover:border-[#3E3830]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#C69214] font-semibold tracking-wider">
                      {circuit.subtitle}
                    </span>
                    <span className="text-[#8A8279] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~{circuit.approxDays} Days
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#FFFFFF] leading-snug">
                    {circuit.name}
                  </h3>
                  <p className="text-xs text-[#8A8279] line-clamp-2 leading-relaxed">
                    {circuit.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#2E2A25]/60 text-xs">
                  <span className="text-[#D4A856] font-mono text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C69214]" />
                    {circuit.monumentIds.length} Monuments
                  </span>
                  <span
                    className={`flex items-center gap-1 font-semibold text-xs ${
                      isActive ? 'text-[#D4A856]' : 'text-[#C69214]'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <span>Load Route</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / Clear Active Circuit */}
        {activeCircuitId && (
          <div className="flex items-center justify-between pt-3 border-t border-[#2E2A25] text-xs">
            <span className="text-[#8A8279]">A circuit is currently active on the map.</span>
            <button
              onClick={() => {
                onClearCircuit();
                onClose();
              }}
              className="text-[#D4A856] hover:text-[#FFFFFF] underline transition"
            >
              Reset to All Monuments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
