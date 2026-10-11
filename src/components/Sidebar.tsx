import React from 'react';
import { 
  Scale, 
  LayoutDashboard, 
  FileUp, 
  GitCompare, 
  History, 
  BookOpen, 
  Sparkles, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAiConfig: () => void;
  analyzedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAiConfig,
  analyzedCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload & Analyze', icon: FileUp },
    { id: 'compare', label: 'Document Comparison', icon: GitCompare },
    { id: 'history', label: 'Case History', icon: History, badge: analyzedCount > 0 ? analyzedCount : undefined },
    { id: 'directory', label: 'Acts & Sections Directory', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-navy-950 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-900/30">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">CaseVeda</span>
              <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Indian Judgment Analysis</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 py-4 flex-1 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Legal Workbench
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-700/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-teal-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Verification Protocol Notice */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 text-xs">
        <div className="flex items-center space-x-2 text-teal-300 font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Evidence-Linked Engine</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          All extracted facts link directly to page numbers & verbatim passages.
        </p>
      </div>

      {/* AI Key / Settings Footer */}
      <div className="p-3 border-t border-slate-800 bg-navy-900/60">
        <button
          onClick={onOpenAiConfig}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Engine & Config</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Ready" />
        </button>
      </div>
    </aside>
  );
};
