import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FalsePositiveFeedbackModal: React.FC = () => {
  const { 
    isFalsePositiveModalOpen, setIsFalsePositiveModalOpen,
    falsePositiveTargetIncident, setFalsePositiveTargetIncident,
    markFalsePositive 
  } = useApp();

  const [category, setCategory] = useState<string>('WILDLIFE');
  const [comment, setComment] = useState<string>('');
  const [contributeToTraining, setContributeToTraining] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isFalsePositiveModalOpen || !falsePositiveTargetIncident) return null;

  const categories = [
    { id: 'WILDLIFE', label: 'Wildlife / Cattle (Nilgai, feral dog, camel)' },
    { id: 'DUST_WEATHER', label: 'Severe Weather / Dust sandstorm whirl' },
    { id: 'LIGHTING_SHADOW', label: 'Lighting artifact / Vehicle high-beam glare' },
    { id: 'FRIENDLY_PATROL', label: 'Friendly Patrol / Authorized Border Guard (BSF)' },
    { id: 'THERMAL_MIRAGE', label: 'Thermal ground heat mirage' },
    { id: 'SENSOR_GLITCH', label: 'Optical lens water droplet / spiderweb' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    markFalsePositive(falsePositiveTargetIncident.id, category, comment);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsFalsePositiveModalOpen(false);
      setFalsePositiveTargetIncident(null);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-tactical font-bold text-sm text-slate-100 uppercase tracking-wider">
              Feedback Loop: Suppress False Positive
            </h3>
          </div>
          <button
            onClick={() => {
              setIsFalsePositiveModalOpen(false);
              setFalsePositiveTargetIncident(null);
            }}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-300 font-mono-code bg-slate-950 p-2.5 rounded border border-slate-800">
          Target: <strong className="text-cyan-400">{falsePositiveTargetIncident.id}</strong> — {falsePositiveTargetIncident.title}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-code">
          <div>
            <label className="text-slate-300 block mb-2 font-bold">
              Select Misclassification Root Cause:
            </label>
            <div className="space-y-1.5">
              {categories.map(cat => (
                <label
                  key={cat.id}
                  className={`flex items-center gap-2.5 p-2 rounded cursor-pointer border transition-colors ${
                    category === cat.id
                      ? 'bg-blue-950/60 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <input
                    type="radio"
                    name="feedbackCategory"
                    value={cat.id}
                    checked={category === cat.id}
                    onChange={(e) => setCategory(e.target.value)}
                    className="accent-cyan-400"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-bold">
              Operator Observation Notes:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Verified by Outpost 02 thermal scope: Stray cattle crossing 40m south of fence..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <label className="flex items-start gap-2 p-2.5 bg-blue-950/20 border border-blue-600/30 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={contributeToTraining}
              onChange={(e) => setContributeToTraining(e.target.checked)}
              className="mt-0.5 accent-cyan-400"
            />
            <span className="text-[11px] text-slate-300">
              Contribute anonymized telemetry crop to Edge Model Active-Learning queue to autonomously reduce similar false alarms in this sector.
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsFalsePositiveModalOpen(false);
                setFalsePositiveTargetIncident(null);
              }}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-750"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Logging...' : 'Submit Feedback & Suppress'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
