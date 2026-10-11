import React, { useState } from 'react';
import { Sparkles, Shield, Key, CheckCircle2, AlertCircle, X, ExternalLink, Cpu } from 'lucide-react';

interface AiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiKey: string;
  onSaveKey: (key: string) => void;
}

export const AiConfigModal: React.FC<AiConfigModalProps> = ({
  isOpen,
  onClose,
  geminiKey,
  onSaveKey,
}) => {
  const [inputKey, setInputKey] = useState(geminiKey);
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputKey.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">CaseVeda AI Engine Configuration</h3>
              <p className="text-xs text-slate-300">Dual Legal Engine Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Engine 1: Built-in Core NLP */}
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2 text-teal-900 font-bold text-sm">
                <Cpu className="w-4 h-4 text-teal-600" />
                <span>1. Core Indian Legal NLP Engine (Active)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-600 text-white">
                Built-in & 100% Offline
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fully functional client-side engine. Extracts Indian courts, case types, registration numbers, parties, sections (IPC, CrPC, NI Act, Arbitration Act), and operative outcomes directly from PDF pages without needing any external API or backend.
            </p>
          </div>

          {/* Engine 2: Enhanced AI / Gemini */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Key className="w-4 h-4 text-slate-700" />
                <span>2. Optional AI LLM API (Gemini API)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">
                Optional Enhancement
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              For deep multi-paragraph ratio decidendi synthesis and predictive argument formulation, you can optionally provide a Google Gemini API Key or configure <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded font-mono text-[11px]">VITE_GEMINI_API_KEY</code> in <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded font-mono text-[11px]">.env</code>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gemini API Key (Stored locally in your browser only)
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-2 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Security Guard:</strong> Keys are never committed to git, never sent to third-party tracking, and remain solely in your client browser session.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center space-x-1"
          >
            <span>Get free Gemini API Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Config Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
