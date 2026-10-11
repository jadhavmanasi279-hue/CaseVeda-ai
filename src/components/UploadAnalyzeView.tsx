import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  GitCompare, 
  Download, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Scale, 
  Users, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { CourtJudgment, ExtractedField, CitedSection } from '../types';

interface UploadAnalyzeViewProps {
  currentJudgment: CourtJudgment | null;
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
  progressStep: string;
  progressPercent: number;
  onCompareWithAnother: (judgment: CourtJudgment) => void;
  onOpenEvidence: (
    title: string,
    fieldLabel: string,
    fieldValue: string,
    pageNumber: number | null,
    evidenceQuote: string | null,
    confidence: number,
    status: 'Verified' | 'Needs Review',
    reviewReason?: string,
    fullPageText?: string
  ) => void;
}

export const UploadAnalyzeView: React.FC<UploadAnalyzeViewProps> = ({
  currentJudgment,
  onFileUpload,
  isAnalyzing,
  progressStep,
  progressPercent,
  onCompareWithAnother,
  onOpenEvidence,
}) => {
  const [activeTab, setActiveTab] = useState<'facts' | 'pages'>('facts');
  const [selectedPageNum, setSelectedPageNum] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const exportBrief = () => {
    if (!currentJudgment) return;
    const brief = {
      title: `CaseVeda AI Legal Brief - ${currentJudgment.extractedData.caseNumber.value}`,
      generatedAt: new Date().toISOString(),
      court: currentJudgment.extractedData.courtName.value,
      caseNumber: currentJudgment.extractedData.caseNumber.value,
      petitioner: currentJudgment.extractedData.petitioner.value,
      respondent: currentJudgment.extractedData.respondent.value,
      operativeOutcome: currentJudgment.extractedData.finalOutcome.disposition,
      verdictQuote: currentJudgment.extractedData.finalOutcome.evidenceQuote,
      sectionsCited: currentJudgment.extractedData.actsAndSections.map(s => ({
        act: s.act,
        section: s.section,
        page: s.pageNumber,
        quote: s.quote,
      })),
      verificationNotice: 'Generated via CaseVeda AI. Official authenticity requires validation with eCourts or High Court Registry.',
    };

    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CaseVeda_Brief_${currentJudgment.extractedData.caseNumber.value.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box (Collapsible or top-bar when judgment is loaded) */}
      {!currentJudgment || isAnalyzing ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 max-w-3xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-6">
            <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-navy-950">Upload Indian Court Judgment PDF</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload any Supreme Court, High Court, or District Court judgment file. Real client-side text extraction locates parties, statutes, and operative rulings.
            </p>
          </div>

          {isAnalyzing ? (
            <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <p className="text-sm font-bold text-navy-900">{progressStep || 'Analyzing Judgment PDF...'}</p>
                <p className="text-xs text-slate-500 mt-1">Extracting text & linking evidentiary quotes...</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 max-w-md mx-auto overflow-hidden">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-teal-800">{progressPercent}% Completed</span>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-10 text-center bg-slate-50/50 hover:bg-teal-50/20 transition cursor-pointer flex flex-col items-center justify-center space-y-3"
              onClick={() => {
                const input = document.getElementById('main-pdf-upload') as HTMLInputElement;
                input?.click();
              }}
            >
              <Upload className="w-8 h-8 text-teal-600 mb-1" />
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  Select or drag & drop court judgment PDF
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports searchable PDF and TXT transcripts (up to 25MB)
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                Browse File
              </span>
              <input
                id="main-pdf-upload"
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
          )}
        </div>
      ) : null}

      {/* Analysis Results View */}
      {currentJudgment && !isAnalyzing && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-md bg-navy-900 text-white text-xs font-bold tracking-tight">
                  {currentJudgment.extractedData.caseType.value}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  currentJudgment.overallStatus === 'Verified'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {currentJudgment.overallStatus === 'Verified' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {currentJudgment.overallStatus}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentJudgment.pageCount} Pages • Analyzed {new Date(currentJudgment.analyzedAt).toLocaleTimeString()}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-navy-950 mt-2 tracking-tight">
                {currentJudgment.extractedData.caseNumber.value}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentJudgment.extractedData.courtName.value}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={exportBrief}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5"
                title="Download structured JSON legal brief"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Brief</span>
              </button>

              <button
                onClick={() => onCompareWithAnother(currentJudgment)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Against Reference Document</span>
              </button>

              <button
                onClick={() => {
                  const input = document.getElementById('secondary-upload-btn') as HTMLInputElement;
                  input?.click();
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                <span>Upload Another</span>
                <input
                  id="secondary-upload-btn"
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </button>
            </div>
          </div>

          {/* Needs Review Alert if flagged */}
          {currentJudgment.overallStatus === 'Needs Review' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm mb-0.5">Attention: Needs Review Required</strong>
                <span>
                  One or more extracted fields did not meet high-confidence automated certainty thresholds or lack direct verbatim citations. Check highlighted items marked with "Needs Review" below.
                </span>
              </div>
            </div>
          )}

          {/* Tab Navigation: Facts vs Raw Pages */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('facts')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
                activeTab === 'facts'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Evidence-Backed Facts ({currentJudgment.extractedData.actsAndSections.length + 5})</span>
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center space-x-2 ${
                activeTab === 'pages'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Document Page Viewer ({currentJudgment.pageCount} Pages)</span>
            </button>
          </div>

          {activeTab === 'facts' ? (
            <div className="space-y-6">
              {/* Operative Verdict / Final Outcome Banner */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Final Operative Disposition / Outcome
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    currentJudgment.extractedData.finalOutcome.status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentJudgment.extractedData.finalOutcome.status === 'Verified' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {currentJudgment.extractedData.finalOutcome.status}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-extrabold text-navy-950 tracking-tight">
                      {currentJudgment.extractedData.finalOutcome.disposition}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 font-serif italic max-w-3xl leading-relaxed">
                      "{currentJudgment.extractedData.finalOutcome.evidenceQuote}"
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => onOpenEvidence(
                        'Operative Outcome Evidence',
                        'Final Disposition',
                        currentJudgment.extractedData.finalOutcome.disposition,
                        currentJudgment.extractedData.finalOutcome.pageNumber,
                        currentJudgment.extractedData.finalOutcome.evidenceQuote,
                        currentJudgment.extractedData.finalOutcome.confidence,
                        currentJudgment.extractedData.finalOutcome.status,
                        currentJudgment.extractedData.finalOutcome.reviewReason,
                        currentJudgment.pages.find(p => p.pageNumber === currentJudgment.extractedData.finalOutcome.pageNumber)?.text
                      )}
                      className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-lg border border-teal-200 transition flex items-center space-x-1"
                    >
                      <span>Inspect Page {currentJudgment.extractedData.finalOutcome.pageNumber} Evidence</span>
                      <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Core Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Court Name */}
                <ExtractedFactCard
                  label="Court Name"
                  field={currentJudgment.extractedData.courtName}
                  onInspect={() => onOpenEvidence(
                    'Court Jurisdiction Evidence',
                    'Court Name',
                    currentJudgment.extractedData.courtName.value,
                    currentJudgment.extractedData.courtName.pageNumber,
                    currentJudgment.extractedData.courtName.evidenceQuote,
                    currentJudgment.extractedData.courtName.confidence,
                    currentJudgment.extractedData.courtName.status,
                    currentJudgment.extractedData.courtName.reviewReason,
                    currentJudgment.pages.find(p => p.pageNumber === currentJudgment.extractedData.courtName.pageNumber)?.text
                  )}
                />

                {/* Case Type */}
                <ExtractedFactCard
                  label="Case Type"
                  field={currentJudgment.extractedData.caseType}
                  onInspect={() => onOpenEvidence(
                    'Case Classification Evidence',
                    'Case Type',
                    currentJudgment.extractedData.caseType.value,
                    currentJudgment.extractedData.caseType.pageNumber,
                    currentJudgment.extractedData.caseType.evidenceQuote,
                    currentJudgment.extractedData.caseType.confidence,
                    currentJudgment.extractedData.caseType.status,
                    currentJudgment.extractedData.caseType.reviewReason,
                    currentJudgment.pages.find(p => p.pageNumber === currentJudgment.extractedData.caseType.pageNumber)?.text
                  )}
                />

                {/* Case Number */}
                <ExtractedFactCard
                  label="Case Registration Number"
                  field={currentJudgment.extractedData.caseNumber}
                  onInspect={() => onOpenEvidence(
                    'Registration Number Evidence',
                    'Case Number',
                    currentJudgment.extractedData.caseNumber.value,
                    currentJudgment.extractedData.caseNumber.pageNumber,
                    currentJudgment.extractedData.caseNumber.evidenceQuote,
                    currentJudgment.extractedData.caseNumber.confidence,
                    currentJudgment.extractedData.caseNumber.status,
                    currentJudgment.extractedData.caseNumber.reviewReason,
                    currentJudgment.pages.find(p => p.pageNumber === currentJudgment.extractedData.caseNumber.pageNumber)?.text
                  )}
                />

                {/* Bench / Coram */}
                <ExtractedFactCard
                  label="Presiding Bench / Judges"
                  field={currentJudgment.extractedData.bench}
                  onInspect={() => onOpenEvidence(
                    'Presiding Bench Evidence',
                    'Bench / Coram',
                    currentJudgment.extractedData.bench.value,
                    currentJudgment.extractedData.bench.pageNumber,
                    currentJudgment.extractedData.bench.evidenceQuote,
                    currentJudgment.extractedData.bench.confidence,
                    currentJudgment.extractedData.bench.status,
                    currentJudgment.extractedData.bench.reviewReason,
                    currentJudgment.pages.find(p => p.pageNumber === currentJudgment.extractedData.bench.pageNumber)?.text
                  )}
                />
              </div>

              {/* Parties Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                    Litigating Parties (Cause Title)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Petitioner */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Petitioner / Appellant
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        currentJudgment.extractedData.petitioner.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {currentJudgment.extractedData.petitioner.status} ({currentJudgment.extractedData.petitioner.confidence}%)
                      </span>
                    </div>
                    <div className="font-bold text-navy-950 text-sm">
                      {currentJudgment.extractedData.petitioner.value}
                    </div>
                    {currentJudgment.extractedData.petitioner.evidenceQuote && (
                      <p className="text-[11px] text-slate-500 italic mt-2 line-clamp-2">
                        "{currentJudgment.extractedData.petitioner.evidenceQuote}"
                      </p>
                    )}
                    <button
                      onClick={() => onOpenEvidence(
                        'Petitioner Party Evidence',
                        'Petitioner / Appellant',
                        currentJudgment.extractedData.petitioner.value,
                        currentJudgment.extractedData.petitioner.pageNumber,
                        currentJudgment.extractedData.petitioner.evidenceQuote,
                        currentJudgment.extractedData.petitioner.confidence,
                        currentJudgment.extractedData.petitioner.status,
                        currentJudgment.extractedData.petitioner.reviewReason,
                        currentJudgment.pages.find(p => p.pageNumber === currentJudgment.extractedData.petitioner.pageNumber)?.text
                      )}
                      className="mt-3 text-[11px] font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
                    >
                      <span>Inspect Evidence (Page {currentJudgment.extractedData.petitioner.pageNumber || 1})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Respondent */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Respondent / Defendant
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        currentJudgment.extractedData.respondent.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {currentJudgment.extractedData.respondent.status} ({currentJudgment.extractedData.respondent.confidence}%)
                      </span>
                    </div>
                    <div className="font-bold text-navy-950 text-sm">
                      {currentJudgment.extractedData.respondent.value}
                    </div>
                    {currentJudgment.extractedData.respondent.evidenceQuote && (
                      <p className="text-[11px] text-slate-500 italic mt-2 line-clamp-2">
                        "{currentJudgment.extractedData.respondent.evidenceQuote}"
                      </p>
                    )}
                    <button
                      onClick={() => onOpenEvidence(
                        'Respondent Party Evidence',
                        'Respondent',
                        currentJudgment.extractedData.respondent.value,
                        currentJudgment.extractedData.respondent.pageNumber,
                        currentJudgment.extractedData.respondent.evidenceQuote,
                        currentJudgment.extractedData.respondent.confidence,
                        currentJudgment.extractedData.respondent.status,
                        currentJudgment.extractedData.respondent.reviewReason,
                        currentJudgment.pages.find(p => p.pageNumber === currentJudgment.extractedData.respondent.pageNumber)?.text
                      )}
                      className="mt-3 text-[11px] font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
                    >
                      <span>Inspect Evidence (Page {currentJudgment.extractedData.respondent.pageNumber || 1})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Statutory Acts and Sections Cited */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                      Legal Acts & Sections Cited ({currentJudgment.extractedData.actsAndSections.length})
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Linked to page occurrences</span>
                </div>

                {currentJudgment.extractedData.actsAndSections.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    No statutory sections detected in judgment text.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentJudgment.extractedData.actsAndSections.map((sec, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 bg-white shadow-xs transition"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-navy-950">
                            {sec.section}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                            Page {sec.pageNumber}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-teal-700 mb-1">
                          {sec.act}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          {sec.description}
                        </p>
                        <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-[11px] font-serif italic text-slate-700 line-clamp-3">
                          "{sec.quote}"
                        </div>
                        <button
                          onClick={() => onOpenEvidence(
                            `Statutory Citation: ${sec.section}`,
                            sec.act,
                            sec.section,
                            sec.pageNumber,
                            sec.quote,
                            sec.confidence,
                            sec.status,
                            undefined,
                            currentJudgment.pages.find(p => p.pageNumber === sec.pageNumber)?.text
                          )}
                          className="mt-2 text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center space-x-1"
                        >
                          <span>View Full Paragraph Context</span>
                          <ExternalLink className="w-3 h-3 text-teal-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Page-by-Page Document Viewer */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Select Page:</span>
                  <div className="flex gap-1 overflow-x-auto max-w-md py-1">
                    {currentJudgment.pages.map((p) => (
                      <button
                        key={p.pageNumber}
                        onClick={() => setSelectedPageNum(p.pageNumber)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${
                          selectedPageNum === p.pageNumber
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        P.{p.pageNumber}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Find keyword in page..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text border border-slate-800">
                {currentJudgment.pages.find(p => p.pageNumber === selectedPageNum)?.text || 'No text extracted for page.'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ExtractedFactCardProps {
  label: string;
  field: ExtractedField;
  onInspect: () => void;
}

const ExtractedFactCard: React.FC<ExtractedFactCardProps> = ({ label, field, onInspect }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 transition flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            field.status === 'Verified'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {field.status === 'Verified' ? (
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-amber-600" />
            )}
            {field.status}
          </span>
        </div>

        <div className="font-bold text-navy-950 text-sm leading-snug">
          {field.value}
        </div>

        {field.evidenceQuote && (
          <p className="text-[11px] text-slate-500 italic mt-2 line-clamp-2 font-serif">
            "{field.evidenceQuote}"
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Confidence: <strong className="text-slate-700">{field.confidence}%</strong>
        </span>
        <button
          onClick={onInspect}
          className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center space-x-1"
        >
          <span>P.{field.pageNumber || 1} Quote</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
