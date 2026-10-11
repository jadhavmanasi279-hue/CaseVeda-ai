import React from 'react';
import { 
  Sparkles, 
  FileText, 
  GitCompare, 
  BookOpen, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { SAMPLE_JUDGMENTS } from '../data/sampleJudgments';
import { CourtJudgment } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectSample: (judgment: CourtJudgment) => void;
  onLoadComparisonDemo: () => void;
  onOpenAiConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectSample,
  onLoadComparisonDemo,
  onOpenAiConfig,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Judicial Intelligence Dashboard',
      subtitle: 'Real-time overview of parsed Indian court judgments and extraction metrics',
    },
    upload: {
      title: 'Analyze Court Judgment PDF',
      subtitle: 'Upload judgment PDF to extract parties, statutory sections, outcome, and page-indexed quotes',
    },
    compare: {
      title: 'Document Comparison & Discrepancy Analysis',
      subtitle: 'Cross-verify subject documents against reference filings with authoritative verification guards',
    },
    history: {
      title: 'Searchable Judgment Repository',
      subtitle: 'Browse, filter, and inspect previously analyzed court records and legal briefs',
    },
    directory: {
      title: 'Indian Statutory Provisions Directory',
      subtitle: 'Quick reference for frequent IPC, CrPC, CPC, and Special Act sections',
    },
  };

  const currentInfo = tabTitles[currentTab] || {
    title: 'CaseVeda AI Legal Workspace',
    subtitle: 'Evidence-backed Indian court judgment intelligence',
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-20">
      <div>
        <h1 className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
          {currentInfo.title}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">{currentInfo.subtitle}</p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quick Demo Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 text-xs font-semibold transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Load Demo Cases</span>
            <ChevronDown className="w-3.5 h-3.5 text-teal-600" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Pre-parsed Indian Judgment
              </div>
              {SAMPLE_JUDGMENTS.filter(s => s.id !== 'sample-tampered-mismatch-doc').map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition flex items-start space-x-2.5"
                >
                  <FileText className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800 leading-tight">
                      {sample.extractedData.caseType.value} ({sample.extractedData.year.value})
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                      {sample.extractedData.courtName.value}
                    </div>
                    <div className="text-[10px] text-teal-700 font-medium mt-0.5">
                      {sample.extractedData.finalOutcome.disposition} • {sample.extractedData.actsAndSections.length} Sections
                    </div>
                  </div>
                </button>
              ))}

              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  onClick={() => {
                    onLoadComparisonDemo();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-50 flex items-center space-x-2"
                >
                  <GitCompare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Launch Document Comparison Demo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Engine Status Pill */}
        <div 
          onClick={onOpenAiConfig}
          className="cursor-pointer hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-medium text-slate-700 transition"
          title="Click to configure AI engine"
        >
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="font-semibold text-slate-800">Legal NLP Engine:</span>
          <span className="text-teal-700 font-semibold">Active</span>
        </div>
      </div>
    </header>
  );
};
