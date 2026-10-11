import React, { useState } from 'react';
import { 
  GitCompare, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Upload, 
  ArrowRight, 
  FileText, 
  Sparkles,
  Scale,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { CourtJudgment, DocumentComparisonResult } from '../types';
import { compareJudgments } from '../utils/comparator';
import { SAMPLE_JUDGMENTS } from '../data/sampleJudgments';

interface ComparisonViewProps {
  judgments: CourtJudgment[];
  docA: CourtJudgment | null;
  docB: CourtJudgment | null;
  onSetDocA: (doc: CourtJudgment) => void;
  onSetDocB: (doc: CourtJudgment) => void;
  onUploadCustomDoc: (file: File, targetSlot: 'A' | 'B') => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  judgments,
  docA,
  docB,
  onSetDocA,
  onSetDocB,
  onUploadCustomDoc,
}) => {
  const [comparisonResult, setComparisonResult] = useState<DocumentComparisonResult | null>(() => {
    if (docA && docB) {
      return compareJudgments(docA, docB);
    }
    return null;
  });

  const handleRunComparison = () => {
    if (docA && docB) {
      setComparisonResult(compareJudgments(docA, docB));
    }
  };

  const handleLoadMatchDemo = () => {
    const original = SAMPLE_JUDGMENTS[0]; // SC Appeal 784
    const clone = { ...SAMPLE_JUDGMENTS[0], id: `ref-${Date.now()}`, fileName: 'Reference_Certified_Copy_SC_784_2023.pdf' };
    onSetDocA(original);
    onSetDocB(clone);
    setComparisonResult(compareJudgments(original, clone));
  };

  const handleLoadMismatchDemo = () => {
    const original = SAMPLE_JUDGMENTS[0]; // SC Appeal 784 (Appeal Allowed)
    const tampered = SAMPLE_JUDGMENTS[2]; // Tampered Mismatch (Appeal Dismissed)
    onSetDocA(original);
    onSetDocB(tampered);
    setComparisonResult(compareJudgments(original, tampered));
  };

  const handleLoadUnverifiedDemo = () => {
    const original = SAMPLE_JUDGMENTS[0];
    const uncertain = SAMPLE_JUDGMENTS[4]; // Incomplete sessions bail order
    onSetDocA(original);
    onSetDocB(uncertain);
    setComparisonResult(compareJudgments(original, uncertain));
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner: Never claim authentic without external verification */}
      <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 text-teal-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Court Document Comparison & Cross-Verification Policy
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              CaseVeda AI cross-references structural parameters, litigating parties, cited statutory sections, and operative rulings. 
              <strong className="text-teal-300"> "Verified Match"</strong> indicates high structural congruence between the two supplied documents. It does <em>not</em> claim a document is authentic unless it has been checked against an official court registry (such as eCourts or Supreme Court SCI portal).
            </p>
          </div>
        </div>

        {/* Demo Pair Presets */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleLoadMismatchDemo}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition flex items-center space-x-1.5"
            title="Compare Genuine Appeal against Tampered Ruling"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Load Mismatch Demo</span>
          </button>

          <button
            onClick={handleLoadMatchDemo}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition flex items-center space-x-1.5"
            title="Compare Genuine Appeal against Certified Duplicate"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load Match Demo</span>
          </button>
        </div>
      </div>

      {/* Select Documents Selector Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Document A (Reference / Original) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-navy-950 uppercase tracking-wider">
                Document A: Reference / Baseline Document
              </span>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Reference Copy
              </span>
            </div>

            {/* Selector Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select from Analyzed Repository:
              </label>
              <select
                value={docA?.id || ''}
                onChange={(e) => {
                  const found = judgments.find(j => j.id === e.target.value);
                  if (found) {
                    onSetDocA(found);
                    if (docB) setComparisonResult(compareJudgments(found, docB));
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
              >
                <option value="">-- Choose Analyzed Judgment --</option>
                {judgments.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.extractedData.caseNumber.value} ({j.extractedData.finalOutcome.disposition})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom File Upload for Doc A */}
            <div
              className="border border-dashed border-slate-300 hover:border-teal-400 rounded-xl p-4 text-center bg-slate-50/50 cursor-pointer transition mb-4"
              onClick={() => {
                const el = document.getElementById('upload-doc-a') as HTMLInputElement;
                el?.click();
              }}
            >
              <Upload className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-slate-700">Upload Reference PDF</p>
              <input
                id="upload-doc-a"
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onUploadCustomDoc(e.target.files[0], 'A');
                  }
                }}
              />
            </div>

            {docA && (
              <div className="p-3.5 rounded-xl bg-teal-50/40 border border-teal-200 text-xs space-y-1.5">
                <div className="font-bold text-navy-950">{docA.extractedData.caseNumber.value}</div>
                <div className="text-slate-600">{docA.extractedData.courtName.value}</div>
                <div className="text-slate-500 font-medium">
                  Parties: {docA.extractedData.petitioner.value} vs {docA.extractedData.respondent.value}
                </div>
                <div className="font-semibold text-teal-800">
                  Ruling: {docA.extractedData.finalOutcome.disposition}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Document B (Subject / Comparison Target) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-navy-950 uppercase tracking-wider">
                Document B: Subject / Comparison Document
              </span>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Subject Copy
              </span>
            </div>

            {/* Selector Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select from Analyzed Repository:
              </label>
              <select
                value={docB?.id || ''}
                onChange={(e) => {
                  const found = judgments.find(j => j.id === e.target.value);
                  if (found) {
                    onSetDocB(found);
                    if (docA) setComparisonResult(compareJudgments(docA, found));
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
              >
                <option value="">-- Choose Analyzed Judgment --</option>
                {judgments.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.extractedData.caseNumber.value} ({j.extractedData.finalOutcome.disposition})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom File Upload for Doc B */}
            <div
              className="border border-dashed border-slate-300 hover:border-teal-400 rounded-xl p-4 text-center bg-slate-50/50 cursor-pointer transition mb-4"
              onClick={() => {
                const el = document.getElementById('upload-doc-b') as HTMLInputElement;
                el?.click();
              }}
            >
              <Upload className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-slate-700">Upload Subject PDF</p>
              <input
                id="upload-doc-b"
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onUploadCustomDoc(e.target.files[0], 'B');
                  }
                }}
              />
            </div>

            {docB && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-navy-950">{docB.extractedData.caseNumber.value}</div>
                <div className="text-slate-600">{docB.extractedData.courtName.value}</div>
                <div className="text-slate-500 font-medium">
                  Parties: {docB.extractedData.petitioner.value} vs {docB.extractedData.respondent.value}
                </div>
                <div className="font-semibold text-slate-800">
                  Ruling: {docB.extractedData.finalOutcome.disposition}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare Action Button */}
      {docA && docB && (
        <div className="flex justify-center">
          <button
            onClick={handleRunComparison}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-900/30 transition flex items-center space-x-2"
          >
            <GitCompare className="w-4 h-4" />
            <span>Execute In-Depth Cross Verification</span>
          </button>
        </div>
      )}

      {/* Comparison Results Card */}
      {comparisonResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 animate-in fade-in duration-200">
          {/* Main Status Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border"
            style={{
              backgroundColor: comparisonResult.overallStatus === 'Verified Match' ? '#f0fdf4' : (comparisonResult.overallStatus === 'Mismatch Detected' ? '#fef2f2' : '#fffbeb'),
              borderColor: comparisonResult.overallStatus === 'Verified Match' ? '#bbf7d0' : (comparisonResult.overallStatus === 'Mismatch Detected' ? '#fecaca' : '#fef08a'),
            }}
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{
                  backgroundColor: comparisonResult.overallStatus === 'Verified Match' ? '#dcfce7' : (comparisonResult.overallStatus === 'Mismatch Detected' ? '#fee2e2' : '#fef9c3'),
                }}
              >
                {comparisonResult.overallStatus === 'Verified Match' && (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                )}
                {comparisonResult.overallStatus === 'Mismatch Detected' && (
                  <XCircle className="w-7 h-7 text-rose-600" />
                )}
                {comparisonResult.overallStatus === 'Unverified' && (
                  <HelpCircle className="w-7 h-7 text-amber-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Comparison Engine Status:
                  </span>
                  <span className={`text-sm font-extrabold px-3 py-0.5 rounded-full ${
                    comparisonResult.overallStatus === 'Verified Match'
                      ? 'bg-emerald-600 text-white'
                      : (comparisonResult.overallStatus === 'Mismatch Detected' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white')
                  }`}>
                    {comparisonResult.overallStatus}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-navy-950 mt-1">
                  {comparisonResult.overallStatus === 'Verified Match' && 'Structural & Semantic Alignment Confirmed'}
                  {comparisonResult.overallStatus === 'Mismatch Detected' && `${comparisonResult.discrepanciesCount} Discrepancies / Divergences Detected`}
                  {comparisonResult.overallStatus === 'Unverified' && 'Inconclusive / Manual Registry Review Mandated'}
                </h4>
              </div>
            </div>

            <div className="flex items-baseline space-x-2 bg-white/80 px-4 py-2 rounded-xl border border-slate-200">
              <span className="text-2xl font-extrabold text-navy-950">
                {comparisonResult.similarityScore}%
              </span>
              <span className="text-xs font-semibold text-slate-500">Alignment Index</span>
            </div>
          </div>

          {/* Critical Operative Verdict Conflict Alert */}
          {!comparisonResult.verdictComparison.isMatch && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-sm block mb-1">
                  CRITICAL RULING DIVERGENCE DETECTED
                </strong>
                <p className="leading-relaxed">
                  Document A records operative disposition as <strong className="underline">{comparisonResult.verdictComparison.outcomeA}</strong>, whereas Document B asserts <strong className="underline">{comparisonResult.verdictComparison.outcomeB}</strong>. This signifies a potential alteration, unrecorded appeal reversal, or conflicting order sheet!
                </p>
              </div>
            </div>
          )}

          {/* Field by Field Detailed Alignment Table */}
          <div>
            <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-3">
              Parameter-By-Parameter Verification Matrix
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4">Parameter</th>
                    <th className="py-2.5 px-4">Document A (Reference)</th>
                    <th className="py-2.5 px-4">Document B (Subject)</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4">Diagnostic Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {comparisonResult.fields.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-navy-900">
                        {f.label}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        <div>{f.valA}</div>
                        {f.pageA && <span className="text-[10px] text-slate-400">Page {f.pageA}</span>}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        <div>{f.valB}</div>
                        {f.pageB && <span className="text-[10px] text-slate-400">Page {f.pageB}</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.matchStatus === 'Match'
                            ? 'bg-emerald-100 text-emerald-800'
                            : (f.matchStatus === 'Mismatch' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800')
                        }`}>
                          {f.matchStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        {f.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 italic">
            {comparisonResult.notice}
          </div>
        </div>
      )}
    </div>
  );
};
