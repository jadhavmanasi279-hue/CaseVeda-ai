import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  GitCompare, 
  Download, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { CourtJudgment } from '../types';

interface HistoryViewProps {
  judgments: CourtJudgment[];
  onSelectJudgment: (judgment: CourtJudgment) => void;
  onCompareJudgment: (judgment: CourtJudgment) => void;
  onDeleteJudgment: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  judgments,
  onSelectJudgment,
  onCompareJudgment,
  onDeleteJudgment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter courts list
  const uniqueCourts = useMemo(() => {
    const list = Array.from(new Set(judgments.map(j => j.extractedData.courtName.value)));
    return list;
  }, [judgments]);

  // Filtered judgments
  const filteredJudgments = useMemo(() => {
    return judgments.filter((item) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.extractedData.caseNumber.value.toLowerCase().includes(query) ||
        item.extractedData.courtName.value.toLowerCase().includes(query) ||
        item.extractedData.petitioner.value.toLowerCase().includes(query) ||
        item.extractedData.respondent.value.toLowerCase().includes(query) ||
        item.extractedData.finalOutcome.disposition.toLowerCase().includes(query) ||
        item.extractedData.actsAndSections.some(s => s.section.toLowerCase().includes(query) || s.act.toLowerCase().includes(query));

      // Court filter
      const matchesCourt = selectedCourt === 'ALL' || item.extractedData.courtName.value === selectedCourt;

      // Status filter
      const matchesStatus = selectedStatus === 'ALL' || item.overallStatus === selectedStatus;

      return matchesSearch && matchesCourt && matchesStatus;
    });
  }, [judgments, searchQuery, selectedCourt, selectedStatus]);

  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(judgments, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CaseVeda_AI_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case no, party, section (IPC 302)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Court Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Court:</span>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            >
              <option value="ALL">All Forums ({judgments.length})</option>
              {uniqueCourts.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Needs Review">Needs Review Only</option>
            </select>
          </div>

          <button
            onClick={handleExportAll}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5 ml-auto md:ml-0"
            title="Export repository dataset as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Repository</span>
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/75 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing {filteredJudgments.length} of {judgments.length} court records</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-teal-700 hover:underline text-[11px]"
            >
              Clear filter
            </button>
          )}
        </div>

        {filteredJudgments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No judgments match your search</p>
            <p className="text-xs text-slate-400 mt-1">Try modifying your keyword, court forum, or status filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredJudgments.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-teal-50/20 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => onSelectJudgment(item)}
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-navy-950 text-sm">
                      {item.extractedData.caseNumber.value}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.overallStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.overallStatus === 'Verified' ? (
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                      )}
                      {item.overallStatus}
                    </span>
                    <span className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded">
                      {item.extractedData.finalOutcome.disposition}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700">
                    {item.extractedData.courtName.value}
                  </p>

                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-600">Parties:</span> {item.extractedData.petitioner.value} vs {item.extractedData.respondent.value}
                  </p>

                  {/* Sections Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.extractedData.actsAndSections.map((sec, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {sec.section}
                      </span>
                    ))}
                    {item.extractedData.actsAndSections.length === 0 && (
                      <span className="text-[10px] text-slate-400 italic">No statutory sections detected</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectJudgment(item);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-800 text-xs font-semibold transition"
                  >
                    Inspect Facts
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompareJudgment(item);
                    }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Compare against reference document"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove "${item.extractedData.caseNumber.value}" from session history?`)) {
                        onDeleteJudgment(item.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
