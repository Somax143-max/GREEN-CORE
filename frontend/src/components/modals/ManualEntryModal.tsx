import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Building2,
  Database
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { ValidationResult } from '../../engine/dataQualityEngine';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ isOpen, onClose }) => {
  const { nodes, addManualEntry } = useCampus();

  const [nodeId, setNodeId] = useState<string>(nodes[0]?.id || 'cse_block');
  const [category, setCategory] = useState<'energy' | 'water' | 'waste'>('energy');
  const [value, setValue] = useState<string>('32000');
  const [actor, setActor] = useState<string>('Student Eco-Volunteer #204');
  const [reason, setReason] = useState<string>('Weekly manual sub-meter reconciliation check');
  const [hasPhotoProof, setHasPhotoProof] = useState<boolean>(true);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numVal = parseFloat(value);
    if (isNaN(numVal)) return;

    const unit = category === 'energy' ? 'kWh' : category === 'water' ? 'L' : 'kg';

    const result = addManualEntry({
      nodeId,
      category,
      value: numVal,
      unit,
      actor,
      reason,
    });

    setValidationResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Manual Sustainability Reading Log</h3>
              <p className="text-[11px] text-slate-400">College A / Hybrid Data Capture Layer with Anti-Gaming Check</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Node Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Campus Node / Facility</label>
            <select
              value={nodeId}
              onChange={e => setNodeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  {n.code} — {n.name} ({n.type})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory('energy');
                setValue('32000');
              }}
              className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                category === 'energy' 
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚡ Energy (kWh)
            </button>

            <button
              type="button"
              onClick={() => {
                setCategory('water');
                setValue('350000');
              }}
              className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                category === 'water' 
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              💧 Water (Litres)
            </button>

            <button
              type="button"
              onClick={() => {
                setCategory('waste');
                setValue('450');
              }}
              className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                category === 'waste' 
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              ♻️ Waste (kg)
            </button>
          </div>

          {/* Value input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">Reading Value</label>
              <span className="text-[10px] text-slate-400">
                Tip: Enter &lt;100 to test the Anti-Gaming Sentinel
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Enter measured reading..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                required
              />
              <span className="absolute right-3 top-2 text-slate-400 font-mono">
                {category === 'energy' ? 'kWh' : category === 'water' ? 'L' : 'kg'}
              </span>
            </div>
          </div>

          {/* Actor & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Logging Actor</label>
              <input
                type="text"
                value={actor}
                onChange={e => setActor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Audit Reason</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Proof of Reading Checkbox */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-white block">Digital Dial Proof Uploaded</span>
                <span className="text-[10px] text-slate-400">meter_photo_20260927.jpg verified</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hasPhotoProof}
              onChange={e => setHasPhotoProof(e.target.checked)}
              className="accent-cyan-400 w-4 h-4"
            />
          </div>

          {/* Live Validation Alert Result */}
          {validationResult && (
            <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
              validationResult.status === 'Verified'
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                : validationResult.status === 'Flagged'
                ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                : 'bg-amber-950/50 border-amber-500 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {validationResult.status === 'Verified' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span>Anti-Gaming Engine: {validationResult.status}</span>
              </div>
              <p className="text-[11px] leading-snug">
                {validationResult.suggestedAction}
              </p>
              {validationResult.flags.length > 0 && (
                <div className="pt-1 border-t border-slate-800 text-[10px] text-rose-300">
                  Flags: {validationResult.flags.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/50 transition-all flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Verify & Submit to Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
