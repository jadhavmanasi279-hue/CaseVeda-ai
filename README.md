# CaseVeda AI ⚖️

### AI-Powered Court Judgment Analysis and Evidence Verification

## 📌 Problem Statement

Indian court judgments can be lengthy and difficult to understand. Finding important case details, applicable legal sections, and final decisions can take considerable time.

## 💡 Our Solution

CaseVeda AI analyzes Indian court judgment PDFs and extracts critical legal information while linking each extracted fact directly to supporting evidence and page numbers from the original document.

---

## ✨ Implemented Core Features

1. **Judicial Intelligence Dashboard**
   - Real-time statistics: Total Documents Analyzed, Verified Extractions, Needs Review Flags, and Comparison Metrics.
   - Quick drag-and-drop judgment PDF uploader directly from the home view.
   - 1-click instant demo judgment loaders (Supreme Court Criminal Appeal, Delhi High Court Commercial Arbitration, Bombay High Court Cheque Dishonour Appeal).

2. **Real Client-Side PDF Text Extraction**
   - Integrated with `pdfjs-dist` to perform page-by-page text extraction directly in the browser with zero external server dependency.
   - Live multi-stage extraction progress indicator.

3. **Evidence-Linked Legal Fact Extraction**
   - **Court Forum**: Supreme Court of India, Bombay High Court, Delhi High Court, Allahabad High Court, etc.
   - **Case Classification & Number**: Criminal Appeal, Civil Appeal, Writ Petition, SLP, Commercial Arbitration, Bail Application with registration number & year.
   - **Cause Title / Parties**: Petitioner/Appellant and Respondent/Defendant.
   - **Presiding Bench / Coram**: Chief Justice, Judges, or Coram members.
   - **Statutory Acts & Sections Cited**: Identification of sections across IPC, CrPC, CPC, Constitution of India, NI Act, Arbitration & Conciliation Act, etc., with plain-language explanations.
   - **Operative Final Outcome**: Appeal Allowed, Appeal Dismissed, Bail Granted, Conviction Upheld, Acquitted, Remanded, etc.

4. **Verbatim Supporting Evidence & Page Anchors**
   - Every extracted legal fact is paired with its exact verbatim passage and page number.
   - Interactive evidence inspection modal showing full paragraph context and confidence metrics.

5. **Document Comparison & Discrepancy Detection Engine**
   - Cross-verifies Document A (Reference / Baseline) against Document B (Subject Document).
   - Parameter-by-parameter alignment across Court, Case Number, Parties, Cited Sections, and Operative Ruling.
   - Tri-state status determination:
     - **Verified Match**: High structural & semantic alignment between compared documents.
     - **Mismatch Detected**: Divergence in ruling, parties, or case registration detected.
     - **Unverified**: Incomplete or ambiguous data requiring authoritative registry review.

6. **Authoritative Verification Protocol Notice**
   - *CaseVeda AI Policy:* "Verified Match" indicates structural alignment between the compared files. The application never claims a document is legally authentic unless independently validated against authoritative portals (e.g., eCourts, Supreme Court of India registry).

7. **"Needs Review" Warning System**
   - Ambiguous rulings, unlisted benches, or low-confidence extractions are clearly flagged with an amber "Needs Review" badge and specific diagnostic reasons.

8. **Searchable Judgment Repository & History**
   - Filter and search past judgments by case number, litigant, court forum, outcome, or statutory section.
   - Export structured case briefings in JSON format.

9. **Statutory Provisions Directory**
   - Interactive reference guide for major Indian statutory sections (IPC 302/34, CrPC 439/482, Article 226/21, NI Act 138, Arbitration Act 34) with key judicial precedents.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS (Legal-tech Dark Navy `#0A1128`, White, and Teal `#0D9488` palette)
* **Icons**: Lucide React
* **PDF Extraction**: PDF.js (`pdfjs-dist`)
* **Legal Engine**: Dual-Architecture
  * **Core NLP Engine**: 100% offline, privacy-first regex and rule-based Indian legal extractor (Active by default).
  * **Enhanced AI Engine**: Optional Google Gemini API (`VITE_GEMINI_API_KEY`) configurable via the in-app AI settings modal or `.env`.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher (Tested on v24)
* **npm**: v9.0.0 or higher

### Installation

1. Navigate to the project root:
   ```bash
   cd CaseVeda-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure Gemini API Key:
   Create a `.env` file in the root directory if you wish to use the optional Gemini API enhancement:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: The core application runs completely offline without any API key.*

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to access CaseVeda AI.

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🎯 Project Goal

To make Indian court judgments easier to understand, legal information more transparent and verifiable, and simplify cross-document verification for practitioners, law students, and litigants.

## ⚠️ Disclaimer

CaseVeda AI is intended as a research and document-analysis aid, not a substitute for professional legal advice or official court registry certification.

## 👥 Team

1. Manasi jadhav
2. Asmita vighne
3. Savitri kusagale
4. Prachi savale
5. Tejaswini satre
