import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  GitCompare, 
  Upload, 
  ArrowUpRight, 
  Scale, 
  Sparkles, 
  Calendar, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { CourtJudgment } from '../types';

interface DashboardViewProps {
  judgments: CourtJudgment[];
  onSelectJudgment: (judgment: CourtJudgment) => void;
  onNavigateTab: (tab: string) => void;
  onFileUpload: (file: File) => void;
  onLoadComparisonDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  judgments,
  onSelectJudgment,
  onNavigateTab,
  onFileUpload,
  onLoadComparisonDemo,
}) => {
  const totalAnalyzed = judgments.length;
  const verifiedCount = judgments.filter(j => j.overallStatus === 'Verified').length;
  const needsReviewCount = judgments.filter(j => j.overallStatus === 'Needs Review').length;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner: Crucial Legal Verification Rule */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-5 rounded-2xl shadow-sm border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 text-teal-300">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                CaseVeda AI Evidence-Linked Judgment Intelligence
              </h2>
              <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 uppercase">
                Legal-Tech Hackathon Edition
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Analyzes Indian court rulings page-by-page. Every extracted party, statutory section, and final outcome is linked directly to exact page numbers and verbatim text. 
              <strong className="text-teal-200"> Verification notice:</strong> Documents are cross-checked for textual and structural validity; official authenticity requires verification with authorized court portals (eCourts/sci.gov.in).
            </p>
          </div>
        </div>

        <button
          onClick={onLoadComparisonDemo}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md shadow-teal-950/40 transition flex items-center space-x-2"
        >
          <GitCompare className="w-4 h-4" />
          <span>Run Comparison Demo</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents Analyzed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Documents Analyzed
            </span>
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-navy-950 tracking-tight">{totalAnalyzed}</span>
            <span className="text-xs font-medium text-slate-400">judgments in session</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active Indian court filings & appeals</p>
        </div>

        {/* Verified Extractions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Verified Extractions
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">{verifiedCount}</span>
            <span className="text-xs font-medium text-emerald-700">
              {totalAnalyzed > 0 ? `${Math.round((verifiedCount / totalAnalyzed) * 100)}%` : '0%'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Direct verbatim passages & page matches</p>
        </div>

        {/* Needs Review / Ambiguous */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Needs Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-600 tracking-tight">{needsReviewCount}</span>
            <span className="text-xs font-medium text-amber-700">
              {needsReviewCount > 0 ? 'Requires attention' : 'Clean'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Ambiguous orders or unlisted bench names</p>
        </div>

        {/* Comparison Engine Ready */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Document Comparison
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-teal-700 tracking-tight">Active</span>
            <span className="text-xs font-medium text-teal-600">3-State Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Verified Match • Mismatch • Unverified</p>
        </div>
      </div>

      {/* Main Action Area: Upload Dropzone & Quick Demo Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Upload Dropzone (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                  Quick Judgment PDF Upload
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-400">PDF, TXT up to 25MB</span>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-teal-50/20 transition cursor-pointer flex flex-col items-center justify-center space-y-3 group"
              onClick={() => {
                const input = document.getElementById('dashboard-file-input') as HTMLInputElement;
                input?.click();
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100/60 text-teal-700 flex items-center justify-center group-hover:scale-105 transition">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  Drag and drop court judgment PDF here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  or <span className="text-teal-700 font-semibold underline">browse local files</span> from your computer
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Supreme Court</span>
                <span>•</span>
                <span>High Courts</span>
                <span>•</span>
                <span>Tribunals</span>
              </div>
              <input
                id="dashboard-file-input"
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onFileUpload(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Client-side extraction runs 100% locally in your browser.</span>
            <button
              onClick={() => onNavigateTab('upload')}
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center space-x-1"
            >
              <span>Advanced Uploader</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Demo Cases Card (1 Column) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                Instant Hackathon Demos
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Test core extraction and evidence linking with 1 click without needing to find court PDF files:
            </p>

            <div className="space-y-2.5">
              {judgments.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectJudgment(item)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-slate-50 transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-navy-900 truncate">
                      {item.extractedData.caseNumber.value}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {item.extractedData.courtName.value}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        {item.extractedData.finalOutcome.disposition}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.pageCount} pgs
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 shrink-0 transition" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onLoadComparisonDemo}
              className="w-full py-2 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition flex items-center justify-center space-x-1.5"
            >
              <GitCompare className="w-3.5 h-3.5 text-teal-600" />
              <span>Test Discrepancy Mismatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Analyzed Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Recent Court Judgments Analyzed
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any judgment to inspect extracted parties, statutory citations, and supporting evidence
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
          >
            <span>View All Repository</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Case Registration / Title</th>
                <th className="py-3 px-4">Court Forum</th>
                <th className="py-3 px-4">Sections Cited</th>
                <th className="py-3 px-4">Operative Outcome</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {judgments.map((judgment) => (
                <tr 
                  key={judgment.id}
                  className="hover:bg-teal-50/30 transition cursor-pointer"
                  onClick={() => onSelectJudgment(judgment)}
                >
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-navy-950">
                      {judgment.extractedData.caseNumber.value}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      {judgment.extractedData.petitioner.value} vs {judgment.extractedData.respondent.value}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {judgment.extractedData.courtName.value}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {judgment.extractedData.actsAndSections.slice(0, 2).map((s, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                          title={s.act}
                        >
                          {s.section}
                        </span>
                      ))}
                      {judgment.extractedData.actsAndSections.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                          +{judgment.extractedData.actsAndSections.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">
                      {judgment.extractedData.finalOutcome.disposition}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      judgment.overallStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {judgment.overallStatus === 'Verified' ? (
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                      )}
                      {judgment.overallStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectJudgment(judgment);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 text-xs font-semibold transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
