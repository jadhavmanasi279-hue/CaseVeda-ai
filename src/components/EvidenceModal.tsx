import React from 'react';
import { ShieldCheck, AlertTriangle, X, BookmarkCheck, FileText } from 'lucide-react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fieldLabel: string;
  fieldValue: string;
  pageNumber: number | null;
  evidenceQuote: string | null;
  confidence: number;
  status: 'Verified' | 'Needs Review';
  reviewReason?: string;
  fullPageText?: string;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  title,
  fieldLabel,
  fieldValue,
  pageNumber,
  evidenceQuote,
  confidence,
  status,
  reviewReason,
  fullPageText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BookmarkCheck className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
              <p className="text-xs text-slate-300">Evidence Link & Source Verification</p>
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Fact Display */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Extracted Fact ({fieldLabel})
            </div>
            <div className="text-base font-bold text-navy-900 leading-snug">
              {fieldValue}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                status === 'Verified'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {status === 'Verified' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                )}
                {status}
              </span>

              <span className="text-xs font-medium text-slate-600">
                Confidence: <strong className="text-slate-900">{confidence}%</strong>
              </span>

              {pageNumber !== null && (
                <span className="text-xs font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Page {pageNumber}
                </span>
              )}
            </div>
          </div>

          {/* Needs Review reason if flagged */}
          {status === 'Needs Review' && reviewReason && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Needs Review Notice:</strong>
                <span>{reviewReason}</span>
              </div>
            </div>
          )}

          {/* Supporting Evidence Quote */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>Supporting Passage From Original Judgment</span>
              </h4>
              {pageNumber !== null && (
                <span className="text-xs text-slate-500 font-medium">
                  Located on Page {pageNumber}
                </span>
              )}
            </div>

            {evidenceQuote ? (
              <div className="p-4 rounded-xl bg-teal-50/40 border border-teal-200 text-slate-800 text-sm font-serif italic leading-relaxed border-l-4 border-l-teal-600">
                "{evidenceQuote}"
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs italic">
                No direct verbatim passage match found in front pages. Flagged for manual review.
              </div>
            )}
          </div>

          {/* Full Page Context if available */}
          {fullPageText && (
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Page {pageNumber} Context
              </div>
              <div className="p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
                {fullPageText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
          >
            Close Evidence Inspection
          </button>
        </div>
      </div>
    </div>
  );
};
