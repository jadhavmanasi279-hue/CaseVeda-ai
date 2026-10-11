import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { UploadAnalyzeView } from './components/UploadAnalyzeView';
import { ComparisonView } from './components/ComparisonView';
import { HistoryView } from './components/HistoryView';
import { LegalDirectoryView } from './components/LegalDirectoryView';
import { EvidenceModal } from './components/EvidenceModal';
import { AiConfigModal } from './components/AiConfigModal';

import { CourtJudgment } from './types';
import { SAMPLE_JUDGMENTS } from './data/sampleJudgments';
import { extractTextFromPdf } from './utils/pdfExtractor';
import { analyzeJudgmentText } from './utils/legalExtractor';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Initialize with sample judgments so user/judges can immediately test without needing files
  const [judgments, setJudgments] = useState<CourtJudgment[]>(() => {
    const saved = localStorage.getItem('caseveda_judgments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SAMPLE_JUDGMENTS;
      }
    }
    return SAMPLE_JUDGMENTS;
  });

  const [selectedJudgment, setSelectedJudgment] = useState<CourtJudgment | null>(SAMPLE_JUDGMENTS[0]);
  const [comparisonDocA, setComparisonDocA] = useState<CourtJudgment | null>(SAMPLE_JUDGMENTS[0]);
  const [comparisonDocB, setComparisonDocB] = useState<CourtJudgment | null>(SAMPLE_JUDGMENTS[2]);

  // Extraction Progress State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  // Evidence Modal State
  const [evidenceModalData, setEvidenceModalData] = useState<{
    isOpen: boolean;
    title: string;
    fieldLabel: string;
    fieldValue: string;
    pageNumber: number | null;
    evidenceQuote: string | null;
    confidence: number;
    status: 'Verified' | 'Needs Review';
    reviewReason?: string;
    fullPageText?: string;
  }>({
    isOpen: false,
    title: '',
    fieldLabel: '',
    fieldValue: '',
    pageNumber: null,
    evidenceQuote: null,
    confidence: 100,
    status: 'Verified',
  });

  // AI Configuration Modal State
  const [isAiConfigOpen, setIsAiConfigOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('caseveda_gemini_key') || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  });

  // Persist judgments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('caseveda_judgments', JSON.stringify(judgments));
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
  }, [judgments]);

  // Handle Real PDF or TXT File Upload & Extraction
  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setProgressPercent(10);
    setProgressStep(`Initializing PDF text extractor for ${file.name}...`);
    setCurrentTab('upload');

    try {
      // 1. Real PDF extraction
      const pdfResult = await extractTextFromPdf(file, (msg, pct) => {
        setProgressStep(msg);
        setProgressPercent(Math.round(pct * 0.7)); // 0 - 70%
      });

      // 2. Legal NLP Analysis
      setProgressStep('Running Indian Legal Fact Extraction Engine...');
      setProgressPercent(85);

      // Short breathing room for UI step rendering
      await new Promise(r => setTimeout(r, 400));

      const analyzed = analyzeJudgmentText(
        pdfResult.fileName,
        pdfResult.fileSize,
        pdfResult.pages,
        pdfResult.fullText
      );

      setProgressStep('Finalizing evidence quotes and page anchors...');
      setProgressPercent(100);
      await new Promise(r => setTimeout(r, 300));

      // 3. Update state
      setJudgments(prev => [analyzed, ...prev]);
      setSelectedJudgment(analyzed);
    } catch (err: any) {
      console.error(err);
      alert(`Error extracting judgment text: ${err?.message || 'Unsupported format'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadCustomDocForComparison = async (file: File, targetSlot: 'A' | 'B') => {
    try {
      const pdfResult = await extractTextFromPdf(file);
      const analyzed = analyzeJudgmentText(
        pdfResult.fileName,
        pdfResult.fileSize,
        pdfResult.pages,
        pdfResult.fullText
      );

      setJudgments(prev => [analyzed, ...prev]);
      if (targetSlot === 'A') {
        setComparisonDocA(analyzed);
      } else {
        setComparisonDocB(analyzed);
      }
    } catch (err: any) {
      alert(`Comparison file upload failed: ${err.message}`);
    }
  };

  const handleSelectJudgment = (judgment: CourtJudgment) => {
    setSelectedJudgment(judgment);
    setCurrentTab('upload');
  };

  const handleCompareWithAnother = (judgment: CourtJudgment) => {
    setComparisonDocA(judgment);
    // Find an alternate for doc B
    const alternate = judgments.find(j => j.id !== judgment.id) || SAMPLE_JUDGMENTS[2];
    setComparisonDocB(alternate);
    setCurrentTab('compare');
  };

  const handleLoadComparisonDemo = () => {
    setComparisonDocA(SAMPLE_JUDGMENTS[0]); // Original appeal (Allowed)
    setComparisonDocB(SAMPLE_JUDGMENTS[2]); // Altered verdict (Dismissed)
    setCurrentTab('compare');
  };

  const handleDeleteJudgment = (id: string) => {
    setJudgments(prev => prev.filter(j => j.id !== id));
    if (selectedJudgment?.id === id) {
      setSelectedJudgment(judgments.find(j => j.id !== id) || null);
    }
  };

  const handleOpenEvidence = (
    title: string,
    fieldLabel: string,
    fieldValue: string,
    pageNumber: number | null,
    evidenceQuote: string | null,
    confidence: number,
    status: 'Verified' | 'Needs Review',
    reviewReason?: string,
    fullPageText?: string
  ) => {
    setEvidenceModalData({
      isOpen: true,
      title,
      fieldLabel,
      fieldValue,
      pageNumber,
      evidenceQuote,
      confidence,
      status,
      reviewReason,
      fullPageText,
    });
  };

  const handleSaveGeminiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('caseveda_gemini_key', key);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAiConfig={() => setIsAiConfigOpen(true)}
        analyzedCount={judgments.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          onSelectSample={handleSelectJudgment}
          onLoadComparisonDemo={handleLoadComparisonDemo}
          onOpenAiConfig={() => setIsAiConfigOpen(true)}
        />

        {/* Tab Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                judgments={judgments}
                onSelectJudgment={handleSelectJudgment}
                onNavigateTab={setCurrentTab}
                onFileUpload={handleFileUpload}
                onLoadComparisonDemo={handleLoadComparisonDemo}
              />
            )}

            {currentTab === 'upload' && (
              <UploadAnalyzeView
                currentJudgment={selectedJudgment}
                onFileUpload={handleFileUpload}
                isAnalyzing={isAnalyzing}
                progressStep={progressStep}
                progressPercent={progressPercent}
                onCompareWithAnother={handleCompareWithAnother}
                onOpenEvidence={handleOpenEvidence}
              />
            )}

            {currentTab === 'compare' && (
              <ComparisonView
                judgments={judgments}
                docA={comparisonDocA}
                docB={comparisonDocB}
                onSetDocA={setComparisonDocA}
                onSetDocB={setComparisonDocB}
                onUploadCustomDoc={handleUploadCustomDocForComparison}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                judgments={judgments}
                onSelectJudgment={handleSelectJudgment}
                onCompareJudgment={handleCompareWithAnother}
                onDeleteJudgment={handleDeleteJudgment}
              />
            )}

            {currentTab === 'directory' && (
              <LegalDirectoryView />
            )}
          </div>
        </main>
      </div>

      {/* Supporting Evidence Detail Inspection Modal */}
      <EvidenceModal
        isOpen={evidenceModalData.isOpen}
        onClose={() => setEvidenceModalData(prev => ({ ...prev, isOpen: false }))}
        title={evidenceModalData.title}
        fieldLabel={evidenceModalData.fieldLabel}
        fieldValue={evidenceModalData.fieldValue}
        pageNumber={evidenceModalData.pageNumber}
        evidenceQuote={evidenceModalData.evidenceQuote}
        confidence={evidenceModalData.confidence}
        status={evidenceModalData.status}
        reviewReason={evidenceModalData.reviewReason}
        fullPageText={evidenceModalData.fullPageText}
      />

      {/* AI Key & Dual Engine Configuration Modal */}
      <AiConfigModal
        isOpen={isAiConfigOpen}
        onClose={() => setIsAiConfigOpen(false)}
        geminiKey={geminiApiKey}
        onSaveKey={handleSaveGeminiKey}
      />
    </div>
  );
};

export default App;
