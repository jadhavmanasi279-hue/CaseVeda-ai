import { CourtJudgment, ExtractedField, CitedSection, ExtractedOutcome, PageContent, VerificationStatus } from '../types';

// Statutory database for Indian law
interface StatutoryRef {
  regex: RegExp;
  act: string;
  section: string;
  description: string;
}

const STATUTORY_KNOWLEDGE_BASE: StatutoryRef[] = [
  {
    regex: /(?:Section|Sec\.?|S\.)\s*302\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*302\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 302',
    description: 'Punishment for murder (Capital punishment or life imprisonment and fine).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*304\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*304\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 304',
    description: 'Punishment for culpable homicide not amounting to murder.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*307\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*307\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 307',
    description: 'Attempt to murder.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*420\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*420\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 420',
    description: 'Cheating and dishonestly inducing delivery of property.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*498A\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*498A\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 498A',
    description: 'Husband or relative of husband of a woman subjecting her to cruelty (Dowry harassment).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*34\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*34\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 34',
    description: 'Acts done by several persons in furtherance of common intention.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*120B\b.*?(?:Indian\s+Penal\s+Code|IPC)\b|(?:Indian\s+Penal\s+Code|IPC)\b.*?(?:Section|Sec\.?|S\.)\s*120B\b/i,
    act: 'Indian Penal Code, 1860',
    section: 'Section 120B',
    description: 'Punishment of criminal conspiracy.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*439\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b|(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b.*?(?:Section|Sec\.?|S\.)\s*439\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 439',
    description: 'Special powers of High Court or Court of Session regarding bail.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*438\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b|(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b.*?(?:Section|Sec\.?|S\.)\s*438\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 438',
    description: 'Direction for grant of bail to person apprehending arrest (Anticipatory Bail).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*482\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b|(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b.*?(?:Section|Sec\.?|S\.)\s*482\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 482',
    description: 'Saving of inherent powers of High Court to prevent abuse of process of any court.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*154\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 154',
    description: 'Information in cognizable cases (First Information Report - FIR).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*313\b.*?(?:Cr\.?P\.?C|Code\s+of\s+Criminal\s+Procedure)\b/i,
    act: 'Code of Criminal Procedure, 1973',
    section: 'Section 313',
    description: 'Power to examine the accused personally in trial.',
  },
  {
    regex: /Article\s+226\b.*?(?:Constitution\s+of\s+India|Constitution)\b|(?:Constitution\s+of\s+India|Constitution)\b.*?Article\s+226\b/i,
    act: 'Constitution of India, 1950',
    section: 'Article 226',
    description: 'Power of High Courts to issue certain writs (Habeas Corpus, Mandamus, Certiorari, etc.).',
  },
  {
    regex: /Article\s+32\b.*?(?:Constitution\s+of\s+India|Constitution)\b|(?:Constitution\s+of\s+India|Constitution)\b.*?Article\s+32\b/i,
    act: 'Constitution of India, 1950',
    section: 'Article 32',
    description: 'Remedies for enforcement of Fundamental Rights conferred by Part III.',
  },
  {
    regex: /Article\s+21\b.*?(?:Constitution\s+of\s+India|Constitution)\b|(?:Constitution\s+of\s+India|Constitution)\b.*?Article\s+21\b/i,
    act: 'Constitution of India, 1950',
    section: 'Article 21',
    description: 'Protection of life and personal liberty.',
  },
  {
    regex: /Article\s+136\b.*?(?:Constitution\s+of\s+India|Constitution)\b|(?:Constitution\s+of\s+India|Constitution)\b.*?Article\s+136\b/i,
    act: 'Constitution of India, 1950',
    section: 'Article 136',
    description: 'Special leave to appeal by the Supreme Court (SLP jurisdiction).',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*138\b.*?(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b|(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b.*?(?:Section|Sec\.?|S\.)\s*138\b/i,
    act: 'Negotiable Instruments Act, 1881',
    section: 'Section 138',
    description: 'Dishonour of cheque for insufficiency of funds in the bank account.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*141\b.*?(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b|(?:Negotiable\s+Instruments\s+Act|NI\s+Act)\b.*?(?:Section|Sec\.?|S\.)\s*141\b/i,
    act: 'Negotiable Instruments Act, 1881',
    section: 'Section 141',
    description: 'Offences by companies and vicarious liability of Directors.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*34\b.*?(?:Arbitration\s+and\s+Conciliation\s+Act|Arbitration\s+Act)\b/i,
    act: 'Arbitration and Conciliation Act, 1996',
    section: 'Section 34',
    description: 'Application for setting aside arbitral award on grounds of patent illegality or public policy.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*9\b.*?(?:Arbitration\s+and\s+Conciliation\s+Act|Arbitration\s+Act)\b/i,
    act: 'Arbitration and Conciliation Act, 1996',
    section: 'Section 9',
    description: 'Interim measures by court before or during arbitral proceedings.',
  },
  {
    regex: /(?:Section|Sec\.?|S\.)\s*37\b.*?(?:Arbitration\s+and\s+Conciliation\s+Act|Arbitration\s+Act)\b/i,
    act: 'Arbitration and Conciliation Act, 1996',
    section: 'Section 37',
    description: 'Appealable orders in arbitration matters.',
  },
  {
    regex: /Order\s+(?:XXXIX|39)\s+Rule\s+(?:1|2|1\s+and\s+2)\b.*?(?:CPC|Code\s+of\s+Civil\s+Procedure)\b/i,
    act: 'Code of Civil Procedure, 1908',
    section: 'Order 39 Rules 1 & 2',
    description: 'Temporary injunctions and interlocutory orders.',
  },
];

/**
 * Searches pages for an exact or approximate regex and returns the match and page number
 */
function findInPages(pages: PageContent[], regex: RegExp): { match: RegExpMatchArray; page: number; sentence: string } | null {
  for (const p of pages) {
    const match = p.text.match(regex);
    if (match) {
      // Find surrounding sentence
      const index = match.index || 0;
      const start = Math.max(0, index - 120);
      const end = Math.min(p.text.length, index + match[0].length + 150);
      let sentence = p.text.substring(start, end).trim();
      if (start > 0) sentence = '...' + sentence;
      if (end < p.text.length) sentence = sentence + '...';
      return { match, page: p.pageNumber, sentence };
    }
  }
  return null;
}

/**
 * Extracts Indian Court Name from front page text
 */
function extractCourtName(pages: PageContent[]): ExtractedField {
  const frontPages = pages.slice(0, 2);
  const frontText = frontPages.map(p => p.text).join(' ');

  const courtPatterns = [
    { name: 'Supreme Court of India', regex: /(?:IN\s+THE\s+)?SUPREME\s+COURT\s+OF\s+INDIA/i },
    { name: 'High Court of Judicature at Bombay', regex: /(?:HIGH\s+COURT\s+OF\s+JUDICATURE\s+AT\s+BOMBAY|BOMBAY\s+HIGH\s+COURT)/i },
    { name: 'High Court of Delhi', regex: /(?:HIGH\s+COURT\s+OF\s+DELHI|DELHI\s+HIGH\s+COURT)/i },
    { name: 'High Court of Judicature at Allahabad', regex: /(?:HIGH\s+COURT\s+OF\s+JUDICATURE\s+AT\s+ALLAHABAD|ALLAHABAD\s+HIGH\s+COURT)/i },
    { name: 'High Court of Judicature at Madras', regex: /(?:HIGH\s+COURT\s+OF\s+JUDICATURE\s+AT\s+MADRAS|MADRAS\s+HIGH\s+COURT)/i },
    { name: 'High Court at Calcutta', regex: /(?:HIGH\s+COURT\s+AT\s+CALCUTTA|CALCUTTA\s+HIGH\s+COURT)/i },
    { name: 'High Court of Karnataka', regex: /(?:HIGH\s+COURT\s+OF\s+KARNATAKA|KARNATAKA\s+HIGH\s+COURT)/i },
    { name: 'National Company Law Appellate Tribunal', regex: /NATIONAL\s+COMPANY\s+LAW\s+APPELLATE\s+TRIBUNAL|NCLAT/i },
  ];

  for (const cp of courtPatterns) {
    const found = findInPages(frontPages, cp.regex);
    if (found) {
      return {
        value: cp.name,
        confidence: 96,
        pageNumber: found.page,
        evidenceQuote: found.sentence,
        status: 'Verified',
      };
    }
  }

  // Fallback heuristic
  const genericMatch = frontText.match(/(?:IN\s+THE\s+COURT\s+OF|BEFORE\s+THE\s+HON'BLE)\s+([A-Z\s,]{6,60})/i);
  if (genericMatch) {
    return {
      value: genericMatch[1].trim(),
      confidence: 65,
      pageNumber: 1,
      evidenceQuote: genericMatch[0],
      status: 'Needs Review',
      reviewReason: 'Court name extracted using generic heuristic. Verification against roster recommended.',
    };
  }

  return {
    value: 'Court Name Unspecified in Header',
    confidence: 25,
    pageNumber: null,
    evidenceQuote: null,
    status: 'Needs Review',
    reviewReason: 'No formal Indian Court header detected on initial pages.',
  };
}

/**
 * Extracts Case Type and Number
 */
function extractCaseDetails(pages: PageContent[]): { caseType: ExtractedField; caseNumber: ExtractedField; year: ExtractedField } {
  const frontPages = pages.slice(0, 2);

  const casePatterns = [
    { type: 'Criminal Appeal', regex: /CRIMINAL\s+APPEAL\s+NO(?:\.|S)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Civil Appeal', regex: /CIVIL\s+APPEAL\s+NO(?:\.|S)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Special Leave Petition (Crl.)', regex: /SPECIAL\s+LEAVE\s+PETITION\s*\((?:CRL\.?|CRIMINAL)\)\s*(?:NO(?:\.|S)?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Special Leave Petition (Civil)', regex: /SPECIAL\s+LEAVE\s+PETITION\s*\((?:CIVIL|C)\)\s*(?:NO(?:\.|S)?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Writ Petition (Civil)', regex: /WRIT\s+PETITION\s*\((?:CIVIL|C)\)\s*(?:NO(?:\.|S)?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})|W\.?P\.?\s*\(C\)\s*NO\.?\s*([0-9\s/-]+)\/([0-9]{4})/i },
    { type: 'Writ Petition (Criminal)', regex: /WRIT\s+PETITION\s*\((?:CRL\.?|CRIMINAL)\)\s*(?:NO(?:\.|S)?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Bail Application', regex: /BAIL\s+APPLN\.?\s*(?:NO\.?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
    { type: 'Arbitration Petition', regex: /(?:ARB\.?\s*P\.?|ARBITRATION\s+PETITION)\s*(?:NO\.?)?\s*([0-9\s/-]+)\s*(?:OF|\/)\s*([0-9]{4})/i },
  ];

  for (const cp of casePatterns) {
    const found = findInPages(frontPages, cp.regex);
    if (found) {
      const num = (found.match[1] || found.match[3] || '').trim().replace(/\s+/g, '');
      const yr = (found.match[2] || found.match[4] || '').trim();
      const fullCaseNo = `${cp.type} No. ${num} of ${yr}`;

      return {
        caseType: {
          value: cp.type,
          confidence: 95,
          pageNumber: found.page,
          evidenceQuote: found.sentence,
          status: 'Verified',
        },
        caseNumber: {
          value: fullCaseNo,
          confidence: 94,
          pageNumber: found.page,
          evidenceQuote: found.sentence,
          status: 'Verified',
        },
        year: {
          value: yr,
          confidence: 96,
          pageNumber: found.page,
          evidenceQuote: found.sentence,
          status: 'Verified',
        },
      };
    }
  }

  // Broad generic match
  const genericMatch = findInPages(frontPages, /(?:Case|Petition|Appeal|Reference)\s+No(?:\.|:)?\s*([A-Za-z0-9\s/().-]+(?:of|\/)\s*[0-9]{4})/i);
  if (genericMatch) {
    return {
      caseType: {
        value: 'Indian Court Proceeding (Unclassified)',
        confidence: 60,
        pageNumber: genericMatch.page,
        evidenceQuote: genericMatch.sentence,
        status: 'Needs Review',
        reviewReason: 'Exact statutory classification category ambiguous.',
      },
      caseNumber: {
        value: genericMatch.match[1].trim(),
        confidence: 70,
        pageNumber: genericMatch.page,
        evidenceQuote: genericMatch.sentence,
        status: 'Needs Review',
        reviewReason: 'Extracted from non-standard title block.',
      },
      year: {
        value: (genericMatch.match[1].match(/[0-9]{4}/)?.[0] || 'Unknown'),
        confidence: 70,
        pageNumber: genericMatch.page,
        evidenceQuote: genericMatch.sentence,
        status: 'Needs Review',
      },
    };
  }

  return {
    caseType: {
      value: 'Unidentified Case Type',
      confidence: 30,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
      reviewReason: 'Missing standard Case Type declaration.',
    },
    caseNumber: {
      value: 'Not Formally Specified',
      confidence: 25,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
      reviewReason: 'No case registration number detected on title page.',
    },
    year: {
      value: 'Unknown',
      confidence: 20,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
    },
  };
}

/**
 * Extracts Petitioner and Respondent
 */
function extractParties(pages: PageContent[]): { petitioner: ExtractedField; respondent: ExtractedField } {
  const frontPages = pages.slice(0, 2);
  const frontText = frontPages.map(p => p.text).join(' ');

  // Standard Indian pattern: Party A ... Appellant(s)/Petitioner(s) VERSUS Party B ... Respondent(s)
  const versusMatch = frontText.match(/([\w\s.,'&()-]{3,120})\s+(?:\.{3,}|_{3,}|\s+)\s*(?:Appellant|Petitioner|Plaintiff|Applicant)(?:s|\(s\))?\s+(?:VERSUS|Vs\.?|V\/s)\s+([\w\s.,'&()-]{3,120})\s+(?:\.{3,}|_{3,}|\s+)\s*(?:Respondent|Defendant|Opposite\s+Party)(?:s|\(s\))?/i);

  if (versusMatch) {
    const rawPet = versusMatch[1].replace(/[\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    const rawResp = versusMatch[2].replace(/[\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

    const petPage = findInPages(frontPages, new RegExp(escapeRegex(rawPet.substring(0, 20)), 'i'))?.page || 1;
    const respPage = findInPages(frontPages, new RegExp(escapeRegex(rawResp.substring(0, 20)), 'i'))?.page || 1;

    return {
      petitioner: {
        value: cleanPartyName(rawPet),
        confidence: 91,
        pageNumber: petPage,
        evidenceQuote: `Petitioner/Appellant recorded as: "${rawPet}" in title cause list.`,
        status: 'Verified',
      },
      respondent: {
        value: cleanPartyName(rawResp),
        confidence: 91,
        pageNumber: respPage,
        evidenceQuote: `Respondent recorded as: "${rawResp}" in title cause list.`,
        status: 'Verified',
      },
    };
  }

  // Secondary versus split
  const simpleVersus = frontText.match(/([A-Z0-9\s.,'&()-]{4,80})\s+(?:VERSUS|VS\.?|V\/S)\s+([A-Z0-9\s.,'&()-]{4,80})/i);
  if (simpleVersus) {
    const p = cleanPartyName(simpleVersus[1]);
    const r = cleanPartyName(simpleVersus[2]);
    return {
      petitioner: {
        value: p,
        confidence: 72,
        pageNumber: 1,
        evidenceQuote: simpleVersus[0],
        status: 'Needs Review',
        reviewReason: 'Identified from simple VERSUS delimiter; verify full corporate or alias titles.',
      },
      respondent: {
        value: r,
        confidence: 72,
        pageNumber: 1,
        evidenceQuote: simpleVersus[0],
        status: 'Needs Review',
        reviewReason: 'Identified from simple VERSUS delimiter; verify respondents list.',
      },
    };
  }

  return {
    petitioner: {
      value: 'Petitioner Details Not Readily Parsed',
      confidence: 30,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
      reviewReason: 'Unable to locate cause title block with Petitioner/Appellant label.',
    },
    respondent: {
      value: 'Respondent Details Not Readily Parsed',
      confidence: 30,
      pageNumber: null,
      evidenceQuote: null,
      status: 'Needs Review',
      reviewReason: 'Unable to locate cause title block with Respondent label.',
    },
  };
}

/**
 * Extracts Bench / Presiding Judges
 */
function extractBench(pages: PageContent[]): ExtractedField {
  const frontPages = pages.slice(0, 2);

  const benchPatterns = [
    /CORAM\s*:\s*([^\n\r]+)/i,
    /HON'BLE\s+(?:MR\.|MS\.|JUSTICE|DR\.)\s+([A-Z\s.,&]+(?:\n[A-Z\s.,&]+)?)/i,
    /BEFORE\s*:\s*([^\n\r]+)/i,
  ];

  for (const pat of benchPatterns) {
    const found = findInPages(frontPages, pat);
    if (found) {
      const benchStr = (found.match[1] || found.match[0]).replace(/\s+/g, ' ').trim();
      return {
        value: benchStr.substring(0, 100),
        confidence: 88,
        pageNumber: found.page,
        evidenceQuote: found.sentence,
        status: 'Verified',
      };
    }
  }

  return {
    value: 'Bench / Coram Not Explicitly Stated on Front Page',
    confidence: 40,
    pageNumber: null,
    evidenceQuote: null,
    status: 'Needs Review',
    reviewReason: 'Judge designations not located in top Coram section.',
  };
}

/**
 * Scans all pages for cited Indian Acts and Sections
 */
function extractActsAndSections(pages: PageContent[]): CitedSection[] {
  const cited: CitedSection[] = [];
  const seenKeys = new Set<string>();

  // 1. Scan against curated knowledge base
  for (const item of STATUTORY_KNOWLEDGE_BASE) {
    const found = findInPages(pages, item.regex);
    if (found) {
      const key = `${item.act}-${item.section}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        cited.push({
          act: item.act,
          section: item.section,
          description: item.description,
          pageNumber: found.page,
          quote: found.sentence,
          confidence: 94,
          status: 'Verified',
        });
      }
    }
  }

  // 2. Generic discovery of other Sections (e.g., Section 11 of Arbitration Act, Section 9 of CPC, etc.)
  for (const p of pages) {
    const secMatches = p.text.matchAll(/(?:Section|Sec\.?|Article|Art\.?)\s*([0-9]+[A-Z]?)\s*(?:of\s+the\s+)?([A-Za-z\s]{4,40}Act(?:,\s*[0-9]{4})?)/gi);
    for (const match of secMatches) {
      const secNum = match[1];
      const actTitle = match[2].trim();
      const key = `${actTitle}-Sec${secNum}`;
      if (!seenKeys.has(key) && cited.length < 8) {
        seenKeys.add(key);
        cited.push({
          act: actTitle,
          section: `Section ${secNum}`,
          description: `Statutory provision cited in judgment text.`,
          pageNumber: p.pageNumber,
          quote: extractSurroundingQuote(p.text, match[0]),
          confidence: 82,
          status: 'Verified',
        });
      }
    }
  }

  return cited;
}

/**
 * Detects Final Outcome and Operative Disposition from concluding pages
 */
function extractFinalOutcome(pages: PageContent[]): ExtractedOutcome {
  // Outcomes are usually on the final 2 pages
  const lastPages = pages.length > 2 ? pages.slice(-2) : pages;

  const outcomeRules: {
    disposition: ExtractedOutcome['disposition'];
    regex: RegExp;
    confidence: number;
  }[] = [
    {
      disposition: 'Appeal Allowed',
      regex: /(?:the\s+)?appeal\s+is\s+allowed|appeals\s+are\s+allowed|conviction\s+is\s+set\s+aside|impugned\s+judgment\s+is\s+quashed\s+and\s+set\s+aside/i,
      confidence: 95,
    },
    {
      disposition: 'Appeal Dismissed',
      regex: /(?:the\s+)?appeal\s+is\s+dismissed|appeals\s+are\s+dismissed|we\s+find\s+no\s+merit\s+in\s+the\s+appeal|conviction\s+is\s+upheld/i,
      confidence: 95,
    },
    {
      disposition: 'Bail Granted',
      regex: /(?:the\s+)?(?:applicant|appellant|accused)\s+(?:is|shall\s+be)\s+released\s+on\s+bail|bail\s+is\s+granted|application\s+for\s+bail\s+is\s+allowed/i,
      confidence: 96,
    },
    {
      disposition: 'Bail Rejected',
      regex: /bail\s+application\s+is\s+rejected|plea\s+for\s+bail\s+is\s+dismissed|declined\s+to\s+grant\s+bail/i,
      confidence: 94,
    },
    {
      disposition: 'Petition Allowed',
      regex: /(?:the\s+)?writ\s+petition\s+is\s+allowed|petition\s+stands\s+allowed|rule\s+is\s+made\s+absolute/i,
      confidence: 92,
    },
    {
      disposition: 'Petition Dismissed',
      regex: /(?:the\s+)?writ\s+petition\s+is\s+dismissed|petition\s+stands\s+dismissed|petition\s+is\s+devoid\s+of\s+merit/i,
      confidence: 93,
    },
    {
      disposition: 'Remanded',
      regex: /matter\s+is\s+remanded\s+back|remitted\s+to\s+the\s+(?:High\s+Court|trial\s+court)|remanded\s+for\s+fresh\s+consideration/i,
      confidence: 91,
    },
    {
      disposition: 'Acquitted',
      regex: /(?:the\s+)?appellant\s+is\s+acquitted|accused\s+is\s+acquitted\s+of\s+all\s+charges/i,
      confidence: 96,
    },
  ];

  for (const rule of outcomeRules) {
    const found = findInPages(lastPages, rule.regex);
    if (found) {
      return {
        disposition: rule.disposition,
        verdictText: found.sentence,
        pageNumber: found.page,
        evidenceQuote: found.sentence,
        confidence: rule.confidence,
        status: 'Verified',
      };
    }
  }

  // Check entire document if not found in last 2 pages
  for (const rule of outcomeRules) {
    const found = findInPages(pages, rule.regex);
    if (found) {
      return {
        disposition: rule.disposition,
        verdictText: found.sentence,
        pageNumber: found.page,
        evidenceQuote: found.sentence,
        confidence: rule.confidence - 10,
        status: 'Needs Review',
        reviewReason: 'Operative disposition identified outside customary concluding paragraphs.',
      };
    }
  }

  // Ambiguous outcome
  return {
    disposition: 'Needs Review',
    verdictText: 'Operative disposition could not be unambiguously classified automatically.',
    pageNumber: pages[pages.length - 1]?.pageNumber || 1,
    evidenceQuote: pages[pages.length - 1]?.text.slice(-250) || 'No text snippet available.',
    confidence: 40,
    status: 'Needs Review',
    reviewReason: 'Operative order contains complex multi-part directions or settlement without standard dismissal/allowance keywords.',
  };
}

/**
 * Generates an executive case brief summary
 */
function generateCaseSummary(
  court: string,
  caseType: string,
  petitioner: string,
  respondent: string,
  outcome: ExtractedOutcome,
  acts: CitedSection[]
): string {
  const sectionsList = acts.length > 0 ? acts.map(a => `${a.section} (${a.act})`).join(', ') : 'General provisions';
  return `This matter before the ${court} involves a ${caseType} between ${petitioner} and ${respondent}. The key statutory provisions deliberated include ${sectionsList}. The Court disposed of the matter with the operative ruling: "${outcome.disposition}" based on evidence scrutinized in the judgment.`;
}

/**
 * Main analysis function that transforms extracted PDF text into structured CourtJudgment
 */
export function analyzeJudgmentText(
  fileName: string,
  fileSize: number,
  pages: PageContent[],
  rawText: string
): CourtJudgment {
  const courtName = extractCourtName(pages);
  const { caseType, caseNumber, year } = extractCaseDetails(pages);
  const { petitioner, respondent } = extractParties(pages);
  const bench = extractBench(pages);
  const actsAndSections = extractActsAndSections(pages);
  const finalOutcome = extractFinalOutcome(pages);

  // Calculate overall confidence
  const fields = [courtName, caseType, caseNumber, petitioner, respondent, bench];
  const avgFieldConf = fields.reduce((acc, f) => acc + f.confidence, 0) / fields.length;
  const overallConfidence = Math.round((avgFieldConf * 0.6) + (finalOutcome.confidence * 0.4));

  // Determine overall status
  const hasNeedsReview = fields.some(f => f.status === 'Needs Review') || finalOutcome.status === 'Needs Review';
  const overallStatus: VerificationStatus = hasNeedsReview ? 'Needs Review' : 'Verified';

  // Last page operative excerpt
  const lastPage = pages[pages.length - 1];
  const operativeOrderText = lastPage ? lastPage.text.slice(-400).trim() : '';

  const summary = generateCaseSummary(
    courtName.value,
    caseType.value,
    petitioner.value,
    respondent.value,
    finalOutcome,
    actsAndSections
  );

  return {
    id: `cv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fileName,
    fileSize,
    analyzedAt: new Date().toISOString(),
    pageCount: pages.length,
    rawText,
    pages,
    extractedData: {
      courtName,
      caseType,
      caseNumber,
      year,
      bench,
      petitioner,
      respondent,
      actsAndSections,
      finalOutcome,
      summary,
      keyIssues: [
        `Applicability and interpretation of ${actsAndSections[0]?.section || 'invoked statutory provisions'}`,
        `Scrutiny of procedural adherence and evidentiary chain of custody`,
        `Admissibility of lower forum determinations and final disposition`,
      ],
      operativeOrderText,
    },
    overallStatus,
    confidenceScore: overallConfidence,
    authoritativeSourceChecked: false, // Never claim authentic without external registry check!
    notes: 'Parsed by CaseVeda AI Evidence-Linked Legal Extraction Engine.',
  };
}

// Helpers
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanPartyName(str: string): string {
  return str
    .replace(/^[\s,.-]+|[\s,.-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSurroundingQuote(text: string, term: string): string {
  const idx = text.indexOf(term);
  if (idx === -1) return term;
  const start = Math.max(0, idx - 80);
  const end = Math.min(text.length, idx + term.length + 80);
  let res = text.substring(start, end).trim();
  if (start > 0) res = '...' + res;
  if (end < text.length) res = res + '...';
  return res;
}
