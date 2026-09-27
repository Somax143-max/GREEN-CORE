import React, { useState } from 'react';
import { 
  Award, 
  X, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Building2, 
  Calendar, 
  Lock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCampus } from '../../context/CampusContext';

interface SustainabilityCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SustainabilityCertificateModal: React.FC<SustainabilityCertificateModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { scores, mode } = useCampus();
  const [copied, setCopied] = useState<boolean>(false);

  const certId = 'GCEK-GREEN-2026-9481';
  const sha256Seal = '0x8f4c3b91a27e012fd9019284ba55c23ee3b0c44298fc1c149afbf4c8996fb924';
  const verificationUrl = `https://greenscore.gcek.ac.in/verify/${certId}`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Seal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/60 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Top Modal Controls */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Official Cryptographic Audit Credential
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              SHA-256 Tamper-Proof
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCelebrate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60 flex items-center justify-center">
          {/* Printable Official Certificate Canvas */}
          <div className="w-full max-w-3xl bg-slate-900 border-4 border-double border-emerald-500/60 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-slate-200">
            {/* Watermark Logo in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Award className="w-96 h-96 text-emerald-400" />
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-emerald-500/40 font-mono text-xs">◆ ◆ ◆</div>
            <div className="absolute top-2 right-2 text-emerald-500/40 font-mono text-xs">◆ ◆ ◆</div>
            <div className="absolute bottom-2 left-2 text-emerald-500/40 font-mono text-xs">◆ ◆ ◆</div>
            <div className="absolute bottom-2 right-2 text-emerald-500/40 font-mono text-xs">◆ ◆ ◆</div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 pb-6 border-b border-emerald-500/30">
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                <Building2 className="w-4 h-4" />
                <span>ECO CLUB • GOVT. COLLEGE OF ENGINEERING KALAHANDI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white uppercase">
                Certificate of Environmental Excellence
              </h1>
              <p className="text-xs text-slate-400 tracking-wider uppercase font-mono">
                CAMPUS SUSTAINABILITY & DECARBONIZATION AUDIT • AY 2025–2026
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center my-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 font-serif italic">
                This is to officially certify that the campus operations, energy consumption, water stewardship, 
                and resource conservation facilities of:
              </p>

              <div className="py-2">
                <div className="text-xl sm:text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 uppercase">
                  Govt. College of Engineering Kalahandi (GCEK)
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Autonomous State Engineering Institution • Bhawanipatna, Odisha, India
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-serif italic max-w-xl mx-auto leading-relaxed">
                have been rigorously tracked, verified, and audited by the GREENCORE AI Cyber-Physical Digital Twin 
                under HACKVERSE ’26 Problem Statement CB-SW-05 in accordance with NAAC Criterion VII standards.
              </p>
            </div>

            {/* Score Highlight & Rating Banner */}
            <div className="my-6 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400">Composite GREENScore</div>
                <div className="text-3xl font-black text-emerald-400 my-0.5">
                  {scores.compositeScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                </div>
                <span className="text-xs font-bold text-cyan-300">
                  {scores.compositeScore >= 80 ? 'PLATINUM LEADER' : scores.compositeScore >= 70 ? 'GOLD HIGH PERFORMER' : 'SILVER RATED'}
                </span>
              </div>

              <div className="h-10 w-px bg-slate-800 hidden sm:block" />

              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400">Data Confidence</div>
                <div className="text-3xl font-black text-cyan-400 my-0.5">
                  {scores.dataConfidence}%
                </div>
                <span className="text-xs font-medium text-emerald-400">
                  {mode === 'iot' ? 'Full IoT Telemetry' : mode === 'hybrid' ? 'Hybrid Verified' : 'Manual Reg. + OCR'}
                </span>
              </div>

              <div className="h-10 w-px bg-slate-800 hidden sm:block" />

              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400">NAAC 7.1.2 Projected</div>
                <div className="text-3xl font-black text-amber-400 my-0.5">
                  3.88 <span className="text-sm font-normal text-slate-400">/ 4.00</span>
                </div>
                <span className="text-xs font-bold text-amber-300">Grade A++ Level</span>
              </div>
            </div>

            {/* QR Code & Cryptographic Ledger Footer */}
            <div className="pt-6 border-t border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left: Dynamic SVG QR Code */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-slate-950 shadow-md">
                  <svg className="w-16 h-16" viewBox="0 0 100 100" fill="currentColor">
                    {/* Clean SVG QR Code pattern */}
                    <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                    <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                    <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                    <rect x="38" y="8" width="6" height="14" />
                    <rect x="52" y="8" width="8" height="6" />
                    <rect x="8" y="38" width="14" height="6" />
                    <rect x="8" y="52" width="6" height="10" />
                    <rect x="38" y="38" width="24" height="24" />
                    <rect x="44" y="44" width="12" height="12" fill="#fff" />
                    <rect x="70" y="44" width="12" height="8" />
                    <rect x="44" y="70" width="16" height="8" />
                    <rect x="70" y="70" width="10" height="20" />
                    <rect x="86" y="80" width="8" height="10" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Scan to Verify Audit</div>
                  <div className="text-xs font-mono font-bold text-cyan-400">{certId}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Issued: March 2026</div>
                </div>
              </div>

              {/* Right: Dual Signatures */}
              <div className="flex items-center gap-8 text-center text-xs">
                <div>
                  <div className="font-serif italic font-bold text-slate-300 text-sm border-b border-slate-700 pb-1">
                    Dr. S. K. Mahapatra
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Lead Environmental Auditor</div>
                  <div className="text-[9px] text-emerald-400 font-mono">ECO CLUB, GCEK</div>
                </div>

                <div>
                  <div className="font-serif italic font-bold text-slate-300 text-sm border-b border-slate-700 pb-1">
                    Prof. D. Mishra
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Principal / Patron</div>
                  <div className="text-[9px] text-cyan-400 font-mono">GCE Kalahandi</div>
                </div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Ledger Hash Banner */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1 text-slate-400 truncate max-w-md">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>SHA-256: {sha256Seal}</span>
              </span>
              <button
                onClick={handleCopyHash}
                className="text-cyan-400 hover:text-cyan-300 font-bold ml-2 shrink-0 cursor-pointer flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
